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

export type PrivateAcquisitionBriefInput = {
  title?: string;
  fullName: string;
  interest: string;
  sourceRoute: string;
  destinationNumber?: string;
  note?: string;
  serviceMessage?: string;
};

type HubSpotUpsertResponse = {
  results?: Array<{ id?: string }>;
};

export type IntakeLocale = "en" | "es" | "ja" | "fr";

const DEFAULT_SERVICE_MESSAGE =
  "A private response follows after review. Your client record is now open.";
const DEFAULT_ACQUISITION_BRIEF_MESSAGE =
  "The brief has been retained under the house record. Continue on WhatsApp with the reference only.";

const privateInquiryServiceMessages: Record<
  IntakeLocale,
  {
    inquiry: string;
    acquisition: string;
    acquisitionBrief: string;
  }
> = {
  en: {
    inquiry:
      "A private response follows after review. Your client record is now open.",
    acquisition:
      "A private placement response follows after review. Your acquisition reference is now open.",
    acquisitionBrief:
      "The brief has been retained under the house record. Continue on WhatsApp with the reference only.",
  },
  es: {
    inquiry:
      "La respuesta privada seguira despues de la revision. Tu registro de cliente ya ha sido abierto.",
    acquisition:
      "La respuesta de adquisicion privada seguira despues de la revision. Tu referencia de adquisicion ya ha sido abierta.",
    acquisitionBrief:
      "El brief ha sido retenido bajo el registro de la casa. Continua en WhatsApp solo con la referencia.",
  },
  ja: {
    inquiry:
      "私的な返信は審査後に続きます。クライアント記録はすでに開かれています。",
    acquisition:
      "私的な取得対応は審査後に続きます。取得参照はすでに開かれています。",
    acquisitionBrief:
      "ブリーフはすでにハウス記録の下で保持されています。参照番号のみでWhatsAppへ続いてください。",
  },
  fr: {
    inquiry:
      "Une reponse privee suivra apres examen. Votre dossier client est maintenant ouvert.",
    acquisition:
      "Une reponse d'acquisition privee suivra apres examen. Votre reference d'acquisition est maintenant ouverte.",
    acquisitionBrief:
      "Le dossier a ete retenu sous le registre de la maison. Continuez sur WhatsApp avec la reference seulement.",
  },
};

export function normalizeIntakeLocale(value?: string): IntakeLocale {
  return value === "es" || value === "ja" || value === "fr" ? value : "en";
}

export function getPrivateInquiryServiceMessage(locale: IntakeLocale): string {
  return privateInquiryServiceMessages[locale].inquiry;
}

export function getPrivateAcquisitionServiceMessage(locale: IntakeLocale): string {
  return privateInquiryServiceMessages[locale].acquisition;
}

export function getPrivateAcquisitionBriefServiceMessage(
  locale: IntakeLocale,
): string {
  return privateInquiryServiceMessages[locale].acquisitionBrief;
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

export async function persistPrivateAcquisitionBrief(
  input: PrivateAcquisitionBriefInput,
): Promise<{ reference: string; serviceMessage: string }> {
  const payload: PrivateAcquisitionBriefInput = {
    ...input,
    title: (input.title || "").trim(),
    fullName: input.fullName.trim(),
    interest: input.interest.trim(),
    sourceRoute: input.sourceRoute.trim(),
    destinationNumber: (input.destinationNumber || "").trim(),
    note: (input.note || "").trim(),
    serviceMessage:
      input.serviceMessage?.trim() || DEFAULT_ACQUISITION_BRIEF_MESSAGE,
  };

  const reference = buildReference();
  const submittedAt = new Date().toISOString();
  const supabase = createSupabaseAdmin();
  const syntheticEmail = `brief+${reference.toLowerCase()}@praeliator.local`;
  const compiledNote = [
    "Acquisition brief retained before WhatsApp contact.",
    payload.destinationNumber
      ? `Destination number: ${payload.destinationNumber}`
      : null,
    payload.note || null,
  ]
    .filter(Boolean)
    .join("\n");

  const { error } = await supabase.from("private_client_inquiries").insert({
    reference_code: reference,
    status: "new",
    title: payload.title || null,
    full_name: payload.fullName,
    email: syntheticEmail,
    dial_code: "+52",
    phone_number: "5540658550",
    full_phone: payload.destinationNumber || "+52 5540658550",
    country: "WhatsApp route",
    interest: payload.interest,
    timeline: "Immediate",
    contact_preference: "WhatsApp",
    note: compiledNote || null,
    source_route: payload.sourceRoute,
    crm_contact_id: null,
    submitted_at: submittedAt,
  });

  if (error) {
    throw error;
  }

  return {
    reference,
    serviceMessage: payload.serviceMessage || DEFAULT_ACQUISITION_BRIEF_MESSAGE,
  };
}
