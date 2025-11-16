# Spendwise - AI-Powered Personal Finance Advisor

Spendwise is a modern personal finance application that integrates AI-powered recommendations to help users make smarter purchasing decisions. Leveraging recent expenses, budget status, and financial goals, Spendwise provides categorized insights and actionable tips.

## Features

### Purchase Advisor

The core feature of Spendwise is the **Purchase Advisor** - an AI-powered recommendation engine that:

- **Analyzes Financial Data**: Processes recent expenses, budget allocations, and financial goals
- **Categorizes Recommendations**: Divides suggestions into:
  - **Necessity**: Essential purchases aligned with your goals
  - **Luxury**: Discretionary spending with tips for optimization
  - **Waste**: Items to avoid or reduce for better financial health
- **Provides Actionable Tips**: Each category includes specific, implementable suggestions
- **Maintains Privacy**: Anonymizes merchant names and excludes sensitive data
- **Caches Results**: Reduces API costs with intelligent short-term caching
- **Error Handling**: Graceful error states with retry capabilities

## Tech Stack

- **Frontend**: React 18 with Next.js 14
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **AI**: OpenAI GPT-4o mini
- **Language**: TypeScript
- **Testing**: Vitest with React Testing Library
- **Styling**: Tailwind CSS (ready to integrate)

## Project Structure

```
spendwise/
├── app/
│   └── api/
│       └── advisor/
│           └── route.ts           # Purchase Advisor API endpoint
├── components/
│   ├── PurchaseAdvisor.tsx         # Main advisor component
│   ├── AdvisorRecommendationCard.tsx # Individual recommendation cards
│   ├── AdvisorLoadingState.tsx      # Loading UI
│   └── AdvisorErrorState.tsx        # Error UI
├── lib/
│   ├── advisor.ts                  # OpenAI integration & anonymization
│   ├── cache.ts                    # Response caching utility
│   └── supabase.ts                 # Supabase client setup
├── types/
│   └── index.ts                    # TypeScript interfaces
├── __tests__/
│   ├── api/
│   │   └── advisor.test.ts         # API route tests
│   ├── components/
│   │   └── PurchaseAdvisor.test.tsx # Component tests
│   └── lib/
│       ├── advisor.test.ts         # Advisor logic tests
│       └── cache.test.ts           # Cache tests
├── __mocks__/
│   └── advisor-responses.ts        # Mock data for testing
├── docs/
│   └── PII_HANDLING.md             # Data privacy documentation
├── .env.example                    # Environment variables template
├── .eslintrc.json                  # ESLint configuration
├── tsconfig.json                   # TypeScript configuration
├── next.config.js                  # Next.js configuration
├── vitest.config.ts                # Vitest configuration
└── package.json                    # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

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
   
   Fill in your configuration:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `OPENAI_API_KEY`: Your OpenAI API key

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Usage

### Using the Purchase Advisor Component

```typescript
import { PurchaseAdvisor } from '@/components/PurchaseAdvisor';
import type { PurchaseAdvisorInput } from '@/types';

export default function AdvisorPage() {
  const input: PurchaseAdvisorInput = {
    recentExpenses: [...],  // Fetch from Supabase
    budgets: [...],         // Fetch from Supabase
    goals: [...],          // Fetch from Supabase
    purchaseContext: 'Considering a new laptop',
  };

  return (
    <PurchaseAdvisor
      token={userAuthToken}
      input={input}
    />
  );
}
```

### API Endpoint

**POST /api/advisor**

Request:
```json
{
  "recentExpenses": [...],
  "budgets": [...],
  "goals": [...],
  "purchaseContext": "optional context"
}
```

Response:
```json
{
  "id": "advisor-resp-123",
  "userId": "user123",
  "recommendations": [
    {
      "type": "necessity",
      "title": "Essential Purchases",
      "description": "...",
      "items": [...],
      "actionableTips": [...]
    }
  ],
  "summary": "...",
  "reasoning": "...",
  "generatedAt": "2024-01-15T15:30:00Z",
  "expiresAt": "2024-01-15T16:30:00Z",
  "cached": false
}
```

**DELETE /api/advisor**

Clears the cached advisor response for the authenticated user.

## Data Privacy

The Purchase Advisor is designed with **privacy-first principles**:

- **Merchant Anonymization**: Specific merchant names are replaced with generic categories
- **PII Exclusion**: User IDs, emails, and personal details are never sent to external APIs
- **Server-Side Processing**: All anonymization happens server-side before external API calls
- **Caching Strategy**: Responses cached for 1 hour to reduce API costs and improve performance
- **User Control**: Users can manually clear cache and request fresh recommendations

For detailed information, see [PII_HANDLING.md](docs/PII_HANDLING.md)

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm test -- --coverage
```

### Test Coverage

- **Unit Tests**: Advisor logic, cache behavior, validation
- **API Tests**: Authentication, request validation, error handling
- **Component Tests**: User interactions, loading states, error states
- **Mock Data**: Comprehensive mock responses in `__mocks__/advisor-responses.ts`

## Linting

```bash
# Run ESLint
npm run lint

# Fix issues
npm run lint -- --fix
```

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## API Documentation

### Purchase Advisor API

#### Authentication

All requests require a Bearer token in the Authorization header:

```
Authorization: Bearer <user_token>
```

#### Request Format

```typescript
POST /api/advisor
Content-Type: application/json
Authorization: Bearer <token>

{
  "recentExpenses": Expense[],
  "budgets": Budget[],
  "goals": FinancialGoal[],
  "purchaseContext": string // optional
}
```

#### Response Format

```typescript
{
  "id": string,
  "userId": string,
  "recommendations": RecommendationCategory[],
  "summary": string,
  "reasoning": string,
  "generatedAt": string,
  "expiresAt": string,
  "cached": boolean
}
```

#### Error Responses

- **401 Unauthorized**: Missing or invalid authentication
- **400 Bad Request**: Invalid request data
- **503 Service Unavailable**: OpenAI API error
- **500 Internal Server Error**: Unexpected server error

## Performance Considerations

1. **Response Caching**: Responses cached for 1 hour per user
2. **API Batching**: Consider batching advisor requests
3. **Rate Limiting**: Implement per-user rate limits in production
4. **Data Minimization**: Send only recent transactions (e.g., last 30 days)

## Future Enhancements

- [ ] Persistent caching with Redis
- [ ] Multi-language support
- [ ] Personalized savings recommendations
- [ ] Integration with bank APIs
- [ ] Mobile app version
- [ ] Real-time budget alerts
- [ ] Spending trend analysis

## Troubleshooting

### "Unauthorized: Missing or invalid authentication"

- Ensure you're passing a valid Bearer token
- Check that the token is in the Authorization header

### "Failed to generate recommendations"

- Verify your OpenAI API key is set
- Check OpenAI API status
- Ensure your account has sufficient credits

### Missing environment variables

- Run `cp .env.example .env.local`
- Fill in all required variables
- Restart the development server

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

MIT

## Support

For issues, questions, or suggestions, please open an issue on the repository.

## Security

For security concerns, please email security@spendwise.app or review [PII_HANDLING.md](docs/PII_HANDLING.md).
