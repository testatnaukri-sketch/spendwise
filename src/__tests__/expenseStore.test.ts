import { describe, it, expect, beforeEach } from 'vitest'
import { useExpenseStore } from '@/store/expenseStore'
import { Expense } from '@/types/expense'

describe('useExpenseStore', () => {
  beforeEach(() => {
    useExpenseStore.setState({
      expenses: [],
      categories: [],
      merchants: [],
      isLoading: false,
      error: null,
    })
  })

  const mockExpense: Expense = {
    id: 'exp-1',
    userId: 'user-1',
    amount: 25.00,
    category: 'Food',
    merchant: 'Restaurant',
    date: '2024-01-15',
    paymentMethod: 'credit_card',
    notes: 'Lunch',
    tags: ['meal'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  }

  const mockExpense2: Expense = {
    id: 'exp-2',
    userId: 'user-1',
    amount: 50.00,
    category: 'Transport',
    merchant: 'Taxi',
    date: '2024-01-16',
    paymentMethod: 'debit_card',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
  }

  describe('expense management', () => {
    it('should add an expense', () => {
      useExpenseStore.getState().addExpense(mockExpense)
      const state = useExpenseStore.getState()
      expect(state.expenses).toHaveLength(1)
      expect(state.expenses[0]).toEqual(mockExpense)
    })

    it('should add multiple expenses', () => {
      useExpenseStore.getState().addExpense(mockExpense)
      useExpenseStore.getState().addExpense(mockExpense2)
      const state = useExpenseStore.getState()
      expect(state.expenses).toHaveLength(2)
    })

    it('should set expenses', () => {
      const expenses = [mockExpense, mockExpense2]
      useExpenseStore.getState().setExpenses(expenses)
      const state = useExpenseStore.getState()
      expect(state.expenses).toEqual(expenses)
    })

    it('should update an expense', () => {
      useExpenseStore.getState().addExpense(mockExpense)
      const updatedExpense = { ...mockExpense, amount: 30.00 }
      useExpenseStore.getState().updateExpense(updatedExpense)
      const state = useExpenseStore.getState()
      expect(state.expenses[0].amount).toBe(30.00)
    })

    it('should remove an expense', () => {
      useExpenseStore.getState().addExpense(mockExpense)
      useExpenseStore.getState().addExpense(mockExpense2)
      useExpenseStore.getState().removeExpense('exp-1')
      const state = useExpenseStore.getState()
      expect(state.expenses).toHaveLength(1)
      expect(state.expenses[0].id).toBe('exp-2')
    })
  })

  describe('category management', () => {
    it('should set categories', () => {
      const categories = [
        { id: '1', name: 'Food', icon: '🍕' },
        { id: '2', name: 'Transport', icon: '🚗' },
      ]
      useExpenseStore.getState().setCategories(categories)
      const state = useExpenseStore.getState()
      expect(state.categories).toEqual(categories)
    })
  })

  describe('merchant management', () => {
    it('should set merchants', () => {
      const merchants = ['Restaurant', 'Taxi']
      useExpenseStore.getState().setMerchants(merchants)
      const state = useExpenseStore.getState()
      expect(state.merchants).toEqual(merchants)
    })

    it('should add a merchant', () => {
      useExpenseStore.getState().addMerchant('Restaurant')
      const state = useExpenseStore.getState()
      expect(state.merchants).toContain('Restaurant')
    })

    it('should not add duplicate merchants', () => {
      useExpenseStore.getState().addMerchant('Restaurant')
      useExpenseStore.getState().addMerchant('Restaurant')
      const state = useExpenseStore.getState()
      expect(state.merchants).toHaveLength(1)
    })

    it('should add multiple unique merchants', () => {
      useExpenseStore.getState().addMerchant('Restaurant')
      useExpenseStore.getState().addMerchant('Taxi')
      useExpenseStore.getState().addMerchant('Store')
      const state = useExpenseStore.getState()
      expect(state.merchants).toHaveLength(3)
    })
  })

  describe('loading and error state', () => {
    it('should set loading state', () => {
      useExpenseStore.getState().setIsLoading(true)
      expect(useExpenseStore.getState().isLoading).toBe(true)
      useExpenseStore.getState().setIsLoading(false)
      expect(useExpenseStore.getState().isLoading).toBe(false)
    })

    it('should set error state', () => {
      const error = 'Something went wrong'
      useExpenseStore.getState().setError(error)
      expect(useExpenseStore.getState().error).toBe(error)
      useExpenseStore.getState().setError(null)
      expect(useExpenseStore.getState().error).toBeNull()
    })
  })
})
