import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function createSupabaseAdmin() {
  return createClient(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

function normalizeInlineText(value: unknown) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeLongText(value: unknown, maxLength = 1200) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function buildRequestReference() {
  const stamp = Date.now().toString(36).toUpperCase();
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `PC-${stamp}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = normalizeInlineText(body.fullName);
    const email = normalizeInlineText(body.email).toLowerCase();
    const phone = normalizeInlineText(body.phone);
    const country = normalizeInlineText(body.country);
    const commissionPurpose = normalizeInlineText(body.commissionPurpose);
    const direction = normalizeLongText(body.direction);
    const timeline = normalizeInlineText(body.timeline);
    const budgetRange = normalizeInlineText(body.budgetRange);
    const monogramInitials = normalizeInlineText(body.monogramInitials)
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 3);
    const note = normalizeLongText(body.note, 900);
    const sourceRoute = normalizeInlineText(body.sourceRoute) || "/private-commission";
    const locale = normalizeInlineText(body.locale) || "en";
    const fieldErrors: Record<string, string> = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (fullName.length < 2) {
      fieldErrors.fullName = "Enter the name that should be attached to the commission request.";
    }

    if (!emailPattern.test(email)) {
      fieldErrors.email = "Enter a valid email for private correspondence.";
    }

    if (phone && phone.replace(/[^\d]/g, "").length < 6) {
      fieldErrors.phone = "Use a fuller phone number or leave the field empty.";
    }

    if (direction.length < 24) {
      fieldErrors.direction =
        "Describe the intended commission direction with enough detail for review.";
    }

    if (Object.keys(fieldErrors).length) {
      return jsonResponse(
        {
          success: false,
          error: "The commission request is incomplete.",
          fieldErrors,
        },
        422,
      );
    }

    const supabase = createSupabaseAdmin();
    const requestReference = buildRequestReference();
    const timestamp = new Date().toISOString();
    const { error } = await supabase.from("private_commission_requests").insert({
      request_reference: requestReference,
      full_name: fullName,
      email,
      phone: phone || null,
      country: country || null,
      commission_purpose: commissionPurpose || null,
      direction,
      timeline: timeline || null,
      budget_range: budgetRange || null,
      monogram_initials: monogramInitials || null,
      note: note || null,
      source_route: sourceRoute,
      locale,
      status: "received",
      created_at: timestamp,
      updated_at: timestamp,
    });

    if (error) throw error;

    return jsonResponse({
      success: true,
      requestReference,
      message:
        "The private commission request has been received for house review.",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "The commission request could not be retained.";

    return jsonResponse({ success: false, error: message }, 500);
  }
}
