create extension if not exists "pgcrypto";

do $$
begin
  create type public.user_role as enum ('customer', 'owner');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.supplier_status as enum (
    'discovered',
    'qualified',
    'contacted',
    'responded',
    'sampling',
    'negotiation',
    'approved',
    'onboarded'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  role public.user_role not null default 'customer',
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price_cents integer not null,
  interval text not null,
  stripe_price_id text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  stripe_subscription_id text unique not null,
  plan_id uuid references public.plans,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  stripe_payment_intent_id text unique not null,
  amount_cents integer not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text,
  region text,
  website text,
  instagram text,
  email text,
  notes text,
  lead_score integer default 0,
  moq integer,
  status public.supplier_status not null default 'discovered',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_contacts (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers on delete cascade,
  name text not null,
  email text,
  role text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.outreach_messages (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers on delete cascade,
  subject text,
  body text,
  channel text not null default 'email',
  status text not null default 'draft',
  sent_at timestamptz,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers on delete cascade,
  title text not null,
  due_at timestamptz,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger set_plans_updated_at
before update on public.plans
for each row execute procedure public.set_updated_at();

create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute procedure public.set_updated_at();

create trigger set_suppliers_updated_at
before update on public.suppliers
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

grant execute on function public.is_owner() to anon, authenticated;

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.orders enable row level security;
alter table public.suppliers enable row level security;
alter table public.supplier_contacts enable row level security;
alter table public.outreach_messages enable row level security;
alter table public.tasks enable row level security;

create policy "Profiles view own or owner"
on public.profiles
for select
using (auth.uid() = id or public.is_owner());

create policy "Profiles update own or owner"
on public.profiles
for update
using (auth.uid() = id or public.is_owner())
with check ((auth.uid() = id and role = 'customer') or public.is_owner());

create policy "Profiles insert own"
on public.profiles
for insert
with check ((auth.uid() = id and role = 'customer') or public.is_owner());

create policy "Plans are viewable"
on public.plans
for select
using (true);

create policy "Plans managed by owner"
on public.plans
for insert
with check (public.is_owner());

create policy "Plans updated by owner"
on public.plans
for update
using (public.is_owner())
with check (public.is_owner());

create policy "Plans deleted by owner"
on public.plans
for delete
using (public.is_owner());

create policy "Subscriptions view own"
on public.subscriptions
for select
using (auth.uid() = user_id or public.is_owner());

create policy "Subscriptions managed by owner"
on public.subscriptions
for insert
with check (public.is_owner());

create policy "Subscriptions updated by owner"
on public.subscriptions
for update
using (public.is_owner())
with check (public.is_owner());

create policy "Orders view own"
on public.orders
for select
using (auth.uid() = user_id or public.is_owner());

create policy "Orders managed by owner"
on public.orders
for insert
with check (public.is_owner());

create policy "Orders updated by owner"
on public.orders
for update
using (public.is_owner())
with check (public.is_owner());

create policy "Suppliers owner only"
on public.suppliers
for all
using (public.is_owner())
with check (public.is_owner());

create policy "Supplier contacts owner only"
on public.supplier_contacts
for all
using (public.is_owner())
with check (public.is_owner());

create policy "Outreach messages owner only"
on public.outreach_messages
for all
using (public.is_owner())
with check (public.is_owner());

create policy "Tasks owner only"
on public.tasks
for all
using (public.is_owner())
with check (public.is_owner());

create index if not exists idx_subscriptions_user_id on public.subscriptions (user_id);
create index if not exists idx_orders_user_id on public.orders (user_id);
create index if not exists idx_suppliers_status on public.suppliers (status);
create index if not exists idx_suppliers_created_at on public.suppliers (created_at);
create index if not exists idx_outreach_supplier_id on public.outreach_messages (supplier_id);
create index if not exists idx_tasks_supplier_id on public.tasks (supplier_id);
