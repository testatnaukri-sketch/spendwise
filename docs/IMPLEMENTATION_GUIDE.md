# Purchase Advisor Implementation Guide

This guide explains how to integrate the Purchase Advisor into your Spendwise application.

## Overview

The Purchase Advisor is a server-side AI feature that analyzes user financial data and provides personalized recommendations. It's designed with:

- ✅ Server-side processing for security
- ✅ Privacy-first anonymization
- ✅ Intelligent caching for cost reduction
- ✅ Comprehensive error handling
- ✅ Full TypeScript support
- ✅ Test coverage

## Architecture

```
┌─────────────────────────────────────────┐
│         React Component UI              │
│     (PurchaseAdvisor.tsx)               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Next.js API Route                  │
│     (/api/advisor/route.ts)             │
│  - Authentication                       │
│  - Request validation                   │
│  - Cache management                     │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────────┐
        ▼                 ▼
   ┌─────────┐      ┌──────────────┐
   │  Cache  │      │Anonymization │
   │         │      │ & Processing │
   └────┬────┘      └──────┬───────┘
        │                   │
        └───────┬───────────┘
                │
                ▼
      ┌──────────────────────┐
      │   OpenAI API         │
      │   (GPT-4o mini)      │
      └──────────────────────┘
```

## File Structure

### Core Implementation

- **`app/api/advisor/route.ts`** - API endpoint
  - POST: Get recommendations
  - DELETE: Clear user cache
  - Handles authentication and validation

- **`lib/advisor.ts`** - AI integration
  - `getAdvisorRecommendations()` - Main AI call
  - Merchant anonymization
  - Payload sanitization
  - Response parsing

- **`lib/cache.ts`** - Response caching
  - In-memory cache implementation
  - TTL management (1 hour default)
  - Per-user caching

### UI Components

- **`components/PurchaseAdvisor.tsx`** - Main component
  - State management (loading, error, success)
  - Fetch coordination
  - User interactions

- **`components/AdvisorRecommendationCard.tsx`** - Individual cards
  - Render recommendation category
  - Display tips and items
  - Visual differentiation by type

- **`components/AdvisorLoadingState.tsx`** - Loading UI
  - Spinner animation
  - Informational messages

- **`components/AdvisorErrorState.tsx`** - Error UI
  - Error message display
  - Retry button

### Types

- **`types/index.ts`** - TypeScript interfaces
  - `Expense` - Transaction data
  - `Budget` - Budget allocation
  - `FinancialGoal` - User goals
  - `RecommendationCategory` - AI output
  - `PurchaseAdvisorResponse` - Complete response
  - `PurchaseAdvisorInput` - Request payload

## API Specification

### Endpoint: POST /api/advisor

**Authentication:**
```
Authorization: Bearer <user_token>
```

**Request Body:**
```typescript
{
  recentExpenses: Array<{
    id: string;
    user_id: string;
    amount: number;
    category: string;
    merchant: string;
    description: string;
    date: string;
    created_at: string;
  }>;
  budgets: Array<{
    id: string;
    user_id: string;
    category: string;
    limit: number;
    period: 'monthly' | 'yearly';
    created_at: string;
    updated_at: string;
  }>;
  goals: Array<{
    id: string;
    user_id: string;
    title: string;
    target_amount: number;
    current_amount: number;
    deadline: string;
    created_at: string;
  }>;
  purchaseContext?: string;
}
```

**Response (200 OK):**
```typescript
{
  id: string;
  userId: string;
  recommendations: Array<{
    type: 'necessity' | 'luxury' | 'waste';
    title: string;
    description: string;
    items: string[];
    actionableTips: string[];
  }>;
  summary: string;
  reasoning: string;
  generatedAt: string;
  expiresAt: string;
  cached: boolean;
}
```

**Error Responses:**
- `401 Unauthorized` - Missing/invalid authentication
- `400 Bad Request` - Invalid request data
- `503 Service Unavailable` - OpenAI API error
- `500 Internal Server Error` - Server error

### Endpoint: DELETE /api/advisor

**Purpose:** Clear cached recommendations for current user

**Response:**
```json
{
  "success": true,
  "message": "Cache cleared"
}
```

## Integration Steps

### 1. Setup Environment Variables

```bash
# Copy template
cp .env.example .env.local

# Fill in values
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=sk-your-api-key
```

### 2. Fetch User Financial Data

In your page/component, fetch data from Supabase:

```typescript
import { supabase } from '@/lib/supabase';
import type { PurchaseAdvisorInput } from '@/types';

async function getUserFinancialData(userId: string): Promise<PurchaseAdvisorInput> {
  const [expenses, budgets, goals] = await Promise.all([
    supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .then(r => r.data || []),
    supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .then(r => r.data || []),
    supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .then(r => r.data || []),
  ]);

  return {
    recentExpenses: expenses,
    budgets,
    goals,
  };
}
```

### 3. Use the Component

```typescript
'use client';

import { PurchaseAdvisor } from '@/components/PurchaseAdvisor';
import { useEffect, useState } from 'react';
import type { PurchaseAdvisorInput } from '@/types';

export default function AdvisorPage() {
  const [input, setInput] = useState<PurchaseAdvisorInput | null>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // Fetch user data and token from your auth provider
    async function load() {
      const userToken = await getUserToken();
      const financialData = await getUserFinancialData();
      setToken(userToken);
      setInput(financialData);
    }

    load();
  }, []);

  if (!input || !token) {
    return <div>Loading...</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Purchase Advisor</h1>
      <PurchaseAdvisor token={token} input={input} />
    </main>
  );
}
```

