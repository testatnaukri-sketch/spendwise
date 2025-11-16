import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type Database = {
  public: {
    Tables: {
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