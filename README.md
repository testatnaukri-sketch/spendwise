# Spendwise - Financial Goals Management

A modern web application for managing financial goals with real-time progress tracking, built with React, TypeScript, and Supabase.

## Features

- **Goal Management**: Create, edit, and archive financial goals
- **Progress Tracking**: Track goal progress with visual indicators
- **Real-time Updates**: Supabase subscriptions for live data synchronization
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **Smart Validation**: Logical constraints for amounts and dates
- **Filtering & Sorting**: Multiple options to organize goals
- **Deadline Reminders**: Visual alerts for approaching deadlines
- **Progress Updates**: Add incremental updates to track savings over time

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Testing**: Vitest + React Testing Library
- **Date Utilities**: date-fns
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

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
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:

Execute the SQL files in `supabase/migrations/` in your Supabase SQL editor:
- `001_create_goals_tables.sql`
- `002_create_helper_functions.sql`

5. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Lint code
- `npm run typecheck` - Type check

## Project Structure

```
src/
├── components/
│   ├── goals/          # Goal-specific components
│   │   ├── GoalCard.tsx
│   │   ├── GoalForm.tsx
│   │   ├── GoalUpdateForm.tsx
│   │   ├── GoalFilters.tsx
│   │   └── GoalsList.tsx
│   └── ui/             # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Modal.tsx
│       └── ProgressBar.tsx
├── hooks/
│   └── useGoals.ts     # Custom hook for goal operations
├── lib/
│   └── supabase.ts     # Supabase client configuration
├── types/
│   └── database.ts     # TypeScript type definitions
├── utils/
│   └── goalCalculations.ts  # Goal calculation utilities
└── test/
    └── setup.ts        # Test configuration
```

## Database Schema

### goals table
- `id` - UUID (Primary Key)
- `user_id` - UUID (Foreign Key to auth.users)
- `title` - TEXT (NOT NULL)
- `description` - TEXT (nullable)
- `target_amount` - NUMERIC(12, 2) (NOT NULL, > 0)
- `current_amount` - NUMERIC(12, 2) (NOT NULL, >= 0)
- `target_date` - DATE (NOT NULL, must be in future)
- `created_at` - TIMESTAMP WITH TIME ZONE
- `updated_at` - TIMESTAMP WITH TIME ZONE
- `archived_at` - TIMESTAMP WITH TIME ZONE (nullable)

### goal_updates table
- `id` - UUID (Primary Key)
- `goal_id` - UUID (Foreign Key to goals)
- `amount` - NUMERIC(12, 2) (NOT NULL)
- `note` - TEXT (nullable)
- `created_at` - TIMESTAMP WITH TIME ZONE

## Features in Detail

### Goal Creation
- Set title, description, target amount, and target date
- Validation ensures amounts are positive and dates are in the future
- Optimistic updates provide instant feedback

### Progress Tracking
- Visual progress bars with color coding based on completion percentage
- Automatic calculation of completion percentage
- Days remaining countdown
- Warning indicators for approaching deadlines

### Real-time Synchronization
- Supabase subscriptions keep all clients in sync
- Changes made in one browser tab appear instantly in others
- Automatic refetch on connection restore

### Optimistic Updates
- UI updates immediately on user actions
- Automatic rollback if server operation fails
- Error messages for failed operations

### Filtering & Sorting
- Search by title or description
- Sort by date created, target date, or progress
- Toggle to show/hide archived goals

## Testing

The application includes comprehensive tests covering:
- Goal calculation utilities
- Goal CRUD operations
- Form validation
- State synchronization
- Optimistic updates and rollback

Run tests with:
```bash
npm test
```

## License

MIT
