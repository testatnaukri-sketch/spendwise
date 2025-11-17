import { useEffect } from 'react'
import { useExpenseStore } from '@/store/expenseStore'
import { ExpenseService } from '@/services/expenseService'
import { Expense } from '@/types/expense'

export const useExpenseSync = (userId: string | undefined) => {
  const { addExpense, updateExpense } = useExpenseStore()

  useEffect(() => {
    if (!userId) return

    const unsubscribe = ExpenseService.subscribeToExpenses(
      userId,
      (expense: Expense) => {
        const { expenses } = useExpenseStore.getState()
        const existingExpense = expenses.find((e) => e.id === expense.id)
        
        if (existingExpense) {
          updateExpense(expense)
        } else {
          addExpense(expense)
        }
      }
    )

    return () => {
      unsubscribe()
    }
  }, [userId, addExpense, updateExpense])
}
