import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Button } from "./ui/button";
import { type SiteLocale, siteLocaleOptions } from "../lib/site-locale";

type AcquisitionSessionSummary = {
  referenceCode: string;
  clientName?: string | null;
  clientEmail?: string | null;
  clientPhone?: string | null;
  productName: string;
  productSnapshot?: {
    specifications?: Array<{ label: string; value: string }>;
    [key: string]: unknown;
  };
  orderSnapshot?: Record<string, unknown>;
  quantity: number;
  currency: string;
  subtotalAmount: number;
  shippingAmount: number;
  totalAmount: number;
  shippingCountry?: string | null;
  shippingRegion?: string | null;
  shippingCity?: string | null;
  shippingPostalCode?: string | null;
  shippingAddressLine1?: string | null;
  shippingAddressLine2?: string | null;
  shippingRecipientName?: string | null;
  shippingDeliveryNotes?: string | null;
  expiresAt: string;
  status: string;
  paidAt?: string | null;
  validatedAt?: string | null;
  deliveryDetailsCompletedAt?: string | null;
};

type StateResponse =
  | {
      success: true;
      state: "access_required";
      expiresAt: string;
    }
  | {
      success: true;
      state: "unlocked" | "paid";
      session: AcquisitionSessionSummary;
      paymentIntentCreated?: boolean;
      paymentStatus?: string | null;
    }
  | {
      success: true;
      state: "expired" | "revoked";
    }
  | {
      success: false;
      state: string;
      error?: string;
    };

type AccessResponse =
  | {
      success: true;
      state: "unlocked" | "paid";
      session: AcquisitionSessionSummary;
    }
  | {
      success: false;
      state: string;
      error?: string;
      lockedUntil?: string | null;
    };

type PaymentIntentResponse =
  | {
      success: true;
      state: "payment_ready";
      publishableKey: string;
      clientSecret: string;
      paymentStatus?: string | null;
      session: AcquisitionSessionSummary;
    }
  | {
      success: true;
      state: "paid";
      session: AcquisitionSessionSummary;
    }
  | {
      success: false;
      state: string;
      error?: string;
    };

type DeliveryFormState = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  shippingCountry: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingCity: string;
  shippingRegion: string;
  shippingPostalCode: string;
  shippingRecipientName: string;
  shippingDeliveryNotes: string;
  confirmDetails: boolean;
};

type DeliveryResponse =
  | {
      success: true;
      state: "delivery_saved" | "paid";
      session: AcquisitionSessionSummary;
    }
  | {
      success: false;
      state: string;
      error?: string;
      fieldErrors?: Partial<Record<keyof DeliveryFormState, string>>;
    };

type AddressSuggestion = {
  id: string;
  label: string;
  secondaryText?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city?: string | null;
  region?: string | null;
  postalCode?: string | null;
  country?: string | null;
};

type GeoapifyAutocompleteResponse = {
  features?: Array<{
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
  }>;
};

const easeLuxury: [number, number, number, number] = [0.16, 1, 0.3, 1];
const chamberFieldClass =
  "min-h-[3.95rem] w-full rounded-[1.6rem] border border-[#ccb59a] bg-[#f8f2ea] px-5 text-[1rem] text-[#241912] outline-none transition placeholder:text-[#bca892] focus:border-[#a37a56] focus:bg-white";
const chamberTextareaClass =
  "min-h-[8.5rem] w-full rounded-[1.6rem] border border-[#ccb59a] bg-[#f8f2ea] px-5 py-4 text-[1rem] text-[#241912] outline-none transition placeholder:text-[#bca892] focus:border-[#a37a56] focus:bg-white";
const geoapifyApiKey = import.meta.env.VITE_GEOAPIFY_API_KEY as
  | string
  | undefined;
