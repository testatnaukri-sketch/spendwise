import { profileFormSchema, profileSchema } from '@/lib/profile-schema'

describe('Profile Schema Validation', () => {
  describe('profileFormSchema', () => {
    it('should validate correct profile form data', () => {
      const validData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        date_of_birth: '1990-01-01',
        employment_status: 'employed',
        monthly_income: 5000,
        fixed_expenses: 2000,
        savings_goal: 10000,
        risk_tolerance: 'moderate',
        financial_goals: ['emergency fund', 'vacation'],
        preferred_currency: 'USD',
      }

      const result = profileFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        full_name: 'John Doe',
        email: 'not-an-email',
        employment_status: 'employed',
        monthly_income: 5000,
        fixed_expenses: 2000,
        savings_goal: 10000,
        risk_tolerance: 'moderate',
      }

      const result = profileFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject missing required fields', () => {
      const incompleteData = {
        email: 'john@example.com',
      }

      const result = profileFormSchema.safeParse(incompleteData)
      expect(result.success).toBe(false)
    })

    it('should reject negative income', () => {
      const invalidData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        employment_status: 'employed',
        monthly_income: -5000,
        fixed_expenses: 2000,
        savings_goal: 10000,
        risk_tolerance: 'moderate',
      }

      const result = profileFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject negative expenses', () => {
      const invalidData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        employment_status: 'employed',
        monthly_income: 5000,
        fixed_expenses: -2000,
        savings_goal: 10000,
        risk_tolerance: 'moderate',
      }

      const result = profileFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject negative savings goal', () => {
      const invalidData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        employment_status: 'employed',
        monthly_income: 5000,
        fixed_expenses: 2000,
        savings_goal: -10000,
        risk_tolerance: 'moderate',
      }

      const result = profileFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid employment status', () => {
      const invalidData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        employment_status: 'invalid-status',
        monthly_income: 5000,
        fixed_expenses: 2000,
        savings_goal: 10000,
        risk_tolerance: 'moderate',
      }

      const result = profileFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should reject invalid risk tolerance', () => {
      const invalidData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        employment_status: 'employed',
        monthly_income: 5000,
        fixed_expenses: 2000,
        savings_goal: 10000,
        risk_tolerance: 'invalid-risk',
      }

      const result = profileFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('should allow optional fields', () => {
      const validData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        employment_status: 'employed',
        monthly_income: 5000,
        fixed_expenses: 2000,
        savings_goal: 10000,
        risk_tolerance: 'moderate',
      }

      const result = profileFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe('profileSchema', () => {
    it('should validate complete profile data', () => {
      const validData = {
        id: 'test-id',
        user_id: 'test-user',
        full_name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        date_of_birth: '1990-01-01',
        employment_status: 'employed',
        monthly_income: 5000,
        fixed_expenses: 2000,
        savings_goal: 10000,
        risk_tolerance: 'moderate',
        financial_goals: ['emergency fund'],
        preferred_currency: 'USD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const result = profileSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should allow null nullable fields', () => {
      const validData = {
        id: 'test-id',
        user_id: 'test-user',
        full_name: null,
        email: null,
        phone: null,
        date_of_birth: null,
        employment_status: null,
        monthly_income: null,
        fixed_expenses: null,
        savings_goal: null,
        risk_tolerance: null,
        financial_goals: null,
        preferred_currency: 'USD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const result = profileSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })
})
