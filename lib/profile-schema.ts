import { z } from 'zod'

export const profileFormSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(255),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  employment_status: z.enum(['employed', 'self-employed', 'unemployed', 'student', 'retired']),
  monthly_income: z.number().min(0, 'Monthly income must be non-negative'),
  fixed_expenses: z.number().min(0, 'Fixed expenses must be non-negative'),
  savings_goal: z.number().min(0, 'Savings goal must be non-negative'),
  risk_tolerance: z.enum(['conservative', 'moderate', 'aggressive']),
  financial_goals: z.array(z.string()).optional().nullable(),
  preferred_currency: z.string().default('USD'),
})

export type ProfileFormData = z.infer<typeof profileFormSchema>

export const profileSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  full_name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  date_of_birth: z.string().nullable(),
  employment_status: z.string().nullable(),
  monthly_income: z.number().nullable(),
  fixed_expenses: z.number().nullable(),
  savings_goal: z.number().nullable(),
  risk_tolerance: z.string().nullable(),
  financial_goals: z.array(z.string()).nullable(),
  preferred_currency: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Profile = z.infer<typeof profileSchema>
