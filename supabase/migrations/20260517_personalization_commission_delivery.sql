alter table public.acquisition_object_records
  add column if not exists personalization_snapshot jsonb not null default '{}'::jsonb,
  add column if not exists delivery_reference text,
  add column if not exists delivery_note text,
  add column if not exists delivery_recorded_by text;

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

create table if not exists public.private_commission_requests (
  id uuid primary key default gen_random_uuid(),
  request_reference text not null unique,
  full_name text not null,
  email text not null,
  phone text,
  country text,
  commission_purpose text,
  direction text not null,
  timeline text,
  budget_range text,
  monogram_initials text,
  note text,
  source_route text,
  locale text,
  status text not null default 'received' check (
    status in ('received', 'under_review', 'accepted', 'declined', 'quoted', 'archived')
  ),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists private_commission_requests_created_idx
  on public.private_commission_requests (created_at desc);

create index if not exists private_commission_requests_email_idx
  on public.private_commission_requests (email);

alter table public.private_commission_requests enable row level security;
