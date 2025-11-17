import type {
  PurchaseAdvisorResponse,
  PurchaseAdvisorInput,
} from '@/types';

/**
 * Mock responses for testing the Purchase Advisor
 */

export const mockAdvisorInput: PurchaseAdvisorInput = {
  recentExpenses: [
    {
      id: '1',
      user_id: 'user123',
      amount: 150,
      category: 'groceries',
      merchant: 'Whole Foods Market',
      description: 'Weekly groceries',
      date: '2024-01-15',
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      user_id: 'user123',
      amount: 45.99,
      category: 'dining',
      merchant: 'Local Coffee Shop',
      description: 'Coffee and pastry',
      date: '2024-01-15',
      created_at: '2024-01-15T09:30:00Z',
    },
    {
      id: '3',
      user_id: 'user123',
      amount: 89,
      category: 'entertainment',
      merchant: 'Streaming Service',
      description: 'Monthly subscription',
      date: '2024-01-14',
      created_at: '2024-01-14T00:00:00Z',
    },
    {
      id: '4',
      user_id: 'user123',
      amount: 200,
      category: 'utilities',
      merchant: 'Electric Company',
      description: 'Monthly electric bill',
      date: '2024-01-10',
      created_at: '2024-01-10T00:00:00Z',
    },
    {
      id: '5',
      user_id: 'user123',
      amount: 50,
      category: 'impulse',
      merchant: 'Electronics Store',
      description: 'USB cables',
      date: '2024-01-12',
      created_at: '2024-01-12T14:00:00Z',
    },
  ],
  budgets: [
    {
      id: 'b1',
      user_id: 'user123',
      category: 'groceries',
      limit: 500,
      period: 'monthly',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: 'b2',
      user_id: 'user123',
      category: 'dining',
      limit: 200,
      period: 'monthly',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
    {
      id: 'b3',
      user_id: 'user123',
      category: 'entertainment',
      limit: 150,
      period: 'monthly',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-15T00:00:00Z',
    },
  ],
  goals: [
    {
      id: 'g1',
      user_id: 'user123',
      title: 'Emergency Fund',
      target_amount: 10000,
      current_amount: 3500,
      deadline: '2024-12-31',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'g2',
      user_id: 'user123',
      title: 'Vacation Fund',
      target_amount: 5000,
      current_amount: 1200,
      deadline: '2024-06-30',
      created_at: '2024-01-01T00:00:00Z',
    },
  ],
  purchaseContext: 'Considering a new laptop purchase for $1500',
};

export const mockAdvisorResponse: PurchaseAdvisorResponse = {
  id: 'advisor-resp-123',
  userId: 'user123',
  recommendations: [
    {
      type: 'necessity',
      title: 'Essential Purchases',
      description: 'Items that are necessary for your daily life and wellbeing',
      items: [
        'Groceries and household essentials',
        'Utilities and rent/mortgage',
        'Transportation',
        'Insurance',
      ],
      actionableTips: [
        'Stick to your $500 grocery budget by meal planning',
        'Buy store brands to save 20-30%',
        'Use grocery loyalty programs for discounts',
      ],
    },
    {
      type: 'luxury',
      title: 'Discretionary Spending',
      description:
        'Items that are nice to have but not essential; can be budgeted for',
      items: [
        'Dining out and coffee ($45.99/day exceeds budget)',
        'Entertainment subscriptions ($89/month)',
        'Hobbies and personal interests',
      ],
      actionableTips: [
        'Your dining budget is at 23% already; consider meal prep to reduce frequency',
        'Entertainment is a 59% of monthly budget; consider pausing one streaming service',
        'Allocate "fun money" deliberately rather than impulse spending',
      ],
    },
    {
      type: 'waste',
      title: 'Unnecessary Spending',
      description:
        'Items that could be eliminated or significantly reduced without impacting quality of life',
      items: [
        'Impulse purchases like $50 USB cables',
        'Unused subscriptions or services',
        'Duplicate or redundant purchases',
      ],
      actionableTips: [
        'Audit all subscriptions monthly to eliminate unused services',
        'Implement a 30-day rule for non-essential purchases',
        'Use browser extensions to find coupon codes before buying',
        'The $50 USB cable purchase is a red flag - shop around first',
      ],
    },
  ],
  summary:
    "You're doing well overall with your budget! Your essentials are well-managed, but discretionary spending shows room for optimization. Focus on reducing impulse purchases to accelerate your emergency fund goal.",
  reasoning:
    'Analysis based on your recent spending patterns, budget allocations, and financial goals. Your necessary expenses are sustainable, but discretionary spending is trending high. The $1500 laptop would set back your emergency fund by a month - consider postponing until you reach $5000 in savings.',
  generatedAt: '2024-01-15T15:30:00Z',
  expiresAt: '2024-01-15T16:30:00Z',
};

export const mockAdvisorErrorResponse = {
  error: 'Failed to connect to AI service. Please try again later.',
};

export const mockValidationError = {
  error: 'Invalid request data',
  details: [
    {
      path: ['recentExpenses'],
      message: 'Expected array',
    },
  ],
};
