# Spendwise Development Guide

## Overview

Spendwise is a personal finance management application built with Next.js 14, React 18, and Supabase. This guide covers the profile module, which allows users to manage their personal information, income, expenses, and financial preferences.

## Tech Stack

- **Framework**: Next.js 14.0.4
- **UI Library**: React 18
- **Database**: Supabase (PostgreSQL)
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Notifications**: Sonner

## Project Structure

```
├── app/
│   ├── api/
│   │   └── profile/
│   │       └── route.ts          # Profile API endpoints
│   ├── profile/
│   │   └── page.tsx              # Profile page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ProfileForm.tsx           # Profile edit form
│   ├── ProfileCard.tsx           # Profile display card
│   └── ProfilePage.tsx           # Profile container
├── lib/
│   ├── hooks/
│   │   ├── useProfile.ts         # Profile management hook
│   │   └── useSpendingCapacity.ts # Spending metrics hook
│   ├── profile-schema.ts         # Zod schemas
│   ├── profile-utils.ts          # Profile utilities
│   ├── supabase.ts               # Supabase client
│   └── mock-data.ts              # Mock data for testing
├── __tests__/
│   ├── profile-utils.test.ts     # Utility tests
│   ├── profile-schema.test.ts    # Validation tests
│   ├── profile-operations.test.ts # Integration tests
│   └── ProfileCard.test.tsx      # Component tests
└── supabase/
    └── schema.sql                # Database schema
```

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Ensure Row Level Security (RLS) is enabled for all tables

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Features

### Profile Management

Users can:
- **View** their profile information
- **Create** a new profile if one doesn't exist
- **Edit** personal information, income, expenses, and preferences
- **Update** their employment status and risk tolerance
- **Set** financial goals and savings targets

### Financial Metrics

The application automatically calculates:
- **Available Spending**: Monthly income minus fixed expenses
- **Savings Rate**: Percentage of income available for savings
- **Spending Capacity**: Maximum monthly discretionary spending

### Form Validation

All profile data is validated using Zod schemas:
- Email format validation
- Non-negative numeric values
- Enum validation for categorical fields
- Required field checks

### Security

- Row Level Security (RLS) policies ensure users can only access their own data
- PII (email, phone, date of birth) is never logged in error messages
- Sensitive data is handled securely in the API layer

## API Reference

### GET /api/profile

Fetch user profile

