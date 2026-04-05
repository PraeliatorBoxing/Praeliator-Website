import {
  buildClearedGrantCookie,
  ensureStripePaymentState,
  getPresentationState,
  getPrivateAcquisitionSessionByToken,
  hasValidAccessGrant,
  jsonResponse,
  saveDeliveryDetails,
  serializeAcquisitionSession,
  validateDeliveryDetailsInput,
} from "./_lib/private-acquisition.js";

type DeliveryPayload = {
  token?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  shippingCountry?: string;
  shippingRegion?: string;
  shippingCity?: string;
  shippingPostalCode?: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingRecipientName?: string;
  shippingDeliveryNotes?: string;
  confirmDetails?: boolean;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DeliveryPayload;
    const token = (body.token || "").trim();

    if (!token) {
      return jsonResponse(
        {
          success: false,
          state: "invalid_request",
          error: "Session token missing.",
        },
        400,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    let session = await getPrivateAcquisitionSessionByToken(token);
    if (!session) {
      return jsonResponse(
        {
          success: false,
          state: "invalid_token",
          error: "Session not found.",
        },
        404,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    session = await ensureStripePaymentState(session);
    const presentationState = getPresentationState(session);

    if (presentationState === "paid") {
      return jsonResponse(
        {
          success: true,
          state: "paid",
          session: serializeAcquisitionSession(session),
        },
        200,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    if (presentationState === "revoked") {
      return jsonResponse(
        {
          success: false,
          state: "revoked",
          error: "This issuance is no longer active.",
        },
        403,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    if (presentationState === "expired") {
      return jsonResponse(
        {
          success: false,
          state: "expired",
          error: "The validity window for this issuance has closed.",
        },
        410,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    if (!hasValidAccessGrant(session, request)) {
      return jsonResponse(
        {
          success: false,
          state: "access_required",
          error:
            "Reference verification is required before destination details can be retained.",
        },
        403,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    const { fieldErrors } = validateDeliveryDetailsInput(body);

    if (Object.keys(fieldErrors).length > 0) {
      return jsonResponse(
        {
          success: false,
          state: "invalid_delivery",
          error:
            "The destination record must be completed in full before payment can proceed.",
          fieldErrors,
        },
        400,
      );
    }

    const updatedSession = await saveDeliveryDetails(session, body);

    return jsonResponse({
      success: true,
      state: "delivery_saved",
      session: serializeAcquisitionSession(updatedSession),
    });
  } catch (error) {
    const rawMessage =
      error instanceof Error
        ? error.message
        : "The destination record could not be retained.";

    const message = /json|unexpected token|doctype|<html/i.test(rawMessage)
      ? "The destination record could not be confirmed just now. Please try again."
      : rawMessage;

    return jsonResponse(
      { success: false, state: "error", error: message },
      500,
    );
  }
}
