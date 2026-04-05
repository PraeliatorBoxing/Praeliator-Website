import {
  buildClearedGrantCookie,
  getPresentationState,
  getPrivateAcquisitionSessionByToken,
  getSessionTokenFromUrl,
  hasValidAccessGrant,
  ensureStripePaymentState,
  jsonResponse,
  serializeAcquisitionSession,
} from "./_lib/private-acquisition.js";

export async function GET(request: Request) {
  try {
    const token = getSessionTokenFromUrl(request);
    if (!token) {
      return jsonResponse(
        { success: false, state: "invalid_token", error: "Session token missing." },
        400,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    let session = await getPrivateAcquisitionSessionByToken(token);
    if (!session) {
      return jsonResponse(
        { success: false, state: "invalid_token", error: "Session not found." },
        404,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    session = await ensureStripePaymentState(session);
    const state = getPresentationState(session);

    if (state === "paid") {
      return jsonResponse({
        success: true,
        state: "paid",
        session: serializeAcquisitionSession(session),
      }, 200, {
        "Set-Cookie": buildClearedGrantCookie(request),
      });
    }

    if (state === "revoked") {
      return jsonResponse(
        { success: true, state: "revoked" },
        200,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    if (state === "expired") {
      return jsonResponse(
        { success: true, state: "expired" },
        200,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    if (!hasValidAccessGrant(session, request)) {
      return jsonResponse(
        {
          success: true,
          state: "access_required",
          expiresAt: session.expires_at,
        },
        200,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    return jsonResponse({
      success: true,
      state: "unlocked",
      session: serializeAcquisitionSession(session),
      paymentIntentCreated: Boolean(session.stripe_payment_intent_id),
      paymentStatus: session.stripe_payment_intent_status || null,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to load the private acquisition session.";

    return jsonResponse({ success: false, state: "error", error: message }, 500, {
      "Set-Cookie": buildClearedGrantCookie(request),
    });
  }
}
