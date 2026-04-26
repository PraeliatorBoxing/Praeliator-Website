import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { type SiteLocale, siteLocaleOptions } from "../lib/site-locale";

type HouseLedgerStats = {
  totalSalesCount: number;
  totalRevenue: number;
  todaySalesCount: number;
  todayRevenue: number;
  monthSalesCount: number;
  monthRevenue: number;
  pendingFulfillmentCount: number;
  unreadNotificationsCount: number;
  lastPaidAt?: string | null;
  reportedCurrency?: string | null;
  currencyCount: number;
};

type HouseLedgerSale = {
  id: string;
  saleReference: string;
  clientName?: string | null;
  clientEmail?: string | null;
  productName: string;
  quantity: number;
  currency: string;
  totalAmount: number;
  amountReceived?: number | null;
  shippingCountry?: string | null;
  shippingRegion?: string | null;
  shippingCity?: string | null;
  fulfillmentStatus: "pending" | "preparing" | "fulfilled" | "archived";
  paidAt?: string | null;
  createdAt?: string | null;
};

type HouseLedgerNotification = {
  id: string;
  saleId?: string | null;
  kind: string;
  title: string;
  body: string;
  payload?: Record<string, unknown>;
  readAt?: string | null;
  createdAt: string;
};

type HouseLedgerOwner = {
  id: string;
  email: string;
  fullName?: string | null;
};

type HouseLedgerState = {
  owner: HouseLedgerOwner;
  stats: HouseLedgerStats;
  sales: HouseLedgerSale[];
  notifications: HouseLedgerNotification[];
};

type HouseLedgerIssueResult = {
  issuance: {
    referenceCode: string;
    privateUrl: string;
    expiresAt: string;
    orderSummary: {
      productName: string;
      quantity: number;
      currency: string;
      totalAmount: number;
      shippingCountry?: string | null;
      shippingRegion?: string | null;
    };
  };
  preparedNotice: string;
  powerShellSnippet: string;
};

type StateResponse =
  | ({ success: true } & HouseLedgerState)
  | { success: false; error?: string };

type ReadNotificationsResponse =
  | { success: true; readAt: string; unreadNotificationsCount: number }
  | { success: false; error?: string };

type SaleStatusResponse =
  | { success: true; sale: HouseLedgerSale }
  | { success: false; error?: string };

type IssueAcquisitionResponse =
  | ({ success: true } & HouseLedgerIssueResult)
  | { success: false; error?: string; fieldErrors?: Record<string, string> };

const easeLuxury: [number, number, number, number] = [0.16, 1, 0.3, 1];
const cardClassName =
  "overflow-hidden rounded-[1.75rem] border border-[#d7c8b3] bg-[linear-gradient(180deg,rgba(253,249,242,0.98),rgba(241,232,220,0.96))] text-[#241b15] shadow-[0_20px_54px_rgba(77,53,30,0.1)]";
const ledgerSurfaceClassName =
  "min-h-dvh bg-[radial-gradient(circle_at_top,rgba(181,142,92,0.17),transparent_26%),linear-gradient(180deg,#f7efe4_0%,#efe3d2_48%,#eadbc7_100%)] text-[#231b15]";
const fieldClassName =
  "w-full rounded-full border border-[#ceb89d] bg-[#fffaf4] px-4 py-3 text-sm text-[#231912] outline-none transition focus:border-[#8f6848] focus:bg-white";
const textAreaFieldClassName =
  "w-full rounded-[1.4rem] border border-[#ceb89d] bg-[#fffaf4] px-4 py-4 text-sm leading-7 text-[#231912] outline-none transition focus:border-[#8f6848] focus:bg-white";
const issuanceSpecificationDefault =
  "Format=16 oz lace-up\nMaterial=Top-grain cowhide";

async function parseJsonResponse<T>(response: Response, fallbackError: string) {
  const contentType = response.headers.get("content-type") || "";
  const rawBody = await response.text();

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error(
      "The house ledger endpoint returned a non-JSON response. Check that /api routes are reaching Vercel functions instead of the site shell.",
    );
  }

  try {
    return JSON.parse(rawBody) as T;
  } catch {
    throw new Error(fallbackError);
  }
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatSummaryMoney(
  amount: number,
  reportedCurrency?: string | null,
  currencyCount = 0,
) {
  if (!reportedCurrency || currencyCount > 1) return "Mixed currencies";
  return formatMoney(amount, reportedCurrency);
}

