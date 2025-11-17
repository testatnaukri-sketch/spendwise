import { supabase } from './supabase'

function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please check your environment variables.')
  }
  return supabase
}

export interface DashboardMetrics {
  totalExpenses: number
  budgetRemaining: number
  monthlyBurnRate: number
  totalGoals: number
  goalsProgress: number
}

export interface RecentTransaction {
  id: string
  amount: number
  description: string
  category: string
  created_at: string
}

export interface SpendingTrend {
  date: string
  amount: number
  category: string
}

export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  try {
    // Get current month's expenses
    const currentMonth = new Date()
    currentMonth.setDate(1)
    currentMonth.setHours(0, 0, 0, 0)

    const client = getSupabaseClient()
    const { data: expenses, error: expensesError } = await client
      .from('expenses')
      .select('amount')
      .eq('user_id', userId)
      .gte('created_at', currentMonth.toISOString())

    if (expensesError) throw expensesError

    const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0

    // Get goals
    const { data: goals, error: goalsError } = await client
      .from('goals')
      .select('target_amount, current_amount')
      .eq('user_id', userId)

    if (goalsError) throw goalsError

    const totalBudget = goals?.reduce((sum, goal) => sum + goal.target_amount, 0) || 0
    const currentSaved = goals?.reduce((sum, goal) => sum + goal.current_amount, 0) || 0
    const budgetRemaining = totalBudget - totalExpenses

    // Calculate monthly burn rate (average daily spending * 30)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: recentExpenses, error: recentError } = await client
      .from('expenses')
      .select('amount, created_at')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString())

    if (recentError) throw recentError

    const totalRecentExpenses = recentExpenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0
    const monthlyBurnRate = (totalRecentExpenses / 30) * 30

    // Calculate goals progress
    const goalsProgress = totalBudget > 0 ? (currentSaved / totalBudget) * 100 : 0

    return {
      totalExpenses,
      budgetRemaining,
      monthlyBurnRate,
      totalGoals: goals?.length || 0,
      goalsProgress,
    }
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error)
    throw error
  }
}

export async function getRecentTransactions(userId: string, limit: number = 10): Promise<RecentTransaction[]> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    throw error
  }
}

export async function getSpendingTrends(userId: string, days: number = 30): Promise<SpendingTrend[]> {
  try {
    const client = getSupabaseClient()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await client
      .from('expenses')
      .select('amount, category, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    return data?.map(expense => ({
      date: new Date(expense.created_at).toLocaleDateString(),
      amount: expense.amount,
      category: expense.category,
    })) || []
  } catch (error) {
    console.error('Error fetching spending trends:', error)
    throw error
  }
}