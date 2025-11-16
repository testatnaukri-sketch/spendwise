import { create } from 'zustand'
import { Expense, Category } from '@/types/expense'

interface ExpenseStore {
  expenses: Expense[]
  categories: Category[]
  merchants: string[]
  isLoading: boolean
  error: string | null
  
  setExpenses: (expenses: Expense[]) => void
  addExpense: (expense: Expense) => void
  updateExpense: (expense: Expense) => void
  removeExpense: (id: string) => void
  
  setCategories: (categories: Category[]) => void
  setMerchants: (merchants: string[]) => void
  addMerchant: (merchant: string) => void
  
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: [],
  categories: [],
  merchants: [],
  isLoading: false,
  error: null,
  
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) => set((state) => ({ 
    expenses: [expense, ...state.expenses] 
  })),
  updateExpense: (expense) => set((state) => ({
    expenses: state.expenses.map((e) => e.id === expense.id ? expense : e)
  })),
  removeExpense: (id) => set((state) => ({
    expenses: state.expenses.filter((e) => e.id !== id)
  })),
  
  setCategories: (categories) => set({ categories }),
  setMerchants: (merchants) => set({ merchants }),
  addMerchant: (merchant) => set((state) => {
    const existing = state.merchants.includes(merchant)
    return {
      merchants: existing ? state.merchants : [...state.merchants, merchant]
    }
  }),
  
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
