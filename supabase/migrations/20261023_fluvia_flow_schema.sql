-- ==============================================================================
-- FLUVIA FLOW — SUPABASE POSTGRESQL PRODUCTION SCHEMA & ROW LEVEL SECURITY
-- Migration: 20261023_fluvia_flow_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. USER PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  role text not null default 'creator' check (role in ('creator', 'admin', 'enterprise')),
  auth_provider text not null default 'email',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for speedy email lookups
create index if not exists idx_profiles_email on public.profiles(lower(email));

-- 3. WORKSPACES & MEMBERS TABLE
create table if not exists public.workspaces (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id text not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index if not exists idx_workspace_members_user on public.workspace_members(user_id);

-- 4. CREDIT ACCOUNTS & CREDIT LEDGER (STRICT SERVER-CONTROLLED)
create table if not exists public.credit_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  available_balance integer not null default 100 check (available_balance >= 0),
  reserved_balance integer not null default 0 check (reserved_balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_ledger (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_type text not null,
  amount integer not null,
  balance_after integer not null,
  idempotency_key text unique,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_credit_ledger_user on public.credit_ledger(user_id, created_at desc);

-- 5. CREATIVE PROJECTS TABLE
create table if not exists public.projects (
  id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  workspace_id text references public.workspaces(id) on delete set null,
  title text not null default 'Untitled Masterpiece',
  aspect_ratio text not null default '16:9',
  status text not null default 'draft',
  tracks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_owner on public.projects(owner_id, updated_at desc);

-- 6. GENERATION JOBS TABLE
create table if not exists public.generation_jobs (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null check (mode in ('video', 'image', 'audio', 'avatar', 'storyboard')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  prompt text,
  output_urls jsonb not null default '[]'::jsonb,
  credits_used integer not null default 0,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_generation_jobs_user on public.generation_jobs(user_id, created_at desc);

-- 7. SUBSCRIPTIONS TABLE
create table if not exists public.subscriptions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,
  status text not null default 'active' check (status in ('active', 'past_due', 'cancelled', 'expired')),
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  billing_interval text not null default 'monthly' check (billing_interval in ('monthly', 'annual')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_subscriptions_user on public.subscriptions(user_id);

-- 8. PAYU PAYMENT ORDERS TABLE
create table if not exists public.payu_orders (
  id text primary key,
  txnid text unique not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_type text not null,
  product_id text not null,
  base_amount numeric(10,2) not null,
  tax_amount numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null,
  currency text not null default 'INR',
  status text not null default 'created' check (status in ('created', 'pending', 'success', 'failed', 'cancelled')),
  payu_mihpayid text,
  payu_bank_ref_num text,
  coupon_code text,
  discount_amount numeric(10,2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payu_orders_user on public.payu_orders(user_id, created_at desc);
create index if not exists idx_payu_orders_txnid on public.payu_orders(txnid);

-- ==============================================================================
-- AUTOMATIC SIGNUP TRIGGER (Provisions Profile, Workspace & 100 Free Credits)
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  clean_name text;
  new_ws_id text;
  new_ledger_id text;
begin
  -- Resolve display name from metadata or email username
  clean_name := coalesce(
    new.raw_user_meta_data->>'displayName',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  new_ws_id := 'ws_' || substr(md5(random()::text), 1, 8);
  new_ledger_id := 'cld_' || substr(md5(random()::text), 1, 10);

  -- 1. Insert Profile
  insert into public.profiles (id, email, display_name, avatar_url, role, auth_provider)
  values (
    new.id,
    lower(new.email),
    clean_name,
    new.raw_user_meta_data->>'avatar_url',
    'creator',
    coalesce(new.raw_app_meta_data->>'provider', 'email')
  )
  on conflict (id) do nothing;

  -- 2. Insert Personal Workspace
  insert into public.workspaces (id, owner_id, name)
  values (new_ws_id, new.id, clean_name || '''s Studio')
  on conflict (id) do nothing;

  -- 3. Insert Workspace Owner Member
  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_ws_id, new.id, 'owner')
  on conflict do nothing;

  -- 4. Insert 100 Welcome Credits Account
  insert into public.credit_accounts (user_id, available_balance, reserved_balance)
  values (new.id, 100, 0)
  on conflict (user_id) do nothing;

  -- 5. Record Welcome Grant in Ledger
  insert into public.credit_ledger (id, user_id, transaction_type, amount, balance_after, idempotency_key, metadata)
  values (
    new_ledger_id,
    new.id,
    'signup_bonus',
    100,
    100,
    'signup_bonus_' || new.id::text,
    jsonb_build_object('note', 'Fluvia Flow welcome bonus')
  )
  on conflict (idempotency_key) do nothing;

  return new;
end;
$$;

-- Drop existing trigger if present to ensure clean rebuild
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all tables
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.credit_accounts enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.projects enable row level security;
alter table public.generation_jobs enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payu_orders enable row level security;

-- PROFILES POLICIES
-- Users can view their own profile (or public profiles for creators)
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update only display_name and avatar_url (cannot escalate role!)
create policy "Users can update own display profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- WORKSPACES POLICIES
create policy "Members can view their workspaces"
  on public.workspaces for select
  using (
    auth.uid() = owner_id or
    exists (
      select 1 from public.workspace_members
      where workspace_members.workspace_id = workspaces.id
      and workspace_members.user_id = auth.uid()
    )
  );

create policy "Owners can update their workspaces"
  on public.workspaces for update
  using (auth.uid() = owner_id);

-- WORKSPACE MEMBERS POLICIES
create policy "Users can view workspace memberships"
  on public.workspace_members for select
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.workspaces
      where workspaces.id = workspace_members.workspace_id
      and workspaces.owner_id = auth.uid()
    )
  );

-- CREDIT ACCOUNTS POLICIES (STRICT READ-ONLY FOR CLIENTS)
-- Users can read their own balance. NO client-side insert/update/delete allowed!
create policy "Users can read own credit balance"
  on public.credit_accounts for select
  using (auth.uid() = user_id);

-- CREDIT LEDGER POLICIES (STRICT READ-ONLY FOR CLIENTS)
create policy "Users can read own credit ledger"
  on public.credit_ledger for select
  using (auth.uid() = user_id);

-- PROJECTS POLICIES
create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = owner_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = owner_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = owner_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = owner_id);

-- GENERATION JOBS POLICIES
create policy "Users can view own generation jobs"
  on public.generation_jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own generation jobs"
  on public.generation_jobs for insert
  with check (auth.uid() = user_id);

-- SUBSCRIPTIONS POLICIES (READ-ONLY FOR CLIENTS)
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- PAYU ORDERS POLICIES (READ-ONLY FOR CLIENTS)
create policy "Users can view own payment orders"
  on public.payu_orders for select
  using (auth.uid() = user_id);

-- ==============================================================================
-- END OF MIGRATION
-- ==============================================================================
