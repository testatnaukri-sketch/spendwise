export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          description: string
          date: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          category: string
          description: string
          date: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: string
          description?: string
          date?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          target_amount: number
          current_amount: number
          target_date: string
          category: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          target_amount: number
          current_amount?: number
          target_date: string
          category: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          target_amount?: number
          current_amount?: number
          target_date?: string
          category?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category: string
          limit: number
          spent: number
          period: 'monthly' | 'yearly'
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          limit: number
          spent?: number
          period: 'monthly' | 'yearly'
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          limit?: number
          spent?: number
          period?: 'monthly' | 'yearly'
          created_at?: string
          updated_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'income' | 'expense'
          category: string
          description: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'income' | 'expense'
          category: string
          description: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'income' | 'expense'
          category?: string
          description?: string
          date?: string
          created_at?: string
        }
      }
      ai_advice: {
        Row: {
          id: string
          user_id: string
          type: 'savings' | 'investment' | 'budget' | 'goal'
          title: string
          content: string
          priority: 'low' | 'medium' | 'high'
          created_at: string
          is_read: boolean
        }
        Insert: {
          id?: string
          user_id: string
          type: 'savings' | 'investment' | 'budget' | 'goal'
          title: string
          content: string
          priority: 'low' | 'medium' | 'high'
          created_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'savings' | 'investment' | 'budget' | 'goal'
          title?: string
          content?: string
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          is_read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_profile: {
        Args: {
          user_id: string
        }
        Returns: Database['public']['Tables']['users']['Row']
      }
      update_user_profile: {
        Args: {
          user_id: string
          user_updates: Database['public']['Tables']['users']['Update']
        }
        Returns: Database['public']['Tables']['users']['Row']
      }
      get_user_expenses: {
        Args: {
          user_id: string
          start_date?: string
          end_date?: string
        }
        Returns: Database['public']['Tables']['expenses']['Row'][]
      }
      create_expense: {
        Args: {
          expense_data: Omit<
            Database['public']['Tables']['expenses']['Insert'],
            'user_id'
          >
        }
        Returns: Database['public']['Tables']['expenses']['Row']
      }
      get_user_goals: {
        Args: {
          user_id: string
        }
        Returns: Database['public']['Tables']['goals']['Row'][]
      }
      update_goal_progress: {
        Args: {
          goal_id: string
          progress_amount: number
        }
        Returns: Database['public']['Tables']['goals']['Row']
      }
      get_user_budgets: {
        Args: {
          user_id: string
        }
        Returns: Database['public']['Tables']['budgets']['Row'][]
      }
      get_budget_spending: {
        Args: {
          user_id: string
          budget_id: string
        }
        Returns: { spent: number }
      }
      get_spending_by_category: {
        Args: {
          user_id: string
          start_date: string
          end_date: string
        }
        Returns: { category: string; amount: number }[]
      }
      get_monthly_spending_trend: {
        Args: {
          user_id: string
          months_count?: number
        }
        Returns: { month: string; amount: number }[]
      }
      generate_ai_advice: {
        Args: {
          user_id: string
          advice_type: 'savings' | 'investment' | 'budget' | 'goal'
        }
        Returns: Database['public']['Tables']['ai_advice']['Row']
      }
      get_ai_advice: {
        Args: {
          user_id: string
        }
        Returns: Database['public']['Tables']['ai_advice']['Row'][]
      }
      mark_advice_as_read: {
        Args: {
          advice_id: string
        }
        Returns: Database['public']['Tables']['ai_advice']['Row']
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
