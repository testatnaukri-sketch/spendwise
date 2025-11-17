import { supabase, withAuth } from './supabase'
import {
  AnalyticsData,
  AnalyticsFilters,
  CategorySpend,
  MonthlyTrend,
  ForecastProjection,
  SpendingAnomaly,
  Transaction,
} from '@/types'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'

export async function fetchCategorySpends(
  filters: AnalyticsFilters
): Promise<CategorySpend[]> {
  return withAuth(async (userId) => {
    const { startDate, endDate, categoryIds } = filters

    let query = supabase
      .from('transactions')
      .select('category_id, categories(name), amount')
      .eq('user_id', userId)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'))
      .eq('type', 'expense')

    if (categoryIds && categoryIds.length > 0) {
      query = query.in('category_id', categoryIds)
    }

    const { data, error } = await query

    if (error) throw error

    const categoryMap = new Map<string, { total: number; count: number; name: string }>()

    data?.forEach((transaction: any) => {
      const categoryId = transaction.category_id
      const categoryName = transaction.categories?.name || 'Uncategorized'

      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, { total: 0, count: 0, name: categoryName })
      }

      const entry = categoryMap.get(categoryId)!
      entry.total += transaction.amount
      entry.count += 1
    })

    const total = Array.from(categoryMap.values()).reduce((sum, entry) => sum + entry.total, 0)

    return Array.from(categoryMap.entries()).map(([categoryId, entry]) => ({
      category_id: categoryId,
      category_name: entry.name,
      total_amount: entry.total,
      transaction_count: entry.count,
      percentage: total > 0 ? (entry.total / total) * 100 : 0,
    }))
  })
}

export async function fetchMonthlyTrends(
  userId: string,
  monthsBack: number = 12
): Promise<MonthlyTrend[]> {
  const trends: MonthlyTrend[] = []

  for (let i = monthsBack - 1; i >= 0; i--) {
    const month = subMonths(new Date(), i)
    const start = format(startOfMonth(month), 'yyyy-MM-dd')
    const end = format(endOfMonth(month), 'yyyy-MM-dd')

    const { data: incomeData, error: incomeError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'income')
      .gte('date', start)
      .lte('date', end)

    const { data: expenseData, error: expenseError } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', start)
      .lte('date', end)

    if (incomeError || expenseError) {
      throw incomeError || expenseError
    }

    const income = incomeData?.reduce((sum, t) => sum + t.amount, 0) || 0
    const expenses = expenseData?.reduce((sum, t) => sum + t.amount, 0) || 0

    trends.push({
      month: format(month, 'MMM yyyy'),
      income,
      expenses,
      net: income - expenses,
    })
  }

  return trends
}

