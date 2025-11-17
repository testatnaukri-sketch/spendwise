# Spendwise Supabase Database Setup

This directory contains SQL migrations, seed data, and configuration for the Spendwise database powered by Supabase.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Database Schema](#database-schema)
4. [Running Migrations](#running-migrations)
5. [Seeding Data](#seeding-data)
6. [Row-Level Security (RLS)](#row-level-security-rls)
7. [Managing Secrets](#managing-secrets)
8. [Common Operations](#common-operations)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or later)
- **npm** or **yarn** package manager
- **Supabase CLI** (install via npm):
  ```bash
  npm install -g supabase
  ```

Verify the Supabase CLI installation:
```bash
supabase --version
```

---

## Project Setup

### 1. Initialize Supabase Locally

To start a local Supabase instance with Docker:

```bash
# Initialize Supabase (if not already done)
supabase init

# Start the local Supabase stack
supabase start
```

This will start PostgreSQL, PostgREST, GoTrue (Auth), Realtime, Storage, and other services.

**Note:** The first `supabase start` may take a few minutes as it downloads Docker images.

After starting, you'll see output like:
```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
```

### 2. Create a Remote Supabase Project

If you're deploying to production or a remote environment:

1. Visit [https://app.supabase.com](https://app.supabase.com)
2. Create a new organization (if you don't have one)
3. Click **New Project**
4. Fill in:
   - **Name:** Spendwise
   - **Database Password:** (choose a strong password and save it securely)
   - **Region:** Select the region closest to your users
5. Click **Create new project**

Wait for the project to finish provisioning (~2 minutes).

### 3. Link Local Project to Remote

Link your local Supabase CLI to the remote project:

```bash
supabase link --project-ref <your-project-ref>
```

You can find the project reference ID in your Supabase project settings under **Project Settings > General > Reference ID**.

When prompted, enter your database password.

---

## Database Schema

The Spendwise database consists of the following tables:

### Core Tables

#### `profiles`
User profile information linked to Supabase Auth.

| Column          | Type         | Description                          |
|-----------------|--------------|--------------------------------------|
| `id`            | `uuid` (PK)  | References `auth.users(id)`          |
| `email`         | `text`       | User email (unique)                  |
| `full_name`     | `text`       | User's full name                     |
| `avatar_url`    | `text`       | Profile picture URL                  |
| `currency_code` | `char(3)`    | ISO 4217 currency code (default USD) |
| `created_at`    | `timestamptz`| Creation timestamp                   |
| `updated_at`    | `timestamptz`| Last update timestamp                |

#### `expense_categories`
Categories for organizing expenses (default + user-custom).

| Column        | Type         | Description                                 |
|---------------|--------------|---------------------------------------------|
| `id`          | `uuid` (PK)  | Primary key                                 |
| `user_id`     | `uuid`       | User ID (null for default categories)      |
| `name`        | `text`       | Category name                               |
| `description` | `text`       | Category description                        |
| `icon`        | `text`       | Emoji or icon identifier                    |
| `is_default`  | `boolean`    | Whether it's a system-provided category     |
| `created_at`  | `timestamptz`| Creation timestamp                          |
| `updated_at`  | `timestamptz`| Last update timestamp                       |

**Constraints:**
- Default categories have `user_id = null` and `is_default = true`
- User-custom categories have `user_id != null` and `is_default = false`
- Unique index on `(user_id, name)` (case-insensitive)

#### `expenses`
Individual expense transactions.

| Column           | Type           | Description                              |
|------------------|----------------|------------------------------------------|
| `id`             | `uuid` (PK)    | Primary key                              |
| `user_id`        | `uuid` (FK)    | Owner of the expense                     |
| `category_id`    | `uuid` (FK)    | References `expense_categories(id)`      |
| `amount`         | `numeric(12,2)`| Expense amount (must be positive)        |
| `currency_code`  | `char(3)`      | ISO 4217 currency code                   |
| `merchant`       | `text`         | Merchant or payee name                   |
| `notes`          | `text`         | Additional notes                         |
| `payment_method` | `text`         | Payment method (e.g., credit_card, cash) |
| `expense_date`   | `date`         | Date of the expense                      |
| `created_at`     | `timestamptz`  | Creation timestamp                       |
| `updated_at`     | `timestamptz`  | Last update timestamp                    |

**Indexes:**
- `(user_id, expense_date DESC)` - efficient user queries sorted by date
- `(category_id)` - fast category filtering

#### `goals`
Financial goals that users set for themselves.

| Column          | Type           | Description                                |
|-----------------|----------------|--------------------------------------------|
| `id`            | `uuid` (PK)    | Primary key                                |
| `user_id`       | `uuid` (FK)    | Owner of the goal                          |
| `name`          | `text`         | Goal name                                  |
| `description`   | `text`         | Goal description                           |
| `target_amount` | `numeric(12,2)`| Target monetary amount (must be positive)  |
| `target_date`   | `date`         | Target completion date                     |
| `status`        | `goal_status`  | Current status (enum)                      |
| `created_at`    | `timestamptz`  | Creation timestamp                         |
| `updated_at`    | `timestamptz`  | Last update timestamp                      |

**Status Enum Values:**
- `not_started` - Goal has been created but no progress yet
- `in_progress` - Actively working toward the goal
- `ahead` - Progress is ahead of schedule
- `needs_attention` - Behind schedule
- `completed` - Goal has been achieved
- `cancelled` - Goal abandoned

**Constraints:**
- Unique index on `(user_id, name)` (case-insensitive)

#### `goal_updates`
Track progress toward goals over time.

| Column            | Type           | Description                                |
|-------------------|----------------|--------------------------------------------|
| `id`              | `uuid` (PK)    | Primary key                                |
| `goal_id`         | `uuid` (FK)    | References `goals(id)`                     |
| `user_id`         | `uuid` (FK)    | Owner of the goal (for RLS)                |
| `progress_amount` | `numeric(12,2)`| Amount of progress made (must be >= 0)     |
| `note`            | `text`         | Notes about this update                    |
| `progress_date`   | `date`         | Date of this progress (default today)      |
| `created_at`      | `timestamptz`  | Creation timestamp                         |
| `updated_at`      | `timestamptz`  | Last update timestamp                      |

**Indexes:**
- `(goal_id, progress_date DESC)` - efficient goal progress history
- `(user_id)` - fast user filtering

**Constraints:**
- `progress_date` cannot be in the future
- Composite foreign key `(goal_id, user_id)` references `goals(id, user_id)`

#### `monthly_summaries`
Aggregate financial data by month for analytics.

| Column          | Type           | Description                           |
|-----------------|----------------|---------------------------------------|
| `id`            | `uuid` (PK)    | Primary key                           |
| `user_id`       | `uuid` (FK)    | Owner of the summary                  |
| `year`          | `int`          | Year (>= 2000)                        |
| `month`         | `int`          | Month (1-12)                          |
| `total_expenses`| `numeric(14,2)`| Sum of expenses for the month         |
| `total_income`  | `numeric(14,2)`| Sum of income for the month           |
| `budget`        | `numeric(14,2)`| Monthly budget (optional)             |
| `notes`         | `text`         | Monthly notes                         |
| `created_at`    | `timestamptz`  | Creation timestamp                    |
| `updated_at`    | `timestamptz`  | Last update timestamp                 |

**Constraints:**
- Unique index on `(user_id, year, month)`
- Budget must be >= 0 if set

---

## Running Migrations

### Local Development

Apply all migrations to your local database:

```bash
supabase db reset
```

This command:
1. Drops the existing database
2. Recreates it
3. Applies all migrations in order

To apply migrations without resetting:

```bash
supabase migration up
```

### Remote/Production

Push migrations to your remote Supabase project:

```bash
supabase db push
```

**Warning:** This applies migrations directly to production. Always test locally first.

### Creating New Migrations

To create a new migration file:

```bash
supabase migration new <migration_name>
```

Example:
```bash
supabase migration new add_budget_alerts
```

This creates a new timestamped SQL file in `supabase/migrations/`.

---

## Seeding Data

### Local Seeding

The seed file is located at `supabase/seed/seed.sql` and includes:
- 15 default expense categories (Food & Dining, Transportation, etc.)
- Demo user account for testing
- Sample expenses, goals, and monthly summaries

To seed your local database:

```bash
supabase db reset
```

The seed file is automatically applied during `db reset`.

Alternatively, if you already applied migrations and only want to seed data, run the helper script:

```bash
./supabase/scripts/seed-local.sh
```

### Manual Seeding

To run the seed file manually:

```bash
psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed/seed.sql
```

Or use the Supabase Studio SQL Editor:
1. Open `http://localhost:54323`
2. Navigate to **SQL Editor**
3. Paste the contents of `seed.sql`
4. Click **Run**

### Demo Account Credentials

After seeding, you can log in with:
- **Email:** `demo@spendwise.dev`
- **Password:** `Password123!`

---

## Row-Level Security (RLS)

All tables have Row-Level Security (RLS) enabled to ensure users can only access their own data.

### Policy Overview

Each table has two main policies:

1. **Select Policy** - Controls read access
   - Users can read their own data: `auth.uid() = user_id`
   - Service role can read all data (for admin operations)
   - Exception: `expense_categories` allows reading default categories (where `user_id IS NULL`)

2. **All Operations Policy** (Insert/Update/Delete) - Controls write access
   - Users can only modify their own data: `auth.uid() = user_id`
   - Service role can modify all data

### Example: Expenses Table

```sql
-- Read access: users can only see their own expenses
create policy "expenses_select_own"
  on public.expenses
  for select
  using (auth.role() = 'service_role' or user_id = auth.uid());

-- Write access: users can only create/modify/delete their own expenses
create policy "expenses_ins_upd_del_own"
  on public.expenses
  for all
  using (auth.role() = 'service_role' or user_id = auth.uid())
  with check (auth.role() = 'service_role' or user_id = auth.uid());
```

### Testing RLS Policies

To test RLS, you can use the Supabase Studio SQL Editor with different user contexts:

```sql
-- Set user context (replace with actual user UUID)
set local role authenticated;
set local request.jwt.claim.sub to '00000000-0000-0000-0000-000000000001';

-- Try to query expenses (should only see your own)
select * from public.expenses;

-- Reset to superuser
reset role;
```

---

## Managing Secrets

### Environment Variables

Supabase provides several secrets for connecting to your database and API:

#### Local Development

When running `supabase start`, secrets are printed to the console:

```
API URL: http://localhost:54321
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Store these in a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-local-service-role-key>
```

#### Production/Remote

Get your production secrets from the Supabase dashboard:

1. Go to **Project Settings** > **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key**
   - **service_role key** (keep this secret!)

Store in `.env.production`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-production-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-production-service-role-key>
```

**Security Notes:**
- ✅ **anon key**: Safe to expose in frontend code
- ⚠️ **service_role key**: Never expose in frontend; only use in backend/server code
- 🔒 Database password: Store securely (e.g., in environment variables or secret manager)

### Database Connection String

For direct database access (e.g., with `psql` or ORMs):

**Local:**
```
postgresql://postgres:postgres@localhost:54322/postgres
```

**Remote:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

Find your connection string in **Project Settings** > **Database** > **Connection string**.

---

## Common Operations

### View All Tables

```bash
supabase db list
```

### Generate TypeScript Types

Automatically generate TypeScript types from your database schema:

```bash
supabase gen types typescript --local > types/supabase.ts
```

For production:
```bash
supabase gen types typescript --project-ref <your-project-ref> > types/supabase.ts
```

### Reset Local Database

Drops and recreates the database, applies migrations, and runs seeds:

```bash
supabase db reset
```

### View Logs

View real-time logs from your local Supabase instance:

```bash
supabase logs
```

### Stop Supabase

Stop the local Supabase instance:

```bash
supabase stop
```

To also remove volumes (complete cleanup):

```bash
supabase stop --no-backup
```

---

## Troubleshooting

### Issue: Migrations Won't Apply

**Symptoms:**
```
Error: migration <name> has already been applied
```

**Solution:**
Check migration status:
```bash
supabase migration list
```

Repair the migration history:
```bash
supabase migration repair <version> --status applied
```

### Issue: RLS Blocks All Queries

**Symptoms:**
Queries return empty results even though data exists.

**Cause:**
You're not authenticated, or `auth.uid()` doesn't match the `user_id`.

**Solution:**
1. Ensure you're signed in via Supabase Auth
2. Check that the JWT is being sent with requests
3. Verify the `user_id` column matches the authenticated user's UUID

**Debug with service_role key:**
Use the service role key (bypasses RLS) to verify data exists:
```javascript
const supabase = createClient(url, serviceRoleKey);
const { data } = await supabase.from('expenses').select('*');
console.log(data); // Should show all expenses
```

### Issue: Seed Data Not Loading

**Symptoms:**
Default categories or demo data missing after reset.

**Solution:**
Manually run the seed file:
```bash
psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed/seed.sql
```

Check for SQL errors in the output.

### Issue: Docker/Supabase Won't Start

**Symptoms:**
```
Error: Cannot connect to the Docker daemon
```

**Solution:**
1. Ensure Docker Desktop is running
2. Check Docker daemon status:
   ```bash
   docker ps
   ```
3. Restart Docker and try again:
   ```bash
   supabase start
   ```

### Issue: Type Mismatches

**Symptoms:**
TypeScript errors when querying data.

**Solution:**
Regenerate types after schema changes:
```bash
supabase gen types typescript --local > types/supabase.ts
```

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row-Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## Support

For issues specific to this project, please open an issue on the GitHub repository.

For Supabase-related questions, visit the [Supabase Discord](https://discord.supabase.com/).