**Query Parameters:**
- `userId` (required): User identifier

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "user_id": "string",
    "full_name": "string",
    "email": "string",
    "monthly_income": 5000,
    "fixed_expenses": 2000,
    "savings_goal": 10000,
    ...
  }
}
```

### POST /api/profile

Create a new profile

**Request Body:**
```json
{
  "user_id": "string",
  "full_name": "string",
  "email": "string",
  "monthly_income": 5000,
  "fixed_expenses": 2000,
  "savings_goal": 10000,
  "employment_status": "employed",
  "risk_tolerance": "moderate"
}
```

### PUT /api/profile

Update user profile

**Request Body:** Same as POST (all fields optional)

### DELETE /api/profile

Delete user profile

**Query Parameters:**
- `userId` (required): User identifier

## Hooks

### useProfile

Hook for managing profile data

```typescript
const { profile, loading, error, isNew, save, refetch } = useProfile({
  userId: 'user-123',
  autoFetch: true,
})
```

**Returns:**
- `profile`: Current profile object
- `loading`: Loading state
- `error`: Error object if request failed
- `isNew`: True if user doesn't have a profile yet
- `save(data)`: Function to save profile changes
- `refetch()`: Function to refresh profile data

### useSpendingCapacity

Hook for computing spending metrics

```typescript
const metrics = useSpendingCapacity(profile)
```

**Returns:**
```typescript
{
  monthlyIncome: number,
  fixedExpenses: number,
  availableSpending: number,
  savingsRate: number,
  savingsGoal: number,
}
```

## Utilities

### calculateSpendingCapacity

Calculate available monthly spending

```typescript
const available = calculateSpendingCapacity(profile)
```

### calculateSavingsRate

Calculate savings rate percentage

```typescript
const rate = calculateSavingsRate(profile) // Returns 0-100
```

### getSpendingMetrics

Get all spending metrics

```typescript
const metrics = getSpendingMetrics(profile)
```

## Testing

### Run Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Test Coverage

- **Unit Tests**: Profile utils, schema validation
- **Component Tests**: ProfileCard, ProfileForm
- **Integration Tests**: Profile CRUD operations, error handling

### Key Test Scenarios

1. **Profile Creation**: User creates a new profile with valid data
2. **Profile Update**: User edits existing profile
3. **Validation**: Invalid data is rejected with helpful messages
4. **PII Security**: Sensitive data is not logged
5. **Metrics Calculation**: Spending capacity is calculated correctly
6. **Error Handling**: Network errors are handled gracefully with retries

## Schema Reference

### Zod Schemas

#### profileFormSchema

Used for form validation and creation

```typescript
{
  full_name: string (required, 1-255 chars)
  email: string (required, valid email)
  phone: string (optional)
  date_of_birth: string (optional)
  employment_status: 'employed' | 'self-employed' | 'unemployed' | 'student' | 'retired'
  monthly_income: number (required, >= 0)
  fixed_expenses: number (required, >= 0)
  savings_goal: number (required, >= 0)
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive'
  financial_goals: string[] (optional)
  preferred_currency: string (default: 'USD')
}
```

#### profileSchema

Used for validating retrieved profiles from database

Extends profileFormSchema with:
```typescript
{
  id: string (required)
  user_id: string (required)
  created_at: string (ISO timestamp)
  updated_at: string (ISO timestamp)
}
```

## Database Schema

### profiles table

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | TEXT | NOT NULL UNIQUE |
| full_name | TEXT | |
| email | TEXT | |
| phone | TEXT | |
| date_of_birth | DATE | |
| employment_status | TEXT | |
| monthly_income | DECIMAL(10,2) | |
| fixed_expenses | DECIMAL(10,2) | |
| savings_goal | DECIMAL(10,2) | |
| risk_tolerance | TEXT | |
| financial_goals | TEXT[] | |
| preferred_currency | TEXT | DEFAULT 'USD' |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

## PII Handling

### Safe Logging

Sensitive fields that should never appear in logs:
- email
- phone
- date_of_birth

### Implementation

When logging profile-related errors:

```typescript
// ❌ Never do this
console.error('Failed to update profile', profile)

// ✅ Do this
const safeLog = {
  user_id: profile.user_id,
  employment_status: profile.employment_status,
  monthly_income: profile.monthly_income,
}
console.error('Failed to update profile', safeLog)
```

## Error Handling

### User-Facing Errors

- Form validation errors are displayed inline with helpful messages
- API errors show toast notifications
- Network errors trigger retry logic with exponential backoff

### Server-Side Errors

- All errors are logged with codes but without PII
- HTTP status codes indicate error type (4xx for validation, 5xx for server errors)
- Database errors are caught and converted to generic messages

## Performance Optimization

- Profile data is cached in component state
- Spending metrics use memoization
- Images are optimized with Next.js Image component
- CSS is minified with Tailwind CSS

## Future Enhancements

- Multi-currency support
- Profile data export/import
- Profile sharing with financial advisors
- Integration with banking APIs
- Advanced analytics dashboard
- Mobile app version

## Troubleshooting

### Environment Variables Not Loading

Ensure `.env.local` is in the project root and the development server is restarted.

### Supabase Connection Errors

Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct.

### Validation Errors

Use the `safeParse` method to get detailed error information:

```typescript
const result = profileFormSchema.safeParse(data)
if (!result.success) {
  console.log(result.error.flatten())
}
```

## Contributing

When adding new features:

1. Add schemas to `lib/profile-schema.ts`
2. Add utilities to `lib/profile-utils.ts`
3. Add tests in `__tests__/`
4. Update this documentation
5. Ensure linting and tests pass before committing

## License

This project is part of the Spendwise personal finance application.
