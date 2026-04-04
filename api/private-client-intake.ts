import {
  jsonResponse,
  persistPrivateInquiry,
} from "./_lib/private-inquiry.js";

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

const SERVICE_MESSAGE =
  "A private response follows after review. Your client record is now open.";

function normalizePayload(raw: IntakePayload) {
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

function validatePayload(payload: ReturnType<typeof normalizePayload>) {
  if (!payload.fullName) return "Full name is required.";
  if (!payload.email) return "Email is required.";
  if (!payload.phoneCountryCode) return "Dial code is required.";
  if (!payload.phoneNumber) return "Phone number is required.";
  if (!payload.country) return "Country is required.";
  if (!payload.interest) return "Interest is required.";
  if (!payload.timeline) return "Timeline is required.";
  if (!payload.contactPreference) {
    return "Preferred contact method is required.";
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const rawPayload = (await request.json()) as IntakePayload;
    const payload = normalizePayload(rawPayload);
    const validationError = validatePayload(payload);

    if (validationError) {
      return jsonResponse({ success: false, error: validationError }, 400);
    }

    const result = await persistPrivateInquiry({
      title: payload.title,
      fullName: payload.fullName,
      email: payload.email,
      phoneCountryCode: payload.phoneCountryCode,
      phoneNumber: payload.phoneNumber,
      fullPhone:
        payload.fullPhone ||
        `${payload.phoneCountryCode} ${payload.phoneNumber}`.trim(),
      country: payload.country,
      interest: payload.interest,
      timeline: payload.timeline,
      contactPreference: payload.contactPreference,
      note: payload.note,
      sourceRoute: payload.sourceRoute,
      lifecycleStage: "lead",
      serviceMessage: SERVICE_MESSAGE,
    });

    return jsonResponse({ success: true, ...result }, 200);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Private intake failed.";

    return jsonResponse({ success: false, error: message }, 500);
  }
}
