# Spendwise - Expense Tracker

A modern, minimal expense tracking application built with React, TypeScript, and Supabase.

## Features

- **Add Expenses**: Create expenses with amount, category, merchant, date, payment method, notes, and tags
- **Client-side Validation**: Helpful error messages for form fields
- **Category Management**: Default categories loaded from Supabase
- **Merchant Suggestions**: Auto-suggest merchants based on past entries
- **Real-time Sync**: Background syncing with Supabase real-time channel for instant updates
- **Responsive Design**: Works on desktop and mobile devices
- **Comprehensive Tests**: Unit and integration tests for validation and service operations

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Database**: Supabase
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Styling**: Tailwind CSS
- **Linting**: ESLint with TypeScript support

## Project Structure

```
src/
├── components/         # React components
│   └── AddExpenseForm.tsx
├── pages/             # Page components
│   └── ExpensesPage.tsx
├── services/          # API/Supabase services
│   └── expenseService.ts
├── store/             # Zustand store
│   └── expenseStore.ts
├── hooks/             # Custom React hooks
│   ├── useExpenseSync.ts
│   └── useMerchantSuggestions.ts
├── lib/               # Utilities and configurations
│   ├── supabase.ts
│   └── validation.ts
├── types/             # TypeScript type definitions
│   └── expense.ts
├── __tests__/         # Test files
│   ├── validation.test.ts
│   ├── expenseService.test.ts
│   ├── expenseStore.test.ts
│   └── AddExpenseForm.test.tsx
├── test/              # Test setup
│   └── setup.ts
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd spendwise
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

Build for production:
```bash
npm run build
```

### Testing

Run all tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Run specific test file:
```bash
npm test -- src/__tests__/validation.test.ts
```

### Linting

Check code style:
```bash
npm run lint
```

### Type Checking

Run TypeScript type checking:
```bash
npm run type-check
```

## API Endpoints / Supabase Tables

The application expects the following Supabase tables:

### `expenses`
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL,
  amount DECIMAL NOT NULL,
  category VARCHAR NOT NULL,
  merchant VARCHAR NOT NULL,
  date DATE NOT NULL,
  payment_method VARCHAR NOT NULL,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `categories`
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL UNIQUE,
  icon VARCHAR
);
```

## Key Features Explained

### Add Expense Form
The `AddExpenseForm` component provides a complete expense entry interface with:
- Real-time form validation
- Auto-suggestions for merchants from past entries
- Tag management system
- Error handling with user-friendly messages

### Validation
The `validateExpenseForm` function validates:
- Amount must be greater than 0
- Category is required
- Merchant name is required
- Date is a valid date
- Payment method is selected

### Real-time Sync
The `useExpenseSync` hook:
- Subscribes to Supabase real-time updates
- Automatically updates local state when expenses are created/updated
- Works in background without user intervention

### Merchant Suggestions
The `useMerchantSuggestions` hook:
- Filters past merchants based on user input
- Returns up to 5 most relevant suggestions
- Updates dynamically as user types

## Testing

The project includes comprehensive tests:

### Unit Tests
- **validation.test.ts**: Form validation logic
- **expenseStore.test.ts**: Zustand store operations

### Integration Tests
- **expenseService.test.ts**: Supabase API mocking
- **AddExpenseForm.test.tsx**: Component rendering and interactions

All tests use Vitest and React Testing Library for accurate behavior verification.

## Performance Considerations

- Lazy loading of expenses on page load
- Merchant suggestions are memoized to prevent unnecessary re-renders
- Real-time sync only activates when user ID is available
- Form validation runs client-side before submission

## Error Handling

The application includes:
- Validation error messages for each form field
- Toast notifications for submission errors
- Automatic error message dismissal after 3 seconds
- Console logging for debugging

## Future Enhancements

- Expense filtering and search
- Data export (CSV, PDF)
- Budget tracking and alerts
- Recurring expenses
- Multi-currency support
- Mobile app version

## License

MIT