export async function fetchIncomeAndExpenses(
  filters: AnalyticsFilters
): Promise<{ income: number; expenses: number }> {
  return withAuth(async (userId) => {
    const { startDate, endDate } = filters
    const startDateStr = format(startDate, 'yyyy-MM-dd')
    const endDateStr = format(endDate, 'yyyy-MM-dd')

    const { data: incomeData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'income')
      .gte('date', startDateStr)
      .lte('date', endDateStr)

    const { data: expenseData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', startDateStr)
      .lte('date', endDateStr)

    const income = incomeData?.reduce((sum, t) => sum + t.amount, 0) || 0
    const expenses = expenseData?.reduce((sum, t) => sum + t.amount, 0) || 0

    return { income, expenses }
  })
}

export async function fetchTopExpenses(
  filters: AnalyticsFilters,
  limit: number = 5
): Promise<Transaction[]> {
  return withAuth(async (userId) => {
    const { startDate, endDate, categoryIds } = filters

    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'))
      .order('amount', { ascending: false })
      .limit(limit)

    if (categoryIds && categoryIds.length > 0) {
      query = query.in('category_id', categoryIds)
    }

    const { data, error } = await query

    if (error) throw error

    return data || []
  })
}

export async function fetchSpendingAnomalies(
  userId: string,
  filters: AnalyticsFilters
): Promise<SpendingAnomaly[]> {
  const { startDate, endDate } = filters
  const anomalies: SpendingAnomaly[] = []

  // Fetch all daily expenses for the period
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('date, amount, categories(name)')
    .eq('user_id', userId)
    .eq('type', 'expense')
    .gte('date', format(startDate, 'yyyy-MM-dd'))
    .lte('date', format(endDate, 'yyyy-MM-dd'))

  if (error) throw error

  // Group by category and date
  const categoryDailyAmounts = new Map<string, number[]>()

  transactions?.forEach((t: any) => {
    const categoryName = t.categories?.name || 'Uncategorized'
    if (!categoryDailyAmounts.has(categoryName)) {
      categoryDailyAmounts.set(categoryName, [])
    }
    categoryDailyAmounts.get(categoryName)!.push(t.amount)
  })

  // Calculate averages and detect anomalies
  transactions?.forEach((t: any) => {
    const categoryName = t.categories?.name || 'Uncategorized'
    const amounts = categoryDailyAmounts.get(categoryName) || []

    if (amounts.length < 2) return

    const average = amounts.reduce((a, b) => a + b, 0) / amounts.length
    const stdDev = Math.sqrt(
      amounts.reduce((sq, n) => sq + Math.pow(n - average, 2), 0) / amounts.length
    )

    // Flag as anomaly if more than 2 standard deviations above average
    if (t.amount > average + 2 * stdDev && t.amount > average * 1.5) {
      const percentageAbove = ((t.amount - average) / average) * 100

      anomalies.push({
        date: t.date,
        category_name: categoryName,
        amount: t.amount,
        percentageAboveAverage: percentageAbove,
      })
    }
  })

  return anomalies.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function fetchForecastProjections(
  userId: string,
  monthsAhead: number = 3
): Promise<ForecastProjection[]> {
  const projections: ForecastProjection[] = []

  // Fetch historical data (last 12 months)
  const trends = await fetchMonthlyTrends(userId, 12)

  // Calculate averages
  const avgIncome = trends.reduce((sum, t) => sum + t.income, 0) / trends.length
  const avgExpenses = trends.reduce((sum, t) => sum + t.expenses, 0) / trends.length

  // Calculate trends (simple linear regression)
  const incomeSlope =
    trends.length > 1
      ? (trends[trends.length - 1].income - trends[0].income) / (trends.length - 1)
      : 0
  const expenseSlope =
    trends.length > 1
      ? (trends[trends.length - 1].expenses - trends[0].expenses) / (trends.length - 1)
      : 0

  // Generate projections
  for (let i = 1; i <= monthsAhead; i++) {
    const month = new Date()
    month.setMonth(month.getMonth() + i)

    const projected_income = Math.max(0, avgIncome + incomeSlope * i)
    const projected_expenses = Math.max(0, avgExpenses + expenseSlope * i)

    projections.push({
      month: format(month, 'MMM yyyy'),
      projected_income,
      projected_expenses,
      projected_balance: projected_income - projected_expenses,
      confidence: 0.7 - (i * 0.1), // Confidence decreases for further projections
    })
  }

  return projections
}

export async function fetchAnalyticsData(
  filters: AnalyticsFilters
): Promise<AnalyticsData> {
  return withAuth(async (userId) => {
    const [categorySpends, incomeExpenses, topExpenses, anomalies, monthlyTrends] =
      await Promise.all([
        fetchCategorySpends(filters),
        fetchIncomeAndExpenses(filters),
        fetchTopExpenses(filters),
        fetchSpendingAnomalies(userId, filters),
        fetchMonthlyTrends(userId, 12),
      ])

    return {
      categorySpends,
      monthlyTrends,
      incomeTotal: incomeExpenses.income,
      expensesTotal: incomeExpenses.expenses,
      balance: incomeExpenses.income - incomeExpenses.expenses,
      topExpenses,
      anomalies,
    }
  })
}
