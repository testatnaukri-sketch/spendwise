# Spendwise

A modern personal finance dashboard built with Next.js, Supabase, and real-time data synchronization.

## Features

- **Dashboard Metrics**: Real-time summary cards showing total expenses, budget remaining, monthly burn rate, and goals progress
- **Recent Transactions**: Live-updating transaction table with categories and timestamps
- **Interactive Charts**: Spending trends and category breakdowns using Recharts
- **Real-time Updates**: Supabase real-time subscriptions for instant data synchronization
- **Server-side Rendering**: Optimized data loading with SWR for client-side revalidation
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Error Handling**: Comprehensive error boundaries and loading states
- **Testing**: Unit tests for components and data aggregation logic

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime Subscriptions
- **Data Fetching**: SWR
- **Charts**: Recharts
- **Testing**: Jest, React Testing Library

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase project URL and anon key.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The app expects two main tables in your Supabase database:

### expenses
- `id` (uuid, primary key)
- `amount` (numeric)
- `description` (text)
- `category` (text)
- `created_at` (timestamp)
- `user_id` (text)

### goals
- `id` (uuid, primary key)
- `name` (text)
- `target_amount` (numeric)
- `current_amount` (numeric, default: 0)
- `created_at` (timestamp)
- `user_id` (text)

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Deployment

This application is designed to be deployed on Vercel, Netlify, or any platform that supports Next.js applications.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request