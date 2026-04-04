import {
  jsonResponse,
  persistPrivateInquiry,
} from "./_lib/private-inquiry";

type AcquisitionPayload = {
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
  collectorIntent?: string;
  purchasePurpose?: string;
  destinationRegion?: string;
  sourceRoute?: string;
};

const SERVICE_MESSAGE =
  "A private placement response follows after review. Your acquisition reference is now open.";

function normalizePayload(raw: AcquisitionPayload) {
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
    collectorIntent: (raw.collectorIntent || "").trim(),
    purchasePurpose: (raw.purchasePurpose || "").trim(),
    destinationRegion: (raw.destinationRegion || "").trim(),
    sourceRoute: (raw.sourceRoute || "/acquisition").trim(),
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
  if (!payload.collectorIntent) return "Collector intent is required.";
  if (!payload.purchasePurpose) return "Placement purpose is required.";
  return null;
}

export async function POST(request: Request) {
  try {
    const rawPayload = (await request.json()) as AcquisitionPayload;
    const payload = normalizePayload(rawPayload);
    const validationError = validatePayload(payload);

    if (validationError) {
      return jsonResponse({ success: false, error: validationError }, 400);
    }

    const compiledNote = [
      `Collector intent: ${payload.collectorIntent}`,
      `Placement purpose: ${payload.purchasePurpose}`,
      payload.destinationRegion
        ? `Destination region: ${payload.destinationRegion}`
        : null,
      payload.note ? `House note: ${payload.note}` : null,
    ]
      .filter(Boolean)
      .join("\n");

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
      note: compiledNote,
      sourceRoute: payload.sourceRoute,
      lifecycleStage: "lead",
      serviceMessage: SERVICE_MESSAGE,
    });

    return jsonResponse({ success: true, ...result }, 200);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Private acquisition intake failed.";

    return jsonResponse({ success: false, error: message }, 500);
  }
}
