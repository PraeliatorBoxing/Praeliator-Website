import {
  buildClearedGrantCookie,
  clearAccessGrant,
  createSupabaseAdmin,
  createStripeServerClient,
  ensureStripePaymentState,
  hasCompletedDeliveryDetails,
  getPresentationState,
  getPrivateAcquisitionSessionByToken,
  getStripePublishableKey,
  hasValidAccessGrant,
  jsonResponse,
  serializeAcquisitionSession,
} from "./_lib/private-acquisition.js";

type PaymentIntentPayload = {
  token?: string;
};

const REUSABLE_PAYMENT_STATUSES = new Set([
  "requires_payment_method",
  "requires_confirmation",
  "requires_action",
]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PaymentIntentPayload;
    const token = (body.token || "").trim();

    if (!token) {
      return jsonResponse(
        { success: false, state: "invalid_request", error: "Session token missing." },
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

    if (!hasValidAccessGrant(session, request)) {
      return jsonResponse(
        {
          success: false,
          state: "access_required",
          error: "Reference verification is required before payment can continue.",
        },
        403,
        {
          "Set-Cookie": buildClearedGrantCookie(request),
        },
      );
    }

    if (!hasCompletedDeliveryDetails(session)) {
      return jsonResponse(
        {
          success: false,
          state: "delivery_required",
          error:
            "The destination record must be completed before the payment chamber can open.",
        },
        403,
      );
    }

    const stripe = createStripeServerClient();
    let clientSecret = "";
    let paymentIntentId = session.stripe_payment_intent_id || "";
    let paymentIntentStatus = session.stripe_payment_intent_status || "";

    if (paymentIntentId) {
      const existingPaymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId,
      );

      if (existingPaymentIntent.status === "succeeded") {
        const refreshed = await ensureStripePaymentState(session);
        await clearAccessGrant(refreshed.id);
        return jsonResponse(
          {
            success: true,
            state: "paid",
            session: serializeAcquisitionSession(refreshed),
          },
          200,
          {
            "Set-Cookie": buildClearedGrantCookie(request),
          },
        );
      }

      if (existingPaymentIntent.status === "processing") {
        return jsonResponse(
          {
            success: false,
            state: "payment_processing",
            error:
              "Payment is already processing for this issuance. Please wait for confirmation before trying again.",
          },
          409,
        );
      }

      if (REUSABLE_PAYMENT_STATUSES.has(existingPaymentIntent.status)) {
        clientSecret = existingPaymentIntent.client_secret || "";
        paymentIntentStatus = existingPaymentIntent.status;
      } else {
        paymentIntentId = "";
      }
    }

    if (!clientSecret) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: session.total_amount,
        currency: session.currency,
        automatic_payment_methods: { enabled: true },
        receipt_email: session.client_email || undefined,
        description: `${session.product_name} / ${session.reference_code}`,
        metadata: {
          private_acquisition_session_id: session.id,
          private_acquisition_reference: session.reference_code,
          private_acquisition_product: session.product_name,
        },
      });

      clientSecret = paymentIntent.client_secret || "";
      paymentIntentId = paymentIntent.id;
      paymentIntentStatus = paymentIntent.status;
    }

    if (!clientSecret || !paymentIntentId) {
      return jsonResponse(
        {
          success: false,
          state: "payment_unavailable",
          error: "The payment chamber could not be prepared.",
        },
        500,
      );
    }

    const supabaseUpdate = await createSupabaseAdmin()
      .from("private_acquisition_sessions")
      .update({
        stripe_payment_intent_id: paymentIntentId,
        stripe_payment_intent_status: paymentIntentStatus,
        stripe_last_payment_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    if (supabaseUpdate.error) {
      throw supabaseUpdate.error;
    }

    return jsonResponse({
      success: true,
      state: "payment_ready",
      publishableKey: getStripePublishableKey(),
      clientSecret,
      session: serializeAcquisitionSession(session),
      paymentStatus: paymentIntentStatus,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to prepare the private payment chamber.";

    return jsonResponse(
      { success: false, state: "error", error: message },
      500,
      {
        "Set-Cookie": buildClearedGrantCookie(request),
      },
    );
  }
}
