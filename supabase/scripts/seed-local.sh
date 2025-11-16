#!/bin/bash

# Script to seed local Supabase database with demo data
# Run this after migrations have been applied

set -e

echo "🌱 Seeding local Supabase database..."

# Check if Supabase is running locally
if ! nc -z localhost 54322 2>/dev/null; then
  echo "❌ Local Supabase is not running. Please start it with: supabase start"
  exit 1
fi

# Apply seed data
psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed/seed.sql

if [ $? -eq 0 ]; then
  echo "✅ Seed data applied successfully!"
  echo ""
  echo "Demo account credentials:"
  echo "  Email: demo@spendwise.dev"
  echo "  Password: Password123!"
else
  echo "❌ Failed to apply seed data"
  exit 1
fi
