import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          email: string | null
          phone: string | null
          date_of_birth: string | null
          employment_status: string | null
          monthly_income: number | null
          fixed_expenses: number | null
          savings_goal: number | null
          risk_tolerance: string | null
          financial_goals: string[] | null
          preferred_currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          employment_status?: string | null
          monthly_income?: number | null
          fixed_expenses?: number | null
          savings_goal?: number | null
          risk_tolerance?: string | null
          financial_goals?: string[] | null
          preferred_currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          date_of_birth?: string | null
          employment_status?: string | null
          monthly_income?: number | null
          fixed_expenses?: number | null
          savings_goal?: number | null
          risk_tolerance?: string | null
          financial_goals?: string[] | null
          preferred_currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          amount: number
          description: string
          category: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          amount: number
          description: string
          category: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          amount?: number
          description?: string
          category?: string
          created_at?: string
          user_id?: string
        }
      }
      goals: {
        Row: {
          id: string
          name: string
          target_amount: number
          current_amount: number
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          target_amount: number
          current_amount?: number
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          created_at?: string
          user_id?: string
        }
      }
    }
  }
}