## Authentication

The current implementation uses a simple Bearer token approach. For production, integrate with your auth provider:

```typescript
// In app/api/advisor/route.ts, modify extractUserId():

function extractUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  // TODO: Verify JWT token and extract user ID
  // Example with Supabase:
  // const { data: { user }, error } = await supabase.auth.getUser(token);
  // return user?.id || null;

  return token; // Replace with actual user ID
}
```

## Caching Strategy

### Cache Flow

1. User requests recommendations
2. Server checks in-memory cache
3. If cached (and not expired):
   - Return cached response
   - Set `cached: true` in response
4. If not cached:
   - Fetch data from OpenAI
   - Store in cache with 1-hour TTL
   - Return fresh response
   - Set `cached: false` in response

### Cache Invalidation

Users can manually refresh with `skipCache: true`:

```typescript
// In PurchaseAdvisor component
await fetch('/api/advisor', { method: 'DELETE' }); // Clear cache
await fetch('/api/advisor', { method: 'POST' }); // Get fresh
```

### Production Caching

For production, replace in-memory cache with Redis:

```typescript
// lib/cache.ts - Production version

import { redis } from '@/lib/redis';

export async function getCached(userId: string) {
  return redis.get(`advisor:${userId}`);
}

export async function setCached(userId: string, response: PurchaseAdvisorResponse) {
  await redis.setex(`advisor:${userId}`, 3600, JSON.stringify(response));
}
```

## PII Anonymization

The system automatically anonymizes merchant names:

```
Amazon          → online_retailer_1
Whole Foods     → grocery_store_1
Starbucks       → coffee_shop
Target          → retail_store_2
Local Restaurant → merchant_L
```

Fields **excluded** from API payloads:
- User IDs
- User names
- Emails
- Phone numbers
- Exact timestamps
- Location data
- Account numbers

See [PII_HANDLING.md](./PII_HANDLING.md) for details.

## Error Handling

### Common Errors and Solutions

**401 Unauthorized**
- Ensure Bearer token is included
- Verify token is valid
- Check authentication logic

**400 Bad Request**
- Validate request structure matches schema
- Ensure all required fields are present
- Check data types (amounts should be numbers)

**503 Service Unavailable**
- OpenAI API is down or rate limited
- Check API key is valid
- Verify account has credits
- Implement retry logic

### Client-Side Error Handling

```typescript
// Use AdvisorErrorState component
function handleError(error: Error) {
  return <AdvisorErrorState
    error={error.message}
    onRetry={() => fetchRecommendations()}
  />;
}
```

## Testing

### Run Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# With coverage
npm test -- --coverage

# UI
npm run test:ui
```

### Test Files

- `__tests__/api/advisor.test.ts` - API route tests
- `__tests__/lib/advisor.test.ts` - Advisor logic tests
- `__tests__/lib/cache.test.ts` - Cache tests
- `__tests__/components/PurchaseAdvisor.test.tsx` - Component tests
- `__tests__/integration/advisor-flow.test.ts` - Integration tests

### Mock Data

Use mock responses for testing:

```typescript
import {
  mockAdvisorInput,
  mockAdvisorResponse,
} from '@/__mocks__/advisor-responses';
```

## Monitoring and Logging

### Production Logging

Add logging to track usage:

```typescript
// lib/advisor.ts
console.log(`[Advisor] User ${userId} requested recommendations`);
console.log(`[Advisor] Generated ${response.recommendations.length} categories`);
console.log(`[Advisor] Cache hit for user ${userId}`);
```

### Metrics to Track

- API calls per user
- Cache hit rate
- Average response time
- OpenAI API costs
- Error rates by type

## Performance Optimization

1. **Batch requests** - Group multiple users' requests
2. **Rate limiting** - Implement per-user limits
3. **Data minimization** - Send only recent transactions
4. **Async processing** - Use queues for heavy computations
5. **CDN caching** - Cache successful responses

## Future Enhancements

- [ ] Persistent caching with Redis
- [ ] Multi-language support
- [ ] Personalized savings plans
- [ ] Bank API integration
- [ ] Real-time notifications
- [ ] Trend analysis over time
- [ ] Predictive recommendations

## Troubleshooting

### Component not rendering

```typescript
// Check if input is being passed correctly
console.log('Input:', input);
console.log('Token:', token);

// Ensure token is not empty
if (!token || !input) return <div>Loading...</div>;
```

### API returning 500

```typescript
// Check environment variables
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);

// Check request payload
console.log('Request:', req.json());
```

### Cache not clearing

```typescript
// Manually clear
await fetch('/api/advisor', { method: 'DELETE' });

// Verify cache was cleared
// Set breakpoint in lib/cache.ts clear() method
```

## Support

For issues or questions:
1. Check [PII_HANDLING.md](./PII_HANDLING.md) for data handling questions
2. Review test files for usage examples
3. Check mock data in `__mocks__/advisor-responses.ts`
4. Open an issue on the repository
