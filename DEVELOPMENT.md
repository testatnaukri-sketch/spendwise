# Development Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Set up database**:
   - Run the SQL script in `supabase/schema.sql` in your Supabase SQL editor
   - This will create the required tables, indexes, and RLS policies

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Generate test data** (optional):
   - Visit `/dev` in your browser
   - Click "Generate Mock Data" to populate the dashboard with sample data

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── dashboard/     # Dashboard data endpoints
│   ├── dashboard/         # Dashboard page
│   ├── dev/              # Development utilities
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page (redirects to dashboard)
├── components/            # React components
│   ├── ErrorBoundary.tsx
│   ├── MetricCard.tsx
│   ├── RecentTransactions.tsx
│   ├── RealtimeSubscription.tsx
│   └── SpendingCharts.tsx
├── lib/                  # Utility libraries
│   ├── dashboard-data.ts # Data aggregation functions
│   ├── mock-data.ts      # Mock data generation
│   └── supabase.ts      # Supabase client configuration
├── __tests__/            # Unit tests
├── supabase/            # Database schema
└── public/              # Static assets
```

## Key Features

### 1. Dashboard Metrics
- **Total Expenses**: Sum of all expenses for the current month
- **Budget Remaining**: Difference between total budget and expenses
- **Monthly Burn Rate**: Average daily spending extrapolated to 30 days
- **Goals Progress**: Percentage of savings goals completed

### 2. Real-time Updates
- Uses Supabase Realtime Subscriptions
- Automatically updates when expenses or goals change
- Shows live indicator in the header

### 3. Data Fetching Strategy
- **Server-side**: API routes aggregate data using Supabase queries
- **Client-side**: SWR handles caching and revalidation
- **Real-time**: Supabase subscriptions trigger immediate updates

### 4. Error Handling
- Error boundaries catch and display errors gracefully
- Loading states show skeleton UI during data fetching
- Empty states provide helpful messages for new users

### 5. Testing
- Unit tests for all major components
- Tests cover loading states, error states, and empty states
- Data aggregation logic is thoroughly tested

## Database Schema

### expenses table
```sql
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT NOT NULL
);
```

### goals table
```sql
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id TEXT NOT NULL
);
```

## API Endpoints

- `GET /api/dashboard/metrics?userId={id}` - Returns dashboard metrics
- `GET /api/dashboard/transactions?userId={id}&limit={n}` - Returns recent transactions
- `GET /api/dashboard/trends?userId={id}&days={n}` - Returns spending trends
- `POST /api/dev/mock-data?action=generate` - Generate mock data (dev only)

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

## Styling

- Uses Tailwind CSS for styling
- Custom CSS classes defined in `app/globals.css`
- Responsive design with mobile-first approach
- Custom color palette for consistency

## Performance Optimizations

- SWR caching reduces API calls
- Skeleton loading states improve perceived performance
- Efficient database queries with proper indexes
- Component-level error boundaries prevent crashes

## Deployment

1. Set environment variables in your hosting platform
2. Run `npm run build` to create production build
3. Deploy the `.next` folder and `public` folder
4. Ensure Supabase RLS policies are properly configured

## Troubleshooting

### Common Issues

1. **Supabase connection errors**: Check environment variables
2. **Real-time updates not working**: Verify RLS policies include SELECT permissions
3. **Build errors**: Ensure all environment variables are set
4. **Empty dashboard**: Generate mock data using the dev utilities

### Debug Mode

Add `?debug=true` to any dashboard URL to see additional debugging information in the console.
