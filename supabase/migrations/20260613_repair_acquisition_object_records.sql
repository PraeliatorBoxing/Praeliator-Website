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

alter table public.acquisition_object_records
  add column if not exists personalization_snapshot jsonb not null default '{}'::jsonb,
  add column if not exists delivery_reference text,
  add column if not exists delivery_note text,
  add column if not exists delivery_recorded_by text;

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

create table if not exists public.legacy_refresh_object_requests (
  id uuid primary key default gen_random_uuid(),
  object_record_id uuid not null references public.acquisition_object_records(id) on delete cascade,
  owner_user_id uuid not null,
  owner_email text not null,
  status text not null default 'pending_review' check (
    status in ('pending_review', 'under_review', 'approved', 'declined', 'completed', 'withdrawn')
  ),
  note text,
  requested_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists legacy_refresh_object_requests_owner_idx
  on public.legacy_refresh_object_requests (owner_user_id, requested_at desc);

create index if not exists legacy_refresh_object_requests_object_idx
  on public.legacy_refresh_object_requests (object_record_id, requested_at desc);

create unique index if not exists legacy_refresh_object_requests_active_unique_idx
  on public.legacy_refresh_object_requests (object_record_id, owner_user_id)
  where status in ('pending_review', 'under_review', 'approved');

alter table public.legacy_refresh_object_requests enable row level security;

drop policy if exists legacy_refresh_object_requests_owner_select
  on public.legacy_refresh_object_requests;

create policy legacy_refresh_object_requests_owner_select
  on public.legacy_refresh_object_requests
  for select
  to authenticated
  using (
    owner_user_id = auth.uid()
    and lower(owner_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and exists (
      select 1
      from public.acquisition_object_records records
      where records.id = legacy_refresh_object_requests.object_record_id
        and lower(records.client_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

drop policy if exists legacy_refresh_object_requests_owner_insert
  on public.legacy_refresh_object_requests;

create policy legacy_refresh_object_requests_owner_insert
  on public.legacy_refresh_object_requests
  for insert
  to authenticated
  with check (
    owner_user_id = auth.uid()
    and lower(owner_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and exists (
      select 1
      from public.acquisition_object_records records
      where records.id = legacy_refresh_object_requests.object_record_id
        and lower(records.client_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

select pg_notify('pgrst', 'reload schema');
