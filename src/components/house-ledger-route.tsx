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

type StateResponse =
  | ({ success: true } & HouseLedgerState)
  | { success: false; error?: string };

type ReadNotificationsResponse =
  | { success: true; readAt: string; unreadNotificationsCount: number }
  | { success: false; error?: string };

type SaleStatusResponse =
  | { success: true; sale: HouseLedgerSale }
  | { success: false; error?: string };

const easeLuxury: [number, number, number, number] = [0.16, 1, 0.3, 1];
const cardClassName =
  "overflow-hidden rounded-[1.75rem] border border-[#d7c8b3] bg-[linear-gradient(180deg,rgba(253,249,242,0.98),rgba(241,232,220,0.96))] text-[#241b15] shadow-[0_20px_54px_rgba(77,53,30,0.1)]";
const ledgerSurfaceClassName =
  "min-h-dvh bg-[radial-gradient(circle_at_top,rgba(181,142,92,0.17),transparent_26%),linear-gradient(180deg,#f7efe4_0%,#efe3d2_48%,#eadbc7_100%)] text-[#231b15]";
const fieldClassName =
  "w-full rounded-full border border-[#ceb89d] bg-[#fffaf4] px-4 py-3 text-sm text-[#231912] outline-none transition focus:border-[#8f6848] focus:bg-white";

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
  const seenNotificationIdsRef = useRef<Set<string>>(new Set());
  const hasHydratedNotificationsRef = useRef(false);

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
        const result = (await response.json()) as StateResponse;

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
      const result = (await response.json()) as ReadNotificationsResponse;

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
      const result = (await response.json()) as SaleStatusResponse;

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
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
