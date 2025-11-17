import { supabase } from './supabase'

function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please check your environment variables.')
  }
  return supabase
}

export interface MockExpense {
  amount: number
  description: string
  category: string
  user_id: string
}

export interface MockGoal {
  name: string
  target_amount: number
  current_amount: number
  user_id: string
}

const expenseDescriptions = [
  'Grocery shopping',
  'Coffee',
  'Lunch with colleagues',
  'Gas station',
  'Electric bill',
  'Internet subscription',
  'Netflix',
  'Gym membership',
  'Restaurant dinner',
  'Uber ride',
  'Book purchase',
  'Phone bill',
  'Car insurance',
  'Home supplies',
  'Pharmacy',
]

const categories = ['Food', 'Transportation', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other']

const goalNames = [
  'Emergency Fund',
  'Vacation Fund',
  'New Car',
  'House Down Payment',
  'Wedding Fund',
  'New Laptop',
  'Investment Portfolio',
  'Education Fund',
]

export async function generateMockExpenses(userId: string, count: number = 20) {
  const expenses: MockExpense[] = []
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90) // Last 90 days
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    
    expenses.push({
      amount: Math.round((Math.random() * 200 + 5) * 100) / 100, // $5-$205
      description: expenseDescriptions[Math.floor(Math.random() * expenseDescriptions.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      user_id: userId,
    })
  }

  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('expenses')
      .insert(expenses)
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error generating mock expenses:', error)
    throw error
  }
}

export async function generateMockGoals(userId: string, count: number = 5) {
  const goals: MockGoal[] = []
  
  for (let i = 0; i < count; i++) {
    const targetAmount = Math.round((Math.random() * 10000 + 1000) * 100) / 100 // $1000-$11000
    const progressPercentage = Math.random() * 0.8 // 0-80% progress
    const currentAmount = Math.round(targetAmount * progressPercentage * 100) / 100
    
    goals.push({
      name: goalNames[Math.floor(Math.random() * goalNames.length)],
      target_amount: targetAmount,
      current_amount: currentAmount,
      user_id: userId,
    })
  }

  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('goals')
      .insert(goals)
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error generating mock goals:', error)
    throw error
  }
}

export async function clearMockData(userId: string) {
  try {
    const client = getSupabaseClient()
    await client.from('expenses').delete().eq('user_id', userId)
    await client.from('goals').delete().eq('user_id', userId)
  } catch (error) {
    console.error('Error clearing mock data:', error)
    throw error
  }
}
