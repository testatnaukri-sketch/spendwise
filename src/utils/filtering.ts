import { Transaction, AnalyticsFilters, CategorySpend } from '@/types'
import { isWithinInterval, parseISO } from 'date-fns'

export function filterTransactionsByDateRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] {
  return transactions.filter((t) => {
    const transactionDate = parseISO(t.date)
    return isWithinInterval(transactionDate, {
      start: startDate,
      end: endDate,
    })
  })
}

export function filterTransactionsByCategory(
  transactions: Transaction[],
  categoryIds: string[]
): Transaction[] {
  if (!categoryIds || categoryIds.length === 0) {
    return transactions
  }
  return transactions.filter((t) => categoryIds.includes(t.category_id))
}

export function filterTransactionsByType(
  transactions: Transaction[],
  type: 'income' | 'expense' | 'all'
): Transaction[] {
  if (type === 'all') {
    return transactions
  }
  return transactions.filter((t) => t.type === type)
}

export function applyFilters(
  transactions: Transaction[],
  filters: AnalyticsFilters
): Transaction[] {
  let filtered = transactions

  filtered = filterTransactionsByDateRange(filtered, filters.startDate, filters.endDate)

  if (filters.categoryIds) {
    filtered = filterTransactionsByCategory(filtered, filters.categoryIds)
  }

  if (filters.transactionType) {
    filtered = filterTransactionsByType(filtered, filters.transactionType)
  }

  return filtered
}

export function sortCategorySpendsByAmount(
  spends: CategorySpend[],
  ascending: boolean = false
): CategorySpend[] {
  return [...spends].sort((a, b) => {
    const diff = a.total_amount - b.total_amount
    return ascending ? diff : -diff
  })
}

export function filterCategorySpendsByMinAmount(
  spends: CategorySpend[],
  minAmount: number
): CategorySpend[] {
  return spends.filter((s) => s.total_amount >= minAmount)
}

export function validateDateRange(
  startDate: Date,
  endDate: Date
): { valid: boolean; error?: string } {
  if (startDate > endDate) {
    return { valid: false, error: 'Start date must be before end date' }
  }

  const thirtyYearsAgo = new Date()
  thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30)

  if (startDate < thirtyYearsAgo) {
    return { valid: false, error: 'Date range cannot exceed 30 years' }
  }

  return { valid: true }
}
