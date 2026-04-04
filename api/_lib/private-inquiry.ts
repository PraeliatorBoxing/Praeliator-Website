import { createClient } from "@supabase/supabase-js";

export type PrivateInquiryRecordInput = {
  title?: string;
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  fullPhone?: string;
  country: string;
  interest: string;
  timeline: string;
  contactPreference: string;
  note?: string;
  sourceRoute: string;
  lifecycleStage?: string;
  serviceMessage?: string;
  syncCrm?: boolean;
  updateClientRecord?: boolean;
};

type HubSpotUpsertResponse = {
  results?: Array<{ id?: string }>;
};

const DEFAULT_SERVICE_MESSAGE =
  "A private response follows after review. Your client record is now open.";

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

function buildReference(): string {
  const date = new Date();
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  const seed = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PRA-${y}${m}${d}-${seed}`;
}

async function upsertHubSpotContact(
  payload: PrivateInquiryRecordInput,
  reference: string,
): Promise<string | null> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return null;

  const response = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          {
            idProperty: "email",
            id: payload.email,
            properties: {
              email: payload.email,
              firstname: payload.fullName.split(" ")[0] || payload.fullName,
              lastname:
                payload.fullName.split(" ").slice(1).join(" ") ||
                payload.fullName,
              phone:
                payload.fullPhone ||
                `${payload.phoneCountryCode} ${payload.phoneNumber}`,
              country: payload.country,
              lifecyclestage: "lead",
              hs_lead_status: "NEW",
              praeliator_reference_code: reference,
              praeliator_interest: payload.interest,
              praeliator_timeline: payload.timeline,
              praeliator_contact_preference: payload.contactPreference,
              praeliator_source_route: payload.sourceRoute,
              praeliator_title: payload.title || "",
            },
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`HubSpot sync failed: ${message}`);
  }

  const data = (await response.json()) as HubSpotUpsertResponse;
  return data.results?.[0]?.id || null;
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function persistPrivateInquiry(
  input: PrivateInquiryRecordInput,
): Promise<{ reference: string; serviceMessage: string }> {
  const payload: PrivateInquiryRecordInput = {
    ...input,
    title: (input.title || "").trim(),
    fullName: input.fullName.trim(),
    email: input.email.trim().toLowerCase(),
    phoneCountryCode: input.phoneCountryCode.trim(),
    phoneNumber: input.phoneNumber.trim(),
    fullPhone: (input.fullPhone || "").trim(),
    country: input.country.trim(),
    interest: input.interest.trim(),
    timeline: input.timeline.trim(),
    contactPreference: input.contactPreference.trim(),
    note: (input.note || "").trim(),
    sourceRoute: input.sourceRoute.trim(),
    lifecycleStage: input.lifecycleStage?.trim() || "lead",
    serviceMessage: input.serviceMessage?.trim() || DEFAULT_SERVICE_MESSAGE,
    syncCrm: input.syncCrm ?? true,
    updateClientRecord: input.updateClientRecord ?? true,
  };

  const reference = buildReference();
  const submittedAt = new Date().toISOString();
  const supabase = createSupabaseAdmin();
  const crmContactId = payload.syncCrm
    ? await upsertHubSpotContact(payload, reference)
    : null;

  const { data: inquiry, error: inquiryError } = await supabase
    .from("private_client_inquiries")
    .insert({
      reference_code: reference,
      status: "new",
      title: payload.title || null,
      full_name: payload.fullName,
      email: payload.email,
      dial_code: payload.phoneCountryCode,
      phone_number: payload.phoneNumber,
      full_phone:
        payload.fullPhone ||
        `${payload.phoneCountryCode} ${payload.phoneNumber}`.trim(),
      country: payload.country,
      interest: payload.interest,
      timeline: payload.timeline,
      contact_preference: payload.contactPreference,
      note: payload.note || null,
      source_route: payload.sourceRoute,
      crm_contact_id: crmContactId,
      submitted_at: submittedAt,
    })
    .select("id")
    .single();

  if (inquiryError) {
    throw inquiryError;
  }

  if (payload.updateClientRecord) {
    const { error: clientRecordError } = await supabase
      .from("client_records")
      .upsert(
        {
          email: payload.email,
          full_name: payload.fullName,
          latest_inquiry_id: inquiry.id,
          current_reference_code: reference,
          lifecycle_stage: payload.lifecycleStage,
          crm_contact_id: crmContactId,
          preferred_contact_method: payload.contactPreference,
          country: payload.country,
          updated_at: submittedAt,
        },
        { onConflict: "email" },
      );

    if (clientRecordError) {
      throw clientRecordError;
    }
  }

  return {
    reference,
    serviceMessage: payload.serviceMessage || DEFAULT_SERVICE_MESSAGE,
  };
}
