import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone_number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone_number?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone_number?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          description: string
          type: 'income' | 'expense'
          date: string
          source: 'manual' | 'mpesa' | 'bank'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          category: string
          description: string
          type: 'income' | 'expense'
          date: string
          source: 'manual' | 'mpesa' | 'bank'
          created_at?: string
        }
        Update: {
          amount?: number
          category?: string
          description?: string
          type?: 'income' | 'expense'
          date?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category: string
          amount: number
          period: 'monthly' | 'weekly'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          amount: number
          period: 'monthly' | 'weekly'
          created_at?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          period?: 'monthly' | 'weekly'
          updated_at?: string
        }
      }
      financial_goals: {
        Row: {
          id: string
          user_id: string
          title: string
          target_amount: number
          current_amount: number
          target_date: string
          category: string
          status: 'active' | 'completed' | 'paused'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          target_amount: number
          current_amount?: number
          target_date: string
          category: string
          status?: 'active' | 'completed' | 'paused'
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          target_amount?: number
          current_amount?: number
          target_date?: string
          status?: 'active' | 'completed' | 'paused'
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          monthly_income: number
          rent: number
          transport: number
          food_budget: number
          savings_goal: number
          emergency_fund: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          monthly_income: number
          rent?: number
          transport?: number
          food_budget?: number
          savings_goal?: number
          emergency_fund?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          monthly_income?: number
          rent?: number
          transport?: number
          food_budget?: number
          savings_goal?: number
          emergency_fund?: number
          updated_at?: string
        }
      }
    }
  }
}