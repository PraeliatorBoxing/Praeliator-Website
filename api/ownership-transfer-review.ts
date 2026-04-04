import {
  jsonResponse,
  persistPrivateInquiry,
} from "./_lib/private-inquiry";

type TransferReviewPayload = {
  currentOwnerName?: string;
  currentOwnerEmail?: string;
  recordReference?: string;
  pairId?: string;
  pairSerial?: string;
  deliveryConfirmedAt?: string;
  nextCustodianName?: string;
  nextCustodianEmail?: string;
  intendedTiming?: string;
  note?: string;
  sourceRoute?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SERVICE_MESSAGE =
  "The transfer review has entered private record and now awaits house review.";

function normalizePayload(raw: TransferReviewPayload) {
  return {
    currentOwnerName: (raw.currentOwnerName || "").trim(),
    currentOwnerEmail: (raw.currentOwnerEmail || "").trim().toLowerCase(),
    recordReference: (raw.recordReference || "").trim(),
    pairId: (raw.pairId || "").trim(),
    pairSerial: (raw.pairSerial || "").trim().toUpperCase(),
    deliveryConfirmedAt: (raw.deliveryConfirmedAt || "").trim(),
    nextCustodianName: (raw.nextCustodianName || "").trim(),
    nextCustodianEmail: (raw.nextCustodianEmail || "").trim().toLowerCase(),
    intendedTiming: (raw.intendedTiming || "").trim(),
    note: (raw.note || "").trim(),
    sourceRoute: (raw.sourceRoute || "/ownership-record").trim(),
  };
}

function validatePayload(payload: ReturnType<typeof normalizePayload>) {
  if (!payload.currentOwnerName) return "Current owner name is required.";
  if (!payload.currentOwnerEmail || !EMAIL_PATTERN.test(payload.currentOwnerEmail)) {
    return "A valid current owner email is required.";
  }
  if (!payload.recordReference) return "Ownership reference is required.";
  if (!payload.pairSerial) return "Pair serial is required.";
  if (!payload.nextCustodianName) return "Next custodian is required.";
  if (payload.nextCustodianEmail && !EMAIL_PATTERN.test(payload.nextCustodianEmail)) {
    return "Enter a valid next-custodian email or leave it blank.";
  }
  if (!payload.intendedTiming) return "Intended timing is required.";
  return null;
}

export async function POST(request: Request) {
  try {
    const rawPayload = (await request.json()) as TransferReviewPayload;
    const payload = normalizePayload(rawPayload);
    const validationError = validatePayload(payload);

    if (validationError) {
      return jsonResponse({ success: false, error: validationError }, 400);
    }

    const compiledNote = [
      `Ownership reference: ${payload.recordReference}`,
      `Pair id: ${payload.pairId || "Not supplied"}`,
      `Pair serial: ${payload.pairSerial}`,
      payload.deliveryConfirmedAt
        ? `Recorded delivery: ${payload.deliveryConfirmedAt}`
        : null,
      `Next custodian: ${payload.nextCustodianName}`,
      `Next custodian email: ${
        payload.nextCustodianEmail || "Not yet supplied"
      }`,
      `Intended timing: ${payload.intendedTiming}`,
      payload.note ? `Continuity note: ${payload.note}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const result = await persistPrivateInquiry({
      fullName: payload.currentOwnerName,
      email: payload.currentOwnerEmail,
      phoneCountryCode: "+00",
      phoneNumber: "0000000",
      fullPhone: "Private ownership review",
      country: "Ownership record",
      interest: `Ownership transfer review / ${payload.pairSerial}`,
      timeline: payload.intendedTiming,
      contactPreference: "Email",
      note: compiledNote,
      sourceRoute: `${payload.sourceRoute}/transfer-review`,
      lifecycleStage: "ownership_review",
      serviceMessage: SERVICE_MESSAGE,
      syncCrm: false,
      updateClientRecord: false,
    });

    return jsonResponse({ success: true, ...result }, 200);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Transfer review failed.";

    return jsonResponse({ success: false, error: message }, 500);
  }
}
