create table if not exists public.sales_registry (
  id uuid primary key default gen_random_uuid(),
  private_acquisition_session_id uuid not null unique references public.private_acquisition_sessions(id) on delete restrict,
  stripe_payment_intent_id text not null unique,
  stripe_charge_id text,
  sale_reference text not null,
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
  amount_received integer,
  shipping_country text,
  shipping_region text,
  shipping_city text,
  shipping_postal_code text,
  shipping_address_line1 text,
  shipping_address_line2 text,
  shipping_recipient_name text,
  shipping_delivery_notes text,
  fulfillment_status text not null default 'pending' check (
    fulfillment_status in ('pending', 'preparing', 'fulfilled', 'archived')
  ),
  paid_at timestamptz not null,
  last_notified_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists sales_registry_paid_at_idx
  on public.sales_registry (paid_at desc);

create index if not exists sales_registry_fulfillment_idx
  on public.sales_registry (fulfillment_status, paid_at desc);

create index if not exists sales_registry_client_email_idx
  on public.sales_registry (client_email);

create table if not exists public.house_ledger_notifications (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid references public.sales_registry(id) on delete cascade,
  kind text not null,
  event_key text not null unique,
  title text not null,
  body text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists house_ledger_notifications_created_idx
  on public.house_ledger_notifications (created_at desc);

create index if not exists house_ledger_notifications_read_idx
  on public.house_ledger_notifications (read_at, created_at desc);

create or replace function public.house_ledger_summary()
returns table (
  total_sales_count bigint,
  total_revenue bigint,
  today_sales_count bigint,
  today_revenue bigint,
  month_sales_count bigint,
  month_revenue bigint,
  pending_fulfillment_count bigint,
  unread_notifications_count bigint,
  last_paid_at timestamptz,
  reported_currency text,
  currency_count bigint
)
language sql
security definer
set search_path = public
as $$
  with sales as (
    select *
    from public.sales_registry
  ),
  notifications as (
    select *
    from public.house_ledger_notifications
  ),
  current_windows as (
    select
      timezone('utc', now()) as now_utc,
      date_trunc('day', timezone('utc', now())) as day_start_utc,
      date_trunc('month', timezone('utc', now())) as month_start_utc
  )
  select
    count(*)::bigint as total_sales_count,
    coalesce(sum(sales.total_amount), 0)::bigint as total_revenue,
    count(*) filter (where sales.paid_at >= current_windows.day_start_utc)::bigint as today_sales_count,
    coalesce(
      sum(sales.total_amount) filter (where sales.paid_at >= current_windows.day_start_utc),
      0
    )::bigint as today_revenue,
    count(*) filter (where sales.paid_at >= current_windows.month_start_utc)::bigint as month_sales_count,
    coalesce(
      sum(sales.total_amount) filter (where sales.paid_at >= current_windows.month_start_utc),
      0
    )::bigint as month_revenue,
    count(*) filter (where sales.fulfillment_status in ('pending', 'preparing'))::bigint as pending_fulfillment_count,
    (
      select count(*)::bigint
      from notifications
      where notifications.read_at is null
    ) as unread_notifications_count,
    max(sales.paid_at) as last_paid_at,
    min(sales.currency) as reported_currency,
    count(distinct sales.currency)::bigint as currency_count
  from sales
  cross join current_windows;
$$;

alter table public.sales_registry enable row level security;
alter table public.house_ledger_notifications enable row level security;
