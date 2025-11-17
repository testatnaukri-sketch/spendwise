-- Spendwise seed data for default categories and demo development dataset

-- Default expense categories shared across all users (readable via RLS)
insert into public.expense_categories (id, user_id, name, description, icon, is_default)
values
  ('11111111-1111-1111-1111-111111111101', null, 'Food & Dining', 'Restaurants, groceries, and food delivery', '🍔', true),
  ('11111111-1111-1111-1111-111111111102', null, 'Transportation', 'Gas, public transit, ride-sharing, parking', '🚗', true),
  ('11111111-1111-1111-1111-111111111103', null, 'Shopping', 'Clothing, electronics, and general retail', '🛍️', true),
  ('11111111-1111-1111-1111-111111111104', null, 'Entertainment', 'Movies, games, streaming services, events', '🎬', true),
  ('11111111-1111-1111-1111-111111111105', null, 'Bills & Utilities', 'Electricity, water, internet, phone bills', '📱', true),
  ('11111111-1111-1111-1111-111111111106', null, 'Healthcare', 'Medical expenses, prescriptions, insurance', '🏥', true),
  ('11111111-1111-1111-1111-111111111107', null, 'Housing', 'Rent, mortgage, home maintenance', '🏠', true),
  ('11111111-1111-1111-1111-111111111108', null, 'Education', 'Tuition, books, courses, learning materials', '📚', true),
  ('11111111-1111-1111-1111-111111111109', null, 'Travel', 'Flights, hotels, vacation expenses', '✈️', true),
  ('11111111-1111-1111-1111-111111111110', null, 'Personal Care', 'Haircuts, cosmetics, gym memberships', '💇', true),
  ('11111111-1111-1111-1111-111111111111', null, 'Subscriptions', 'Recurring digital and physical subscriptions', '📦', true),
  ('11111111-1111-1111-1111-111111111112', null, 'Gifts & Donations', 'Presents, charitable giving', '🎁', true),
  ('11111111-1111-1111-1111-111111111113', null, 'Pet Care', 'Pet food, vet, supplies', '🐾', true),
  ('11111111-1111-1111-1111-111111111114', null, 'Insurance', 'Life, auto, health insurance premiums', '🛡️', true),
  ('11111111-1111-1111-1111-111111111115', null, 'Other', 'Miscellaneous expenses', '📌', true)
on conflict (id) do nothing;

-- Demo account for local development (email/password: demo@spendwise.dev / Password123!)
insert into auth.users (
  instance_id,
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  'demo@spendwise.dev',
  crypt('Password123!', gen_salt('bf')),
  timezone('utc', now()),
  timezone('utc', now()),
  timezone('utc', now()),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  'authenticated',
  'authenticated',
  timezone('utc', now()),
  timezone('utc', now())
)
on conflict (id) do update
set
  email = excluded.email,
  updated_at = excluded.updated_at,
  raw_app_meta_data = excluded.raw_app_meta_data;

insert into auth.identities (
  id,
  provider,
  user_id,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  'email',
  '00000000-0000-0000-0000-000000000001',
  jsonb_build_object('sub', '00000000-0000-0000-0000-000000000001', 'email', 'demo@spendwise.dev'),
  timezone('utc', now()),
  timezone('utc', now()),
  timezone('utc', now())
)
on conflict (provider, user_id) do update
set
  identity_data = excluded.identity_data,
  updated_at = excluded.updated_at;

with demo_user as (
  select id, email
  from auth.users
  where id = '00000000-0000-0000-0000-000000000001'
)
insert into public.profiles (id, email, full_name, currency_code)
select
  du.id,
  du.email,
  'Demo User',
  'USD'
from demo_user du
on conflict (id) do update
set
  email = excluded.email,
  full_name = excluded.full_name,
  currency_code = excluded.currency_code;

with demo_user as (
  select id
  from auth.users
  where id = '00000000-0000-0000-0000-000000000001'
),
user_categories as (
  select *
  from (values
    ('22222222-2222-2222-2222-222222222221'::uuid, 'Fitness'::text, 'Gym memberships, workout classes, and equipment'::text, '💪'::text)
  ) as v(id, name, description, icon)
)
insert into public.expense_categories (id, user_id, name, description, icon, is_default)
select
  uc.id,
  du.id,
  uc.name,
  uc.description,
  uc.icon,
  false
from demo_user du
join user_categories uc on true
on conflict on constraint expense_categories_user_name_idx do update
set
  description = excluded.description,
  icon = excluded.icon;

