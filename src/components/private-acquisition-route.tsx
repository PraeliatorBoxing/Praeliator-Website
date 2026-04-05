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

type AcquisitionSessionSummary = {
  referenceCode: string;
  clientName?: string | null;
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
  expiresAt: string;
  status: string;
  paidAt?: string | null;
  validatedAt?: string | null;
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

const easeLuxury: [number, number, number, number] = [0.16, 1, 0.3, 1];

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
}: {
  wordmarkSrc: string;
  onReturnHome: () => void;
}) {
  const token = useMemo(() => getSessionToken(), []);
  const [stateResponse, setStateResponse] = useState<StateResponse | null>(null);
  const [loadingState, setLoadingState] = useState(true);
  const [referenceCode, setReferenceCode] = useState("");
  const [accessSubmitting, setAccessSubmitting] = useState(false);
  const [accessError, setAccessError] = useState("");
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

      const result = (await response.json()) as StateResponse;
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

      const result = (await response.json()) as AccessResponse;

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

  const handlePreparePayment = async () => {
    if (!token) return;

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

      const result = (await response.json()) as PaymentIntentResponse;

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
          <p className="text-[10px] uppercase tracking-[0.34em] text-white/42 sm:text-[11px]">
            Private issuance
          </p>
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
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9a7a5b]">
                              Quantity
                            </p>
                            <p className="mt-2 text-lg text-[#241912]">
                              {activeSession?.quantity}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9a7a5b]">
                              Destination
                            </p>
                            <p className="mt-2 text-lg text-[#241912]">
                              {[
                                activeSession?.shippingRegion,
                                activeSession?.shippingCountry,
                              ]
                                .filter(Boolean)
                                .join(", ") || "Private review"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9a7a5b]">
                              Subtotal
                            </p>
                            <p className="mt-2 text-lg text-[#241912]">
                              {activeSession
                                ? formatMoney(
                                    activeSession.subtotalAmount,
                                    activeSession.currency,
                                  )
                                : "Pending"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#9a7a5b]">
                              Shipping
                            </p>
                            <p className="mt-2 text-lg text-[#241912]">
                              {activeSession
                                ? formatMoney(
                                    activeSession.shippingAmount,
                                    activeSession.currency,
                                  )
                                : "Pending"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-5 border-t border-[#e7d8c7] pt-4">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-[#9a7a5b]">
                            Total amount
                          </p>
                          <p className="mt-2 font-['Cormorant_Garamond'] text-[2.1rem] leading-none tracking-[-0.05em] text-[#241912]">
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

                    <div className="flex flex-col rounded-[1.8rem] border border-[#d8c3aa] bg-[#fcf8f2] p-5 shadow-[0_18px_50px_rgba(111,79,49,0.06)] sm:p-6">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a7a5b]">
                          Payment chamber
                        </p>
                        <p className="mt-4 font-['Cormorant_Garamond'] text-[2.4rem] leading-[0.94] tracking-[-0.06em] text-[#241912]">
                          Confirm the prepared acquisition within the site.
                        </p>
                        <p className="mt-5 text-base leading-8 text-[#5f4b3c]">
                          The payment step is opened only after the issued
                          session and reference agree. Completion closes the
                          issuance automatically.
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
                              Payment is still closed. When you are ready, the
                              chamber can be prepared inside this page without
                              sending you to an external payment link.
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
                                disabled={paymentSubmitting}
                                className="min-h-[3.85rem] rounded-full bg-[#211711] px-7 text-sm text-[#f7efe5] shadow-[0_20px_50px_rgba(24,18,14,0.18)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#16100c] disabled:pointer-events-none disabled:opacity-60"
                              >
                                {paymentSubmitting
                                  ? "Preparing payment..."
                                  : "Open Private Payment"}
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
