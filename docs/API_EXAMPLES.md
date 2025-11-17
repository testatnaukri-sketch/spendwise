# Purchase Advisor API Examples

This document provides practical examples of how to use the Purchase Advisor API.

## Basic Usage

### JavaScript/TypeScript

```typescript
import type { PurchaseAdvisorInput } from '@/types';

// 1. Prepare financial data
const advisorInput: PurchaseAdvisorInput = {
  recentExpenses: [
    {
      id: 'exp1',
      user_id: 'user123',
      amount: 50.99,
      category: 'groceries',
      merchant: 'Whole Foods Market',
      description: 'Weekly groceries',
      date: '2024-01-15',
      created_at: '2024-01-15T10:00:00Z',
    },
  ],
  budgets: [
    {
      id: 'bud1',
      user_id: 'user123',
      category: 'groceries',
      limit: 500,
      period: 'monthly',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
  ],
  goals: [
    {
      id: 'goal1',
      user_id: 'user123',
      title: 'Emergency Fund',
      target_amount: 10000,
      current_amount: 3500,
      deadline: '2024-12-31',
      created_at: '2024-01-01T00:00:00Z',
    },
  ],
  purchaseContext: 'Considering buying a new laptop',
};

// 2. Fetch recommendations
const response = await fetch('/api/advisor', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`,
  },
  body: JSON.stringify(advisorInput),
});

const recommendations = await response.json();

// 3. Use the recommendations
if (response.ok) {
  console.log('Summary:', recommendations.summary);
  console.log('Cached:', recommendations.cached);
  recommendations.recommendations.forEach((rec) => {
    console.log(`${rec.type}: ${rec.title}`);
    console.log(`Tips: ${rec.actionableTips.join(', ')}`);
  });
}
```

## React Component Integration

### Using the PurchaseAdvisor Component

```typescript
'use client';

import { PurchaseAdvisor } from '@/components/PurchaseAdvisor';
import { useEffect, useState } from 'react';
import type { PurchaseAdvisorInput } from '@/types';

export default function DashboardPage() {
  const [input, setInput] = useState<PurchaseAdvisorInput | null>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      // 1. Get user authentication token
      const authToken = await getAuthToken();

      // 2. Fetch from Supabase
      const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('date', { ascending: false });

      const { data: budgets } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);

      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);

      setToken(authToken);
      setInput({
        recentExpenses: expenses || [],
        budgets: budgets || [],
        goals: goals || [],
      });
    }

    loadData();
  }, []);

  if (!input || !token) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
      <PurchaseAdvisor token={token} input={input} />
    </div>
  );
}
```

### Using the AdvisorPanel Component

```typescript
import { AdvisorPanel } from '@/components/AdvisorPanel';

export default function HomePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdvisorPanel
        token={userToken}
        input={financialData}
        title="Financial Advisor"
      />
    </div>
  );
}
```

## cURL Examples

### Get Recommendations

```bash
curl -X POST http://localhost:3000/api/advisor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "recentExpenses": [
      {
        "id": "1",
        "user_id": "user123",
        "amount": 100,
        "category": "groceries",
        "merchant": "Whole Foods",
        "description": "Weekly shopping",
        "date": "2024-01-15",
        "created_at": "2024-01-15T10:00:00Z"
      }
    ],
    "budgets": [
      {
        "id": "b1",
        "user_id": "user123",
        "category": "groceries",
        "limit": 500,
        "period": "monthly",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-15T00:00:00Z"
      }
    ],
    "goals": [],
    "purchaseContext": "Buying a new phone"
  }'
```

### Clear Cache

```bash
curl -X DELETE http://localhost:3000/api/advisor \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## React Hook for Advisor

Here's a custom hook to simplify usage:

```typescript
// hooks/useAdvisor.ts

import { useState, useCallback } from 'react';
import type { PurchaseAdvisorResponse, PurchaseAdvisorInput } from '@/types';

interface UseAdvisorOptions {
  token: string;
}

export function useAdvisor({ token }: UseAdvisorOptions) {
  const [response, setResponse] = useState<PurchaseAdvisorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = useCallback(
    async (input: PurchaseAdvisorInput) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/advisor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(input),
        });

        if (!res.ok) {
          throw new Error('Failed to get recommendations');
        }

        const data = await res.json();
        setResponse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const clearCache = useCallback(async () => {
    try {
      await fetch('/api/advisor', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setResponse(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cache');
    }
  }, [token]);

  return {
    response,
    loading,
    error,
    getRecommendations,
    clearCache,
  };
}
```

