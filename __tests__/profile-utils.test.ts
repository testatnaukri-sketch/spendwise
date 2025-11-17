import {
  calculateSpendingCapacity,
  calculateSavingsRate,
  getSpendingMetrics,
} from '@/lib/profile-utils'
import { Profile } from '@/lib/profile-schema'

describe('Profile Utils', () => {
  const mockProfile: Profile = {
    id: 'test-id',
    user_id: 'test-user',
    full_name: 'Test User',
    email: 'test@example.com',
    phone: null,
    date_of_birth: null,
    employment_status: 'employed',
    monthly_income: 5000,
    fixed_expenses: 2000,
    savings_goal: 10000,
    risk_tolerance: 'moderate',
    financial_goals: null,
    preferred_currency: 'USD',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  describe('calculateSpendingCapacity', () => {
    it('should calculate available spending correctly', () => {
      const capacity = calculateSpendingCapacity(mockProfile)
      expect(capacity).toBe(3000) // 5000 - 2000
    })

    it('should return 0 if income is not set', () => {
      const profile = { ...mockProfile, monthly_income: null }
      const capacity = calculateSpendingCapacity(profile)
      expect(capacity).toBe(0)
    })

    it('should return 0 if expenses exceed income', () => {
      const profile = { ...mockProfile, monthly_income: 2000, fixed_expenses: 3000 }
      const capacity = calculateSpendingCapacity(profile)
      expect(capacity).toBe(0)
    })

    it('should handle zero expenses', () => {
      const profile = { ...mockProfile, fixed_expenses: 0 }
      const capacity = calculateSpendingCapacity(profile)
      expect(capacity).toBe(5000)
    })
  })

  describe('calculateSavingsRate', () => {
    it('should calculate savings rate correctly', () => {
      const rate = calculateSavingsRate(mockProfile)
      expect(rate).toBe(60) // (5000 - 2000) / 5000 * 100
    })

    it('should return 0 if income is not set', () => {
      const profile = { ...mockProfile, monthly_income: null }
      const rate = calculateSavingsRate(profile)
      expect(rate).toBe(0)
    })

    it('should return 0 if income is zero', () => {
      const profile = { ...mockProfile, monthly_income: 0 }
      const rate = calculateSavingsRate(profile)
      expect(rate).toBe(0)
    })

    it('should return 100 if no expenses', () => {
      const profile = { ...mockProfile, fixed_expenses: 0 }
      const rate = calculateSavingsRate(profile)
      expect(rate).toBe(100)
    })

    it('should return 0 if expenses equal income', () => {
      const profile = { ...mockProfile, monthly_income: 2000, fixed_expenses: 2000 }
      const rate = calculateSavingsRate(profile)
      expect(rate).toBe(0)
    })
  })

  describe('getSpendingMetrics', () => {
    it('should return all metrics correctly', () => {
      const metrics = getSpendingMetrics(mockProfile)

      expect(metrics).toEqual({
        monthlyIncome: 5000,
        fixedExpenses: 2000,
        availableSpending: 3000,
        savingsRate: 60,
        savingsGoal: 10000,
      })
    })

    it('should handle null values', () => {
      const profile = {
        ...mockProfile,
        monthly_income: null,
        fixed_expenses: null,
        savings_goal: null,
      }
      const metrics = getSpendingMetrics(profile)

      expect(metrics).toEqual({
        monthlyIncome: 0,
        fixedExpenses: 0,
        availableSpending: 0,
        savingsRate: 0,
        savingsGoal: 0,
      })
    })

    it('should handle partial data', () => {
      const profile = {
        ...mockProfile,
        monthly_income: 5000,
        fixed_expenses: null,
        savings_goal: null,
      }
      const metrics = getSpendingMetrics(profile)

      expect(metrics.monthlyIncome).toBe(5000)
      expect(metrics.fixedExpenses).toBe(0)
      expect(metrics.availableSpending).toBe(5000)
      expect(metrics.savingsGoal).toBe(0)
    })
  })
})
