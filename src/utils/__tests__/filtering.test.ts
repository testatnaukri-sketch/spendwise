import { describe, it, expect, beforeEach } from 'vitest'
import {
  filterTransactionsByDateRange,
  filterTransactionsByCategory,
  filterTransactionsByType,
  applyFilters,
  sortCategorySpendsByAmount,
  filterCategorySpendsByMinAmount,
  validateDateRange,
} from '../filtering'
import { Transaction, CategorySpend, AnalyticsFilters } from '@/types'
import { subDays, addDays } from 'date-fns'

describe('Filtering Utilities', () => {
  let mockTransactions: Transaction[]
  let mockCategorySpends: CategorySpend[]

  beforeEach(() => {
    const today = new Date()
    mockTransactions = [
      {
        id: '1',
        user_id: 'user1',
        category_id: 'cat1',
        amount: 50,
        description: 'Groceries',
        date: addDays(today, -5).toISOString().split('T')[0],
        type: 'expense',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        user_id: 'user1',
        category_id: 'cat2',
        amount: 100,
        description: 'Salary',
        date: addDays(today, -10).toISOString().split('T')[0],
        type: 'income',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        user_id: 'user1',
        category_id: 'cat1',
        amount: 30,
        description: 'Coffee',
        date: today.toISOString().split('T')[0],
        type: 'expense',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        user_id: 'user1',
        category_id: 'cat3',
        amount: 200,
        description: 'Gas',
        date: addDays(today, -20).toISOString().split('T')[0],
        type: 'expense',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    mockCategorySpends = [
      { category_id: 'cat1', category_name: 'Food', total_amount: 100, transaction_count: 5, percentage: 50 },
      { category_id: 'cat2', category_name: 'Transport', total_amount: 75, transaction_count: 3, percentage: 37.5 },
      { category_id: 'cat3', category_name: 'Utilities', total_amount: 25, transaction_count: 1, percentage: 12.5 },
    ]
  })

  describe('filterTransactionsByDateRange', () => {
    it('should filter transactions within date range', () => {
      const startDate = subDays(new Date(), 7)
      const endDate = new Date()

      const result = filterTransactionsByDateRange(mockTransactions, startDate, endDate)

      expect(result.length).toBeGreaterThan(0)
      result.forEach((t) => {
        const transDate = new Date(t.date)
        expect(transDate.getTime()).toBeGreaterThanOrEqual(startDate.getTime())
        expect(transDate.getTime()).toBeLessThanOrEqual(endDate.getTime())
      })
    })

    it('should return empty array if no transactions in range', () => {
      const startDate = subDays(new Date(), 2)
      const endDate = addDays(new Date(), 5)

      const result = filterTransactionsByDateRange([], startDate, endDate)

      expect(result).toEqual([])
    })
  })

  describe('filterTransactionsByCategory', () => {
    it('should filter transactions by single category', () => {
      const result = filterTransactionsByCategory(mockTransactions, ['cat1'])

      expect(result.length).toBe(2)
      result.forEach((t) => {
        expect(t.category_id).toBe('cat1')
      })
    })

    it('should filter transactions by multiple categories', () => {
      const result = filterTransactionsByCategory(mockTransactions, ['cat1', 'cat2'])

      expect(result.length).toBe(3)
      result.forEach((t) => {
        expect(['cat1', 'cat2']).toContain(t.category_id)
      })
    })

    it('should return all transactions if category list is empty', () => {
      const result = filterTransactionsByCategory(mockTransactions, [])

      expect(result).toEqual(mockTransactions)
    })
  })

  describe('filterTransactionsByType', () => {
    it('should filter income transactions', () => {
      const result = filterTransactionsByType(mockTransactions, 'income')

      expect(result.length).toBe(1)
      result.forEach((t) => {
        expect(t.type).toBe('income')
      })
    })

    it('should filter expense transactions', () => {
      const result = filterTransactionsByType(mockTransactions, 'expense')

      expect(result.length).toBe(3)
      result.forEach((t) => {
        expect(t.type).toBe('expense')
      })
    })

    it('should return all transactions for "all" type', () => {
      const result = filterTransactionsByType(mockTransactions, 'all')

      expect(result).toEqual(mockTransactions)
    })
  })

  describe('applyFilters', () => {
    it('should apply all filters correctly', () => {
      const filters: AnalyticsFilters = {
        startDate: subDays(new Date(), 15),
        endDate: new Date(),
        categoryIds: ['cat1'],
        transactionType: 'expense',
      }

      const result = applyFilters(mockTransactions, filters)

      result.forEach((t) => {
        expect(t.category_id).toBe('cat1')
        expect(t.type).toBe('expense')
      })
    })

    it('should handle undefined categoryIds', () => {
      const filters: AnalyticsFilters = {
        startDate: subDays(new Date(), 15),
        endDate: new Date(),
        transactionType: 'expense',
      }

      const result = applyFilters(mockTransactions, filters)

      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('sortCategorySpendsByAmount', () => {
    it('should sort by amount in descending order by default', () => {
      const result = sortCategorySpendsByAmount(mockCategorySpends)

      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].total_amount).toBeGreaterThanOrEqual(result[i + 1].total_amount)
      }
    })

    it('should sort by amount in ascending order when specified', () => {
      const result = sortCategorySpendsByAmount(mockCategorySpends, true)

      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].total_amount).toBeLessThanOrEqual(result[i + 1].total_amount)
      }
    })

    it('should not mutate original array', () => {
      const original = [...mockCategorySpends]
      sortCategorySpendsByAmount(mockCategorySpends)

      expect(mockCategorySpends).toEqual(original)
    })
  })

  describe('filterCategorySpendsByMinAmount', () => {
    it('should filter category spends by minimum amount', () => {
      const result = filterCategorySpendsByMinAmount(mockCategorySpends, 50)

      expect(result.length).toBe(2)
      result.forEach((spend) => {
        expect(spend.total_amount).toBeGreaterThanOrEqual(50)
      })
    })

    it('should return empty array if minimum exceeds all amounts', () => {
      const result = filterCategorySpendsByMinAmount(mockCategorySpends, 1000)

      expect(result).toEqual([])
    })
  })

  describe('validateDateRange', () => {
    it('should validate correct date range', () => {
      const startDate = subDays(new Date(), 30)
      const endDate = new Date()

      const result = validateDateRange(startDate, endDate)

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject if start date is after end date', () => {
      const startDate = new Date()
      const endDate = subDays(new Date(), 30)

      const result = validateDateRange(startDate, endDate)

      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should reject if range exceeds 30 years', () => {
      const startDate = subDays(new Date(), 365 * 31)
      const endDate = new Date()

      const result = validateDateRange(startDate, endDate)

      expect(result.valid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })
})
