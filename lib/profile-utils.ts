import { supabase } from './supabase'
import { Profile, ProfileFormData } from './profile-schema'

/**
 * Fetch user profile from Supabase
 * Returns null if profile doesn't exist
 */
export async function fetchProfile(userId: string): Promise<Profile | null> {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means "no rows returned", which is expected for new users
      console.error('[Profile] Error fetching profile:', { code: error.code })
      throw error
    }

    return data || null
  } catch (error) {
    console.error('[Profile] Unexpected error fetching profile')
    throw error
  }
}

/**
 * Create a new profile for user
 */
export async function createProfile(
  userId: string,
  data: Partial<ProfileFormData>
): Promise<Profile> {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        ...data,
      } as any)
      .select()
      .single()

    if (error) {
      console.error('[Profile] Error creating profile:', { code: error.code })
      throw error
    }

    return profile
  } catch (error) {
    console.error('[Profile] Unexpected error creating profile')
    throw error
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  data: Partial<ProfileFormData>
): Promise<Profile> {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      } as any)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('[Profile] Error updating profile:', { code: error.code })
      throw error
    }

    return profile
  } catch (error) {
    console.error('[Profile] Unexpected error updating profile')
    throw error
  }
}

/**
 * Delete user profile
 */
export async function deleteProfile(userId: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('[Profile] Error deleting profile:', { code: error.code })
      throw error
    }
  } catch (error) {
    console.error('[Profile] Unexpected error deleting profile')
    throw error
  }
}

/**
 * Calculate spending capacity based on profile data
 * Returns available monthly spending capacity
 */
export function calculateSpendingCapacity(profile: Profile): number {
  if (!profile.monthly_income || !profile.fixed_expenses) {
    return 0
  }

  const available = profile.monthly_income - profile.fixed_expenses
  return Math.max(0, available)
}

/**
 * Calculate savings rate based on profile data
 */
export function calculateSavingsRate(profile: Profile): number {
  if (!profile.monthly_income || profile.monthly_income === 0) {
    return 0
  }

  const spending = profile.fixed_expenses || 0
  const savings = Math.max(0, profile.monthly_income - spending)
  return (savings / profile.monthly_income) * 100
}

/**
 * Get spending capacity metrics for UI display
 */
export function getSpendingMetrics(profile: Profile) {
  return {
    monthlyIncome: profile.monthly_income || 0,
    fixedExpenses: profile.fixed_expenses || 0,
    availableSpending: calculateSpendingCapacity(profile),
    savingsRate: calculateSavingsRate(profile),
    savingsGoal: profile.savings_goal || 0,
  }
}