with demo_user as (
  select id
  from auth.users
  where id = '00000000-0000-0000-0000-000000000001'
),
expense_rows as (
  select *
  from (values
    ('33333333-3333-3333-3333-333333333331'::uuid, '11111111-1111-1111-1111-111111111101'::uuid, 38.75::numeric, 'Local Bistro'::text, 'Lunch with a client'::text, -5::int, 'credit_card'::text),
    ('33333333-3333-3333-3333-333333333332'::uuid, '11111111-1111-1111-1111-111111111102'::uuid, 62.40::numeric, 'City Gas Station'::text, 'Weekly fuel fill-up'::text, -9::int, 'debit_card'::text),
    ('33333333-3333-3333-3333-333333333333'::uuid, '11111111-1111-1111-1111-111111111103'::uuid, 129.99::numeric, 'Gadget World'::text, 'Noise-cancelling headphones'::text, -14::int, 'credit_card'::text),
    ('33333333-3333-3333-3333-333333333334'::uuid, '11111111-1111-1111-1111-111111111107'::uuid, 1425.00::numeric, 'Downtown Apartments'::text, 'Monthly rent'::text, -20::int, 'bank_transfer'::text),
    ('33333333-3333-3333-3333-333333333335'::uuid, '22222222-2222-2222-2222-222222222221'::uuid, 55.00::numeric, 'FitLab'::text, 'Spin class drop-in'::text, -3::int, 'credit_card'::text)
  ) as v(id, category_id, amount, merchant, notes, day_offset, payment_method)
)
insert into public.expenses (id, user_id, category_id, amount, currency_code, merchant, notes, expense_date, payment_method)
select
  er.id,
  du.id,
  er.category_id,
  er.amount,
  'USD',
  er.merchant,
  er.notes,
  (current_date + er.day_offset)::date,
  er.payment_method
from demo_user du
join expense_rows er on true
on conflict (id) do update
set
  category_id = excluded.category_id,
  amount = excluded.amount,
  merchant = excluded.merchant,
  notes = excluded.notes,
  expense_date = excluded.expense_date,
  payment_method = excluded.payment_method;

with demo_user as (
  select id
  from auth.users
  where id = '00000000-0000-0000-0000-000000000001'
),
goal_rows as (
  select *
  from (values
    ('44444444-4444-4444-4444-444444444441'::uuid, 'Emergency Fund'::text, 'Build a 6-month emergency reserve'::text, 10000.00::numeric, (current_date + 365)::date, 'in_progress'::public.goal_status),
    ('44444444-4444-4444-4444-444444444442'::uuid, 'Vacation to Europe'::text, 'Summer trip to Europe'::text, 5000.00::numeric, (current_date + 210)::date, 'not_started'::public.goal_status)
  ) as v(id, name, description, target_amount, target_date, status)
),
upserted_goals as (
  insert into public.goals (id, user_id, name, description, target_amount, target_date, status)
  select
    gr.id,
    du.id,
    gr.name,
    gr.description,
    gr.target_amount,
    gr.target_date,
    gr.status
  from demo_user du
  join goal_rows gr on true
  on conflict (id) do update
  set
    description = excluded.description,
    target_amount = excluded.target_amount,
    target_date = excluded.target_date,
    status = excluded.status
  returning id, user_id, name
)
insert into public.goal_updates (id, goal_id, user_id, progress_amount, note, progress_date)
select
  upd.id,
  ug.id,
  ug.user_id,
  upd.progress_amount,
  upd.note,
  (current_date + upd.day_offset)::date
from upserted_goals ug
join (
  values
    ('55555555-5555-5555-5555-555555555551'::uuid, 'Emergency Fund'::text, 750.00::numeric, 'Initial deposit from paycheck'::text, -25::int),
    ('55555555-5555-5555-5555-555555555552'::uuid, 'Emergency Fund'::text, 500.00::numeric, 'Transferred bonus savings'::text, -10::int),
    ('55555555-5555-5555-5555-555555555553'::uuid, 'Vacation to Europe'::text, 250.00::numeric, 'Started a dedicated savings transfer'::text, -7::int)
) as upd(id, goal_name, progress_amount, note, day_offset)
  on upd.goal_name = ug.name
on conflict (id) do update
set
  progress_amount = excluded.progress_amount,
  note = excluded.note,
  progress_date = excluded.progress_date;

with demo_user as (
  select id
  from auth.users
  where id = '00000000-0000-0000-0000-000000000001'
),
summary_rows as (
  select *
  from (values
    ('66666666-6666-6666-6666-666666666661'::uuid, (date_trunc('month', current_date - interval '1 month'))::date, 2850.14::numeric, 4200.00::numeric, 3000.00::numeric, 'Baseline month prior to current period'::text),
    ('66666666-6666-6666-6666-666666666662'::uuid, (date_trunc('month', current_date))::date, 1711.14::numeric, 4200.00::numeric, 2800.00::numeric, 'Current month tracking toward lower spending goal'::text)
  ) as v(id, month_start, total_expenses, total_income, budget, notes)
)
insert into public.monthly_summaries (id, user_id, year, month, total_expenses, total_income, budget, notes)
select
  sr.id,
  du.id,
  extract(year from sr.month_start)::int,
  extract(month from sr.month_start)::int,
  sr.total_expenses,
  sr.total_income,
  sr.budget,
  sr.notes
from demo_user du
join summary_rows sr on true
on conflict (id) do update
set
  total_expenses = excluded.total_expenses,
  total_income = excluded.total_income,
  budget = excluded.budget,
  notes = excluded.notes;
