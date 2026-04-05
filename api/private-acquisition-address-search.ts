import {
  buildClearedGrantCookie,
  ensureStripePaymentState,
  getPresentationState,
  getPrivateAcquisitionSessionByToken,
  hasValidAccessGrant,
  jsonResponse,
} from "./_lib/private-acquisition.js";

type GeoapifyFeature = {
  properties?: {
    place_id?: string;
    formatted?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
};

const COUNTRY_HINT_TO_ISO2: Record<string, string> = {
  mexico: "mx",
  "méxico": "mx",
  "united states": "us",
  usa: "us",
  canada: "ca",
  japan: "jp",
  france: "fr",
  spain: "es",
  "united kingdom": "gb",
  uk: "gb",
  england: "gb",
  germany: "de",
  italy: "it",
  "united arab emirates": "ae",
  uae: "ae",
};

function getGeoapifyApiKey() {
  const value = process.env.GEOAPIFY_API_KEY?.trim();
  if (!value) {
    throw new Error("Missing environment variable: GEOAPIFY_API_KEY");
  }
  return value;
}

function normalizeCountryHint(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";
  if (/^[a-z]{2}$/i.test(normalized)) return normalized;
  return COUNTRY_HINT_TO_ISO2[normalized] || "";
}

function buildQuery(query: string, countryHint: string) {
  if (!countryHint) return query;
  if (query.toLowerCase().includes(countryHint.toLowerCase())) return query;
  return `${query}, ${countryHint}`;
}

function mapFeatureToSuggestion(feature: GeoapifyFeature, fallbackCountry: string) {
  const properties = feature.properties || {};
  const secondaryText = [
    properties.address_line2,
    properties.city,
    properties.postcode,
    properties.state,
    properties.country || fallbackCountry,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    id: String(properties.place_id || properties.formatted || properties.address_line1 || ""),
    label: String(
      properties.formatted || properties.address_line1 || "",
    ).trim(),
    secondaryText: secondaryText || null,
    addressLine1: String(properties.address_line1 || "").trim(),
    addressLine2: String(properties.address_line2 || "").trim() || null,
    city: String(properties.city || "").trim(),
    region: String(properties.state || "").trim(),
    postalCode: String(properties.postcode || "").trim(),
    country: String(properties.country || fallbackCountry || "").trim(),
  };
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = (url.searchParams.get("token") || "").trim();
    const query = (url.searchParams.get("q") || "").trim();
    const locale = (url.searchParams.get("locale") || "en").trim();
    const providedCountryHint = (url.searchParams.get("countryHint") || "").trim();

    if (!token) {
      return jsonResponse(
        {
          success: false,
          state: "invalid_request",
          error: "Session token missing.",
        },
        400,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    if (query.length < 3) {
      return jsonResponse({ success: true, suggestions: [] });
    }

    let session = await getPrivateAcquisitionSessionByToken(token);
    if (!session) {
      return jsonResponse(
        {
          success: false,
          state: "invalid_token",
          error: "Session not found.",
        },
        404,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    session = await ensureStripePaymentState(session);
    const presentationState = getPresentationState(session);

    if (presentationState !== "active") {
      return jsonResponse(
        {
          success: false,
          state: presentationState,
          error: "Address lookup is no longer available for this issuance.",
        },
        403,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    if (!hasValidAccessGrant(session, request)) {
      return jsonResponse(
        {
          success: false,
          state: "access_required",
          error:
            "Reference verification is required before address lookup can continue.",
        },
        403,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    const countryHint = session.shipping_country || providedCountryHint;
    const countryCode = normalizeCountryHint(countryHint);
    const searchUrl = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
    searchUrl.searchParams.set("text", buildQuery(query, countryHint));
    searchUrl.searchParams.set("limit", "5");
    searchUrl.searchParams.set("lang", locale);
    searchUrl.searchParams.set("type", "street");
    searchUrl.searchParams.set("format", "json");
    searchUrl.searchParams.set("apiKey", getGeoapifyApiKey());
    if (countryCode) {
      searchUrl.searchParams.set("filter", `countrycode:${countryCode}`);
    }

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Address lookup is unavailable right now.");
    }

    const data = (await response.json()) as { features?: GeoapifyFeature[] };
    const suggestions = Array.isArray(data.features)
      ? data.features
          .map((feature) => mapFeatureToSuggestion(feature, countryHint))
          .filter((suggestion) => Boolean(suggestion.addressLine1))
      : [];

    return jsonResponse({
      success: true,
      suggestions,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Address lookup is unavailable right now.";

    return jsonResponse(
      {
        success: false,
        state: "error",
        error: message,
      },
      500,
    );
  }
}
