import { createClient, type User } from "@supabase/supabase-js";
import { createHash } from "crypto";

const HOUSE_LEDGER_ALLOWED_EMAILS_ENV = "HOUSE_LEDGER_ALLOWED_EMAILS";
const FULFILLMENT_STATUSES = ["pending", "preparing", "fulfilled", "archived"] as const;

type FulfillmentStatus = (typeof FULFILLMENT_STATUSES)[number];

export class HouseLedgerAccessError extends Error {
  status: number;

  constructor(message: string, status = 403) {
    super(message);
    this.name = "HouseLedgerAccessError";
    this.status = status;
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
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

function nowIso() {
  return new Date().toISOString();
}

function normalizeInlineText(value: unknown) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function getAllowedOwnerEmails() {
  const raw = requireEnv(HOUSE_LEDGER_ALLOWED_EMAILS_ENV);
  const emails = raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!emails.length) {
    throw new Error(
      `${HOUSE_LEDGER_ALLOWED_EMAILS_ENV} must contain at least one owner email.`,
    );
  }

  return new Set(emails);
}

function getBearerToken(request: Request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}

function getOrderSnapshotObject(session: Record<string, unknown>) {
  const snapshot = session.order_snapshot;
  return snapshot && typeof snapshot === "object"
    ? (snapshot as Record<string, unknown>)
    : {};
}

function getDeliverySnapshot(session: Record<string, unknown>) {
  const orderSnapshot = getOrderSnapshotObject(session);
  const delivery = orderSnapshot.deliveryDetails;
  return delivery && typeof delivery === "object"
    ? (delivery as Record<string, unknown>)
    : {};
}

function resolveSessionField(
  session: Record<string, unknown>,
  sessionKey: string,
  snapshotKey: string,
) {
  const sessionValue = normalizeInlineText(session[sessionKey]);
  if (sessionValue) return sessionValue;

  const deliverySnapshot = getDeliverySnapshot(session);
  const snapshotValue = normalizeInlineText(deliverySnapshot[snapshotKey]);
  return snapshotValue || null;
}

function getResolvedDeliveryDetails(session: Record<string, unknown>) {
  return {
    clientName: resolveSessionField(session, "client_name", "clientName"),
    clientEmail: resolveSessionField(session, "client_email", "clientEmail"),
    clientPhone: resolveSessionField(session, "client_phone", "clientPhone"),
    shippingCountry: resolveSessionField(
      session,
      "shipping_country",
      "shippingCountry",
    ),
    shippingRegion: resolveSessionField(
      session,
      "shipping_region",
      "shippingRegion",
    ),
    shippingCity: resolveSessionField(session, "shipping_city", "shippingCity"),
    shippingPostalCode: resolveSessionField(
      session,
      "shipping_postal_code",
      "shippingPostalCode",
    ),
    shippingAddressLine1: resolveSessionField(
      session,
      "shipping_address_line1",
      "shippingAddressLine1",
    ),
    shippingAddressLine2: resolveSessionField(
      session,
      "shipping_address_line2",
      "shippingAddressLine2",
    ),
    shippingRecipientName: resolveSessionField(
      session,
      "shipping_recipient_name",
      "shippingRecipientName",
    ),
    shippingDeliveryNotes: resolveSessionField(
      session,
      "shipping_delivery_notes",
      "shippingDeliveryNotes",
    ),
  };
}

function getMinorAmount(value: unknown, fallback = 0) {
  return Number.isInteger(value) ? Number(value) : fallback;
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: String(currency || "mxn").toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

function formatPaidAtForLedger(value: unknown) {
  const date = value ? new Date(String(value)) : null;
  if (!date || Number.isNaN(date.getTime())) return "Pending";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function buildSaleNotificationTitle(session: Record<string, unknown>) {
  return `Sale recorded · ${normalizeInlineText(session.reference_code) || "Praeliator"}`;
}

function buildSaleNotificationBody(sale: Record<string, unknown>) {
  const fragments = [
    normalizeInlineText(sale.client_name),
    normalizeInlineText(sale.product_name),
    formatMoney(
      getMinorAmount(sale.total_amount, 0),
      normalizeInlineText(sale.currency) || "mxn",
    ),
    normalizeInlineText(sale.shipping_country),
    formatPaidAtForLedger(sale.paid_at),
  ].filter(Boolean);

  return fragments.join(" · ");
}

function hashFragment(value: unknown, length = 8) {
  return createHash("sha256")
    .update(normalizeInlineText(value) || nowIso())
    .digest("hex")
    .slice(0, length)
    .toUpperCase();
}

function buildObjectReference(session: Record<string, unknown>) {
  return `OR-${hashFragment(`${session.id}:${session.reference_code}`, 10)}`;
}

function buildSerialNumber(session: Record<string, unknown>) {
  const product = normalizeInlineText(session.product_name).toUpperCase();
  const productCode = product.includes("VIS") ? "VIS" : "OBJ";
  return `PR-${productCode}-${hashFragment(session.id, 6)}`;
}

function addOneYearIso(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setUTCFullYear(date.getUTCFullYear() + 1);
  return date.toISOString();
}

function serializeObjectRecord(record: Record<string, unknown> | null | undefined) {
  if (!record) return null;
  return {
    id: record.id,
    objectReference: record.object_reference,
    serialNumber: record.serial_number,
    status: record.status,
    deliveryRecordedAt: record.delivery_recorded_at,
    legacyRefreshEligibleOn: record.legacy_refresh_eligible_on,
  };
}

async function upsertObjectRecordFromSession(input: {
  sale: Record<string, unknown>;
  session: Record<string, unknown>;
}) {
  const { sale, session } = input;
  const supabase = createSupabaseAdmin();
  const resolvedDelivery = getResolvedDeliveryDetails(session);
  const timestamp = nowIso();
  const fulfillmentStatus = normalizeInlineText(sale.fulfillment_status);
  const deliveryRecordedAt =
    fulfillmentStatus === "fulfilled"
      ? normalizeInlineText(sale.delivery_recorded_at) || timestamp
      : null;
  const legacyRefreshEligibleOn =
    deliveryRecordedAt && fulfillmentStatus === "fulfilled"
      ? addOneYearIso(deliveryRecordedAt)
      : null;

  const payload = {
    private_acquisition_session_id: String(session.id),
    sale_id: String(sale.id),
    object_reference: buildObjectReference(session),
    serial_number: buildSerialNumber(session),
    product_name: normalizeInlineText(session.product_name),
    client_name: resolvedDelivery.clientName,
    client_email: resolvedDelivery.clientEmail,
    status:
      fulfillmentStatus === "fulfilled"
        ? "delivery_recorded"
        : fulfillmentStatus === "preparing"
          ? "preparing"
          : fulfillmentStatus === "archived"
            ? "archived"
            : "paid_recorded",
    destination_snapshot: {
      country: resolvedDelivery.shippingCountry,
      region: resolvedDelivery.shippingRegion,
      city: resolvedDelivery.shippingCity,
      postalCode: resolvedDelivery.shippingPostalCode,
      addressLine1: resolvedDelivery.shippingAddressLine1,
      addressLine2: resolvedDelivery.shippingAddressLine2,
      recipientName: resolvedDelivery.shippingRecipientName,
      deliveryNotes: resolvedDelivery.shippingDeliveryNotes,
    },
    product_snapshot:
      session.product_snapshot && typeof session.product_snapshot === "object"
        ? session.product_snapshot
        : {},
    order_snapshot:
      session.order_snapshot && typeof session.order_snapshot === "object"
        ? session.order_snapshot
        : {},
    paid_at: normalizeInlineText(session.paid_at) || normalizeInlineText(sale.paid_at) || null,
    delivery_recorded_at: deliveryRecordedAt,
    legacy_refresh_eligible_on: legacyRefreshEligibleOn,
    updated_at: timestamp,
  };

  const { data, error } = await supabase
    .from("acquisition_object_records")
    .upsert(payload, {
      onConflict: "private_acquisition_session_id",
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

function toOwnerRecord(user: User) {
  return {
    id: user.id,
    email: user.email?.trim().toLowerCase() || "",
    fullName:
      normalizeInlineText(user.user_metadata?.full_name) ||
      normalizeInlineText(user.user_metadata?.name) ||
      null,
  };
}

export function createHouseLedgerResponse(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export function isValidFulfillmentStatus(value: unknown): value is FulfillmentStatus {
  return FULFILLMENT_STATUSES.includes(value as FulfillmentStatus);
}

export async function requireHouseLedgerOwner(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    throw new HouseLedgerAccessError(
      "A signed-in owner session is required for the house ledger.",
      401,
    );
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new HouseLedgerAccessError(
      "The owner session could not be verified.",
      401,
    );
  }

  const owner = toOwnerRecord(data.user);
  if (!owner.email) {
    throw new HouseLedgerAccessError(
      "The current session is missing an owner email.",
      403,
    );
  }

  if (!getAllowedOwnerEmails().has(owner.email)) {
    throw new HouseLedgerAccessError(
      "This route has not been issued to the current account.",
      403,
    );
  }

  return owner;
}

export async function syncHouseLedgerSaleFromSession(input: {
  session: Record<string, unknown>;
  paymentIntentId: string;
  amountReceived?: number;
  chargeId?: string | null;
}) {
  const { session, paymentIntentId, amountReceived, chargeId } = input;
  const supabase = createSupabaseAdmin();
  const resolvedDelivery = getResolvedDeliveryDetails(session);
  const timestamp = nowIso();

  const upsertPayload = {
    private_acquisition_session_id: String(session.id),
    stripe_payment_intent_id: paymentIntentId,
    stripe_charge_id: chargeId || null,
    sale_reference: normalizeInlineText(session.reference_code),
    client_name: resolvedDelivery.clientName,
    client_email: resolvedDelivery.clientEmail,
    client_phone: resolvedDelivery.clientPhone,
    product_name: normalizeInlineText(session.product_name),
    product_snapshot:
      session.product_snapshot && typeof session.product_snapshot === "object"
        ? session.product_snapshot
        : {},
    order_snapshot:
      session.order_snapshot && typeof session.order_snapshot === "object"
        ? session.order_snapshot
        : {},
    quantity: getMinorAmount(session.quantity, 1),
    currency: normalizeInlineText(session.currency).toLowerCase() || "mxn",
    subtotal_amount: getMinorAmount(session.subtotal_amount, 0),
    shipping_amount: getMinorAmount(session.shipping_amount, 0),
    total_amount: getMinorAmount(session.total_amount, 0),
    amount_received:
      typeof amountReceived === "number"
        ? amountReceived
        : getMinorAmount(session.total_amount, 0),
    shipping_country: resolvedDelivery.shippingCountry,
    shipping_region: resolvedDelivery.shippingRegion,
    shipping_city: resolvedDelivery.shippingCity,
    shipping_postal_code: resolvedDelivery.shippingPostalCode,
    shipping_address_line1: resolvedDelivery.shippingAddressLine1,
    shipping_address_line2: resolvedDelivery.shippingAddressLine2,
    shipping_recipient_name: resolvedDelivery.shippingRecipientName,
    shipping_delivery_notes: resolvedDelivery.shippingDeliveryNotes,
    paid_at: normalizeInlineText(session.paid_at) || timestamp,
    updated_at: timestamp,
  };

  const { data: sale, error: saleError } = await supabase
    .from("sales_registry")
    .upsert(upsertPayload, {
      onConflict: "private_acquisition_session_id",
    })
    .select("*")
    .single();

  if (saleError) throw saleError;

  const objectRecord = await upsertObjectRecordFromSession({ sale, session });

  const notificationTimestamp = nowIso();
  const notificationEventKey = `sale-paid:${String(session.id)}`;
  const { error: notificationError } = await supabase
    .from("house_ledger_notifications")
    .upsert(
      {
        sale_id: sale.id,
        kind: "sale_paid",
        event_key: notificationEventKey,
        title: buildSaleNotificationTitle(session),
        body: buildSaleNotificationBody(sale),
        payload: {
          saleId: sale.id,
          saleReference: sale.sale_reference,
          objectReference: objectRecord.object_reference,
          serialNumber: objectRecord.serial_number,
          productName: sale.product_name,
          totalAmount: sale.total_amount,
          currency: sale.currency,
          shippingCountry: sale.shipping_country,
        },
      },
      { onConflict: "event_key" },
    );

  if (notificationError) throw notificationError;

  const { error: syncError } = await supabase
    .from("sales_registry")
    .update({
      last_notified_at: notificationTimestamp,
      updated_at: notificationTimestamp,
    })
    .eq("id", sale.id);

  if (syncError) throw syncError;

  return {
    ...sale,
    objectRecord,
  };
}

export async function getHouseLedgerState() {
  const supabase = createSupabaseAdmin();
  const [{ data: summaryRows, error: summaryError }, { data: sales, error: salesError }, { data: notifications, error: notificationsError }] =
    await Promise.all([
      supabase.rpc("house_ledger_summary"),
      supabase
        .from("sales_registry")
        .select(
          "id, sale_reference, client_name, client_email, product_name, currency, total_amount, amount_received, quantity, shipping_country, shipping_region, shipping_city, fulfillment_status, paid_at, created_at",
        )
        .order("paid_at", { ascending: false })
        .limit(18),
      supabase
        .from("house_ledger_notifications")
        .select("id, sale_id, kind, title, body, payload, read_at, created_at")
        .order("created_at", { ascending: false })
        .limit(18),
    ]);

  if (summaryError) throw summaryError;
  if (salesError) throw salesError;
  if (notificationsError) throw notificationsError;

  const summary = Array.isArray(summaryRows) && summaryRows[0] ? summaryRows[0] : null;
  const saleIds = (sales || []).map((sale) => sale.id).filter(Boolean);
  const { data: objectRecords, error: objectRecordsError } = saleIds.length
    ? await supabase
        .from("acquisition_object_records")
        .select(
          "id, sale_id, object_reference, serial_number, status, delivery_recorded_at, legacy_refresh_eligible_on",
        )
        .in("sale_id", saleIds)
    : { data: [], error: null };

  if (objectRecordsError) throw objectRecordsError;

  const objectRecordBySaleId = new Map(
    (objectRecords || []).map((record) => [record.sale_id, record]),
  );

  return {
    stats: {
      totalSalesCount: Number(summary?.total_sales_count || 0),
      totalRevenue: Number(summary?.total_revenue || 0),
      todaySalesCount: Number(summary?.today_sales_count || 0),
      todayRevenue: Number(summary?.today_revenue || 0),
      monthSalesCount: Number(summary?.month_sales_count || 0),
      monthRevenue: Number(summary?.month_revenue || 0),
      pendingFulfillmentCount: Number(summary?.pending_fulfillment_count || 0),
      unreadNotificationsCount: Number(summary?.unread_notifications_count || 0),
      lastPaidAt: summary?.last_paid_at || null,
      reportedCurrency: normalizeInlineText(summary?.reported_currency).toLowerCase() || null,
      currencyCount: Number(summary?.currency_count || 0),
    },
    sales: (sales || []).map((sale) => ({
      id: sale.id,
      saleReference: sale.sale_reference,
      clientName: sale.client_name,
      clientEmail: sale.client_email,
      productName: sale.product_name,
      quantity: sale.quantity,
      currency: sale.currency,
      totalAmount: sale.total_amount,
      amountReceived: sale.amount_received,
      shippingCountry: sale.shipping_country,
      shippingRegion: sale.shipping_region,
      shippingCity: sale.shipping_city,
      fulfillmentStatus: sale.fulfillment_status,
      objectRecord: serializeObjectRecord(objectRecordBySaleId.get(sale.id)),
      paidAt: sale.paid_at,
      createdAt: sale.created_at,
    })),
    notifications: (notifications || []).map((notification) => ({
      id: notification.id,
      saleId: notification.sale_id,
      kind: notification.kind,
      title: notification.title,
      body: notification.body,
      payload:
        notification.payload && typeof notification.payload === "object"
          ? notification.payload
          : {},
      readAt: notification.read_at,
      createdAt: notification.created_at,
    })),
  };
}

export async function markHouseLedgerNotificationsRead(input: {
  notificationId?: string | null;
}) {
  const supabase = createSupabaseAdmin();
  const timestamp = nowIso();
  const notificationId = normalizeInlineText(input.notificationId);

  let query = supabase
    .from("house_ledger_notifications")
    .update({ read_at: timestamp })
    .is("read_at", null);

  query = notificationId ? query.eq("id", notificationId) : query;

  const { error } = await query;
  if (error) throw error;

  const { count, error: countError } = await supabase
    .from("house_ledger_notifications")
    .select("id", { count: "exact", head: true })
    .is("read_at", null);

  if (countError) throw countError;

  return {
    readAt: timestamp,
    unreadNotificationsCount: Number(count || 0),
  };
}

export async function updateHouseLedgerSaleStatus(input: {
  saleId: string;
  fulfillmentStatus: FulfillmentStatus;
}) {
  const supabase = createSupabaseAdmin();
  const timestamp = nowIso();

  const { data, error } = await supabase
    .from("sales_registry")
    .update({
      fulfillment_status: input.fulfillmentStatus,
      updated_at: timestamp,
    })
    .eq("id", input.saleId)
    .select(
      "id, private_acquisition_session_id, sale_reference, client_name, client_email, product_name, currency, total_amount, amount_received, quantity, shipping_country, shipping_region, shipping_city, fulfillment_status, paid_at, created_at",
    )
    .single();

  if (error) throw error;

  const { data: existingRecord, error: existingRecordError } = await supabase
    .from("acquisition_object_records")
    .select(
      "id, sale_id, object_reference, serial_number, status, delivery_recorded_at, legacy_refresh_eligible_on",
    )
    .eq("sale_id", data.id)
    .maybeSingle();

  if (existingRecordError) throw existingRecordError;

  let objectRecord = existingRecord;

  if (existingRecord) {
    const mappedStatus =
      input.fulfillmentStatus === "fulfilled"
        ? "delivery_recorded"
        : input.fulfillmentStatus === "archived"
          ? "archived"
          : input.fulfillmentStatus === "preparing"
            ? "preparing"
            : "paid_recorded";

    const shouldRecordDelivery =
      input.fulfillmentStatus === "fulfilled" &&
      !normalizeInlineText(existingRecord.delivery_recorded_at);
    const deliveryRecordedAt = shouldRecordDelivery
      ? timestamp
      : normalizeInlineText(existingRecord.delivery_recorded_at) || null;
    const legacyRefreshEligibleOn =
      deliveryRecordedAt && input.fulfillmentStatus === "fulfilled"
        ? normalizeInlineText(existingRecord.legacy_refresh_eligible_on) ||
          addOneYearIso(deliveryRecordedAt)
        : normalizeInlineText(existingRecord.legacy_refresh_eligible_on) || null;

    const { data: updatedRecord, error: recordError } = await supabase
      .from("acquisition_object_records")
      .update({
        status: mappedStatus,
        delivery_recorded_at: deliveryRecordedAt,
        legacy_refresh_eligible_on: legacyRefreshEligibleOn,
        updated_at: timestamp,
      })
      .eq("id", existingRecord.id)
      .select(
        "id, sale_id, object_reference, serial_number, status, delivery_recorded_at, legacy_refresh_eligible_on",
      )
      .single();

    if (recordError) throw recordError;
    objectRecord = updatedRecord;

    if (shouldRecordDelivery) {
      const { error: notificationError } = await supabase
        .from("house_ledger_notifications")
        .upsert(
          {
            sale_id: data.id,
            kind: "delivery_recorded",
            event_key: `delivery-recorded:${existingRecord.id}`,
            title: `Delivery recorded · ${existingRecord.serial_number}`,
            body: [
              data.client_name || "Private client",
              data.product_name,
              `Legacy Refresh opens ${formatPaidAtForLedger(legacyRefreshEligibleOn)}`,
            ]
              .filter(Boolean)
              .join(" · "),
            payload: {
              saleId: data.id,
              objectReference: existingRecord.object_reference,
              serialNumber: existingRecord.serial_number,
              deliveryRecordedAt,
              legacyRefreshEligibleOn,
            },
          },
          { onConflict: "event_key" },
        );

      if (notificationError) throw notificationError;
    }
  } else if (data.private_acquisition_session_id) {
    const { data: session, error: sessionError } = await supabase
      .from("private_acquisition_sessions")
      .select("*")
      .eq("id", data.private_acquisition_session_id)
      .single();

    if (sessionError) throw sessionError;
    objectRecord = await upsertObjectRecordFromSession({ sale: data, session });
  }

  return {
    id: data.id,
    saleReference: data.sale_reference,
    clientName: data.client_name,
    clientEmail: data.client_email,
    productName: data.product_name,
    quantity: data.quantity,
    currency: data.currency,
    totalAmount: data.total_amount,
    amountReceived: data.amount_received,
    shippingCountry: data.shipping_country,
    shippingRegion: data.shipping_region,
    shippingCity: data.shipping_city,
    fulfillmentStatus: data.fulfillment_status,
    objectRecord: serializeObjectRecord(objectRecord),
    paidAt: data.paid_at,
    createdAt: data.created_at,
  };
}
