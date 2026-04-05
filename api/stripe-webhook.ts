import {
  createStripeServerClient,
  handleStripePaymentEvent,
  jsonResponse,
} from "./_lib/private-acquisition.js";

function requireWebhookSecret() {
  const value = process.env.STRIPE_WEBHOOK_SECRET;
  if (!value) {
    throw new Error("Missing environment variable: STRIPE_WEBHOOK_SECRET");
  }
  return value;
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return jsonResponse({ error: "Missing Stripe signature." }, 400);
    }

    const payload = await request.text();
    const stripe = createStripeServerClient();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      requireWebhookSecret(),
    );

    await handleStripePaymentEvent(event);
    return jsonResponse({ received: true }, 200);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook verification failed.";

    return jsonResponse({ error: message }, 400);
  }
}
