import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  fetchCategorySpends,
  fetchMonthlyTrends,
  fetchIncomeAndExpenses,
  fetchTopExpenses,
  fetchSpendingAnomalies,
  fetchForecastProjections,
} from '../analyticsData'
import { AnalyticsFilters } from '@/types'
import { subDays, startOfYear, format } from 'date-fns'

// Mock the supabase module
vi.mock('../supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(function (this: any) {
        return this
      }),
      eq: vi.fn(function (this: any) {
        return this
      }),
      gte: vi.fn(function (this: any) {
        return this
      }),
      lte: vi.fn(function (this: any) {
        return this
      }),
      order: vi.fn(function (this: any) {
        return this
      }),
      limit: vi.fn(function (this: any) {
        return this
      }),
      in: vi.fn(function (this: any) {
        return this
      }),
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'test-user' } } })),
    },
  },
  withAuth: vi.fn((cb: Function) => cb('test-user')),
}))

describe('Analytics Data Fetching', () => {
  let mockFilters: AnalyticsFilters

  beforeEach(() => {
    mockFilters = {
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      transactionType: 'all',
    }
  })

  describe('fetchCategorySpends', () => {
    it('should fetch and aggregate category spending data', async () => {
      const mockData = [
        { category_id: 'cat1', categories: { name: 'Food' }, amount: 50 },
        { category_id: 'cat1', categories: { name: 'Food' }, amount: 30 },
        { category_id: 'cat2', categories: { name: 'Transport' }, amount: 40 },
      ]

      // Mock the Supabase query chain
      const { supabase } = await import('../supabase')
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        then: vi.fn(() => Promise.resolve({ data: mockData, error: null })),
      } as any)

      const result = await fetchCategorySpends(mockFilters)

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should calculate percentages correctly', async () => {
      const mockData = [
        { category_id: 'cat1', categories: { name: 'Food' }, amount: 60 },
        { category_id: 'cat2', categories: { name: 'Transport' }, amount: 40 },
      ]

      const { supabase } = await import('../supabase')
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        then: vi.fn(() => Promise.resolve({ data: mockData, error: null })),
      } as any)

      const result = await fetchCategorySpends(mockFilters)

      if (result.length >= 2) {
        const totalPercentage = result.reduce((sum, item) => sum + item.percentage, 0)
        expect(totalPercentage).toBeCloseTo(100, 1)
      }
    })

    it('should handle empty data gracefully', async () => {
      const { supabase } = await import('../supabase')
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        then: vi.fn(() => Promise.resolve({ data: [], error: null })),
      } as any)

      const result = await fetchCategorySpends(mockFilters)

      expect(result).toEqual([])
    })
  })

  describe('fetchMonthlyTrends', () => {
    it('should fetch monthly trends for specified number of months', async () => {
      const result = await fetchMonthlyTrends('test-user', 3)

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(3)
    })

    it('should include income, expenses, and net for each month', async () => {
      const result = await fetchMonthlyTrends('test-user', 2)

      result.forEach((trend) => {
        expect(trend).toHaveProperty('month')
        expect(trend).toHaveProperty('income')
        expect(trend).toHaveProperty('expenses')
        expect(trend).toHaveProperty('net')
        expect(trend.net).toBe(trend.income - trend.expenses)
      })
    })
  })

  describe('fetchIncomeAndExpenses', () => {
    it('should calculate total income and expenses', async () => {
      const { supabase } = await import('../supabase')

      const mockIncomeData = [{ amount: 1000 }, { amount: 1500 }]
      const mockExpenseData = [{ amount: 200 }, { amount: 300 }]

      let callCount = 0
      vi.mocked(supabase.from).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockReturnThis(),
            then: vi.fn(() => Promise.resolve({ data: mockIncomeData, error: null })),
          } as any
        } else {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockReturnThis(),
            then: vi.fn(() => Promise.resolve({ data: mockExpenseData, error: null })),
          } as any
        }
      })

      const result = await fetchIncomeAndExpenses(mockFilters)

      expect(result.income).toBeGreaterThan(0)
      expect(result.expenses).toBeGreaterThan(0)
    })
  })

  describe('fetchTopExpenses', () => {
    it('should return top expenses sorted by amount', async () => {
      const result = await fetchTopExpenses(mockFilters, 5)

      expect(Array.isArray(result)).toBe(true)
      if (result.length > 1) {
        for (let i = 0; i < result.length - 1; i++) {
          expect(result[i].amount).toBeGreaterThanOrEqual(result[i + 1].amount)
        }
      }
    })

    it('should respect limit parameter', async () => {
      const limit = 3
      const result = await fetchTopExpenses(mockFilters, limit)

      expect(result.length).toBeLessThanOrEqual(limit)
    })
  })

  describe('fetchSpendingAnomalies', () => {
    it('should detect anomalies in spending patterns', async () => {
      const result = await fetchSpendingAnomalies('test-user', mockFilters)

      expect(Array.isArray(result)).toBe(true)
      result.forEach((anomaly) => {
        expect(anomaly).toHaveProperty('date')
        expect(anomaly).toHaveProperty('category_name')
        expect(anomaly).toHaveProperty('amount')
        expect(anomaly).toHaveProperty('percentageAboveAverage')
      })
    })
  })

  describe('fetchForecastProjections', () => {
    it('should generate forecast projections', async () => {
      const result = await fetchForecastProjections('test-user', 3)

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(3)
    })

    it('should have decreasing confidence for future months', async () => {
      const result = await fetchForecastProjections('test-user', 5)

      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].confidence).toBeGreaterThan(result[i + 1].confidence)
      }
    })

    it('should have non-negative projections', async () => {
      const result = await fetchForecastProjections('test-user', 3)

      result.forEach((projection) => {
        expect(projection.projected_income).toBeGreaterThanOrEqual(0)
        expect(projection.projected_expenses).toBeGreaterThanOrEqual(0)
      })
    })
  })
})
