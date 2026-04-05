import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const PRIVATE_ACQUISITION_COOKIE_NAME =
  "praeliator_private_acquisition_grant";

const ACCESS_GRANT_TTL_MS = 1000 * 60 * 30;
const FAILED_ATTEMPT_LIMIT = 5;
const LOCKOUT_WINDOW_MS = 1000 * 60 * 15;
const STRIPE_API_VERSION = "2026-02-25.clover";
const REFERENCE_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const DELIVERY_NOTES_LIMIT = 500;

const DELIVERY_REQUIRED_FIELD_KEYS = [
  "client_name",
  "client_email",
  "client_phone",
  "shipping_country",
  "shipping_region",
  "shipping_city",
  "shipping_postal_code",
  "shipping_address_line1",
];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export function createSupabaseAdmin() {
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

export function createStripeServerClient() {
  return new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
    apiVersion: STRIPE_API_VERSION,
  });
}

export function getStripePublishableKey() {
  return requireEnv("VITE_STRIPE_PUBLISHABLE_KEY");
}

export function getPrivateAcquisitionBaseUrl() {
  return (
    process.env.PRIVATE_ACQUISITION_BASE_URL ||
    process.env.PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.URL ||
    ""
  ).trim();
}

function getHashSecret() {
  return requireEnv("PRIVATE_ACQUISITION_HASH_SECRET");
}

function hmacHex(value) {
  return crypto
    .createHmac("sha256", getHashSecret())
    .update(value)
    .digest("hex");
}

function safeEqualHex(left, right) {
  if (!left || !right || left.length !== right.length) return false;
  return crypto.timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}

