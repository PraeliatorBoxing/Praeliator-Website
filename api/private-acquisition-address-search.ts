import {
  buildClearedGrantCookie,
  ensureStripePaymentState,
  getPresentationState,
  getPrivateAcquisitionSessionByToken,
  hasValidAccessGrant,
  jsonResponse,
} from "./_lib/private-acquisition.js";

type MapboxFeature = {
  id?: string;
  mapbox_id?: string;
  name?: string;
  full_address?: string;
  place_formatted?: string;
  context?: Record<string, unknown> | Array<Record<string, unknown>>;
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

function getMapboxAccessToken() {
  const value = process.env.MAPBOX_ACCESS_TOKEN?.trim();
  if (!value) {
    throw new Error("Missing environment variable: MAPBOX_ACCESS_TOKEN");
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

function getContextEntry(feature: MapboxFeature, key: string) {
  const context = feature.context;
  if (!context) return null;

  if (Array.isArray(context)) {
    return (
      context.find((entry) => {
        const entryId = String(entry.id || "");
        const featureType = String(
          entry.feature_type || entry.type || entry.kind || "",
        );
        return entryId.startsWith(`${key}.`) || featureType === key;
      }) || null
    );
  }

  if (typeof context === "object") {
    const direct = context[key];
    if (direct && typeof direct === "object") {
      return direct as Record<string, unknown>;
    }

    for (const value of Object.values(context)) {
      if (!value || typeof value !== "object") continue;
      const record = value as Record<string, unknown>;
      const entryId = String(record.id || "");
      const featureType = String(
        record.feature_type || record.type || record.kind || "",
      );
      if (entryId.startsWith(`${key}.`) || featureType === key) {
        return record;
      }
    }
  }

  return null;
}

function getContextName(feature: MapboxFeature, key: string) {
  const entry = getContextEntry(feature, key);
  if (!entry) return "";
  return String(
    entry.name || entry.text || entry.name_preferred || entry.place_name || "",
  ).trim();
}

function mapFeatureToSuggestion(feature: MapboxFeature, fallbackCountry: string) {
  const neighborhood = getContextName(feature, "neighborhood");
  const locality = getContextName(feature, "locality");
  const district = getContextName(feature, "district");
  const place = getContextName(feature, "place");
  const region = getContextName(feature, "region");
  const postalCode = getContextName(feature, "postcode");
  const country = getContextName(feature, "country") || fallbackCountry;

  const addressLine1 = String(feature.name || "").trim();
  const addressLine2 = [neighborhood, district]
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index)
    .join(", ");

  const secondaryText = [
    locality || place,
    district && district !== locality ? district : "",
    postalCode,
    region,
    country,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    id: String(feature.mapbox_id || feature.id || feature.full_address || addressLine1),
    label: String(feature.full_address || feature.name || "").trim(),
    secondaryText: secondaryText || feature.place_formatted || null,
    addressLine1,
    addressLine2: addressLine2 || null,
    city: locality || place || district || "",
    region: region || "",
    postalCode: postalCode || "",
    country: country || "",
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
    const mapboxCountry = normalizeCountryHint(countryHint);
    const searchUrl = new URL("https://api.mapbox.com/search/geocode/v6/forward");
    searchUrl.searchParams.set("q", buildQuery(query, countryHint));
    searchUrl.searchParams.set("autocomplete", "true");
    searchUrl.searchParams.set("limit", "5");
    searchUrl.searchParams.set("types", "address,street");
    searchUrl.searchParams.set("language", locale);
    searchUrl.searchParams.set("access_token", getMapboxAccessToken());
    if (mapboxCountry) {
      searchUrl.searchParams.set("country", mapboxCountry);
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

    const data = (await response.json()) as { features?: MapboxFeature[] };
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
