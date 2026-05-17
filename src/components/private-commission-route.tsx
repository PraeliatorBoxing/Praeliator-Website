import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import {
  normalizedSiteLocaleOptions,
  type SiteLocale,
} from "../lib/site-locale";

type CommissionForm = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  commissionPurpose: string;
  direction: string;
  timeline: string;
  budgetRange: string;
  monogramInitials: string;
  note: string;
};

type CommissionResponse =
  | {
      success: true;
      requestReference: string;
      message?: string;
    }
  | {
      success: false;
      error?: string;
      fieldErrors?: Partial<Record<keyof CommissionForm, string>>;
    };

const easeLuxury: [number, number, number, number] = [0.16, 1, 0.3, 1];
const initialForm: CommissionForm = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  commissionPurpose: "",
  direction: "",
  timeline: "",
  budgetRange: "",
  monogramInitials: "",
  note: "",
};

const fieldClassName =
  "min-h-[4rem] w-full rounded-full border border-[#3b2b20] bg-[#0e0b09] px-5 text-[16px] text-[#f7efe5] outline-none transition placeholder:text-white/28 focus:border-[#8f6848] focus:bg-[#120e0b] focus:shadow-[0_0_0_3px_rgba(181,142,92,0.1)]";
const textAreaClassName =
  "min-h-[10rem] w-full rounded-[1.65rem] border border-[#3b2b20] bg-[#0e0b09] px-5 py-4 text-[16px] leading-7 text-[#f7efe5] outline-none transition placeholder:text-white/28 focus:border-[#8f6848] focus:bg-[#120e0b] focus:shadow-[0_0_0_3px_rgba(181,142,92,0.1)]";

