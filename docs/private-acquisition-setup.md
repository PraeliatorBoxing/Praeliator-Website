# Private Acquisition Setup

## What this adds

- A hidden `private-acquisition` route that is not linked from public navigation
- Server-validated acquisition sessions with:
  - tokenized URL access
  - reference-code verification
  - expiration
  - revocation
  - single-use closure after successful payment
- On-site Stripe payment via Payment Element
- Webhook-based payment confirmation
- An internal issuer script for creating or revoking sessions

## Required environment variables

### Existing Supabase variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### New private acquisition variables

- `PRIVATE_ACQUISITION_HASH_SECRET`
  - Long random secret used to hash session tokens, reference codes, and temporary access grants.
- `PRIVATE_ACQUISITION_BASE_URL`
  - Public site origin used when issuing private URLs.
  - Example: `https://praeliator.com`

### New Stripe variables

- `STRIPE_SECRET_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Database migration

Run the SQL in:

- [supabase/migrations/20260404_private_acquisition_sessions.sql](C:\Users\patoz\OneDrive\Escritorio\Webpage\supabase\migrations\20260404_private_acquisition_sessions.sql)

This creates `private_acquisition_sessions` with:

- hashed token storage
- reference-code storage and verification hash
- product and order snapshots
- lifecycle status fields
- guardrail fields for invalid access attempts
- Stripe payment intent linkage

RLS is enabled and no client-facing policies are added, so browser clients do not get direct table access.

## Create a private acquisition session

Example:

```bash
npm run private-acquisition:create -- \
  --product-name "Praeliator VIS" \
  --client-name "Client Name" \
  --client-email "client@example.com" \
  --subtotal 6000 \
  --shipping 0 \
  --currency mxn \
  --quantity 1 \
  --shipping-country "Mexico" \
  --shipping-region "Monterrey" \
  --expires-in-hours 72 \
  --created-by "Praeliator" \
  --spec "Format=16 oz lace-up" \
  --spec "Material=Top-grain cowhide"
```

The script prints:

- `Reference code`
- `Private URL`
- `Expires at`
- `Product`
- `Quantity`
- `Total`

Amounts are entered in major currency units in the script and stored in minor units in the database.

## Revoke a session

```bash
npm run private-acquisition:revoke -- --reference-code PRA-VIS-7K4M9Q --note "Manual revocation"
```

If the related Stripe PaymentIntent is still cancellable, the revocation flow attempts to cancel it as well.

## Payment flow

1. Praeliator issues a session internally.
2. The client opens the tokenized private URL.
3. The page remains locked until the issued reference code is entered.
4. The server verifies:
   - token
   - reference code
   - expiration
   - session status
   - lockout state
5. The server issues a short-lived private access grant cookie.
6. The client can then open the on-site payment chamber.
7. The server creates or reuses a Stripe PaymentIntent.
8. Stripe Payment Element renders inside the Praeliator page.
9. On success:
   - webhook marks the session `paid`
   - access grant is cleared
   - the session becomes unusable for another purchase

## API routes added

- [api/private-acquisition-state.ts](C:\Users\patoz\OneDrive\Escritorio\Webpage\api\private-acquisition-state.ts)
- [api/private-acquisition-access.ts](C:\Users\patoz\OneDrive\Escritorio\Webpage\api\private-acquisition-access.ts)
- [api/private-acquisition-payment-intent.ts](C:\Users\patoz\OneDrive\Escritorio\Webpage\api\private-acquisition-payment-intent.ts)
- [api/stripe-webhook.ts](C:\Users\patoz\OneDrive\Escritorio\Webpage\api\stripe-webhook.ts)

## Security model

- The URL token is long, random, and never stored in plaintext.
- The reference code is required in addition to the token.
- Validation is server-side only.
- Access to payment creation requires a valid short-lived grant cookie.
- Expired, revoked, and paid sessions are blocked server-side.
- Repeated invalid reference attempts temporarily lock the session.
- Successful payment closes the session and prevents reuse.
