-- Spendwise base schema migration
set check_function_bodies = off;

create extension if not exists "pgcrypto";

create type public.goal_status as enum (
  'not_started',
  'in_progress',
  'ahead',
  'needs_attention',
  'completed',
  'cancelled'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  currency_code char(3) not null default 'USD',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_currency_code_length check (char_length(currency_code) = 3)
);

create trigger set_public_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table public.expense_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  icon text,
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint expense_categories_scope check (
    (is_default and user_id is null) or (not is_default and user_id is not null)
  )
);

create unique index expense_categories_user_name_idx
  on public.expense_categories (user_id, lower(name))
  nulls not distinct;

create trigger set_public_expense_categories_updated_at
before update on public.expense_categories
for each row execute function public.set_updated_at();

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.expense_categories(id) on delete set null,
  amount numeric(12, 2) not null check (amount > 0),
  currency_code char(3) not null default 'USD',
  merchant text,
  notes text,
  payment_method text,
  expense_date date not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint expenses_currency_code_length check (char_length(currency_code) = 3)
);

create index expenses_user_id_expense_date_idx
  on public.expenses (user_id, expense_date desc);

create index expenses_category_id_idx
  on public.expenses (category_id);

create trigger set_public_expenses_updated_at
before update on public.expenses
for each row execute function public.set_updated_at();

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  target_amount numeric(12, 2) not null check (target_amount > 0),
  target_date date,
  status public.goal_status not null default 'not_started',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index goals_user_name_idx
  on public.goals (user_id, lower(name));

create trigger set_public_goals_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

create table public.goal_updates (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  progress_amount numeric(12, 2) not null check (progress_amount >= 0),
  note text,
  progress_date date not null default current_date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint goal_updates_progress_date_future check (progress_date <= current_date)
);

create index goal_updates_goal_id_progress_date_idx
  on public.goal_updates (goal_id, progress_date desc);

create index goal_updates_user_id_idx
  on public.goal_updates (user_id);

create trigger set_public_goal_updates_updated_at
before update on public.goal_updates
for each row execute function public.set_updated_at();

-- Ensure goal_id and user_id pair exists for goal_updates
create unique index goals_id_user_id_unique
  on public.goals (id, user_id);

alter table public.goal_updates
  add constraint goal_updates_goal_user_fk
  foreign key (goal_id, user_id)
  references public.goals (id, user_id)
  on delete cascade;

create table public.monthly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  year int not null check (year >= 2000),
  month int not null check (month between 1 and 12),
  total_expenses numeric(14, 2) not null default 0,
  total_income numeric(14, 2) not null default 0,
  budget numeric(14, 2),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint monthly_summaries_budget_positive check (budget is null or budget >= 0)
);

create unique index monthly_summaries_user_year_month_uindex
  on public.monthly_summaries (user_id, year, month);

create trigger set_public_monthly_summaries_updated_at
before update on public.monthly_summaries
for each row execute function public.set_updated_at();

-- Enable row-level security and define policies
alter table public.profiles enable row level security;
alter table public.expense_categories enable row level security;
alter table public.expenses enable row level security;
alter table public.goals enable row level security;
alter table public.goal_updates enable row level security;
alter table public.monthly_summaries enable row level security;

create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id or auth.role() = 'service_role');

create policy "profiles_insert_update_own"
  on public.profiles
  for all
  using (auth.uid() = id or auth.role() = 'service_role')
  with check (auth.uid() = id or auth.role() = 'service_role');

create policy "expense_categories_select_scope"
  on public.expense_categories
  for select
  using (
    auth.role() = 'service_role'
    or user_id = auth.uid()
    or (user_id is null and is_default)
  );

create policy "expense_categories_ins_upd_del_own"
  on public.expense_categories
  for all
  using (auth.role() = 'service_role' or user_id = auth.uid())
  with check (auth.role() = 'service_role' or user_id = auth.uid());

create policy "expenses_select_own"
  on public.expenses
  for select
  using (auth.role() = 'service_role' or user_id = auth.uid());

create policy "expenses_ins_upd_del_own"
  on public.expenses
  for all
  using (auth.role() = 'service_role' or user_id = auth.uid())
  with check (auth.role() = 'service_role' or user_id = auth.uid());

create policy "goals_select_own"
  on public.goals
  for select
  using (auth.role() = 'service_role' or user_id = auth.uid());

create policy "goals_ins_upd_del_own"
  on public.goals
  for all
  using (auth.role() = 'service_role' or user_id = auth.uid())
  with check (auth.role() = 'service_role' or user_id = auth.uid());

create policy "goal_updates_select_own"
  on public.goal_updates
  for select
  using (auth.role() = 'service_role' or user_id = auth.uid());

create policy "goal_updates_ins_upd_del_own"
  on public.goal_updates
  for all
  using (auth.role() = 'service_role' or user_id = auth.uid())
  with check (auth.role() = 'service_role' or user_id = auth.uid());

create policy "monthly_summaries_select_own"
  on public.monthly_summaries
  for select
  using (auth.role() = 'service_role' or user_id = auth.uid());

create policy "monthly_summaries_ins_upd_del_own"
  on public.monthly_summaries
  for all
  using (auth.role() = 'service_role' or user_id = auth.uid())
  with check (auth.role() = 'service_role' or user_id = auth.uid());