function PrivateCommissionLanguageSwitcher({
  locale,
  onChange,
  label,
}: {
  locale: SiteLocale;
  onChange: (locale: SiteLocale) => void;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/18 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-white/58">
      <span>{label}</span>
      <select
        value={locale}
        onChange={(event) => onChange(event.target.value as SiteLocale)}
        className="bg-transparent text-[#f7efe5] outline-none"
        aria-label={label}
      >
        {normalizedSiteLocaleOptions.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#0c0907]">
            {option.shortLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

async function readJsonResponse<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text) as T;
}

export function PrivateCommissionRoute({
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
  const [form, setForm] = useState<CommissionForm>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof CommissionForm, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [requestReference, setRequestReference] = useState("");

  const handleFieldChange = <Key extends keyof CommissionForm>(
    field: Key,
    value: CommissionForm[Key],
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (error) setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");
    setFieldErrors({});
    setRequestReference("");

    try {
      const response = await fetch("/api/private-commission-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          sourceRoute: "/private-commission",
          locale,
        }),
      });
      const result = await readJsonResponse<CommissionResponse>(response);

      if (!result) {
        throw new Error("The commission request could not be retained.");
      }

      if (!response.ok || !result.success) {
        setFieldErrors(result.fieldErrors || {});
        throw new Error(
          result.error || "The commission request could not be retained.",
        );
      }

      setRequestReference(result.requestReference);
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "The commission request could not be retained.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#050403] text-[#f7efe5]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(92,55,30,0.34),transparent_34%),linear-gradient(180deg,#070504_0%,#0d0906_48%,#050403_100%)]" />
      <div className="absolute inset-x-[8%] top-28 h-px bg-white/10" />
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-[105rem] flex-col px-4 py-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onReturnHome}
            className="inline-flex items-center gap-3 text-left text-[#f6efe5] transition hover:text-white"
          >
            <img
              src={wordmarkSrc}
              alt="Praeliator"
              className="h-8 w-auto sm:h-11"
              draggable={false}
            />
          </button>
          <PrivateCommissionLanguageSwitcher
            locale={locale}
            onChange={onLocaleChange}
            label={languageLabel}
          />
        </header>

        <main className="grid flex-1 gap-10 py-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeLuxury }}
          >
            <p className="text-[10px] uppercase tracking-[0.36em] text-[#c7a98d]">
              Private Commission
            </p>
            <h1 className="mt-5 max-w-[10ch] font-['Cormorant_Garamond'] text-[clamp(3.2rem,8vw,7.6rem)] font-semibold leading-[0.86] tracking-[-0.07em]">
              Prepared by request, never by menu.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/62">
              A commission is not open customization. It is a request for the
              house to interpret a private direction while keeping control of
              material, placement, restraint, and final approval.
            </p>
            <div className="mt-10 grid gap-5 border-y border-white/10 py-6 text-sm leading-7 text-white/58 sm:grid-cols-3">
              <p>Starts from MX$12,000 and is quoted by complexity.</p>
              <p>Subject to house review before any private allocation is issued.</p>
              <p>No external logos, novelty graphics, or uncontrolled color systems.</p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: easeLuxury }}
            className="rounded-[2rem] border border-[#2f2118] bg-[linear-gradient(180deg,rgba(12,9,7,0.94),rgba(8,6,5,0.96))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:p-8"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 sm:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b99973]">
                  Full name
                </span>
                <input
                  value={form.fullName}
                  onChange={(event) =>
                    handleFieldChange("fullName", event.target.value)
                  }
                  className={fieldClassName}
                  placeholder="Name for private correspondence"
                  autoComplete="name"
                />
                {fieldErrors.fullName ? (
                  <p className="text-sm leading-6 text-[#d0a083]">
                    {fieldErrors.fullName}
                  </p>
                ) : null}
              </label>

              <label className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b99973]">
                  Email
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    handleFieldChange("email", event.target.value)
                  }
                  className={fieldClassName}
                  placeholder="private@email.com"
                  autoComplete="email"
                />
                {fieldErrors.email ? (
                  <p className="text-sm leading-6 text-[#d0a083]">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </label>

              <label className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b99973]">
                  Phone
                </span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    handleFieldChange("phone", event.target.value)
                  }
                  className={fieldClassName}
                  placeholder="Optional direct line"
                  autoComplete="tel"
                />
                {fieldErrors.phone ? (
                  <p className="text-sm leading-6 text-[#d0a083]">
                    {fieldErrors.phone}
                  </p>
                ) : null}
              </label>

              <label className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b99973]">
                  Country
                </span>
                <input
                  value={form.country}
                  onChange={(event) =>
                    handleFieldChange("country", event.target.value)
                  }
                  className={fieldClassName}
                  placeholder="Country"
                  autoComplete="country-name"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b99973]">
                  Purpose
                </span>
                <select
                  value={form.commissionPurpose}
                  onChange={(event) =>
                    handleFieldChange("commissionPurpose", event.target.value)
                  }
                  className={fieldClassName}
                >
                  <option value="">Select purpose</option>
                  <option value="Personal use">Personal use</option>
                  <option value="Gift">Gift</option>
                  <option value="Collector piece">Collector piece</option>
                  <option value="Occasion or event">Occasion or event</option>
                </select>
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b99973]">
                  Commission direction
                </span>
                <textarea
                  value={form.direction}
                  onChange={(event) =>
                    handleFieldChange("direction", event.target.value)
                  }
                  className={textAreaClassName}
                  placeholder="Describe the private direction, material mood, occasion, or personal meaning the house should review."
                />
                {fieldErrors.direction ? (
                  <p className="text-sm leading-6 text-[#d0a083]">
                    {fieldErrors.direction}
                  </p>
                ) : null}
              </label>

              <label className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b99973]">
                  Timeline
                </span>
                <input
                  value={form.timeline}
                  onChange={(event) =>
                    handleFieldChange("timeline", event.target.value)
                  }
                  className={fieldClassName}
                  placeholder="6-10 weeks, event date, or flexible"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b99973]">
                  Budget posture
                </span>
                <select
                  value={form.budgetRange}
                  onChange={(event) =>
                    handleFieldChange("budgetRange", event.target.value)
                  }
                  className={fieldClassName}
                >
                  <option value="">Select range</option>
                  <option value="MX$12,000-MX$15,000">MX$12,000-MX$15,000</option>
                  <option value="MX$15,000-MX$22,000">MX$15,000-MX$22,000</option>
                  <option value="MX$22,000+">MX$22,000+</option>
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b99973]">
                  Initials if relevant
                </span>
                <input
                  value={form.monogramInitials}
                  onChange={(event) =>
                    handleFieldChange(
                      "monogramInitials",
                      event.target.value.toUpperCase().slice(0, 3),
                    )
                  }
                  className={fieldClassName}
                  placeholder="PM"
                  maxLength={3}
                />
              </label>

              <label className="grid gap-2 sm:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-[#b99973]">
                  Private note
                </span>
                <textarea
                  value={form.note}
                  onChange={(event) =>
                    handleFieldChange("note", event.target.value.slice(0, 900))
                  }
                  className={`${textAreaClassName} min-h-[7.5rem]`}
                  placeholder="Anything the house should know before review."
                  maxLength={900}
                />
              </label>
            </div>

            {error ? (
              <p className="mt-5 text-sm leading-7 text-[#d0a083]">{error}</p>
            ) : null}

            {requestReference ? (
              <div className="mt-5 border-y border-white/10 py-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#b99973]">
                  Request retained
                </p>
                <p className="mt-3 text-2xl text-[#f7efe5]">
                  {requestReference}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/58">
                  The request has entered house review. If accepted, the next
                  step is a controlled direction proposal, quote, and deposit
                  route.
                </p>
              </div>
            ) : null}

            <p className="mt-5 text-xs leading-6 text-white/42">
              Details are retained only for private commission review and direct
              correspondence.{" "}
              <a
                href="/privacy-notice"
                className="underline decoration-[#b99973] underline-offset-4 transition hover:text-[#f7efe5]"
              >
                Privacy Notice
              </a>
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="submit"
                disabled={submitting}
                className="min-h-[3.85rem] rounded-full bg-[#efe5d7] px-7 text-sm text-[#17110d] shadow-[0_18px_48px_rgba(239,229,215,0.12)] transition duration-500 hover:bg-[#e4d7c7] disabled:pointer-events-none disabled:opacity-60"
              >
                {submitting ? "Retaining request..." : "Request Review"}
              </Button>
              <p className="text-xs leading-6 text-white/42">
                Requests are subject to house approval before quotation.
              </p>
            </div>
          </motion.form>
        </main>
      </div>
    </section>
  );
}