function formatDateTime(value?: string | null) {
  if (!value) return "Pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pending";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCompactDate(value?: string | null) {
  if (!value) return "Pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Pending";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatFulfillmentStatus(value: HouseLedgerSale["fulfillmentStatus"]) {
  switch (value) {
    case "pending":
      return "Pending release";
    case "preparing":
      return "Preparing";
    case "fulfilled":
      return "Fulfilled";
    case "archived":
      return "Archived";
    default:
      return value;
  }
}

function formatIssuedExpiry(value?: string | null) {
  if (!value) return "Pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getNotificationPermissionState() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported" as const;
  }

  return Notification.permission;
}

export function HouseLedgerRoute({
  authSession,
  wordmarkSrc,
  onReturnHome,
  onGoToSignIn,
  onSignOut,
  locale,
  onLocaleChange,
  languageLabel,
}: {
  authSession: Session | null;
  wordmarkSrc: string;
  onReturnHome: () => void;
  onGoToSignIn: () => void;
  onSignOut: () => void;
  locale: SiteLocale;
  onLocaleChange: (locale: SiteLocale) => void;
  languageLabel: string;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<HouseLedgerState | null>(null);
  const [markingRead, setMarkingRead] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState(
    getNotificationPermissionState(),
  );
  const [issueForm, setIssueForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    productName: "Praeliator VIS",
    subtotal: "6000",
    shipping: "300",
    currency: "mxn",
    quantity: "1",
    shippingCountry: "",
    shippingRegion: "",
    expiresInHours: "72",
    createdBy: "Praeliator",
    specifications: issuanceSpecificationDefault,
  });
  const [issueFieldErrors, setIssueFieldErrors] = useState<Record<string, string>>(
    {},
  );
  const [issueSubmitting, setIssueSubmitting] = useState(false);
  const [issueResult, setIssueResult] = useState<HouseLedgerIssueResult | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const seenNotificationIdsRef = useRef<Set<string>>(new Set());
  const hasHydratedNotificationsRef = useRef(false);
  const copyFeedbackTimeoutRef = useRef<number | null>(null);

  const authToken = authSession?.access_token || "";
  const signedInEmail = authSession?.user.email?.trim().toLowerCase() || "";

  const sortedUnreadNotifications = useMemo(
    () => (state?.notifications || []).filter((item) => !item.readAt),
    [state],
  );
  const pendingSales = useMemo(
    () =>
      (state?.sales || []).filter(
        (sale) =>
          sale.fulfillmentStatus === "pending" ||
          sale.fulfillmentStatus === "preparing",
      ),
    [state],
  );

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const handleIncomingBrowserNotifications = useCallback(
    (nextState: HouseLedgerState) => {
      const nextIds = new Set(nextState.notifications.map((item) => item.id));

      if (!hasHydratedNotificationsRef.current) {
        seenNotificationIdsRef.current = nextIds;
        hasHydratedNotificationsRef.current = true;
        return;
      }

      const canNotify =
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted";

      nextState.notifications.forEach((notification) => {
        const alreadySeen = seenNotificationIdsRef.current.has(notification.id);
        if (!alreadySeen && canNotify && !notification.readAt) {
          new Notification(notification.title, {
            body: notification.body,
          });
        }
      });

      seenNotificationIdsRef.current = nextIds;
    },
    [],
  );

  const loadState = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!authToken) {
        setLoading(false);
        setState(null);
        return;
      }

      if (!options?.silent) {
        setLoading(true);
      }

      try {
        const response = await fetch("/api/house-ledger-state", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const result = await parseJsonResponse<StateResponse>(
          response,
          "The house ledger response could not be read.",
        );

        if (!response.ok || !result.success) {
          throw new Error(result.error || "The house ledger could not be opened.");
        }

        setState(result);
        setError(null);
        handleIncomingBrowserNotifications(result);
      } catch (loadError) {
        setState(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "The house ledger could not be opened.",
        );
      } finally {
        setLoading(false);
      }
    },
    [authToken, handleIncomingBrowserNotifications],
  );

  useEffect(() => {
    if (!authToken) {
      setLoading(false);
      setState(null);
      setError(null);
      return;
    }

    void loadState();

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadState({ silent: true });
      }
    }, 30000);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void loadState({ silent: true });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [authToken, loadState]);

  const handleEnableNotices = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  const handleMarkNotificationsRead = async () => {
    if (!authToken || !state || !sortedUnreadNotifications.length) return;

    setMarkingRead(true);
    try {
      const response = await fetch("/api/house-ledger-notifications-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({}),
      });
      const result = await parseJsonResponse<ReadNotificationsResponse>(
        response,
        "The ledger notices response could not be read.",
      );

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Ledger notifications could not be updated.");
      }

      setState((current) =>
        current
          ? {
              ...current,
              stats: {
                ...current.stats,
                unreadNotificationsCount: result.unreadNotificationsCount,
              },
              notifications: current.notifications.map((notification) =>
                notification.readAt
                  ? notification
                  : { ...notification, readAt: result.readAt }
              ),
            }
          : current,
      );
    } catch (markError) {
      setError(
        markError instanceof Error
          ? markError.message
          : "Ledger notifications could not be updated.",
      );
    } finally {
      setMarkingRead(false);
    }
  };

  const handleUpdateSaleStatus = async (
    saleId: string,
    fulfillmentStatus: HouseLedgerSale["fulfillmentStatus"],
  ) => {
    if (!authToken) return;

    setStatusUpdatingId(saleId);
    try {
      const response = await fetch("/api/house-ledger-sale-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ saleId, fulfillmentStatus }),
      });
      const result = await parseJsonResponse<SaleStatusResponse>(
        response,
        "The sale line response could not be read.",
      );

      if (!response.ok || !result.success) {
        throw new Error(result.error || "The sale line could not be updated.");
      }

      setState((current) =>
        current
          ? {
              ...current,
              sales: current.sales.map((sale) =>
                sale.id === saleId ? result.sale : sale,
              ),
            }
          : current,
      );
      await loadState({ silent: true });
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "The sale line could not be updated.",
      );
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleIssueFieldChange = (
    key: keyof typeof issueForm,
    value: string,
  ) => {
    setIssueForm((current) => ({
      ...current,
      [key]: value,
    }));
    setIssueFieldErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleCopyValue = async (label: string, value: string) => {
    if (!value || typeof navigator === "undefined" || !navigator.clipboard) {
      setCopyFeedback(`${label} could not be copied on this device.`);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyFeedback(`${label} copied.`);
    } catch {
      setCopyFeedback(`${label} could not be copied on this device.`);
    }

    if (copyFeedbackTimeoutRef.current) {
      window.clearTimeout(copyFeedbackTimeoutRef.current);
    }

    copyFeedbackTimeoutRef.current = window.setTimeout(() => {
      setCopyFeedback(null);
    }, 2200);
  };

  const handleIssueAcquisition = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!authToken || issueSubmitting) return;

    setIssueSubmitting(true);
    setIssueFieldErrors({});
    setCopyFeedback(null);

    try {
      const response = await fetch("/api/house-ledger-issue-acquisition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(issueForm),
      });
      const result = await parseJsonResponse<IssueAcquisitionResponse>(
        response,
        "The issuance response could not be read.",
      );

      if (!response.ok || !result.success) {
        if (result.fieldErrors) {
          setIssueFieldErrors(result.fieldErrors);
        }

        throw new Error(
          result.error || "The private acquisition page could not be issued.",
        );
      }

      setIssueResult(result);
      setError(null);
    } catch (issueError) {
      setError(
        issueError instanceof Error
          ? issueError.message
          : "The private acquisition page could not be issued.",
      );
    } finally {
      setIssueSubmitting(false);
    }
  };

  if (!authSession) {
    return (
      <section className={ledgerSurfaceClassName}>
        <div className="mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className={`${cardClassName} w-full max-w-3xl p-7 sm:p-10`}>
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onReturnHome}
                className="text-[11px] uppercase tracking-[0.28em] text-[#8e6f4f]"
              >
                Return
              </button>
              <img
                src={wordmarkSrc}
                alt="Praeliator"
                className="h-10 w-auto object-contain"
              />
              <span className="text-[11px] uppercase tracking-[0.28em] text-[#8e6f4f]">
                Internal
              </span>
            </div>
            <div className="mt-12 max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#9a7a56]">
                House Ledger
              </p>
              <h1 className="mt-5 text-[clamp(3.25rem,10vw,5.8rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-[#231912]">
                Owner access is required.
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-[#5d493b] sm:text-base sm:leading-8">
                This chamber is reserved for issued internal accounts. Sign in with the owner record before the ledger can open.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={onGoToSignIn}
                  className="rounded-full bg-[#201814] px-7 py-6 text-sm text-[#f6eee3] shadow-[0_14px_36px_rgba(35,27,21,0.16)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#18120f]"
                >
                  Sign In
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onReturnHome}
                  className="rounded-full border-[#cdb89b] bg-transparent px-7 py-6 text-sm text-[#4b392d] transition duration-500 hover:-translate-y-0.5 hover:border-[#bfa17d] hover:bg-white/40"
                >
                  Return Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={ledgerSurfaceClassName}>
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-[1.7rem] border border-[#d5c6b2] bg-[linear-gradient(180deg,rgba(252,247,240,0.88),rgba(245,236,224,0.9))] p-4 shadow-[0_18px_44px_rgba(82,58,34,0.08)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onReturnHome}
              className="rounded-full border border-[#d1c0ab] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#7e654b] transition hover:border-[#b99a74] hover:bg-white/40"
            >
              Return
            </button>
            <img
              src={wordmarkSrc}
              alt="Praeliator"
              className="h-10 w-auto object-contain sm:h-11"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2 rounded-full border border-[#d1c0ab] bg-white/55 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-[#7a5f46]">
              <span>{languageLabel}</span>
              <select
                value={locale}
                onChange={(event) => onLocaleChange(event.target.value as SiteLocale)}
                className="bg-transparent text-[11px] uppercase tracking-[0.24em] text-[#231912] outline-none"
              >
                {siteLocaleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.shortLabel}
                  </option>
                ))}
              </select>
            </label>
            <Button
              type="button"
              variant="outline"
              onClick={onSignOut}
              className="rounded-full border-[#d1c0ab] bg-transparent px-5 py-5 text-sm text-[#4a382d] transition duration-500 hover:-translate-y-0.5 hover:border-[#b99a74] hover:bg-white/40"
            >
              Sign Out
            </Button>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: easeLuxury }}
          className="grid gap-4"
        >
          <div className={`${cardClassName} p-6 sm:p-8 lg:p-10`}>
            <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#9a7a56]">
                  House Ledger
                </p>
                <h1 className="mt-5 max-w-[10ch] text-[clamp(3.2rem,8vw,6.6rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-[#231912]">
                  Sales retained under the house.
                </h1>
                <p className="mt-6 max-w-2xl text-sm leading-7 text-[#5f4b3b] sm:text-base sm:leading-8">
                  Every paid acquisition enters this internal record the moment settlement is confirmed. This chamber remains available only to issued owner accounts.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[#8b6f53]">
                  <span className="rounded-full border border-[#d2c2ad] bg-white/45 px-4 py-2">
                    {state?.owner.fullName || "Praeliator owner"}
                  </span>
                  <span className="rounded-full border border-[#d2c2ad] bg-white/45 px-4 py-2">
                    {signedInEmail}
                  </span>
                  <span className="rounded-full border border-[#d2c2ad] bg-white/45 px-4 py-2">
                    Last settlement {formatCompactDate(state?.stats.lastPaidAt)}
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-[#dac9b4] bg-white/52 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#967552]">
                    Lifetime retained
                  </p>
                  <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#201711]">
                    {state
                      ? formatSummaryMoney(
                          state.stats.totalRevenue,
                          state.stats.reportedCurrency,
                          state.stats.currencyCount,
                        )
                      : "MX$0.00"}
                  </p>
                  <p className="mt-2 text-sm text-[#665241]">
                    {state?.stats.totalSalesCount || 0} sale{state?.stats.totalSalesCount === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-[#dac9b4] bg-white/52 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#967552]">
                    This month
                  </p>
                  <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#201711]">
                    {state
                      ? formatSummaryMoney(
                          state.stats.monthRevenue,
                          state.stats.reportedCurrency,
                          state.stats.currencyCount,
                        )
                      : "MX$0.00"}
                  </p>
                  <p className="mt-2 text-sm text-[#665241]">
                    {state?.stats.monthSalesCount || 0} settlement{state?.stats.monthSalesCount === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-[#dac9b4] bg-white/52 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#967552]">
                    Today
                  </p>
                  <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#201711]">
                    {state
                      ? formatSummaryMoney(
                          state.stats.todayRevenue,
                          state.stats.reportedCurrency,
                          state.stats.currencyCount,
                        )
                      : "MX$0.00"}
                  </p>
                  <p className="mt-2 text-sm text-[#665241]">
                    {state?.stats.todaySalesCount || 0} sale{state?.stats.todaySalesCount === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-[#dac9b4] bg-white/52 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#967552]">
                    Pending fulfillment
                  </p>
                  <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#201711]">
                    {state?.stats.pendingFulfillmentCount || 0}
                  </p>
                  <p className="mt-2 text-sm text-[#665241]">
                    Unread notices: {state?.stats.unreadNotificationsCount || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-[1.45rem] border border-[#b98d83] bg-[rgba(85,39,28,0.08)] px-5 py-4 text-sm leading-7 text-[#6b332a]">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className={`${cardClassName} px-6 py-8 text-sm leading-7 text-[#5a4738] sm:px-8`}>
              Opening the current ledger state...
            </div>
          ) : null}

          {!loading && !state && authSession ? (
            <div className={`${cardClassName} px-6 py-8 text-sm leading-7 text-[#5a4738] sm:px-8`}>
              This route has not been issued to the current account.
            </div>
          ) : null}

          {!loading && state ? (
            <div className="grid gap-4">
              <div className={`${cardClassName} p-5 sm:p-6 lg:p-8`}>
                <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.26em] text-[#987554]">
                      Issue acquisition
                    </p>
                    <h2 className="mt-4 text-[clamp(2.2rem,5vw,4.1rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-[#231912]">
                      Prepare a private page without opening terminal.
                    </h2>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-[#5d4a3b] sm:text-base sm:leading-8">
                      This issuing desk is reserved for the owner record. Enter the client and order details once, then retain the reference, URL, expiry, and prepared notice from the same chamber.
                    </p>
                    <div className="mt-6 grid gap-3">
                      <div className="rounded-[1.25rem] border border-[#ddcbb6] bg-white/50 p-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#8f6f50]">
                          Access posture
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[#5b4839]">
                          The public site remains unchanged. Only the owner-signed ledger session can issue a new private acquisition page from here.
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] border border-[#ddcbb6] bg-white/50 p-4">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-[#8f6f50]">
                          Result retained
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[#5b4839]">
                          Each issue returns the live reference code, private URL, validity window, a copyable client notice, and the equivalent PowerShell block for your own working record.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form className="grid gap-4" onSubmit={handleIssueAcquisition}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                          Client name
                        </span>
                        <input
                          value={issueForm.clientName}
                          onChange={(event) =>
                            handleIssueFieldChange("clientName", event.target.value)
                          }
                          className={`${fieldClassName} ${
                            issueFieldErrors.clientName ? "border-[#b98d83]" : ""
                          }`}
                          placeholder="Client name"
                          autoComplete="name"
                        />
                        {issueFieldErrors.clientName ? (
                          <span className="text-xs leading-6 text-[#7a3b33]">
                            {issueFieldErrors.clientName}
                          </span>
                        ) : null}
                      </label>

                      <label className="grid gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                          Client email
                        </span>
                        <input
                          value={issueForm.clientEmail}
                          onChange={(event) =>
                            handleIssueFieldChange("clientEmail", event.target.value)
                          }
                          className={`${fieldClassName} ${
                            issueFieldErrors.clientEmail ? "border-[#b98d83]" : ""
                          }`}
                          placeholder="client@email.com"
                          autoComplete="email"
                          inputMode="email"
                        />
                        {issueFieldErrors.clientEmail ? (
                          <span className="text-xs leading-6 text-[#7a3b33]">
                            {issueFieldErrors.clientEmail}
                          </span>
                        ) : null}
                      </label>

                      <label className="grid gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                          Client phone
                        </span>
                        <input
                          value={issueForm.clientPhone}
                          onChange={(event) =>
                            handleIssueFieldChange("clientPhone", event.target.value)
                          }
                          className={`${fieldClassName} ${
                            issueFieldErrors.clientPhone ? "border-[#b98d83]" : ""
                          }`}
                          placeholder="+52 55 0000 0000"
                          autoComplete="tel"
                          inputMode="tel"
                        />
                        {issueFieldErrors.clientPhone ? (
                          <span className="text-xs leading-6 text-[#7a3b33]">
                            {issueFieldErrors.clientPhone}
                          </span>
                        ) : null}
                      </label>

                      <label className="grid gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                          Product name
                        </span>
                        <input
                          value={issueForm.productName}
                          onChange={(event) =>
                            handleIssueFieldChange("productName", event.target.value)
                          }
                          className={`${fieldClassName} ${
                            issueFieldErrors.productName ? "border-[#b98d83]" : ""
                          }`}
                          placeholder="Praeliator VIS"
                        />
                        {issueFieldErrors.productName ? (
                          <span className="text-xs leading-6 text-[#7a3b33]">
                            {issueFieldErrors.productName}
                          </span>
                        ) : null}
                      </label>

                      <label className="grid gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                          Destination country
                        </span>
                        <input
                          value={issueForm.shippingCountry}
                          onChange={(event) =>
                            handleIssueFieldChange("shippingCountry", event.target.value)
                          }
                          className={`${fieldClassName} ${
                            issueFieldErrors.shippingCountry ? "border-[#b98d83]" : ""
                          }`}
                          placeholder="Mexico"
                          autoComplete="country-name"
                        />
                        {issueFieldErrors.shippingCountry ? (
                          <span className="text-xs leading-6 text-[#7a3b33]">
                            {issueFieldErrors.shippingCountry}
                          </span>
                        ) : null}
                      </label>

                      <label className="grid gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                          Destination region
                        </span>
                        <input
                          value={issueForm.shippingRegion}
                          onChange={(event) =>
                            handleIssueFieldChange("shippingRegion", event.target.value)
                          }
                          className={`${fieldClassName} ${
                            issueFieldErrors.shippingRegion ? "border-[#b98d83]" : ""
                          }`}
                          placeholder="Monterrey"
                          autoComplete="address-level1"
                        />
                        {issueFieldErrors.shippingRegion ? (
                          <span className="text-xs leading-6 text-[#7a3b33]">
                            {issueFieldErrors.shippingRegion}
                          </span>
                        ) : null}
                      </label>

                      <label className="grid gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                          Subtotal
                        </span>
                        <input
                          value={issueForm.subtotal}
                          onChange={(event) =>
                            handleIssueFieldChange("subtotal", event.target.value)
                          }
                          className={`${fieldClassName} ${
                            issueFieldErrors.subtotal ? "border-[#b98d83]" : ""
                          }`}
                          inputMode="decimal"
                          placeholder="6000"
                        />
                        {issueFieldErrors.subtotal ? (
                          <span className="text-xs leading-6 text-[#7a3b33]">
                            {issueFieldErrors.subtotal}
                          </span>
                        ) : null}
                      </label>

                      <label className="grid gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                          Fulfillment
                        </span>
                        <input
                          value={issueForm.shipping}
                          onChange={(event) =>
                            handleIssueFieldChange("shipping", event.target.value)
                          }
                          className={`${fieldClassName} ${
                            issueFieldErrors.shipping ? "border-[#b98d83]" : ""
                          }`}
                          inputMode="decimal"
                          placeholder="300"
                        />
                        {issueFieldErrors.shipping ? (
                          <span className="text-xs leading-6 text-[#7a3b33]">
                            {issueFieldErrors.shipping}
                          </span>
                        ) : null}
                      </label>

                      <label className="grid gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                          Currency
                        </span>
                        <input
                          value={issueForm.currency}
                          onChange={(event) =>
                            handleIssueFieldChange("currency", event.target.value)
                          }
                          className={fieldClassName}
                          placeholder="mxn"
                          autoCapitalize="off"
                        />
                      </label>

                      <label className="grid gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                          Quantity
                        </span>
                        <input
                          value={issueForm.quantity}
                          onChange={(event) =>
                            handleIssueFieldChange("quantity", event.target.value)
                          }
                          className={`${fieldClassName} ${
                            issueFieldErrors.quantity ? "border-[#b98d83]" : ""
                          }`}
                          inputMode="numeric"
                          placeholder="1"
                        />
                        {issueFieldErrors.quantity ? (
                          <span className="text-xs leading-6 text-[#7a3b33]">
                            {issueFieldErrors.quantity}
                          </span>
                        ) : null}
                      </label>

                      <label className="grid gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                          Validity hours
                        </span>
                        <input
                          value={issueForm.expiresInHours}
                          onChange={(event) =>
                            handleIssueFieldChange("expiresInHours", event.target.value)
                          }
                          className={`${fieldClassName} ${
                            issueFieldErrors.expiresInHours ? "border-[#b98d83]" : ""
                          }`}
                          inputMode="numeric"
                          placeholder="72"
                        />
                        {issueFieldErrors.expiresInHours ? (
                          <span className="text-xs leading-6 text-[#7a3b33]">
                            {issueFieldErrors.expiresInHours}
                          </span>
                        ) : null}
                      </label>

                      <label className="grid gap-2">
                        <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                          Created by
                        </span>
                        <input
                          value={issueForm.createdBy}
                          onChange={(event) =>
                            handleIssueFieldChange("createdBy", event.target.value)
                          }
                          className={fieldClassName}
                          placeholder="Praeliator"
                        />
                      </label>
                    </div>

                    <label className="grid gap-2">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                        Specifications
                      </span>
                      <textarea
                        value={issueForm.specifications}
                        onChange={(event) =>
                          handleIssueFieldChange("specifications", event.target.value)
                        }
                        className={`${textAreaFieldClassName} min-h-[9rem] resize-y ${
                          issueFieldErrors.specifications ? "border-[#b98d83]" : ""
                        }`}
                        placeholder="Format=16 oz lace-up"
                      />
                      <span className="text-xs leading-6 text-[#70594a]">
                        One line per specification in the form <span className="font-medium">Label=Value</span>.
                      </span>
                      {issueFieldErrors.specifications ? (
                        <span className="text-xs leading-6 text-[#7a3b33]">
                          {issueFieldErrors.specifications}
                        </span>
                      ) : null}
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                      <Button
                        type="submit"
                        disabled={issueSubmitting}
                        className="rounded-full bg-[#201814] px-7 py-6 text-sm text-[#f6eee3] shadow-[0_14px_36px_rgba(35,27,21,0.16)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#18120f] disabled:pointer-events-none disabled:opacity-60"
                      >
                        {issueSubmitting ? "Issuing private page..." : "Issue Private Page"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIssueForm({
                            clientName: "",
                            clientEmail: "",
                            clientPhone: "",
                            productName: "Praeliator VIS",
                            subtotal: "6000",
                            shipping: "300",
                            currency: "mxn",
                            quantity: "1",
                            shippingCountry: "",
                            shippingRegion: "",
                            expiresInHours: "72",
                            createdBy: "Praeliator",
                            specifications: issuanceSpecificationDefault,
                          });
                          setIssueFieldErrors({});
                        }}
                        className="rounded-full border-[#d0bca1] bg-transparent px-6 py-6 text-sm text-[#5b4738] transition duration-500 hover:-translate-y-0.5 hover:border-[#b99973] hover:bg-white/40"
                      >
                        Reset form
                      </Button>
                      {copyFeedback ? (
                        <span className="text-xs uppercase tracking-[0.22em] text-[#7d634a]">
                          {copyFeedback}
                        </span>
                      ) : null}
                    </div>
                  </form>
                </div>

                {issueResult ? (
                  <div className="mt-8 grid gap-4 border-t border-[#d9ccb9] pt-6 xl:grid-cols-[0.84fr_1.16fr]">
                    <div className="grid gap-3">
                      <div className="rounded-[1.3rem] border border-[#dcccb8] bg-white/55 p-4">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-[#957452]">
                          Issued reference
                        </p>
                        <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#241912]">
                          {issueResult.issuance.referenceCode}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              void handleCopyValue(
                                "Reference code",
                                issueResult.issuance.referenceCode,
                              )
                            }
                            className="rounded-full border-[#d0bca1] bg-transparent px-4 py-4 text-xs text-[#5b4738] transition duration-500 hover:-translate-y-0.5 hover:border-[#b99973] hover:bg-white/40"
                          >
                            Copy reference
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              void handleCopyValue(
                                "Private URL",
                                issueResult.issuance.privateUrl,
                              )
                            }
                            className="rounded-full border-[#d0bca1] bg-transparent px-4 py-4 text-xs text-[#5b4738] transition duration-500 hover:-translate-y-0.5 hover:border-[#b99973] hover:bg-white/40"
                          >
                            Copy URL
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-[1.3rem] border border-[#dcccb8] bg-white/55 p-4">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-[#957452]">
                          Valid until
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[#5e4b3b]">
                          {formatIssuedExpiry(issueResult.issuance.expiresAt)}
                        </p>
                      </div>

                      <div className="rounded-[1.3rem] border border-[#dcccb8] bg-white/55 p-4">
                        <p className="text-[10px] uppercase tracking-[0.24em] text-[#957452]">
                          Order line
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[#5e4b3b]">
                          {issueResult.issuance.orderSummary.productName}
                        </p>
                        <p className="text-sm leading-7 text-[#5e4b3b]">
                          Qty {issueResult.issuance.orderSummary.quantity} Â·{" "}
                          {formatMoney(
                            issueResult.issuance.orderSummary.totalAmount,
                            issueResult.issuance.orderSummary.currency,
                          )}
                        </p>
                        {(issueResult.issuance.orderSummary.shippingRegion ||
                          issueResult.issuance.orderSummary.shippingCountry) ? (
                          <p className="text-sm leading-7 text-[#5e4b3b]">
                            {[
                              issueResult.issuance.orderSummary.shippingRegion,
                              issueResult.issuance.orderSummary.shippingCountry,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        ) : null}
                        <div className="mt-4">
                          <Button
                            asChild
                            type="button"
                            className="rounded-full bg-[#201814] px-5 py-4 text-xs text-[#f6eee3] shadow-[0_12px_30px_rgba(35,27,21,0.14)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#18120f]"
                          >
                            <a
                              href={issueResult.issuance.privateUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open issued page
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="rounded-[1.3rem] border border-[#dcccb8] bg-white/55 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[#957452]">
                              Prepared client notice
                            </p>
                            <p className="mt-2 text-sm leading-7 text-[#5e4b3b]">
                              Ready to send without rewriting the reference by hand.
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              void handleCopyValue(
                                "Prepared notice",
                                issueResult.preparedNotice,
                              )
                            }
                            className="rounded-full border-[#d0bca1] bg-transparent px-4 py-4 text-xs text-[#5b4738] transition duration-500 hover:-translate-y-0.5 hover:border-[#b99973] hover:bg-white/40"
                          >
                            Copy notice
                          </Button>
                        </div>
                        <pre className="mt-4 whitespace-pre-wrap rounded-[1.1rem] border border-[#eadcc9] bg-[#fffaf4] px-4 py-4 text-sm leading-7 text-[#2b211a]">
                          {issueResult.preparedNotice}
                        </pre>
                      </div>

                      <div className="rounded-[1.3rem] border border-[#dcccb8] bg-white/55 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[#957452]">
                              Equivalent PowerShell
                            </p>
                            <p className="mt-2 text-sm leading-7 text-[#5e4b3b]">
                              Running this block again would issue a new session. Keep it only as a working template or record.
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              void handleCopyValue(
                                "PowerShell block",
                                issueResult.powerShellSnippet,
                              )
                            }
                            className="rounded-full border-[#d0bca1] bg-transparent px-4 py-4 text-xs text-[#5b4738] transition duration-500 hover:-translate-y-0.5 hover:border-[#b99973] hover:bg-white/40"
                          >
                            Copy block
                          </Button>
                        </div>
                        <pre className="mt-4 overflow-x-auto rounded-[1.1rem] border border-[#eadcc9] bg-[#fffaf4] px-4 py-4 text-sm leading-7 text-[#2b211a]">
                          {issueResult.powerShellSnippet}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
              <div className={`${cardClassName} p-5 sm:p-6`}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.26em] text-[#987554]">
                      Recent sales
                    </p>
                    <h2 className="mt-3 text-[clamp(2rem,4vw,3.35rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[#231912]">
                      Settlements under active custody.
                    </h2>
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#8b7057]">
                    {pendingSales.length} awaiting release
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {state.sales.length ? (
                    state.sales.map((sale) => (
                      <div
                        key={sale.id}
                        className="rounded-[1.35rem] border border-[#dcccb8] bg-white/55 p-4"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[#957452]">
                              {sale.saleReference}
                            </p>
                            <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[#241912]">
                              {sale.productName}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-[#5d4a3b]">
                              {(sale.clientName || "Private client") +
                                (sale.shippingCountry
                                  ? ` · ${sale.shippingCountry}`
                                  : "") +
                                (sale.shippingRegion ? `, ${sale.shippingRegion}` : "")}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-[#85684d]">
                              <span className="rounded-full border border-[#d6c4ad] px-3 py-2">
                                {formatMoney(sale.totalAmount, sale.currency)}
                              </span>
                              <span className="rounded-full border border-[#d6c4ad] px-3 py-2">
                                Qty {sale.quantity}
                              </span>
                              <span className="rounded-full border border-[#d6c4ad] px-3 py-2">
                                {formatCompactDate(sale.paidAt)}
                              </span>
                            </div>
                          </div>

                          <div className="w-full max-w-[15rem]">
                            <label className="grid gap-2">
                              <span className="text-[10px] uppercase tracking-[0.22em] text-[#8b7057]">
                                Fulfillment line
                              </span>
                              <select
                                value={sale.fulfillmentStatus}
                                disabled={statusUpdatingId === sale.id}
                                onChange={(event) =>
                                  void handleUpdateSaleStatus(
                                    sale.id,
                                    event.target.value as HouseLedgerSale["fulfillmentStatus"],
                                  )
                                }
                                className={fieldClassName}
                              >
                                <option value="pending">Pending release</option>
                                <option value="preparing">Preparing</option>
                                <option value="fulfilled">Fulfilled</option>
                                <option value="archived">Archived</option>
                              </select>
                            </label>
                            <p className="mt-3 text-xs leading-6 text-[#6b5847]">
                              {statusUpdatingId === sale.id
                                ? "Updating the sale line..."
                                : `Current status: ${formatFulfillmentStatus(sale.fulfillmentStatus)}.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.35rem] border border-dashed border-[#d3c0a8] bg-white/35 px-5 py-6 text-sm leading-7 text-[#5d4a3b]">
                      No paid acquisition has entered the ledger yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4">
                <div className={`${cardClassName} p-5 sm:p-6`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.26em] text-[#987554]">
                        Internal notices
                      </p>
                      <h2 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[#231912]">
                        Signals from paid sales.
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {notificationPermission === "default" ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleEnableNotices}
                          className="rounded-full border-[#d0bca1] bg-transparent px-4 py-4 text-xs text-[#5b4738] transition duration-500 hover:-translate-y-0.5 hover:border-[#b99973] hover:bg-white/40"
                        >
                          Enable live notices
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        variant="outline"
                        disabled={markingRead || !sortedUnreadNotifications.length}
                        onClick={() => void handleMarkNotificationsRead()}
                        className="rounded-full border-[#d0bca1] bg-transparent px-4 py-4 text-xs text-[#5b4738] transition duration-500 hover:-translate-y-0.5 hover:border-[#b99973] hover:bg-white/40 disabled:pointer-events-none disabled:opacity-55"
                      >
                        {markingRead ? "Marking..." : "Mark all read"}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    {state.notifications.length ? (
                      state.notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`rounded-[1.3rem] border p-4 transition ${
                            notification.readAt
                              ? "border-[#dfd1bf] bg-white/40"
                              : "border-[#ccb28f] bg-[linear-gradient(180deg,rgba(255,252,246,0.92),rgba(244,235,223,0.92))]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.24em] text-[#957452]">
                                {notification.kind.replace(/_/g, " ")}
                              </p>
                              <h3 className="mt-3 text-base font-semibold tracking-[-0.02em] text-[#231912]">
                                {notification.title}
                              </h3>
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.22em] text-[#85694e]">
                              {notification.readAt ? "Read" : "Unread"}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-[#5e4b3b]">
                            {notification.body}
                          </p>
                          <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-[#8b7057]">
                            {formatDateTime(notification.createdAt)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.3rem] border border-dashed border-[#d3c0a8] bg-white/35 px-5 py-6 text-sm leading-7 text-[#5d4a3b]">
                        No internal notices have been issued yet.
                      </div>
                    )}
                  </div>
                </div>

                <div className={`${cardClassName} p-5 sm:p-6`}>
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#987554]">
                    Custody cadence
                  </p>
                  <div className="mt-5 grid gap-3">
                    <div className="rounded-[1.25rem] border border-[#ddcbb6] bg-white/50 p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#8f6f50]">
                        Pending release
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[#5b4839]">
                        {pendingSales.length
                          ? `${pendingSales.length} retained sale line${pendingSales.length === 1 ? "" : "s"} still await release or final archiving.`
                          : "Every current sale line has moved beyond the pending stage."}
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-[#ddcbb6] bg-white/50 p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#8f6f50]">
                        Notice posture
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[#5b4839]">
                        Unread notices remain visible here even without browser permission. Live notices can be enabled when you want immediate surface-level confirmation while the ledger is open.
                      </p>
                    </div>
                    <div className="rounded-[1.25rem] border border-[#ddcbb6] bg-white/50 p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#8f6f50]">
                        Last settlement
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[#5b4839]">
                        {formatDateTime(state.stats.lastPaidAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
