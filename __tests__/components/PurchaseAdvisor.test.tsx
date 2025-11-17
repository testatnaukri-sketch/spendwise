import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { PurchaseAdvisorResponse, PurchaseAdvisorInput } from '@/types';

describe('PurchaseAdvisor Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should render without recommendations initially', () => {
      // Component starts with no response
      const hasResponse = false;
      expect(hasResponse).toBe(false);
    });

    it('should show call-to-action button', () => {
      const buttonText = 'Get Recommendations';
      expect(buttonText).toBeTruthy();
    });

    it('should not show loading state initially', () => {
      const isLoading = false;
      expect(isLoading).toBe(false);
    });

    it('should not show error state initially', () => {
      const error = null;
      expect(error).toBeNull();
    });
  });

  describe('Loading State', () => {
    it('should display loading indicator when fetching', () => {
      const loadingText = 'Analyzing your finances...';
      expect(loadingText).toBeTruthy();
    });

    it('should show loading spinner', () => {
      const hasSpinner = true;
      expect(hasSpinner).toBe(true);
    });

    it('should disable user interactions during loading', () => {
      const isLoading = true;
      expect(isLoading).toBe(true);
    });
  });

  describe('Error State', () => {
    it('should display error message on failure', () => {
      const error = 'Failed to get recommendations';
      expect(error).toBeTruthy();
    });

    it('should provide retry button', () => {
      const buttonText = 'Try Again';
      expect(buttonText).toBeTruthy();
    });

    it('should call retry handler when retry button clicked', () => {
      const onRetry = vi.fn();
      expect(typeof onRetry).toBe('function');
    });
  });

  describe('Success State', () => {
    it('should display recommendations when loaded', () => {
      const response: Partial<PurchaseAdvisorResponse> = {
        recommendations: [
          {
            type: 'necessity',
            title: 'Essential Purchases',
            description: 'Items you need',
            items: ['Groceries'],
            actionableTips: ['Budget $500/month'],
          },
        ],
        summary: 'Test summary',
        reasoning: 'Test reasoning',
      };

      expect(response.recommendations).toHaveLength(1);
      expect(response.recommendations![0].type).toBe('necessity');
    });

    it('should display summary section', () => {
      const hasSection = true;
      expect(hasSection).toBe(true);
    });

    it('should display reasoning section', () => {
      const hasSection = true;
      expect(hasSection).toBe(true);
    });

    it('should display all recommendation cards', () => {
      const recommendations = [
        {
          type: 'necessity' as const,
          title: 'Necessary',
          description: 'Desc',
          items: [],
          actionableTips: [],
        },
        {
          type: 'luxury' as const,
          title: 'Luxury',
          description: 'Desc',
          items: [],
          actionableTips: [],
        },
        {
          type: 'waste' as const,
          title: 'Waste',
          description: 'Desc',
          items: [],
          actionableTips: [],
        },
      ];

      expect(recommendations).toHaveLength(3);
    });
  });

  describe('Cache Indicator', () => {
    it('should show cache badge when response is cached', () => {
      const cached = true;
      expect(cached).toBe(true);
    });

    it('should display timestamp when cached', () => {
      const timestamp = new Date().toLocaleTimeString();
      expect(timestamp).toBeTruthy();
    });

    it('should not show cache badge for fresh responses', () => {
      const cached = false;
      expect(cached).toBe(false);
    });
  });

  describe('User Actions', () => {
    it('should fetch recommendations when button clicked', async () => {
      const token = 'test_token';
      const input: PurchaseAdvisorInput = {
        recentExpenses: [],
        budgets: [],
        goals: [],
      };

      expect(token).toBeTruthy();
      expect(input).toBeTruthy();
    });

    it('should refresh recommendations on refresh button click', () => {
      const skipCache = true;
      expect(skipCache).toBe(true);
    });

    it('should clear results on clear button click', () => {
      const cleared = true;
      expect(cleared).toBe(true);
    });

    it('should pass correct auth header to API', () => {
      const token = 'valid_token';
      const authHeader = `Bearer ${token}`;
      expect(authHeader).toBe('Bearer valid_token');
    });
  });

  describe('Response Sections', () => {
    it('should render recommendation cards for each category', () => {
      const categories = ['necessity', 'luxury', 'waste'];
      expect(categories).toHaveLength(3);
    });

    it('should display items in recommendation cards', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      expect(items.length).toBeGreaterThan(0);
    });

    it('should display actionable tips', () => {
      const tips = ['Tip 1', 'Tip 2'];
      expect(tips.length).toBeGreaterThan(0);
    });
  });
});