Usage:

```typescript
export function MyComponent() {
  const { response, loading, error, getRecommendations, clearCache } = useAdvisor({
    token: userToken,
  });

  return (
    <div>
      <button onClick={() => getRecommendations(input)} disabled={loading}>
        {loading ? 'Loading...' : 'Get Recommendations'}
      </button>
      {error && <div className="error">{error}</div>}
      {response && (
        <>
          <div>{response.summary}</div>
          <button onClick={clearCache}>Clear Cache</button>
        </>
      )}
    </div>
  );
}
```

## Response Examples

### Successful Response

```json
{
  "id": "advisor-resp-123",
  "userId": "user123",
  "recommendations": [
    {
      "type": "necessity",
      "title": "Essential Purchases",
      "description": "Items that are necessary for your daily life",
      "items": [
        "Groceries",
        "Utilities",
        "Transportation"
      ],
      "actionableTips": [
        "Stick to your $500 grocery budget by meal planning",
        "Use loyalty programs for discounts"
      ]
    },
    {
      "type": "luxury",
      "title": "Discretionary Spending",
      "description": "Items that are nice to have but optional",
      "items": [
        "Dining out",
        "Entertainment subscriptions",
        "Hobbies"
      ],
      "actionableTips": [
        "Limit dining out to 2-3 times per week",
        "Consider pausing one streaming service"
      ]
    },
    {
      "type": "waste",
      "title": "Unnecessary Spending",
      "description": "Items that could be eliminated",
      "items": [
        "Impulse purchases",
        "Unused subscriptions"
      ],
      "actionableTips": [
        "Implement 30-day rule for purchases",
        "Audit subscriptions monthly"
      ]
    }
  ],
  "summary": "You're doing well overall! Keep up with your budget discipline.",
  "reasoning": "Based on your recent transactions and budget allocation, you're tracking well.",
  "generatedAt": "2024-01-15T15:30:00Z",
  "expiresAt": "2024-01-15T16:30:00Z",
  "cached": false
}
```

### Error Response (401 Unauthorized)

```json
{
  "error": "Unauthorized: Missing or invalid authentication"
}
```

### Error Response (400 Bad Request)

```json
{
  "error": "Invalid request data",
  "details": [
    {
      "path": ["recentExpenses"],
      "message": "Expected array, received string"
    }
  ]
}
```

### Error Response (503 Service Unavailable)

```json
{
  "error": "Failed to generate recommendations. Please try again later."
}
```

## Best Practices

### 1. Token Management

```typescript
// Always include Bearer token
const headers = {
  'Authorization': `Bearer ${await getValidToken()}`,
  'Content-Type': 'application/json',
};
```

### 2. Error Handling

```typescript
try {
  const response = await fetch('/api/advisor', {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return await response.json();
} catch (error) {
  console.error('Advisor error:', error);
  // Handle error gracefully
}
```

### 3. Data Fetching

```typescript
// Fetch only recent expenses (e.g., last 30 days)
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

const { data: expenses } = await supabase
  .from('expenses')
  .select('*')
  .eq('user_id', userId)
  .gte('date', thirtyDaysAgo.toISOString())
  .order('date', { ascending: false });
```

### 4. Cache Management

```typescript
// Refresh recommendations if needed
const response = await fetch('/api/advisor', { method: 'DELETE' });
if (response.ok) {
  // Fetch fresh recommendations
}
```

### 5. Performance Optimization

```typescript
// Debounce advisor requests
let timeout: NodeJS.Timeout;

function requestAdvisor(input: PurchaseAdvisorInput) {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    getRecommendations(input);
  }, 500);
}
```

## Testing

### Mock Response for Testing

```typescript
import { mockAdvisorResponse } from '@/__mocks__/advisor-responses';

test('displays recommendations', () => {
  // Use mock data in tests
  expect(mockAdvisorResponse.recommendations).toHaveLength(3);
});
```

### API Testing with vitest

```typescript
import { describe, it, expect } from 'vitest';

describe('POST /api/advisor', () => {
  it('returns recommendations with valid token', async () => {
    const response = await fetch('/api/advisor', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer valid_token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockInput),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.recommendations).toBeDefined();
  });
});
```
