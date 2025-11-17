import { useMemo } from 'react'
import { Profile } from '../profile-schema'
import { getSpendingMetrics } from '../profile-utils'

/**
 * Custom hook to compute spending capacity metrics from profile data
 * This hook can be reused throughout the application
 */
export function useSpendingCapacity(profile: Profile | null) {
  return useMemo(() => {
    if (!profile) {
      return {
        monthlyIncome: 0,
        fixedExpenses: 0,
        availableSpending: 0,
        savingsRate: 0,
        savingsGoal: 0,
      }
    }

    return getSpendingMetrics(profile)
  }, [profile])
}
