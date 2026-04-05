create extension if not exists pgcrypto;

create table if not exists public.private_acquisition_sessions (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  reference_code text not null unique,
  reference_code_hash text not null unique,
  client_name text,
  client_email text,
  client_phone text,
  product_name text not null,
  product_snapshot jsonb not null default '{}'::jsonb,
  order_snapshot jsonb not null default '{}'::jsonb,
  quantity integer not null default 1 check (quantity > 0),
  currency text not null check (char_length(currency) between 3 and 8),
  subtotal_amount integer not null check (subtotal_amount >= 0),
  shipping_amount integer not null default 0 check (shipping_amount >= 0),
  total_amount integer not null check (total_amount >= 0),
  shipping_country text,
  shipping_region text,
  status text not null default 'issued' check (
    status in ('issued', 'validated', 'paid', 'expired', 'revoked')
  ),
  expires_at timestamptz not null,
  validated_at timestamptz,
  paid_at timestamptz,
  revoked_at timestamptz,
  locked_until timestamptz,
  failed_access_attempts integer not null default 0 check (failed_access_attempts >= 0),
  last_failed_access_at timestamptz,
  access_grant_hash text,
  access_grant_expires_at timestamptz,
  stripe_payment_intent_id text unique,
  stripe_payment_intent_status text,
  stripe_last_payment_error text,
  note text,
  created_by text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists private_acquisition_sessions_status_expires_idx
  on public.private_acquisition_sessions (status, expires_at desc);

create index if not exists private_acquisition_sessions_client_email_idx
  on public.private_acquisition_sessions (client_email);

alter table public.private_acquisition_sessions enable row level security;
