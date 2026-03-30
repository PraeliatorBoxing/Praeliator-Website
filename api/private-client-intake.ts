import { createClient } from "@supabase/supabase-js";

type IntakePayload = {
  title?: string;
  fullName?: string;
  email?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  fullPhone?: string;
  country?: string;
  interest?: string;
  timeline?: string;
  contactPreference?: string;
  note?: string;
  sourceRoute?: string;
};

type HubSpotUpsertResponse = {
  results?: Array<{ id?: string }>;
};

const SERVICE_MESSAGE =
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
    }
  );
}

function normalizePayload(raw: IntakePayload): Required<IntakePayload> {
  return {
    title: (raw.title || "").trim(),
    fullName: (raw.fullName || "").trim(),
    email: (raw.email || "").trim().toLowerCase(),
    phoneCountryCode: (raw.phoneCountryCode || "").trim(),
    phoneNumber: (raw.phoneNumber || "").trim(),
    fullPhone: (raw.fullPhone || "").trim(),
    country: (raw.country || "").trim(),
    interest: (raw.interest || "").trim(),
    timeline: (raw.timeline || "").trim(),
    contactPreference: (raw.contactPreference || "").trim(),
    note: (raw.note || "").trim(),
    sourceRoute: (raw.sourceRoute || "/waitlist").trim(),
  };
}

function validatePayload(payload: Required<IntakePayload>): string | null {
  if (!payload.fullName) return "Full name is required.";
  if (!payload.email) return "Email is required.";
  if (!payload.phoneCountryCode) return "Dial code is required.";
  if (!payload.phoneNumber) return "Phone number is required.";
  if (!payload.country) return "Country is required.";
  if (!payload.interest) return "Interest is required.";
  if (!payload.timeline) return "Timeline is required.";
  if (!payload.contactPreference) return "Preferred contact method is required.";
  return null;
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
  payload: Required<IntakePayload>,
  reference: string
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
                payload.fullName.split(" ").slice(1).join(" ") || payload.fullName,
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
              praeliator_title: payload.title,
            },
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`HubSpot sync failed: ${message}`);
  }

  const data = (await response.json()) as HubSpotUpsertResponse;
  return data.results?.[0]?.id || null;
}

export async function POST(request: Request) {
  try {
    const rawPayload = (await request.json()) as IntakePayload;
    const payload = normalizePayload(rawPayload);
    const validationError = validatePayload(payload);

    if (validationError) {
      return new Response(
        JSON.stringify({ success: false, error: validationError }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const reference = buildReference();
    const submittedAt = new Date().toISOString();

    const supabase = createSupabaseAdmin();
    const crmContactId = await upsertHubSpotContact(payload, reference);

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
          payload.fullPhone || `${payload.phoneCountryCode} ${payload.phoneNumber}`,
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

    const { error: clientRecordError } = await supabase.from("client_records").upsert(
      {
        email: payload.email,
        full_name: payload.fullName,
        latest_inquiry_id: inquiry.id,
        current_reference_code: reference,
        lifecycle_stage: "lead",
        crm_contact_id: crmContactId,
        preferred_contact_method: payload.contactPreference,
        country: payload.country,
        updated_at: submittedAt,
      },
      { onConflict: "email" }
    );

    if (clientRecordError) {
      throw clientRecordError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        reference,
        serviceMessage: SERVICE_MESSAGE,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Private intake failed.";

    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}