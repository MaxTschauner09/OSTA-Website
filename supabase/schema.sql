-- OSTA KI-Services — Phase 1 schema (accounts, subscriptions, analytics)
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query).

-- ---------- profiles ----------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- security-definer helper so admin checks don't recurse into RLS on profiles itself
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- subscriptions ----------

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null,
  stripe_subscription_id text,
  stripe_customer_id text,
  status text not null default 'inactive' check (status in ('inactive', 'active', 'past_due', 'canceled')),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Admins can view all subscriptions"
  on public.subscriptions for select
  using (public.is_admin());

create policy "Admins can update subscriptions"
  on public.subscriptions for update
  using (public.is_admin());

-- Note: no client-side insert policy yet — subscription rows will be created
-- later by the Stripe webhook handler using the service_role key, which
-- bypasses RLS entirely.

-- ---------- page_views (privacy-friendly analytics) ----------

create table public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  session_id text not null,
  created_at timestamptz not null default now()
);

alter table public.page_views enable row level security;

create policy "Anyone can log a page view"
  on public.page_views for insert
  with check (true);

create policy "Admins can read page views"
  on public.page_views for select
  using (public.is_admin());

-- ---------- make yourself an admin ----------
-- 1. Register a normal account on the website first (registrieren.html)
-- 2. Then run this, replacing the email:
--
-- update public.profiles set role = 'admin' where email = 'deine@email.de';
