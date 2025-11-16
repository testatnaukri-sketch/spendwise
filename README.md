# Spendwise

Spendwise uses [Supabase](https://supabase.com/) for its database, authentication, and realtime features. This repository contains SQL migrations, seed data, and documentation to help you set up and manage the Spendwise Supabase project.

## Getting Started

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize and start Supabase locally:
   ```bash
   supabase init
   supabase start
   ```

3. Apply migrations and seed data:
   ```bash
   supabase db reset
   ```

4. Log in with the demo credentials:
   - Email: `demo@spendwise.dev`
   - Password: `Password123!`

## Documentation

Detailed setup, schema, and operations guides are available in [`supabase/README.md`](supabase/README.md).

## Directory Structure

```
.
├── supabase
│   ├── migrations     # Database schema migrations
│   ├── seed           # Seed data for demo and default values
│   ├── scripts        # Helper scripts for local development
│   └── README.md      # Detailed Supabase documentation
└── README.md          # Project overview
```