export function normalizeReferenceCode(value) {
  return (value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function normalizeCurrency(value) {
  return (value || "").trim().toLowerCase();
}

function normalizeInlineText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function generateAcquisitionToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function buildProductPrefix(productName) {
  const letters = (productName || "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.slice(0, 3))
    .join("")
    .slice(0, 3);

  return letters || "VIS";
}

export function generateReferenceCode(productName) {
  const prefix = buildProductPrefix(productName);
  const randomBytes = crypto.randomBytes(6);
  let seed = "";

  for (let index = 0; index < 6; index += 1) {
    seed +=
      REFERENCE_CODE_ALPHABET[
        randomBytes[index] % REFERENCE_CODE_ALPHABET.length
      ];
  }

  return `PRA-${prefix}-${seed}`;
}

function toIsoString(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function nowIso() {
  return new Date().toISOString();
}

function addMs(dateLike, ms) {
  const date = new Date(dateLike);
  return new Date(date.getTime() + ms).toISOString();
}

function getCookieMap(request) {
  const raw = request.headers.get("cookie") || "";
  return raw.split(";").reduce((map, chunk) => {
    const [name, ...rest] = chunk.trim().split("=");
    if (!name) return map;
    map.set(name, decodeURIComponent(rest.join("=")));
    return map;
  }, new Map());
}

export function getAcquisitionGrantFromRequest(request) {
  return getCookieMap(request).get(PRIVATE_ACQUISITION_COOKIE_NAME) || "";
}

function shouldUseSecureCookie(request) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto) return forwardedProto === "https";
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}

export function buildGrantCookie(request, grantToken, expiresAt) {
  const parts = [
    `${PRIVATE_ACQUISITION_COOKIE_NAME}=${encodeURIComponent(grantToken)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Expires=${new Date(expiresAt).toUTCString()}`,
  ];

  if (shouldUseSecureCookie(request)) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function buildClearedGrantCookie(request) {
  const parts = [
    `${PRIVATE_ACQUISITION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ];

  if (shouldUseSecureCookie(request)) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function getSessionTokenFromUrl(requestOrUrl) {
  const url =
    requestOrUrl instanceof URL
      ? requestOrUrl
      : new URL(requestOrUrl.url || requestOrUrl);

  return (url.searchParams.get("token") || "").trim();
}

async function cancelPaymentIntentIfPossible(paymentIntentId) {
  if (!paymentIntentId) return;

  try {
    const stripe = createStripeServerClient();
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (
      paymentIntent.status === "requires_payment_method" ||
      paymentIntent.status === "requires_confirmation" ||
      paymentIntent.status === "requires_action" ||
      paymentIntent.status === "processing"
    ) {
      await stripe.paymentIntents.cancel(paymentIntentId);
    }
  } catch {
    // Cancellation failure should not block state transitions.
  }
}

export async function createPrivateAcquisitionSession(input) {
  const supabase = createSupabaseAdmin();
  const expiresAt = toIsoString(input.expiresAt);

  if (!expiresAt) {
    throw new Error("A valid expiration timestamp is required.");
  }

  const payload = {
    clientName: (input.clientName || "").trim() || null,
    clientEmail: (input.clientEmail || "").trim().toLowerCase() || null,
    clientPhone: (input.clientPhone || "").trim() || null,
    productName: (input.productName || "").trim(),
    productSnapshot: input.productSnapshot || {},
    orderSnapshot: input.orderSnapshot || {},
    quantity: Number(input.quantity || 1),
    currency: normalizeCurrency(input.currency || "mxn"),
    subtotalAmount: Number(input.subtotalAmount || 0),
    shippingAmount: Number(input.shippingAmount || 0),
    totalAmount: Number(
      input.totalAmount ??
        Number(input.subtotalAmount || 0) + Number(input.shippingAmount || 0),
    ),
    shippingCountry: (input.shippingCountry || "").trim() || null,
    shippingRegion: (input.shippingRegion || "").trim() || null,
    note: (input.note || "").trim() || null,
    createdBy: (input.createdBy || "").trim() || null,
  };

  if (!payload.productName) {
    throw new Error("Product name is required.");
  }

  if (!payload.currency) {
    throw new Error("Currency is required.");
  }

  if (!Number.isInteger(payload.quantity) || payload.quantity < 1) {
    throw new Error("Quantity must be a whole number greater than zero.");
  }

  if (
    !Number.isInteger(payload.subtotalAmount) ||
    !Number.isInteger(payload.shippingAmount) ||
    !Number.isInteger(payload.totalAmount)
  ) {
    throw new Error("Amounts must be provided in minor currency units.");
  }

  const baseUrl = getPrivateAcquisitionBaseUrl();
  if (!baseUrl) {
    throw new Error(
      "Missing environment variable: PRIVATE_ACQUISITION_BASE_URL",
    );
  }

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const token = generateAcquisitionToken();
    const referenceCode = generateReferenceCode(payload.productName);
    const tokenHash = hmacHex(token);
    const referenceCodeHash = hmacHex(normalizeReferenceCode(referenceCode));
    const timestamp = nowIso();

    const { data, error } = await supabase
      .from("private_acquisition_sessions")
      .insert({
        token_hash: tokenHash,
        reference_code: referenceCode,
        reference_code_hash: referenceCodeHash,
        client_name: payload.clientName,
        client_email: payload.clientEmail,
        client_phone: payload.clientPhone,
        product_name: payload.productName,
        product_snapshot: payload.productSnapshot,
        order_snapshot: payload.orderSnapshot,
        quantity: payload.quantity,
        currency: payload.currency,
        subtotal_amount: payload.subtotalAmount,
        shipping_amount: payload.shippingAmount,
        total_amount: payload.totalAmount,
        shipping_country: payload.shippingCountry,
        shipping_region: payload.shippingRegion,
        status: "issued",
        expires_at: expiresAt,
        note: payload.note,
        created_by: payload.createdBy,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .select(
        "id, reference_code, product_name, currency, total_amount, expires_at, shipping_country, shipping_region, quantity",
      )
      .single();

    if (!error && data) {
      const privateUrl = new URL("/private-acquisition", baseUrl);
      privateUrl.searchParams.set("token", token);

      return {
        id: data.id,
        token,
        referenceCode,
        privateUrl: privateUrl.toString(),
        expiresAt: data.expires_at,
        orderSummary: {
          productName: data.product_name,
          quantity: data.quantity,
          currency: data.currency,
          totalAmount: data.total_amount,
          shippingCountry: data.shipping_country,
          shippingRegion: data.shipping_region,
        },
      };
    }

    if (error?.code !== "23505") {
      throw error;
    }
  }

  throw new Error("Unable to generate a unique acquisition session.");
}

export async function revokePrivateAcquisitionSession({
  referenceCode,
  note,
}) {
  const supabase = createSupabaseAdmin();
  const normalizedReferenceCode = (referenceCode || "").trim().toUpperCase();

  if (!normalizedReferenceCode) {
    throw new Error("Reference code is required to revoke a session.");
  }

  const { data: session, error } = await supabase
    .from("private_acquisition_sessions")
    .select("id, stripe_payment_intent_id, status")
    .eq("reference_code", normalizedReferenceCode)
    .maybeSingle();

  if (error) throw error;
  if (!session) {
    throw new Error("No private acquisition session was found for that reference.");
  }

  if (session.status !== "paid") {
    await cancelPaymentIntentIfPossible(session.stripe_payment_intent_id);
  }

  const timestamp = nowIso();
  const { error: updateError } = await supabase
    .from("private_acquisition_sessions")
    .update({
      status: "revoked",
      revoked_at: timestamp,
      access_grant_hash: null,
      access_grant_expires_at: null,
      note: note ? `${note}` : null,
      updated_at: timestamp,
    })
    .eq("id", session.id);

  if (updateError) throw updateError;

  return {
    referenceCode: normalizedReferenceCode,
    revokedAt: timestamp,
  };
}

export async function getPrivateAcquisitionSessionByToken(token) {
  const normalizedToken = (token || "").trim();
  if (!normalizedToken) return null;

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("private_acquisition_sessions")
    .select("*")
    .eq("token_hash", hmacHex(normalizedToken))
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return syncTerminalSessionState(data, supabase);
}

async function syncTerminalSessionState(session, supabase = createSupabaseAdmin()) {
  const now = Date.now();

  if (
    session.status !== "paid" &&
    session.status !== "revoked" &&
    session.status !== "expired" &&
    new Date(session.expires_at).getTime() <= now
  ) {
    if (session.stripe_payment_intent_id) {
      await cancelPaymentIntentIfPossible(session.stripe_payment_intent_id);
    }

    const timestamp = nowIso();
    const { error } = await supabase
      .from("private_acquisition_sessions")
      .update({
        status: "expired",
        access_grant_hash: null,
        access_grant_expires_at: null,
        updated_at: timestamp,
      })
      .eq("id", session.id);

    if (error) throw error;

    return {
      ...session,
      status: "expired",
      access_grant_hash: null,
      access_grant_expires_at: null,
      updated_at: timestamp,
    };
  }

  return session;
}

export function getPresentationState(session) {
  if (!session) return "invalid";
  if (session.status === "paid") return "paid";
  if (session.status === "revoked") return "revoked";
  if (session.status === "expired") return "expired";
  return "active";
}

export function serializeAcquisitionSession(session) {
  const productSnapshot =
    session.product_snapshot && typeof session.product_snapshot === "object"
      ? session.product_snapshot
      : {};

  const orderSnapshot =
    session.order_snapshot && typeof session.order_snapshot === "object"
      ? session.order_snapshot
      : {};

  return {
    id: session.id,
    referenceCode: session.reference_code,
    clientName: session.client_name,
    clientEmail: session.client_email,
    clientPhone: session.client_phone,
    productName: session.product_name,
    productSnapshot,
    orderSnapshot,
    quantity: session.quantity,
    currency: session.currency,
    subtotalAmount: session.subtotal_amount,
    shippingAmount: session.shipping_amount,
    totalAmount: session.total_amount,
    shippingCountry: session.shipping_country,
    shippingRegion: session.shipping_region,
    shippingCity: session.shipping_city,
    shippingPostalCode: session.shipping_postal_code,
    shippingAddressLine1: session.shipping_address_line1,
    shippingAddressLine2: session.shipping_address_line2,
    shippingRecipientName: session.shipping_recipient_name,
    shippingDeliveryNotes: session.shipping_delivery_notes,
    expiresAt: session.expires_at,
    status: session.status,
    paidAt: session.paid_at,
    validatedAt: session.validated_at,
    deliveryDetailsCompletedAt: session.delivery_details_completed_at,
  };
}

export function hasCompletedDeliveryDetails(session) {
  if (!session?.delivery_details_completed_at) return false;

  return DELIVERY_REQUIRED_FIELD_KEYS.every((key) =>
    Boolean(normalizeInlineText(session[key])),
  );
}

export function normalizeDeliveryDetailsInput(input) {
  return {
    clientName: normalizeInlineText(input.clientName),
    clientEmail: normalizeInlineText(input.clientEmail).toLowerCase(),
    clientPhone: normalizeInlineText(input.clientPhone),
    shippingCountry: normalizeInlineText(input.shippingCountry),
    shippingRegion: normalizeInlineText(input.shippingRegion),
    shippingCity: normalizeInlineText(input.shippingCity),
    shippingPostalCode: normalizeInlineText(input.shippingPostalCode),
    shippingAddressLine1: normalizeInlineText(input.shippingAddressLine1),
    shippingAddressLine2: normalizeInlineText(input.shippingAddressLine2) || null,
    shippingRecipientName:
      normalizeInlineText(input.shippingRecipientName) || null,
    shippingDeliveryNotes:
      String(input.shippingDeliveryNotes || "").trim().slice(0, DELIVERY_NOTES_LIMIT) ||
      null,
    confirmDetails: Boolean(input.confirmDetails),
  };
}

export function validateDeliveryDetailsInput(input) {
  const normalized = normalizeDeliveryDetailsInput(input);
  const fieldErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsOnlyPhone = normalized.clientPhone.replace(/[^\d+()\-\s]/g, "");

  if (!normalized.clientName || normalized.clientName.length < 2) {
    fieldErrors.clientName =
      "Enter the full name to be attached to this acquisition record.";
  }

  if (!normalized.clientEmail || !emailPattern.test(normalized.clientEmail)) {
    fieldErrors.clientEmail =
      "Enter a valid email address for delivery correspondence.";
  }

  if (!digitsOnlyPhone || digitsOnlyPhone.replace(/[^\d]/g, "").length < 6) {
    fieldErrors.clientPhone =
      "Enter a valid phone number for delivery contact.";
  }

  if (!normalized.shippingCountry) {
    fieldErrors.shippingCountry = "Enter the destination country.";
  }

  if (!normalized.shippingAddressLine1 || normalized.shippingAddressLine1.length < 5) {
    fieldErrors.shippingAddressLine1 =
      "Enter the primary destination line in full.";
  }

  if (!normalized.shippingCity) {
    fieldErrors.shippingCity = "Enter the destination city.";
  }

  if (!normalized.shippingRegion) {
    fieldErrors.shippingRegion = "Enter the state or region.";
  }

  if (!normalized.shippingPostalCode || normalized.shippingPostalCode.length < 3) {
    fieldErrors.shippingPostalCode = "Enter the postal code for this destination.";
  }

  if (
    normalized.shippingRecipientName &&
    normalized.shippingRecipientName.length < 2
  ) {
    fieldErrors.shippingRecipientName =
      "Enter the recipient name in full or leave the field empty.";
  }

  if (!normalized.confirmDetails) {
    fieldErrors.confirmDetails =
      "Confirm the destination record before payment can continue.";
  }

  return {
    normalized,
    fieldErrors,
  };
}

export async function saveDeliveryDetails(sessionId, input) {
  const supabase = createSupabaseAdmin();
  const timestamp = nowIso();
  const { normalized } = validateDeliveryDetailsInput(input);

  const { data, error } = await supabase
    .from("private_acquisition_sessions")
    .update({
      client_name: normalized.clientName,
      client_email: normalized.clientEmail,
      client_phone: normalized.clientPhone,
      shipping_country: normalized.shippingCountry,
      shipping_region: normalized.shippingRegion,
      shipping_city: normalized.shippingCity,
      shipping_postal_code: normalized.shippingPostalCode,
      shipping_address_line1: normalized.shippingAddressLine1,
      shipping_address_line2: normalized.shippingAddressLine2,
      shipping_recipient_name: normalized.shippingRecipientName,
      shipping_delivery_notes: normalized.shippingDeliveryNotes,
      delivery_details_completed_at: timestamp,
      updated_at: timestamp,
    })
    .eq("id", sessionId)
    .select("*")
    .single();

  if (error) throw error;

  return data;
}

export async function recordFailedAccessAttempt(session) {
  const supabase = createSupabaseAdmin();
  const currentCount = Number(session.failed_access_attempts || 0) + 1;
  const timestamp = nowIso();
  const lockoutTriggered = currentCount >= FAILED_ATTEMPT_LIMIT;
  const lockedUntil = lockoutTriggered ? addMs(timestamp, LOCKOUT_WINDOW_MS) : null;

  const { error } = await supabase
    .from("private_acquisition_sessions")
    .update({
      failed_access_attempts: currentCount,
      last_failed_access_at: timestamp,
      locked_until: lockedUntil,
      updated_at: timestamp,
    })
    .eq("id", session.id);

  if (error) throw error;

  return {
    failedAccessAttempts: currentCount,
    lockedUntil,
  };
}

export function isLockedOut(session) {
  if (!session?.locked_until) return false;
  return new Date(session.locked_until).getTime() > Date.now();
}

export async function clearFailedAccessState(sessionId) {
  const supabase = createSupabaseAdmin();
  const timestamp = nowIso();

  const { error } = await supabase
    .from("private_acquisition_sessions")
    .update({
      failed_access_attempts: 0,
      last_failed_access_at: null,
      locked_until: null,
      updated_at: timestamp,
    })
    .eq("id", sessionId);

  if (error) throw error;
}

export async function issueAccessGrant(session) {
  const supabase = createSupabaseAdmin();
  const grantToken = crypto.randomBytes(24).toString("base64url");
  const now = nowIso();
  const sessionExpiresAt = new Date(session.expires_at).getTime();
  const ttlExpiresAt = new Date(Date.now() + ACCESS_GRANT_TTL_MS).getTime();
  const grantExpiresAt = new Date(
    Math.min(sessionExpiresAt, ttlExpiresAt),
  ).toISOString();

  const { error } = await supabase
    .from("private_acquisition_sessions")
    .update({
      status: session.status === "issued" ? "validated" : session.status,
      validated_at: session.validated_at || now,
      access_grant_hash: hmacHex(grantToken),
      access_grant_expires_at: grantExpiresAt,
      failed_access_attempts: 0,
      last_failed_access_at: null,
      locked_until: null,
      updated_at: now,
    })
    .eq("id", session.id);

  if (error) throw error;

  return {
    grantToken,
    grantExpiresAt,
  };
}

export function hasValidAccessGrant(session, request) {
  const grantToken = getAcquisitionGrantFromRequest(request);
  if (!grantToken) return false;
  if (!session.access_grant_hash || !session.access_grant_expires_at) return false;
  if (new Date(session.access_grant_expires_at).getTime() <= Date.now()) return false;

  return safeEqualHex(session.access_grant_hash, hmacHex(grantToken));
}

export async function clearAccessGrant(sessionId) {
  const supabase = createSupabaseAdmin();
  const timestamp = nowIso();

  const { error } = await supabase
    .from("private_acquisition_sessions")
    .update({
      access_grant_hash: null,
      access_grant_expires_at: null,
      updated_at: timestamp,
    })
    .eq("id", sessionId);

  if (error) throw error;
}

export function matchesReferenceCode(session, referenceCode) {
  const normalizedInput = normalizeReferenceCode(referenceCode);
  if (!normalizedInput || !session?.reference_code_hash) return false;
  return safeEqualHex(session.reference_code_hash, hmacHex(normalizedInput));
}

export async function ensureStripePaymentState(session) {
  const normalizedSession = await syncTerminalSessionState(session);

  if (
    !normalizedSession ||
    !normalizedSession.stripe_payment_intent_id ||
    normalizedSession.status === "paid" ||
    normalizedSession.status === "revoked" ||
    normalizedSession.status === "expired"
  ) {
    return normalizedSession;
  }

  const stripe = createStripeServerClient();
  const paymentIntent = await stripe.paymentIntents.retrieve(
    normalizedSession.stripe_payment_intent_id,
  );

  if (paymentIntent.status === "succeeded") {
    return markSessionPaid({
      sessionId: normalizedSession.id,
      paymentIntentId: paymentIntent.id,
      amountReceived: paymentIntent.amount_received,
    });
  }

  if (
    paymentIntent.status === "canceled" &&
    normalizedSession.status === "validated"
  ) {
    const supabase = createSupabaseAdmin();
    const timestamp = nowIso();
    const { error } = await supabase
      .from("private_acquisition_sessions")
      .update({
        stripe_payment_intent_status: paymentIntent.status,
        access_grant_hash: null,
        access_grant_expires_at: null,
        updated_at: timestamp,
      })
      .eq("id", normalizedSession.id);

    if (error) throw error;

    return {
      ...normalizedSession,
      stripe_payment_intent_status: paymentIntent.status,
      access_grant_hash: null,
      access_grant_expires_at: null,
      updated_at: timestamp,
    };
  }

  return normalizedSession;
}

export async function markSessionPaid({
  sessionId,
  paymentIntentId,
  amountReceived,
}) {
  const supabase = createSupabaseAdmin();
  const timestamp = nowIso();

  const { data, error } = await supabase
    .from("private_acquisition_sessions")
    .update({
      status: "paid",
      paid_at: timestamp,
      access_grant_hash: null,
      access_grant_expires_at: null,
      stripe_payment_intent_status: "succeeded",
      updated_at: timestamp,
    })
    .eq("id", sessionId)
    .eq("stripe_payment_intent_id", paymentIntentId)
    .select("*")
    .single();

  if (error) throw error;

  return {
    ...data,
    amount_received: amountReceived,
  };
}

export async function handleStripePaymentEvent(event) {
  const type = event.type;

  if (type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const sessionId = paymentIntent.metadata?.private_acquisition_session_id;
    if (!sessionId) return;

    await markSessionPaid({
      sessionId,
      paymentIntentId: paymentIntent.id,
      amountReceived: paymentIntent.amount_received,
    });
    return;
  }

  if (type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const sessionId = paymentIntent.metadata?.private_acquisition_session_id;
    if (!sessionId) return;

    const supabase = createSupabaseAdmin();
    const { error } = await supabase
      .from("private_acquisition_sessions")
      .update({
        stripe_payment_intent_status: paymentIntent.status,
        stripe_last_payment_error:
          paymentIntent.last_payment_error?.message || "Payment failed.",
        updated_at: nowIso(),
      })
      .eq("id", sessionId);

    if (error) throw error;
  }
}
