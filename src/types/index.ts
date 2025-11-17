// Transaction types
export interface Transaction {
  id: string
  user_id: string
  category_id: string
  amount: number
  description: string
  date: string
  type: 'income' | 'expense'
  created_at: string
  updated_at: string
}

// Category types
export interface Category {
  id: string
  user_id: string
  name: string
  color: string
  icon: string
  created_at: string
  updated_at: string
}

// Analytics types
export interface CategorySpend {
  category_id: string
  category_name: string
  total_amount: number
  transaction_count: number
  percentage: number
}

export interface MonthlyTrend {
  month: string
  income: number
  expenses: number
  net: number
}

export interface DailySpend {
  date: string
  amount: number
  category_name: string
  category_id: string
}

export interface AnalyticsFilters {
  startDate: Date
  endDate: Date
  categoryIds?: string[]
  transactionType?: 'income' | 'expense' | 'all'
}

export interface AnalyticsData {
  categorySpends: CategorySpend[]
  monthlyTrends: MonthlyTrend[]
  incomeTotal: number
  expensesTotal: number
  balance: number
  topExpenses: Transaction[]
  anomalies: SpendingAnomaly[]
}

export interface SpendingAnomaly {
  date: string
  category_name: string
  amount: number
  percentageAboveAverage: number
  reason?: string
}

export interface ForecastProjection {
  month: string
  projected_income: number
  projected_expenses: number
  projected_balance: number
  confidence: number
}

// Pagination types
export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Export types
export interface ExportOptions {
  format: 'csv' | 'pdf'
  includeCharts?: boolean
  dateRange?: {
    startDate: Date
    endDate: Date
  }
}

export interface ExportData {
  fileName: string
  content: string | Blob
  mimeType: string
}
