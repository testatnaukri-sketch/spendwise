import { createClientComponentClient } from './client'
import { Database } from '@/types/database'

type SupabaseClient = ReturnType<typeof createClientComponentClient>

export class RPC {
  private client: SupabaseClient

  constructor() {
    this.client = createClientComponentClient()
  }

  // User-related RPC functions
  async getUserProfile(userId: string) {
    const { data, error } = await this.client.rpc('get_user_profile', {
      user_id: userId,
    })
    return { data, error }
  }

  async updateUserProfile(
    userId: string,
    updates: Partial<Database['public']['Tables']['users']['Update']>
  ) {
    const { data, error } = await this.client.rpc('update_user_profile', {
      user_id: userId,
      user_updates: updates,
    })
    return { data, error }
  }

  // Expense-related RPC functions
  async getUserExpenses(userId: string, startDate?: string, endDate?: string) {
    const { data, error } = await this.client.rpc('get_user_expenses', {
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
    })
    return { data, error }
  }

  async createExpense(
    expense: Omit<Database['public']['Tables']['expenses']['Insert'], 'user_id'>
  ) {
    const { data, error } = await this.client.rpc('create_expense', {
      expense_data: expense,
    })
    return { data, error }
  }

  // Goal-related RPC functions
  async getUserGoals(userId: string) {
    const { data, error } = await this.client.rpc('get_user_goals', {
      user_id: userId,
    })
    return { data, error }
  }

  async updateGoalProgress(goalId: string, amount: number) {
    const { data, error } = await this.client.rpc('update_goal_progress', {
      goal_id: goalId,
      progress_amount: amount,
    })
    return { data, error }
  }

  // Budget-related RPC functions
  async getUserBudgets(userId: string) {
    const { data, error } = await this.client.rpc('get_user_budgets', {
      user_id: userId,
    })
    return { data, error }
  }

  async getBudgetSpending(userId: string, budgetId: string) {
    const { data, error } = await this.client.rpc('get_budget_spending', {
      user_id: userId,
      budget_id: budgetId,
    })
    return { data, error }
  }

  // Analytics RPC functions
  async getSpendingByCategory(
    userId: string,
    startDate: string,
    endDate: string
  ) {
    const { data, error } = await this.client.rpc('get_spending_by_category', {
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
    })
    return { data, error }
  }

  async getMonthlySpendingTrend(userId: string, months: number = 12) {
    const { data, error } = await this.client.rpc(
      'get_monthly_spending_trend',
      {
        user_id: userId,
        months_count: months,
      }
    )
    return { data, error }
  }

  // AI Advice RPC functions
  async generateAIAdvice(
    userId: string,
    type: 'savings' | 'investment' | 'budget' | 'goal'
  ) {
    const { data, error } = await this.client.rpc('generate_ai_advice', {
      user_id: userId,
      advice_type: type,
    })
    return { data, error }
  }

  async getAIAdvice(userId: string) {
    const { data, error } = await this.client.rpc('get_ai_advice', {
      user_id: userId,
    })
    return { data, error }
  }

  async markAdviceAsRead(adviceId: string) {
    const { data, error } = await this.client.rpc('mark_advice_as_read', {
      advice_id: adviceId,
    })
    return { data, error }
  }
}

export const rpc = new RPC()
