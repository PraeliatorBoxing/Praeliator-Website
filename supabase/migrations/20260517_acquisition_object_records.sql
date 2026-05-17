create table if not exists public.acquisition_object_records (
  id uuid primary key default gen_random_uuid(),
  private_acquisition_session_id uuid not null unique references public.private_acquisition_sessions(id) on delete restrict,
  sale_id uuid unique references public.sales_registry(id) on delete set null,
  object_reference text not null unique,
  serial_number text not null unique,
  product_name text not null,
  client_name text,
  client_email text,
  status text not null default 'paid_recorded' check (
    status in ('paid_recorded', 'preparing', 'delivery_recorded', 'archived')
  ),
  destination_snapshot jsonb not null default '{}'::jsonb,
  product_snapshot jsonb not null default '{}'::jsonb,
  order_snapshot jsonb not null default '{}'::jsonb,
  personalization_snapshot jsonb not null default '{}'::jsonb,
  paid_at timestamptz,
  delivery_recorded_at timestamptz,
  delivery_reference text,
  delivery_note text,
  delivery_recorded_by text,
  legacy_refresh_eligible_on timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists acquisition_object_records_client_email_idx
  on public.acquisition_object_records (client_email);

create index if not exists acquisition_object_records_delivery_idx
  on public.acquisition_object_records (delivery_recorded_at desc);

alter table public.acquisition_object_records enable row level security;

drop policy if exists acquisition_object_records_owner_select
  on public.acquisition_object_records;

create policy acquisition_object_records_owner_select
  on public.acquisition_object_records
  for select
  to authenticated
  using (
    lower(client_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
