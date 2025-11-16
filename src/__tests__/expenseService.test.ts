import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ExpenseService } from '@/services/expenseService'
import * as supabaseModule from '@/lib/supabase'
import { ExpenseFormData } from '@/types/expense'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('ExpenseService', () => {
  const mockUserId = 'user-123'
  const mockExpenseData: ExpenseFormData = {
    amount: 50.00,
    category: 'Food',
    merchant: 'Pizza Place',
    date: '2024-01-15',
    paymentMethod: 'credit_card',
    notes: 'Dinner',
    tags: ['meal'],
  }

  const mockExpenseResponse = {
    id: 'exp-123',
    user_id: mockUserId,
    amount: 50.00,
    category: 'Food',
    merchant: 'Pizza Place',
    date: '2024-01-15',
    payment_method: 'credit_card',
    notes: 'Dinner',
    tags: ['meal'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createExpense', () => {
    it('should create an expense with valid data', async () => {
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockExpenseResponse,
            error: null,
          }),
        }),
      })

      vi.mocked(supabaseModule.supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any)

      const result = await ExpenseService.createExpense(mockUserId, mockExpenseData)

      expect(result).toEqual({
        id: mockExpenseResponse.id,
        userId: mockUserId,
        amount: 50.00,
        category: 'Food',
        merchant: 'Pizza Place',
        date: '2024-01-15',
        paymentMethod: 'credit_card',
        notes: 'Dinner',
        tags: ['meal'],
        createdAt: mockExpenseResponse.created_at,
        updatedAt: mockExpenseResponse.updated_at,
      })
      expect(mockInsert).toHaveBeenCalled()
    })

    it('should throw error when create fails', async () => {
      const mockError = new Error('Database error')
      const mockInsert = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        }),
      })

      vi.mocked(supabaseModule.supabase.from).mockReturnValue({
        insert: mockInsert,
      } as any)

      await expect(
        ExpenseService.createExpense(mockUserId, mockExpenseData)
      ).rejects.toThrow()
    })
  })

  describe('getExpenses', () => {
    it('should fetch expenses for a user', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: [mockExpenseResponse],
            error: null,
          }),
        }),
      })

      vi.mocked(supabaseModule.supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await ExpenseService.getExpenses(mockUserId)

      expect(result).toHaveLength(1)
      expect(result[0].userId).toBe(mockUserId)
      expect(mockSelect).toHaveBeenCalledWith('*')
    })

    it('should handle empty results', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      })

      vi.mocked(supabaseModule.supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await ExpenseService.getExpenses(mockUserId)

      expect(result).toEqual([])
    })
  })

  describe('getCategories', () => {
    it('should fetch categories', async () => {
      const mockCategories = [
        { id: '1', name: 'Food', icon: '🍕' },
        { id: '2', name: 'Transport', icon: '🚗' },
      ]

      const mockSelect = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({
          data: mockCategories,
          error: null,
        }),
      })

      vi.mocked(supabaseModule.supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await ExpenseService.getCategories()

      expect(result).toEqual(mockCategories)
      expect(mockSelect).toHaveBeenCalledWith('*')
    })
  })

  describe('getMerchants', () => {
    it('should fetch unique merchants for a user', async () => {
      const mockExpenses = [
        { merchant: 'Pizza Place' },
        { merchant: 'McDonald\'s' },
        { merchant: 'Pizza Place' },
      ]

      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: mockExpenses,
              error: null,
            }),
          }),
        }),
      })

      vi.mocked(supabaseModule.supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await ExpenseService.getMerchants(mockUserId)

      expect(result).toHaveLength(2)
      expect(result).toContain('Pizza Place')
      expect(result).toContain('McDonald\'s')
    })

    it('should handle empty merchant list', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      })

      vi.mocked(supabaseModule.supabase.from).mockReturnValue({
        select: mockSelect,
      } as any)

      const result = await ExpenseService.getMerchants(mockUserId)

      expect(result).toEqual([])
    })
  })

  describe('deleteExpense', () => {
    it('should delete an expense', async () => {
      const mockDelete = vi.fn().mockReturnValue({
        eq: vi.fn()
          .mockReturnValue({
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          }),
      })

      vi.mocked(supabaseModule.supabase.from).mockReturnValue({
        delete: mockDelete,
      } as any)

      await expect(
        ExpenseService.deleteExpense(mockUserId, 'exp-123')
      ).resolves.not.toThrow()

      expect(mockDelete).toHaveBeenCalled()
    })
  })
})
