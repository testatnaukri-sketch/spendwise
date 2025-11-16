# Spendwise Analytics Suite

A comprehensive analytics dashboard for the Spendwise expense tracking application. Built with React, TypeScript, Express, and Supabase, providing detailed financial insights with interactive charts, advanced filtering, and data export capabilities.

## Features

### Analytics Dashboard
- **Category Spending Breakdown** - Pie chart visualization of expenses by category
- **Monthly Trends** - Multi-series bar chart showing income, expenses, and net cash flow
- **Summary Statistics** - Quick overview of total income, expenses, and balance
- **Spending Anomalies** - AI-assisted detection of unusual spending patterns
- **Financial Forecasts** - Predictive projections for future months based on historical data

### Interactive Filters
- Date range selection with preset ranges (7 days, 30 days, 90 days, 1 year)
- Category filtering for focused analysis
- Transaction type filtering (income, expense, or all)
- Advanced filter options for power users

### Export Capabilities
- **CSV Export** - Comprehensive data export with all metrics and category breakdowns
- **PDF Export** - Professional formatted reports with charts and tables
- Automated filename generation with timestamps

### Data Management
- Real-time data fetching from Supabase
- Pagination and virtualization support for large datasets
- Efficient data aggregation and calculations
- Performance optimized queries

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **date-fns** - Date utilities

### Backend
- **Express.js** - Server framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin support

### Database & Auth
- **Supabase** - PostgreSQL database with built-in auth
- **@supabase/supabase-js** - Supabase client library

### Testing
- **Vitest** - Unit testing framework
- **@testing-library/react** - React testing utilities
- **@testing-library/jest-dom** - DOM matchers

### Code Quality
- **ESLint** - Linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## Project Structure

```
spendwise/
├── src/
│   ├── client/              # React frontend
│   │   ├── App.tsx          # Main App component
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── server/              # Express backend
│   │   ├── index.ts         # Server setup
│   │   └── routes/          # API route handlers
│   ├── components/          # React components
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── SummaryStats.tsx
│   │   ├── CategoryBreakdown.tsx
│   │   ├── MonthlyTrends.tsx
│   │   ├── AnalyticsFilters.tsx
│   │   ├── ExportControls.tsx
│   │   └── AnomaliesPanel.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useAnalyticsData.ts
│   ├── utils/               # Utility functions
│   │   ├── supabase.ts      # Supabase client setup
│   │   ├── analyticsData.ts # Data fetching functions
│   │   ├── filtering.ts     # Filter utilities
│   │   ├── exporters.ts     # CSV/PDF export functions
│   │   └── __tests__/       # Unit tests
│   ├── types/               # TypeScript type definitions
│   └── test/                # Test setup
├── index.html               # HTML entry point
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── vitest.config.ts         # Vitest config
└── tailwind.config.js       # Tailwind CSS config
```

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account with configured database

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd spendwise
```

2. Install dependencies:
```bash
npm install
```

3. Environment Configuration:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Development

### Start Development Servers

Frontend and backend:
```bash
npm run dev
```

Frontend only:
```bash
npm run dev:client
```

Backend only:
```bash
npm run dev:server
```

### Build

```bash
npm run build
```

This generates:
- Client build in `dist/client`
- Server build in `dist/server`

## Testing

### Run All Tests
```bash
npm test
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm test -- --coverage
```

## Code Quality

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

### Formatting
```bash
npm run format
```

## API Endpoints

### Analytics
- `POST /api/analytics/data` - Fetch comprehensive analytics data
- `POST /api/analytics/categories` - Get category spending breakdown
- `GET /api/analytics/trends` - Get monthly trends

### Forecast
- `GET /api/forecast/projections` - Get future month projections

## Types

### Main Types
- `Transaction` - Individual transaction record
- `Category` - Expense category
- `AnalyticsData` - Complete analytics dataset
- `AnalyticsFilters` - Filter parameters
- `MonthlyTrend` - Monthly income/expense data
- `CategorySpend` - Category spending summary
- `SpendingAnomaly` - Detected spending anomaly
- `ForecastProjection` - Predicted future financial data

## Database Schema Requirements

The application expects the following Supabase tables:

### transactions
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  type VARCHAR(10) NOT NULL, -- 'income' or 'expense'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7),
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Features Implementation Details

### Category Spending Breakdown
- Aggregates expenses by category over selected date range
- Calculates percentages of total spending
- Includes transaction count per category
- Displays as interactive pie chart with legend

### Monthly Trends
- Calculates income, expenses, and net for each month
- Supports customizable lookback period
- Visualizes as multi-series bar chart
- Enables year-over-year comparisons

### Spending Anomalies
- Detects outliers using statistical analysis (2+ standard deviations)
- Calculates percentage above average
- Sorted by date (most recent first)
- Highlights concerning spending patterns

### Forecast Projections
- Uses linear regression on historical data
- Generates projections for up to 12 months
- Includes confidence scores that decrease over time
- Helps with financial planning

### Export Functionality
- CSV format includes all numeric data
- PDF format includes formatted tables and summary
- Professional report generation
- Automatic timestamp in filenames

## Performance Considerations

- **Pagination**: Supports pagination for large datasets
- **Virtualization**: Charts render efficiently with Recharts
- **Data Fetching**: Optimized Supabase queries with proper indexing
- **Caching**: Consider implementing caching layer for historical data
- **Real-time Updates**: Optional WebSocket integration for live updates

## Error Handling

- Comprehensive error boundaries
- User-friendly error messages
- Graceful degradation on data fetch failures
- Retry mechanisms with exponential backoff
- Detailed console logging for debugging

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Sufficient color contrast
- Responsive design for all screen sizes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please contact the development team or create an issue in the repository.
