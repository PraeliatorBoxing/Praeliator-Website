import {
  buildClearedGrantCookie,
  buildGrantCookie,
  clearFailedAccessState,
  ensureStripePaymentState,
  getPresentationState,
  getPrivateAcquisitionSessionByToken,
  isLockedOut,
  issueAccessGrant,
  jsonResponse,
  matchesReferenceCode,
  recordFailedAccessAttempt,
  serializeAcquisitionSession,
} from "./_lib/private-acquisition.js";

type AccessPayload = {
  token?: string;
  referenceCode?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AccessPayload;
    const token = (body.token || "").trim();
    const referenceCode = (body.referenceCode || "").trim();

    if (!token || !referenceCode) {
      return jsonResponse(
        {
          success: false,
          state: "invalid_request",
          error: "Token and reference code are required.",
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
        { success: false, state: "invalid_token", error: "Session not found." },
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

    if (isLockedOut(session)) {
      return jsonResponse(
        {
          success: false,
          state: "locked",
          error:
            "Reference access is temporarily paused after repeated invalid attempts. Please wait and try again.",
          lockedUntil: session.locked_until,
        },
        429,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    if (!matchesReferenceCode(session, referenceCode)) {
      const failure = await recordFailedAccessAttempt(session);

      return jsonResponse(
        {
          success: false,
          state: failure.lockedUntil ? "locked" : "invalid_reference",
          error: failure.lockedUntil
            ? "Reference access is temporarily paused after repeated invalid attempts. Please wait and try again."
            : "The reference could not be verified for this issuance.",
          lockedUntil: failure.lockedUntil,
        },
        failure.lockedUntil ? 429 : 403,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    await clearFailedAccessState(session.id);
    const { grantToken, grantExpiresAt } = await issueAccessGrant(session);
    const refreshedSession = await getPrivateAcquisitionSessionByToken(token);

    return jsonResponse(
      {
        success: true,
        state: "unlocked",
        session: serializeAcquisitionSession(refreshedSession),
      },
      200,
      {
        "Set-Cookie": buildGrantCookie(request, grantToken, grantExpiresAt),
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to verify the private acquisition reference.";

    return jsonResponse(
      { success: false, state: "error", error: message },
      500,
      {
        "Set-Cookie": buildClearedGrantCookie(request),
      },
    );
  }
}
