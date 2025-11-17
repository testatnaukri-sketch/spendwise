import { supabase } from '@/lib/supabase'
import { Expense, ExpenseFormData, Category } from '@/types/expense'

export class ExpenseService {
  static async createExpense(userId: string, data: ExpenseFormData): Promise<Expense> {
    const { data: expense, error } = await supabase
      .from('expenses')
      .insert([
        {
          user_id: userId,
          amount: data.amount,
          category: data.category,
          merchant: data.merchant,
          date: data.date,
          payment_method: data.paymentMethod,
          notes: data.notes,
          tags: data.tags,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error
    return this.mapExpense(expense)
  }

  static async updateExpense(userId: string, expenseId: string, data: Partial<ExpenseFormData>): Promise<Expense> {
    const { data: expense, error } = await supabase
      .from('expenses')
      .update({
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.category && { category: data.category }),
        ...(data.merchant && { merchant: data.merchant }),
        ...(data.date && { date: data.date }),
        ...(data.paymentMethod && { payment_method: data.paymentMethod }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.tags !== undefined && { tags: data.tags }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', expenseId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return this.mapExpense(expense)
  }

  static async getExpenses(userId: string): Promise<Expense[]> {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })

    if (error) throw error
    return (expenses || []).map((e) => this.mapExpense(e))
  }

  static async deleteExpense(userId: string, expenseId: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', userId)

    if (error) throw error
  }

  static async getCategories(): Promise<Category[]> {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return categories || []
  }

  static async getMerchants(userId: string): Promise<string[]> {
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('merchant')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(100)

    if (error) throw error
    
    const merchants = new Set((expenses || []).map((e) => e.merchant))
    return Array.from(merchants).filter((m) => m && m.trim() !== '')
  }

  static subscribeToExpenses(userId: string, callback: (expense: Expense) => void) {
    const channel = supabase
      .channel(`expenses:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const expense = this.mapExpense(payload.new)
          callback(expense)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  private static mapExpense(data: any): Expense {
    return {
      id: data.id,
      userId: data.user_id,
      amount: data.amount,
      category: data.category,
      merchant: data.merchant,
      date: data.date,
      paymentMethod: data.payment_method,
      notes: data.notes,
      tags: data.tags,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }
  }
}
