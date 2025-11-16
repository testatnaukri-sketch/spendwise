# Spendwise

A modern personal finance dashboard built with Next.js 14, TypeScript, and Supabase. Track expenses, manage financial goals, and get AI-powered financial advice.

## 🚀 Features

- **Dashboard**: Comprehensive financial overview with key metrics and insights
- **Expense Tracking**: Categorize and monitor all your expenses
- **Goal Management**: Set and track progress towards financial goals
- **AI Advisor**: Get personalized financial advice powered by AI
- **Profile Management**: Manage account settings and preferences
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Built-in light/dark theme support

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS with CSS variables for theming
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI + Custom component library
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── expenses/          # Expense tracking page
│   ├── goals/             # Goals management page
│   ├── advisor/           # AI advisor page
│   ├── profile/           # User profile page
│   └── auth/              # Authentication page
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (Button, Input, Card, etc.)
│   └── layout/           # Layout components (Sidebar, Navigation)
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase client and RPC utilities
│   └── utils.ts          # General utility functions
├── hooks/                 # Custom React hooks
│   ├── use-auth.ts       # Authentication hook
│   └── use-theme.ts      # Theme management hook
├── styles/               # Global styles and CSS
├── types/                # TypeScript type definitions
└── test/                 # Test setup and utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd spendwise
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure Supabase**
   - Create a new Supabase project
   - Run the SQL migrations (provided below)
   - Update your `.env.local` with your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

-- Expenses table
create table public.expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  amount numeric not null,
  category text not null,
  description text not null,
  date date not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

-- Goals table
create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  target_date date not null,
  category text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

-- Budgets table
create table public.budgets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  category text not null,
  limit numeric not null,
  spent numeric default 0,
  period text check (period in ('monthly', 'yearly')) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

-- Transactions table
create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  amount numeric not null,
  type text check (type in ('income', 'expense')) not null,
  category text not null,
  description text not null,
  date date not null,
  created_at timestamp with time zone default now()
);

-- AI Advice table
create table public.ai_advice (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  type text check (type in ('savings', 'investment', 'budget', 'goal')) not null,
  title text not null,
  content text not null,
  priority text check (priority in ('low', 'medium', 'high')) not null,
  created_at timestamp with time zone default now(),
  is_read boolean default false
);

-- Row Level Security
alter table public.users enable row level security;
alter table public.expenses enable row level security;
alter table public.goals enable row level security;
alter table public.budgets enable row level security;
alter table public.transactions enable row level security;
alter table public.ai_advice enable row level security;

-- RLS Policies
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

create policy "Users can view own expenses" on public.expenses for select using (auth.uid() = user_id);
create policy "Users can insert own expenses" on public.expenses for insert with check (auth.uid() = user_id);
create policy "Users can update own expenses" on public.expenses for update using (auth.uid() = user_id);
create policy "Users can delete own expenses" on public.expenses for delete using (auth.uid() = user_id);

create policy "Users can view own goals" on public.goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals" on public.goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals" on public.goals for update using (auth.uid() = user_id);
create policy "Users can delete own goals" on public.goals for delete using (auth.uid() = user_id);

create policy "Users can view own budgets" on public.budgets for select using (auth.uid() = user_id);
create policy "Users can insert own budgets" on public.budgets for insert with check (auth.uid() = user_id);
create policy "Users can update own budgets" on public.budgets for update using (auth.uid() = user_id);
create policy "Users can delete own budgets" on public.budgets for delete using (auth.uid() = user_id);

create policy "Users can view own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on public.transactions for insert with check (auth.uid() = user_id);

create policy "Users can view own advice" on public.ai_advice for select using (auth.uid() = user_id);
create policy "Users can update own advice" on public.ai_advice for update using (auth.uid() = user_id);
```

## 🧪 Testing

The project uses Vitest for unit testing and Testing Library for component testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

### Test Structure

- Unit tests are located alongside the files they test
- Test utilities are in `src/test/`
- Component tests use Testing Library
- Tests mock external dependencies (Supabase, Next.js router)

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Run tests with UI
```

## 🎨 Styling

The project uses TailwindCSS with a custom design system:

- **CSS Variables**: All colors are defined as CSS variables for easy theming
- **Dark Mode**: Built-in support for light/dark themes
- **Component Library**: Reusable UI components with consistent styling
- **Responsive**: Mobile-first design approach

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Provider (optional)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### Supabase Client

The project includes typed Supabase clients:

- `createClientComponentClient()` - For client-side usage
- `createServerComponentClient()` - For server-side usage
- `createServiceClient()` - For admin operations

### RPC Functions

Typed RPC utilities are available in `src/lib/supabase/rpc.ts` for common database operations.

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Other Platforms

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [troubleshooting guide](docs/troubleshooting.md)
2. Search existing [GitHub issues](../../issues)
3. Create a new issue with detailed information

## 🔮 Roadmap

- [ ] Real-time expense tracking
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Bank account integration
- [ ] Investment portfolio tracking
- [ ] Budget optimization algorithms
- [ ] Multi-currency support
