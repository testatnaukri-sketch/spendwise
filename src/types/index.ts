export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
}

export interface Expense {
  id: string
  user_id: string
  amount: number
  category: string
  description: string
  date: string
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  target_amount: number
  current_amount: number
  target_date: string
  category: string
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  user_id: string
  category: string
  limit: number
  spent: number
  period: 'monthly' | 'yearly'
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  date: string
  created_at: string
}

export interface AIAdvice {
  id: string
  user_id: string
  type: 'savings' | 'investment' | 'budget' | 'goal'
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
  created_at: string
  is_read: boolean
}

export interface DatabaseUser extends User {
  updated_at?: string
}

export interface DatabaseExpense extends Omit<Expense, 'updated_at'> {
  updated_at?: string
}

export interface DatabaseGoal extends Omit<Goal, 'updated_at'> {
  updated_at?: string
}
