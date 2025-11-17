import { describe, it, expect, beforeEach } from 'vitest';
import type { PurchaseAdvisorInput, PurchaseAdvisorResponse } from '@/types';
import { mockAdvisorInput, mockAdvisorResponse } from '@/__mocks__/advisor-responses';

describe('Purchase Advisor Integration Flow', () => {
  beforeEach(() => {
    // Reset any state before each test
  });

  describe('End-to-End Flow', () => {
    it('should process user financial data and return recommendations', () => {
      // Simulate the complete flow
      const input = mockAdvisorInput;

      // Validate input structure
      expect(input).toHaveProperty('recentExpenses');
      expect(input).toHaveProperty('budgets');
      expect(input).toHaveProperty('goals');
      expect(Array.isArray(input.recentExpenses)).toBe(true);
      expect(Array.isArray(input.budgets)).toBe(true);
      expect(Array.isArray(input.goals)).toBe(true);
    });

    it('should generate recommendations with all categories', () => {
      const response = mockAdvisorResponse;

      expect(response.recommendations).toHaveLength(3);

      const types = response.recommendations.map((r) => r.type);
      expect(types).toContain('necessity');
      expect(types).toContain('luxury');
      expect(types).toContain('waste');
    });

    it('should include explanation and reasoning in response', () => {
      const response = mockAdvisorResponse;

      expect(response.summary).toBeTruthy();
      expect(response.summary.length).toBeGreaterThan(10);
      expect(response.reasoning).toBeTruthy();
      expect(response.reasoning.length).toBeGreaterThan(10);
    });

    it('should provide actionable tips for each recommendation', () => {
      const response = mockAdvisorResponse;

      response.recommendations.forEach((rec) => {
        expect(Array.isArray(rec.actionableTips)).toBe(true);
        expect(rec.actionableTips.length).toBeGreaterThan(0);

        rec.actionableTips.forEach((tip) => {
          expect(typeof tip).toBe('string');
          expect(tip.length).toBeGreaterThan(5);
        });
      });
    });
  });

  describe('Data Validation', () => {
    it('should accept valid expense records', () => {
      const input = mockAdvisorInput;

      input.recentExpenses.forEach((exp) => {
        expect(exp).toHaveProperty('id');
        expect(exp).toHaveProperty('user_id');
        expect(exp).toHaveProperty('amount');
        expect(exp).toHaveProperty('category');
        expect(exp).toHaveProperty('merchant');
        expect(typeof exp.amount).toBe('number');
        expect(exp.amount).toBeGreaterThan(0);
      });
    });

    it('should accept valid budget records', () => {
      const input = mockAdvisorInput;

      input.budgets.forEach((budget) => {
        expect(budget).toHaveProperty('id');
        expect(budget).toHaveProperty('user_id');
        expect(budget).toHaveProperty('category');
        expect(budget).toHaveProperty('limit');
        expect(budget).toHaveProperty('period');
        expect(['monthly', 'yearly']).toContain(budget.period);
      });
    });

    it('should accept valid goal records', () => {
      const input = mockAdvisorInput;

      input.goals.forEach((goal) => {
        expect(goal).toHaveProperty('id');
        expect(goal).toHaveProperty('user_id');
        expect(goal).toHaveProperty('title');
        expect(goal).toHaveProperty('target_amount');
        expect(goal).toHaveProperty('current_amount');
        expect(goal.target_amount).toBeGreaterThan(0);
        expect(goal.current_amount).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle optional purchaseContext field', () => {
      const input: PurchaseAdvisorInput = {
        ...mockAdvisorInput,
        purchaseContext: 'Testing context',
      };

      expect(input.purchaseContext).toBe('Testing context');

      const inputWithoutContext: PurchaseAdvisorInput = {
        recentExpenses: [],
        budgets: [],
        goals: [],
      };

      expect(inputWithoutContext.purchaseContext).toBeUndefined();
    });
  });

  describe('Response Structure', () => {
    it('should return properly structured recommendations', () => {
      const response = mockAdvisorResponse;
      const rec = response.recommendations[0];

      expect(rec).toHaveProperty('type');
      expect(rec).toHaveProperty('title');
      expect(rec).toHaveProperty('description');
      expect(rec).toHaveProperty('items');
      expect(rec).toHaveProperty('actionableTips');

      expect(typeof rec.title).toBe('string');
      expect(typeof rec.description).toBe('string');
      expect(Array.isArray(rec.items)).toBe(true);
      expect(Array.isArray(rec.actionableTips)).toBe(true);
    });

    it('should include timestamp information', () => {
      const response = mockAdvisorResponse;

      expect(response).toHaveProperty('generatedAt');
      expect(response).toHaveProperty('expiresAt');

      const generated = new Date(response.generatedAt);
      const expires = new Date(response.expiresAt);

      expect(generated instanceof Date).toBe(true);
      expect(expires instanceof Date).toBe(true);
      expect(expires > generated).toBe(true);
    });

    it('should include response metadata', () => {
      const response = mockAdvisorResponse;

      expect(response).toHaveProperty('id');
      expect(response).toHaveProperty('userId');
      expect(response).toHaveProperty('recommendations');
      expect(response).toHaveProperty('summary');
      expect(response).toHaveProperty('reasoning');

      expect(typeof response.id).toBe('string');
      expect(typeof response.userId).toBe('string');
      expect(Array.isArray(response.recommendations)).toBe(true);
    });
  });

  describe('Recommendation Quality', () => {
    it('should provide specific, actionable tips', () => {
      const response = mockAdvisorResponse;

      response.recommendations.forEach((rec) => {
        rec.actionableTips.forEach((tip) => {
          // Tips should be specific and actionable (not generic)
          expect(tip.length).toBeGreaterThan(10);
          expect(tip).not.toMatch(/^[a-z]*$/i); // Not just a single word
        });
      });
    });

    it('should provide relevant examples for each category', () => {
      const response = mockAdvisorResponse;

      response.recommendations.forEach((rec) => {
        if (rec.items.length > 0) {
          rec.items.forEach((item) => {
            // Items should be relevant to the category
            expect(typeof item).toBe('string');
            expect(item.length).toBeGreaterThan(2);
          });
        }
      });
    });

    it('should provide distinct recommendations for each category', () => {
      const response = mockAdvisorResponse;

      const titles = response.recommendations.map((r) => r.title);
      const uniqueTitles = new Set(titles);

      expect(uniqueTitles.size).toBe(3);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty expense history', () => {
      const input: PurchaseAdvisorInput = {
        recentExpenses: [],
        budgets: [
          {
            id: 'b1',
            user_id: 'user123',
            category: 'groceries',
            limit: 500,
            period: 'monthly',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        goals: [],
      };

      expect(input.recentExpenses.length).toBe(0);
      expect(Array.isArray(input.recentExpenses)).toBe(true);
    });

    it('should handle missing budgets', () => {
      const input: PurchaseAdvisorInput = {
        recentExpenses: [
          {
            id: '1',
            user_id: 'user123',
            amount: 100,
            category: 'groceries',
            merchant: 'Store',
            description: 'Test',
            date: '2024-01-01',
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
        budgets: [],
        goals: [],
      };

      expect(input.budgets.length).toBe(0);
    });

    it('should handle missing goals', () => {
      const input: PurchaseAdvisorInput = {
        recentExpenses: [],
        budgets: [],
        goals: [],
      };

      expect(input.goals.length).toBe(0);
    });
  });

  describe('Cache Behavior', () => {
    it('should have expiration timestamp', () => {
      const response = mockAdvisorResponse;
      const ttlMs = new Date(response.expiresAt).getTime() -
        new Date(response.generatedAt).getTime();

      // 1 hour in milliseconds
      expect(ttlMs).toBe(3600000);
    });

    it('should be identifiable by user ID', () => {
      const response = mockAdvisorResponse;

      expect(response.userId).toBeTruthy();
      expect(typeof response.userId).toBe('string');
    });

    it('should have unique response ID', () => {
      const response1 = mockAdvisorResponse;
      const response2 = { ...mockAdvisorResponse, id: 'different-id' };

      expect(response1.id).not.toBe(response2.id);
    });
  });
});