const countryHintToIso2: Record<string, string> = {
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

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(value?: string | null) {
  if (!value) return "Pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pending";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function createDeliveryFormState(
  session?: AcquisitionSessionSummary | null,
): DeliveryFormState {
  return {
    clientName: session?.clientName || "",
    clientEmail: session?.clientEmail || "",
    clientPhone: session?.clientPhone || "",
    shippingCountry: session?.shippingCountry || "",
    shippingAddressLine1: session?.shippingAddressLine1 || "",
    shippingAddressLine2: session?.shippingAddressLine2 || "",
    shippingCity: session?.shippingCity || "",
    shippingRegion: session?.shippingRegion || "",
    shippingPostalCode: session?.shippingPostalCode || "",
    shippingRecipientName: session?.shippingRecipientName || "",
    shippingDeliveryNotes: session?.shippingDeliveryNotes || "",
    confirmDetails: Boolean(session?.deliveryDetailsCompletedAt),
  };
}

function validateDeliveryFormState(form: DeliveryFormState) {
  const errors: Partial<Record<keyof DeliveryFormState, string>> = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.clientName.trim() || form.clientName.trim().length < 2) {
    errors.clientName =
      "Enter the full name to be attached to this acquisition record.";
  }

  if (!form.clientEmail.trim() || !emailPattern.test(form.clientEmail.trim())) {
    errors.clientEmail =
      "Enter a valid email address for delivery correspondence.";
  }

  if (form.clientPhone.replace(/[^\d]/g, "").length < 6) {
    errors.clientPhone = "Enter a valid phone number for delivery contact.";
  }

  if (!form.shippingCountry.trim()) {
    errors.shippingCountry = "Enter the destination country.";
  }

  if (!form.shippingAddressLine1.trim() || form.shippingAddressLine1.trim().length < 5) {
    errors.shippingAddressLine1 = "Enter the primary destination line in full.";
  }

  if (!form.shippingCity.trim()) {
    errors.shippingCity = "Enter the destination city.";
  }

  if (!form.shippingRegion.trim()) {
    errors.shippingRegion = "Enter the state or region.";
  }

  if (!form.shippingPostalCode.trim() || form.shippingPostalCode.trim().length < 3) {
    errors.shippingPostalCode = "Enter the postal code for this destination.";
  }

  if (
    form.shippingRecipientName.trim() &&
    form.shippingRecipientName.trim().length < 2
  ) {
    errors.shippingRecipientName =
      "Enter the recipient name in full or leave the field empty.";
  }

  if (!form.confirmDetails) {
    errors.confirmDetails =
      "Confirm the destination record before payment can continue.";
  }

  return errors;
}

async function readJsonResponse<T>(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function normalizeAddressComparison(value: string) {
  return value.toLowerCase().replace(/[\s,.-]+/g, " ").trim();
}

function normalizeCountryHintToIso2(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return "";
  if (/^[a-z]{2}$/i.test(normalized)) return normalized;
  return countryHintToIso2[normalized] || "";
}

function buildAddressLookupQuery(query: string, countryHint: string) {
  if (!countryHint) return query;
  if (query.toLowerCase().includes(countryHint.toLowerCase())) return query;
  return `${query}, ${countryHint}`;
}

function mapGeoapifySuggestion(
  feature: GeoapifyAutocompleteResponse["features"][number],
  fallbackCountry: string,
): AddressSuggestion | null {
  const properties = feature?.properties;
  if (!properties) return null;

  const addressLine1 = String(properties.address_line1 || "").trim();
  if (!addressLine1) return null;

  return {
    id: String(
      properties.place_id || properties.formatted || properties.address_line1,
    ),
    label: String(properties.formatted || properties.address_line1 || "").trim(),
    secondaryText:
      [
        properties.address_line2,
        properties.city,
        properties.postcode,
        properties.state,
        properties.country || fallbackCountry,
      ]
        .filter(Boolean)
        .join(", ") || null,
    addressLine1,
    addressLine2: String(properties.address_line2 || "").trim() || null,
    city: String(properties.city || "").trim() || null,
    region: String(properties.state || "").trim() || null,
    postalCode: String(properties.postcode || "").trim() || null,
    country: String(properties.country || fallbackCountry || "").trim() || null,
  };
}

function PrivateRouteLanguageSwitcher({
  locale,
  onChange,
  label,
}: {
  locale: SiteLocale;
  onChange: (locale: SiteLocale) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const currentOption =
    siteLocaleOptions.find((option) => option.value === locale) ??
    siteLocaleOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 text-[10px] uppercase tracking-[0.26em] text-white/72 transition duration-300 hover:border-white/16 hover:bg-white/[0.06] hover:text-white"
        aria-label={label}
        aria-expanded={open}
      >
        <span>{currentOption.shortLabel}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: easeLuxury }}
            className="absolute right-0 top-[calc(100%+0.6rem)] z-30 min-w-[11rem] overflow-hidden rounded-[1.2rem] border border-white/10 bg-[#0b0a09]/96 p-1 shadow-[0_24px_60px_rgba(0,0,0,0.34)] backdrop-blur-xl"
          >
            {siteLocaleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-[0.95rem] px-3 py-2.5 text-left text-sm transition duration-200 ${
                  option.value === locale
                    ? "bg-white/[0.08] text-white"
                    : "text-white/72 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <span>{option.label}</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-white/34">
                  {option.shortLabel}
                </span>
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function getSessionToken() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("token") || "";
}

function getSpecifications(
  session?: AcquisitionSessionSummary | null,
): Array<{ label: string; value: string }> {
  const specs = session?.productSnapshot?.specifications;
  if (Array.isArray(specs) && specs.length) {
    return specs.filter(
      (entry): entry is { label: string; value: string } =>
        Boolean(entry?.label) && Boolean(entry?.value),
    );
  }

  return [
    { label: "Format", value: "Private house issuance" },
    { label: "Quantity", value: String(session?.quantity || 1) },
  ];
}

function PrivatePaymentForm({
  session,
  token,
  onRefresh,
}: {
  session: AcquisitionSessionSummary;
  token: string;
  onRefresh: () => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setErrorMessage("");

    const returnUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/private-acquisition?token=${encodeURIComponent(
            token,
          )}`
        : undefined;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: returnUrl ? { return_url: returnUrl } : undefined,
      redirect: "if_required",
    });

    if (result.error) {
      setErrorMessage(
        result.error.message ||
          "Payment could not be completed. Please review the details and continue again.",
      );
      setSubmitting(false);
      return;
    }

    await onRefresh();
    setSubmitting(false);
  };

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="rounded-[1.8rem] border border-[#d8c3aa] bg-[#f8f2ea] p-5 shadow-[0_18px_50px_rgba(111,79,49,0.08)]">
        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                name: session.clientName || undefined,
              },
            },
          }}
        />
      </div>

      {errorMessage ? (
        <p className="text-sm leading-7 text-[#815c42]">{errorMessage}</p>
      ) : (
        <p className="text-sm leading-7 text-[#6c5646]">
          Payment remains inside the Praeliator surface. Once confirmed, this
          issuance closes and cannot be used again.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          disabled={!stripe || !elements || submitting}
          className="min-h-[3.85rem] rounded-full bg-[#211711] px-7 text-sm text-[#f7efe5] shadow-[0_20px_50px_rgba(24,18,14,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#16100c] disabled:pointer-events-none disabled:opacity-60"
        >
          {submitting ? "Confirming payment..." : "Confirm Private Acquisition"}
        </Button>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#8b6b4f]">
          Reference {session.referenceCode}
        </p>
      </div>
    </form>
  );
}

function PaymentChamber({
  publishableKey,
  clientSecret,
  session,
  token,
  onRefresh,
}: {
  publishableKey: string;
  clientSecret: string;
  session: AcquisitionSessionSummary;
  token: string;
  onRefresh: () => Promise<void>;
}) {
  const stripePromise = useMemo<Promise<Stripe | null> | null>(() => {
    if (!publishableKey) return null;
    return loadStripe(publishableKey);
  }, [publishableKey]);

  const appearance = useMemo(
    () => ({
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#231b15",
        colorBackground: "#fbf6ef",
        colorText: "#241912",
        colorDanger: "#7e5343",
        fontFamily:
          '"Cormorant Garamond", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
        borderRadius: "18px",
      },
      rules: {
        ".Input": {
          backgroundColor: "#f8f2ea",
          border: "1px solid #d8c3aa",
          boxShadow: "none",
        },
        ".Tab": {
          backgroundColor: "#f6efe6",
          border: "1px solid #d8c3aa",
        },
        ".Tab--selected": {
          backgroundColor: "#efe2d1",
          borderColor: "#b8916d",
        },
        ".Label": {
          color: "#6d5848",
        },
      },
    }),
    [],
  );

  if (!stripePromise) return null;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance,
      }}
    >
      <PrivatePaymentForm
        session={session}
        token={token}
        onRefresh={onRefresh}
      />
    </Elements>
  );
}

export function PrivateAcquisitionRoute({
  wordmarkSrc,
  onReturnHome,
  locale,
  onLocaleChange,
  languageLabel,
}: {
  wordmarkSrc: string;
  onReturnHome: () => void;
  locale: SiteLocale;
  onLocaleChange: (locale: SiteLocale) => void;
  languageLabel: string;
}) {
  const token = useMemo(() => getSessionToken(), []);
  const [stateResponse, setStateResponse] = useState<StateResponse | null>(null);
  const [loadingState, setLoadingState] = useState(true);
  const [referenceCode, setReferenceCode] = useState("");
  const [accessSubmitting, setAccessSubmitting] = useState(false);
  const [accessError, setAccessError] = useState("");
  const [deliveryForm, setDeliveryForm] = useState<DeliveryFormState>(
    createDeliveryFormState(),
  );
  const [deliveryErrors, setDeliveryErrors] = useState<
    Partial<Record<keyof DeliveryFormState, string>>
  >({});
  const [deliverySubmitting, setDeliverySubmitting] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const [deliveryNotice, setDeliveryNotice] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [addressSearchLoading, setAddressSearchLoading] = useState(false);
  const [addressSearchError, setAddressSearchError] = useState("");
  const [selectedAddressLabel, setSelectedAddressLabel] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [publishableKey, setPublishableKey] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const refreshState = React.useCallback(async () => {
    if (!token) {
      setStateResponse({
        success: false,
        state: "invalid_token",
        error: "This private page could not be identified.",
      });
      setLoadingState(false);
      return;
    }

    setLoadingState(true);

    try {
      const response = await fetch(
        `/api/private-acquisition-state?token=${encodeURIComponent(token)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        },
      );

      const result = await readJsonResponse<StateResponse>(response);

      if (!result) {
        throw new Error("The private acquisition page could not be loaded.");
      }

      setStateResponse(result);
    } catch (error) {
      setStateResponse({
        success: false,
        state: "error",
        error:
          error instanceof Error
            ? error.message
            : "The private acquisition page could not be loaded.",
      });
    } finally {
      setLoadingState(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshState();
  }, [refreshState]);

  const activeSession =
    stateResponse &&
    "session" in stateResponse &&
    stateResponse.session
      ? stateResponse.session
      : null;

  useEffect(() => {
    setDeliveryForm(createDeliveryFormState(activeSession));
    setDeliveryErrors({});
    setDeliveryError("");
    setDeliveryNotice("");
    setAddressSuggestions([]);
    setAddressSearchError("");
    setSelectedAddressLabel(activeSession?.shippingAddressLine1 || "");
  }, [
    activeSession?.referenceCode,
    activeSession?.clientName,
    activeSession?.clientEmail,
    activeSession?.clientPhone,
    activeSession?.shippingCountry,
    activeSession?.shippingAddressLine1,
    activeSession?.shippingAddressLine2,
    activeSession?.shippingCity,
    activeSession?.shippingRegion,
    activeSession?.shippingPostalCode,
    activeSession?.shippingRecipientName,
    activeSession?.shippingDeliveryNotes,
    activeSession?.deliveryDetailsCompletedAt,
  ]);

  const addressCountryHint = useMemo(
    () =>
      (activeSession?.shippingCountry || deliveryForm.shippingCountry || "").trim(),
    [activeSession?.shippingCountry, deliveryForm.shippingCountry],
  );

  useEffect(() => {
    if (!activeSession) {
      setAddressSuggestions([]);
      setAddressSearchLoading(false);
      return;
    }

    const query = deliveryForm.shippingAddressLine1.trim();
    if (query.length < 3 || query === selectedAddressLabel.trim()) {
      setAddressSuggestions([]);
      setAddressSearchLoading(false);
      setAddressSearchError("");
      return;
    }

    if (!geoapifyApiKey) {
      setAddressSuggestions([]);
      setAddressSearchLoading(false);
      setAddressSearchError("Address suggestions are unavailable right now.");
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setAddressSearchLoading(true);
      setAddressSearchError("");

      try {
        const searchUrl = new URL(
          "https://api.geoapify.com/v1/geocode/autocomplete",
        );
        searchUrl.searchParams.set(
          "text",
          buildAddressLookupQuery(query, addressCountryHint),
        );
        searchUrl.searchParams.set("limit", "5");
        searchUrl.searchParams.set("lang", locale);
        searchUrl.searchParams.set("format", "json");
        searchUrl.searchParams.set("apiKey", geoapifyApiKey);

        const countryCode = normalizeCountryHintToIso2(addressCountryHint);
        if (countryCode) {
          searchUrl.searchParams.set("filter", `countrycode:${countryCode}`);
        }

        const response = await fetch(searchUrl.toString(), {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        const result = await readJsonResponse<GeoapifyAutocompleteResponse>(
          response,
        );
        if (!result) {
          setAddressSuggestions([]);
          setAddressSearchError(
            "Address suggestions could not be prepared just now.",
          );
          return;
        }

        if (!response.ok) {
          setAddressSuggestions([]);
          setAddressSearchError("Address suggestions could not be prepared just now.");
          return;
        }

        const nextSuggestions = Array.isArray(result.features)
          ? result.features
              .map((feature) =>
                mapGeoapifySuggestion(feature, addressCountryHint),
              )
              .filter((suggestion): suggestion is AddressSuggestion =>
                Boolean(suggestion?.addressLine1),
              )
          : [];
        const comparableQuery = normalizeAddressComparison(query);
        const exactSuggestion =
          nextSuggestions.length === 1
            ? nextSuggestions[0]
            : nextSuggestions.find((suggestion) => {
                const lineValue = normalizeAddressComparison(
                  suggestion.addressLine1,
                );
                const labelValue = normalizeAddressComparison(suggestion.label);

                return (
                  comparableQuery.length >= 8 &&
                  (lineValue === comparableQuery ||
                    labelValue === comparableQuery ||
                    labelValue.startsWith(`${comparableQuery},`) ||
                    labelValue.startsWith(`${comparableQuery} `))
                );
              });

        if (exactSuggestion) {
          handleSelectAddressSuggestion(exactSuggestion);
          return;
        }

        setAddressSuggestions(nextSuggestions);
      } catch (error) {
        if (controller.signal.aborted) return;
        setAddressSuggestions([]);
        setAddressSearchError(
          error instanceof Error
            ? error.message
            : "Address suggestions could not be prepared just now.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setAddressSearchLoading(false);
        }
      }
    }, 260);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [
    activeSession,
    deliveryForm.shippingAddressLine1,
    addressCountryHint,
    locale,
    selectedAddressLabel,
  ]);

  const deliveryDetailsCompleted = Boolean(
    activeSession?.deliveryDetailsCompletedAt,
  );

  const handleUnlock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    setAccessSubmitting(true);
    setAccessError("");

    try {
      const response = await fetch("/api/private-acquisition-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token,
          referenceCode,
        }),
      });

      const result = await readJsonResponse<AccessResponse>(response);

      if (!result) {
        setAccessError(
          "The reference could not be verified just now. Please try again.",
        );
        return;
      }

      if (!response.ok || !result.success) {
        setAccessError(
          result.error ||
            "The reference could not be verified for this private issuance.",
        );
        return;
      }

      setReferenceCode("");
      setStateResponse({
        success: true,
        state: result.state,
        session: result.session,
      });
    } catch (error) {
      setAccessError(
        error instanceof Error
          ? error.message
          : "The reference could not be verified for this private issuance.",
      );
    } finally {
      setAccessSubmitting(false);
    }
  };

  const handleDeliveryFieldChange = <
    Key extends keyof DeliveryFormState,
  >(
    field: Key,
    value: DeliveryFormState[Key],
  ) => {
    setDeliveryForm((current) => ({ ...current, [field]: value }));
    if (deliveryErrors[field]) {
      setDeliveryErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
    if (deliveryError) setDeliveryError("");
    if (deliveryNotice) setDeliveryNotice("");
    if (paymentError) setPaymentError("");
    if (addressSearchError) setAddressSearchError("");
    if (clientSecret) setClientSecret("");
    if (publishableKey) setPublishableKey("");

    if (field === "shippingAddressLine1") {
      setSelectedAddressLabel("");
    }
  };

  const handleSelectAddressSuggestion = (suggestion: AddressSuggestion) => {
    setDeliveryForm((current) => ({
      ...current,
      shippingAddressLine1: suggestion.addressLine1 || current.shippingAddressLine1,
      shippingAddressLine2:
        current.shippingAddressLine2 || suggestion.addressLine2 || "",
      shippingCity: suggestion.city || current.shippingCity,
      shippingRegion: suggestion.region || current.shippingRegion,
      shippingPostalCode: suggestion.postalCode || current.shippingPostalCode,
      shippingCountry:
        activeSession?.shippingCountry ||
        suggestion.country ||
        current.shippingCountry,
    }));
    setSelectedAddressLabel(suggestion.addressLine1 || "");
    setAddressSuggestions([]);
    setAddressSearchError("");
    setDeliveryErrors((current) => {
      const next = { ...current };
      delete next.shippingAddressLine1;
      delete next.shippingAddressLine2;
      delete next.shippingCity;
      delete next.shippingRegion;
      delete next.shippingPostalCode;
      delete next.shippingCountry;
      return next;
    });
  };

  const handleSaveDeliveryDetails = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!token) return;

    const clientErrors = validateDeliveryFormState(deliveryForm);
    if (Object.keys(clientErrors).length > 0) {
      setDeliveryErrors(clientErrors);
      return;
    }

    setDeliverySubmitting(true);
    setDeliveryErrors({});
    setDeliveryError("");
    setDeliveryNotice("");
    setPaymentError("");

    try {
      const response = await fetch("/api/private-acquisition-delivery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token,
          clientName: deliveryForm.clientName,
          clientEmail: deliveryForm.clientEmail,
          clientPhone: deliveryForm.clientPhone,
          shippingCountry: deliveryForm.shippingCountry,
          shippingRegion: deliveryForm.shippingRegion,
          shippingCity: deliveryForm.shippingCity,
          shippingPostalCode: deliveryForm.shippingPostalCode,
          shippingAddressLine1: deliveryForm.shippingAddressLine1,
          shippingAddressLine2: deliveryForm.shippingAddressLine2,
          shippingRecipientName: deliveryForm.shippingRecipientName,
          shippingDeliveryNotes: deliveryForm.shippingDeliveryNotes,
          confirmDetails: deliveryForm.confirmDetails,
        }),
      });

      const result = await readJsonResponse<DeliveryResponse>(response);

      if (!result) {
        setDeliveryError(
          "The destination record could not be confirmed just now. Please try again.",
        );
        setDeliveryNotice("");
        return;
      }

      if (!response.ok || !result.success) {
        setDeliveryErrors(result.fieldErrors || {});
        setDeliveryError(
          result.error ||
            "The destination record could not be retained under this issuance.",
        );
        setDeliveryNotice("");
        return;
      }

      if (result.state === "paid") {
        setStateResponse({
          success: true,
          state: "paid",
          session: result.session,
        });
        return;
      }

      setStateResponse({
        success: true,
        state: "unlocked",
        session: result.session,
      });
      setClientSecret("");
      setPublishableKey("");
      setDeliveryNotice(
        "The destination record has been retained. Payment may now continue within this page.",
      );
    } catch (error) {
      setDeliveryError(
        error instanceof Error
          ? error.message
          : "The destination record could not be retained under this issuance.",
      );
    } finally {
      setDeliverySubmitting(false);
    }
  };

  const handlePreparePayment = async () => {
    if (!token) return;

    if (!deliveryDetailsCompleted) {
      setPaymentError(
        "The acquisition can proceed once the destination record is complete.",
      );
      return;
    }

    setPaymentSubmitting(true);
    setPaymentError("");

    try {
      const response = await fetch("/api/private-acquisition-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await readJsonResponse<PaymentIntentResponse>(response);

      if (!result) {
        setPaymentError(
          "The private payment chamber could not be prepared just now.",
        );
        return;
      }

      if (!response.ok || !result.success) {
        setPaymentError(
          result.error || "The private payment chamber could not be prepared.",
        );
        return;
      }

      if (result.state === "paid") {
        setStateResponse({
          success: true,
          state: "paid",
          session: result.session,
        });
        return;
      }

      setPublishableKey(result.publishableKey);
      setClientSecret(result.clientSecret);
      setStateResponse({
        success: true,
        state: "unlocked",
        session: result.session,
      });
    } catch (error) {
      setPaymentError(
        error instanceof Error
          ? error.message
          : "The private payment chamber could not be prepared.",
      );
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const title = loadingState
    ? "Preparing private access."
    : !stateResponse || !stateResponse.success
      ? "Private access unavailable."
      : stateResponse.state === "access_required"
        ? "Private Acquisition Access"
        : stateResponse.state === "unlocked"
          ? "Private Acquisition"
          : stateResponse.state === "paid"
            ? "Acquisition confirmed."
            : stateResponse.state === "revoked"
              ? "Issuance withdrawn."
              : stateResponse.state === "expired"
                ? "Issuance expired."
                : "Private access unavailable.";

  const description = loadingState
    ? "This page is being prepared under the house record."
    : !stateResponse || !stateResponse.success
      ? stateResponse?.error ||
        "This private page could not be opened as issued."
      : stateResponse.state === "access_required"
        ? "This page has been issued following direct correspondence. Enter the reference code to continue into the private acquisition chamber."
        : stateResponse.state === "unlocked"
          ? "Your acquisition has been prepared privately. Review the retained summary below, then continue into on-site payment within the validity window."
          : stateResponse.state === "paid"
            ? "This issuance has already been completed and is now retained under the house record."
            : stateResponse.state === "revoked"
              ? "This issuance is no longer active. If anything requires clarification, the house should continue through direct correspondence."
              : "The validity window for this issuance has now closed.";

  const specifications = getSpecifications(activeSession);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#090806] text-[#f6efe5]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(199,160,111,0.12),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,6,0.92),rgba(8,7,6,0.98))]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[110rem] flex-col px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-10 lg:pb-12 lg:pt-10">
        <header className="flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={onReturnHome}
            className="inline-flex items-center gap-3 text-left text-[#f6efe5] transition hover:text-white"
          >
            <img
              src={wordmarkSrc}
              alt="Praeliator"
              className="h-9 w-auto sm:h-11"
              draggable={false}
            />
          </button>
          <div className="flex items-center gap-3 sm:gap-5">
            <PrivateRouteLanguageSwitcher
              locale={locale}
              onChange={onLocaleChange}
              label={languageLabel}
            />
            <p className="text-[10px] uppercase tracking-[0.34em] text-white/42 sm:text-[11px]">
              Private issuance
            </p>
          </div>
        </header>

        <div className="mt-8 grid flex-1 gap-6 lg:mt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: easeLuxury }}
            className="flex"
          >
            <div className="flex h-full w-full flex-col justify-between rounded-[2.25rem] border border-[#35271d] bg-[linear-gradient(180deg,rgba(251,244,236,0.98),rgba(245,235,224,0.98))] p-6 text-[#241912] shadow-[0_38px_120px_rgba(0,0,0,0.24)] sm:p-8 lg:p-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#9a7a5b]">
                  Private acquisition
                </p>
                <h1 className="mt-5 max-w-[12ch] font-['Cormorant_Garamond'] text-[3.2rem] font-semibold leading-[0.92] tracking-[-0.06em] sm:text-[4rem] lg:text-[5rem]">
                  {title}
                </h1>
                <p className="mt-5 max-w-2xl text-[1.02rem] leading-8 text-[#59483b] sm:text-[1.08rem]">
                  {description}
                </p>
              </div>

              <div className="mt-8 rounded-[1.8rem] border border-[#d8c3aa] bg-[rgba(255,251,245,0.65)] p-5 sm:p-6">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#9a7a5b]">
                  House note
                </p>
                <p className="mt-3 text-base leading-8 text-[#5f4b3c]">
                  Hidden access alone is not sufficient. The private link and the issued reference must agree before the allocation is revealed.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.06, ease: easeLuxury }}
            className="flex"
          >
            <div className="flex h-full w-full flex-col rounded-[2.25rem] border border-[#35271d] bg-[linear-gradient(180deg,rgba(251,244,236,0.98),rgba(245,235,224,0.98))] p-6 text-[#241912] shadow-[0_38px_120px_rgba(0,0,0,0.24)] sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                {loadingState ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease: easeLuxury }}
                    className="flex min-h-[26rem] flex-1 flex-col items-start justify-center"
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#9a7a5b]">
                      Preparing
                    </p>
                    <p className="mt-4 font-['Cormorant_Garamond'] text-5xl leading-none tracking-[-0.06em]">
                      Quietly opening the chamber.
                    </p>
                    <div className="mt-6 h-1 w-28 overflow-hidden rounded-full bg-[#dbcab8]">
                      <motion.div
                        className="h-full rounded-full bg-[#2f2218]"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </motion.div>
                ) : !stateResponse || !stateResponse.success ? (
                  <motion.div
                    key="invalid"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease: easeLuxury }}
                    className="flex min-h-[26rem] flex-1 flex-col justify-center"
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#9a7a5b]">
                      Invalid issuance
                    </p>
                    <p className="mt-4 max-w-[13ch] font-['Cormorant_Garamond'] text-5xl leading-[0.95] tracking-[-0.06em]">
                      This private page could not be verified.
                    </p>
                    <p className="mt-5 max-w-xl text-base leading-8 text-[#5f4b3c]">
                      {stateResponse?.error ||
                        "The link is not recognized under the current house record."}
                    </p>
                    <div className="mt-8">
                      <Button
                        type="button"
                        onClick={onReturnHome}
                        className="min-h-[3.75rem] rounded-full bg-[#211711] px-7 text-sm text-[#f7efe5] shadow-[0_20px_50px_rgba(24,18,14,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#16100c]"
                      >
                        Return to Praeliator
                      </Button>
                    </div>
                  </motion.div>
                ) : stateResponse.state === "access_required" ? (
                  <motion.div
                    key="access"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease: easeLuxury }}
                    className="flex flex-1 flex-col justify-center"
                  >
                    <div className="grid gap-5">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-[#9a7a5b]">
                          Access verification
                        </p>
                        <p className="mt-4 font-['Cormorant_Garamond'] text-[3rem] leading-[0.94] tracking-[-0.06em] sm:text-[3.6rem]">
                          Enter your issued reference.
                        </p>
                        <p className="mt-5 max-w-2xl text-base leading-8 text-[#5f4b3c]">
                          This page remains private until the reference and the
                          issued session link are verified together.
                        </p>
                      </div>

                      <form className="grid gap-4" onSubmit={handleUnlock}>
                        <label className="grid gap-2">
                          <span className="text-[11px] uppercase tracking-[0.28em] text-[#9a7a5b]">
                            Reference code
                          </span>
                          <input
                            type="text"
                            value={referenceCode}
                            onChange={(event) => {
                              setReferenceCode(event.target.value.toUpperCase());
                              if (accessError) setAccessError("");
                            }}
                            className="min-h-[4rem] rounded-[1.8rem] border border-[#ccb59a] bg-[#f8f2ea] px-5 text-[1rem] tracking-[0.14em] text-[#241912] outline-none transition focus:border-[#a37a56] focus:bg-white"
                            placeholder="PRA-VIS-7K4M9Q"
                            autoCapitalize="characters"
                            autoComplete="one-time-code"
                          />
                        </label>

                        {accessError ? (
                          <p className="text-sm leading-7 text-[#815c42]">
                            {accessError}
                          </p>
                        ) : (
                          <p className="text-sm leading-7 text-[#6c5646]">
                            Valid until {formatDate(stateResponse.expiresAt)}.
                          </p>
                        )}

                        <div className="pt-2">
                          <Button
                            type="submit"
                            disabled={accessSubmitting}
                            className="min-h-[3.85rem] rounded-full bg-[#211711] px-7 text-sm text-[#f7efe5] shadow-[0_20px_50px_rgba(24,18,14,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#16100c] disabled:pointer-events-none disabled:opacity-60"
                          >
                            {accessSubmitting
                              ? "Verifying reference..."
                              : "Continue Privately"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                ) : stateResponse.state === "paid" ? (
                  <motion.div
                    key="paid"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease: easeLuxury }}
                    className="flex flex-1 flex-col justify-center"
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#9a7a5b]">
                      Retained confirmation
                    </p>
                    <p className="mt-4 max-w-[13ch] font-['Cormorant_Garamond'] text-[3rem] leading-[0.94] tracking-[-0.06em] sm:text-[3.8rem]">
                      The acquisition has been confirmed.
                    </p>
                    <p className="mt-5 max-w-2xl text-base leading-8 text-[#5f4b3c]">
                      Reference {stateResponse.session.referenceCode} was
                      completed on {formatDate(stateResponse.session.paidAt)}.
                    </p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.6rem] border border-[#d8c3aa] bg-[#f8f2ea] p-5">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                          Product
                        </p>
                        <p className="mt-3 text-lg text-[#241912]">
                          {stateResponse.session.productName}
                        </p>
                      </div>
                      <div className="rounded-[1.6rem] border border-[#d8c3aa] bg-[#f8f2ea] p-5">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                          Total retained
                        </p>
                        <p className="mt-3 text-lg text-[#241912]">
                          {formatMoney(
                            stateResponse.session.totalAmount,
                            stateResponse.session.currency,
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : stateResponse.state === "revoked" ||
                  stateResponse.state === "expired" ? (
                  <motion.div
                    key={stateResponse.state}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease: easeLuxury }}
                    className="flex flex-1 flex-col justify-center"
                  >
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#9a7a5b]">
                      {stateResponse.state === "expired"
                        ? "Expired issuance"
                        : "Withdrawn issuance"}
                    </p>
                    <p className="mt-4 max-w-[12ch] font-['Cormorant_Garamond'] text-[3rem] leading-[0.94] tracking-[-0.06em] sm:text-[3.8rem]">
                      {stateResponse.state === "expired"
                        ? "The validity window has closed."
                        : "This issuance is no longer active."}
                    </p>
                    <p className="mt-5 max-w-2xl text-base leading-8 text-[#5f4b3c]">
                      The house should continue only through direct correspondence
                      if anything now requires review.
                    </p>
                    <div className="mt-8">
                      <Button
                        type="button"
                        onClick={onReturnHome}
                        className="min-h-[3.75rem] rounded-full bg-[#211711] px-7 text-sm text-[#f7efe5] shadow-[0_20px_50px_rgba(24,18,14,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#16100c]"
                      >
                        Return to Praeliator
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="unlocked"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.45, ease: easeLuxury }}
                    className="grid flex-1 gap-6 lg:grid-cols-[0.92fr_1.08fr]"
                  >
                    <div className="grid gap-4">
                      <div className="rounded-[1.8rem] border border-[#d8c3aa] bg-[#f8f2ea] p-5">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                          House reference
                        </p>
                        <p className="mt-4 font-['Cormorant_Garamond'] text-[2.4rem] leading-none tracking-[-0.06em]">
                          {activeSession?.referenceCode}
                        </p>
                        <p className="mt-4 text-base leading-8 text-[#5f4b3c]">
                          Prepared following direct correspondence. Valid until{" "}
                          {formatDate(activeSession?.expiresAt)}.
                        </p>
                      </div>

                      <div className="rounded-[1.8rem] border border-[#d8c3aa] bg-[#f8f2ea] p-5">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                          Product
                        </p>
                        <p className="mt-3 text-xl text-[#241912]">
                          {activeSession?.productName}
                        </p>
                        <div className="mt-5 grid gap-3">
                          {specifications.map((item) => (
                            <div
                              key={`${item.label}-${item.value}`}
                              className="flex items-start justify-between gap-4 border-t border-[#e7d8c7] pt-3"
                            >
                              <p className="text-[11px] uppercase tracking-[0.18em] text-[#9a7a5b]">
                                {item.label}
                              </p>
                              <p className="text-sm leading-7 text-[#3f3126]">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.8rem] border border-[#d8c3aa] bg-[#f8f2ea] p-5">
                        <div className="divide-y divide-[#e7d8c7]">
                          <div className="flex items-start justify-between gap-6 py-4 first:pt-0">
                            <div>
                              <p className="text-lg leading-8 text-[#241912]">
                                {activeSession?.productName || "Praeliator VIS"}
                              </p>
                              <p className="text-sm leading-7 text-[#6c5646]">
                                Quantity {activeSession?.quantity || 1}
                              </p>
                            </div>
                            <p className="text-lg leading-8 text-[#241912]">
                              {activeSession
                                ? formatMoney(
                                    activeSession.subtotalAmount,
                                    activeSession.currency,
                                  )
                                : "Pending"}
                            </p>
                          </div>

                          <div className="flex items-start justify-between gap-6 py-4">
                            <div>
                              <p className="text-lg leading-8 text-[#241912]">
                                Private allocation and fulfillment
                              </p>
                              <p className="text-sm leading-7 text-[#6c5646]">
                                {[
                                  activeSession?.shippingRegion,
                                  activeSession?.shippingCountry,
                                ]
                                  .filter(Boolean)
                                  .join(", ") || "Prepared under private review"}
                              </p>
                            </div>
                            <p className="text-lg leading-8 text-[#241912]">
                              {activeSession
                                ? formatMoney(
                                    activeSession.shippingAmount,
                                    activeSession.currency,
                                  )
                                : "Pending"}
                            </p>
                          </div>

                          <div className="flex items-start justify-between gap-6 py-4 pb-0">
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-[#9a7a5b]">
                                Total due today
                              </p>
                            </div>
                            <p className="font-['Cormorant_Garamond'] text-[2.1rem] leading-none tracking-[-0.05em] text-[#241912]">
                              {activeSession
                                ? formatMoney(
                                    activeSession.totalAmount,
                                    activeSession.currency,
                                  )
                                : "Pending"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <form
                        className="rounded-[1.8rem] border border-[#d8c3aa] bg-[#fcf8f2] p-5 shadow-[0_18px_50px_rgba(111,79,49,0.06)] sm:p-6"
                        onSubmit={handleSaveDeliveryDetails}
                        autoComplete="on"
                      >
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                            Destination record
                          </p>
                          <p className="mt-4 font-['Cormorant_Garamond'] text-[2.2rem] leading-[0.94] tracking-[-0.06em] text-[#241912]">
                            Retain the delivery details before payment opens.
                          </p>
                          <p className="mt-5 text-base leading-8 text-[#5f4b3c]">
                            These details remain attached to the acquisition
                            record and are required before the payment chamber
                            can proceed.
                          </p>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                          <label className="grid gap-2 sm:col-span-2">
                            <span className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                              Full name
                            </span>
                            <input
                              type="text"
                              name="clientName"
                              value={deliveryForm.clientName}
                              onChange={(event) =>
                                handleDeliveryFieldChange(
                                  "clientName",
                                  event.target.value,
                                )
                              }
                              className={chamberFieldClass}
                              placeholder="Name attached to this acquisition"
                              autoComplete="name"
                            />
                            {deliveryErrors.clientName ? (
                              <p className="text-sm leading-7 text-[#815c42]">
                                {deliveryErrors.clientName}
                              </p>
                            ) : null}
                          </label>

                          <label className="grid gap-2">
                            <span className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                              Email
                            </span>
                            <input
                              type="email"
                              name="clientEmail"
                              value={deliveryForm.clientEmail}
                              onChange={(event) =>
                                handleDeliveryFieldChange(
                                  "clientEmail",
                                  event.target.value,
                                )
                              }
                              className={chamberFieldClass}
                              placeholder="Delivery correspondence"
                              autoComplete="email"
                              inputMode="email"
                            />
                            {deliveryErrors.clientEmail ? (
                              <p className="text-sm leading-7 text-[#815c42]">
                                {deliveryErrors.clientEmail}
                              </p>
                            ) : null}
                          </label>

                          <label className="grid gap-2 sm:col-span-2">
                            <span className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                              Phone
                            </span>
                            <input
                              type="tel"
                              name="clientPhone"
                              value={deliveryForm.clientPhone}
                              onChange={(event) =>
                                handleDeliveryFieldChange(
                                  "clientPhone",
                                  event.target.value,
                                )
                              }
                              className={chamberFieldClass}
                              placeholder="Delivery contact number"
                              autoComplete="tel"
                              inputMode="tel"
                            />
                            {deliveryErrors.clientPhone ? (
                              <p className="text-sm leading-7 text-[#815c42]">
                                {deliveryErrors.clientPhone}
                              </p>
                            ) : null}
                          </label>

                          <label className="grid gap-2">
                            <span className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                              Country
                            </span>
                            <input
                              type="text"
                              name="shippingCountry"
                              value={deliveryForm.shippingCountry}
                              onChange={(event) =>
                                handleDeliveryFieldChange(
                                  "shippingCountry",
                                  event.target.value,
                                )
                              }
                              className={chamberFieldClass}
                              placeholder="Destination country"
                              autoComplete="off"
                              readOnly={Boolean(activeSession?.shippingCountry)}
                              spellCheck={false}
                            />
                            {deliveryErrors.shippingCountry ? (
                              <p className="text-sm leading-7 text-[#815c42]">
                                {deliveryErrors.shippingCountry}
                              </p>
                            ) : null}
                          </label>

                          <label className="grid gap-2">
                            <span className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                              State / region
                            </span>
                            <input
                              type="text"
                              name="shippingRegion"
                              value={deliveryForm.shippingRegion}
                              onChange={(event) =>
                                handleDeliveryFieldChange(
                                  "shippingRegion",
                                  event.target.value,
                                )
                              }
                              className={chamberFieldClass}
                              placeholder="State or region"
                              autoComplete="off"
                              spellCheck={false}
                            />
                            {deliveryErrors.shippingRegion ? (
                              <p className="text-sm leading-7 text-[#815c42]">
                                {deliveryErrors.shippingRegion}
                              </p>
                            ) : null}
                          </label>

                          <label className="grid gap-2">
                            <span className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                              City
                            </span>
                            <input
                              type="text"
                              name="shippingCity"
                              value={deliveryForm.shippingCity}
                              onChange={(event) =>
                                handleDeliveryFieldChange(
                                  "shippingCity",
                                  event.target.value,
                                )
                              }
                              className={chamberFieldClass}
                              placeholder="Destination city"
                              autoComplete="off"
                              spellCheck={false}
                            />
                            {deliveryErrors.shippingCity ? (
                              <p className="text-sm leading-7 text-[#815c42]">
                                {deliveryErrors.shippingCity}
                              </p>
                            ) : null}
                          </label>

                          <label className="grid gap-2 sm:col-span-2">
                            <span className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                              Address line 1
                            </span>
                            <input
                              type="text"
                              name="deliveryAddressLookup"
                              value={deliveryForm.shippingAddressLine1}
                              onChange={(event) =>
                                handleDeliveryFieldChange(
                                  "shippingAddressLine1",
                                  event.target.value,
                                )
                              }
                              className={chamberFieldClass}
                              placeholder="Begin entering the destination address"
                              autoComplete="off"
                              autoCorrect="off"
                              spellCheck={false}
                            />
                            {addressSuggestions.length ? (
                              <div className="grid gap-2 rounded-[1.35rem] border border-[#d8c3aa] bg-white/95 p-2 shadow-[0_16px_36px_rgba(111,79,49,0.08)]">
                                {addressSuggestions.map((suggestion) => (
                                  <button
                                    key={suggestion.id}
                                    type="button"
                                    onClick={() =>
                                      handleSelectAddressSuggestion(suggestion)
                                    }
                                    className="rounded-[1rem] px-3 py-3 text-left transition duration-200 hover:bg-[#f6ede3]"
                                  >
                                    <p className="text-sm leading-6 text-[#241912]">
                                      {suggestion.label}
                                    </p>
                                    {suggestion.secondaryText ? (
                                      <p className="mt-1 text-xs leading-5 text-[#7b6553]">
                                        {suggestion.secondaryText}
                                      </p>
                                    ) : null}
                                  </button>
                                ))}
                              </div>
                            ) : null}
                            {addressSearchLoading ? (
                              <p className="text-sm leading-7 text-[#6c5646]">
                                Searching destination addresses...
                              </p>
                            ) : null}
                            {addressSearchError ? (
                              <p className="text-sm leading-7 text-[#815c42]">
                                {addressSearchError}
                              </p>
                            ) : null}
                            {deliveryErrors.shippingAddressLine1 ? (
                              <p className="text-sm leading-7 text-[#815c42]">
                                {deliveryErrors.shippingAddressLine1}
                              </p>
                            ) : null}
                          </label>

                          <label className="grid gap-2 sm:col-span-2">
                            <span className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                              Address line 2
                            </span>
                            <input
                              type="text"
                              name="deliveryAddressLine2"
                              value={deliveryForm.shippingAddressLine2}
                              onChange={(event) =>
                                handleDeliveryFieldChange(
                                  "shippingAddressLine2",
                                  event.target.value,
                                )
                              }
                              className={chamberFieldClass}
                              placeholder="Apartment, suite, or additional detail"
                              autoComplete="off"
                              spellCheck={false}
                            />
                          </label>

                          <label className="grid gap-2">
                            <span className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                              Postal code
                            </span>
                            <input
                              type="text"
                              name="deliveryPostalCode"
                              value={deliveryForm.shippingPostalCode}
                              onChange={(event) =>
                                handleDeliveryFieldChange(
                                  "shippingPostalCode",
                                  event.target.value,
                                )
                              }
                              className={chamberFieldClass}
                              placeholder="Postal code"
                              autoComplete="off"
                              inputMode="numeric"
                              spellCheck={false}
                            />
                            {deliveryErrors.shippingPostalCode ? (
                              <p className="text-sm leading-7 text-[#815c42]">
                                {deliveryErrors.shippingPostalCode}
                              </p>
                            ) : null}
                          </label>

                          <label className="grid gap-2 sm:col-span-2">
                            <span className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                              Recipient name
                            </span>
                            <input
                              type="text"
                              name="shippingRecipientName"
                              value={deliveryForm.shippingRecipientName}
                              onChange={(event) =>
                                handleDeliveryFieldChange(
                                  "shippingRecipientName",
                                  event.target.value,
                                )
                              }
                              className={chamberFieldClass}
                              placeholder="Only if the recipient differs"
                              autoComplete="shipping name"
                            />
                            {deliveryErrors.shippingRecipientName ? (
                              <p className="text-sm leading-7 text-[#815c42]">
                                {deliveryErrors.shippingRecipientName}
                              </p>
                            ) : null}
                          </label>

                          <label className="grid gap-2 sm:col-span-2">
                            <span className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                              Delivery notes
                            </span>
                            <textarea
                              name="shippingDeliveryNotes"
                              value={deliveryForm.shippingDeliveryNotes}
                              onChange={(event) =>
                                handleDeliveryFieldChange(
                                  "shippingDeliveryNotes",
                                  event.target.value.slice(0, 500),
                                )
                              }
                              className={chamberTextareaClass}
                              placeholder="Any detail the house should retain for delivery."
                              maxLength={500}
                              autoComplete="off"
                            />
                          </label>
                        </div>

                        <label className="mt-5 flex items-start gap-3 rounded-[1.4rem] border border-[#d8c3aa] bg-[#f8f2ea] px-4 py-4">
                          <input
                            type="checkbox"
                            checked={deliveryForm.confirmDetails}
                            onChange={(event) =>
                              handleDeliveryFieldChange(
                                "confirmDetails",
                                event.target.checked,
                              )
                            }
                            className="mt-1 h-4 w-4 rounded border-[#b8916d] text-[#211711] focus:ring-[#a37a56]"
                          />
                          <span className="text-sm leading-7 text-[#5f4b3c]">
                            I confirm that these delivery details are correct and
                            may be attached to this acquisition record.
                          </span>
                        </label>
                        {deliveryErrors.confirmDetails ? (
                          <p className="mt-2 text-sm leading-7 text-[#815c42]">
                            {deliveryErrors.confirmDetails}
                          </p>
                        ) : null}

                        {deliveryNotice ? (
                          <p className="mt-4 text-sm leading-7 text-[#5f4b3c]">
                            {deliveryNotice}
                          </p>
                        ) : null}
                        {deliveryError ? (
                          <p className="mt-4 text-sm leading-7 text-[#815c42]">
                            {deliveryError}
                          </p>
                        ) : null}

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                          <Button
                            type="submit"
                            disabled={deliverySubmitting}
                            className="min-h-[3.85rem] rounded-full bg-[#211711] px-7 text-sm text-[#f7efe5] shadow-[0_20px_50px_rgba(24,18,14,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#16100c] disabled:pointer-events-none disabled:opacity-60"
                          >
                            {deliverySubmitting
                              ? "Retaining destination..."
                              : deliveryDetailsCompleted
                                ? "Update Destination Record"
                                : "Confirm Destination Record"}
                          </Button>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#8b6b4f]">
                            {deliveryDetailsCompleted
                              ? "Destination retained"
                              : "Payment remains sealed"}
                          </p>
                        </div>
                      </form>
                    </div>

                    <div className="flex flex-col rounded-[1.8rem] border border-[#d8c3aa] bg-[#fcf8f2] p-5 shadow-[0_18px_50px_rgba(111,79,49,0.06)] sm:p-6">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                          Payment chamber
                        </p>
                        <p className="mt-4 font-['Cormorant_Garamond'] text-[2.4rem] leading-[0.94] tracking-[-0.06em] text-[#241912]">
                          Confirm the prepared acquisition within the site.
                        </p>
                        <p className="mt-5 text-base leading-8 text-[#5f4b3c]">
                          The destination record must be complete before payment
                          opens. Once confirmed, completion closes the issuance
                          automatically.
                        </p>
                      </div>

                      <div className="mt-6 flex-1">
                        {clientSecret && publishableKey ? (
                          <PaymentChamber
                            publishableKey={publishableKey}
                            clientSecret={clientSecret}
                            session={activeSession!}
                            token={token}
                            onRefresh={refreshState}
                          />
                        ) : (
                          <div className="rounded-[1.8rem] border border-dashed border-[#d8c3aa] bg-[#f8f2ea] p-6">
                            <p className="text-sm leading-8 text-[#5f4b3c]">
                              {deliveryDetailsCompleted
                                ? "The destination record is complete. Payment can now be prepared inside this page without sending you to an external link."
                                : "The acquisition can proceed once the destination record is complete and retained under this issuance."}
                            </p>
                            {paymentError ? (
                              <p className="mt-4 text-sm leading-7 text-[#815c42]">
                                {paymentError}
                              </p>
                            ) : null}
                            <div className="mt-6">
                              <Button
                                type="button"
                                onClick={handlePreparePayment}
                                disabled={paymentSubmitting || !deliveryDetailsCompleted}
                                className="min-h-[3.85rem] rounded-full bg-[#211711] px-7 text-sm text-[#f7efe5] shadow-[0_20px_50px_rgba(24,18,14,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#16100c] disabled:pointer-events-none disabled:opacity-60"
                              >
                                {paymentSubmitting
                                  ? "Preparing payment..."
                                  : deliveryDetailsCompleted
                                    ? "Open Private Payment"
                                    : "Complete Destination Record First"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
