'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { profileFormSchema, ProfileFormData, Profile } from '@/lib/profile-schema'

interface ProfileFormProps {
  initialData?: Profile | null
  onSuccess?: (profile: Profile) => void
  onSubmit: (data: Partial<ProfileFormData>) => Promise<Profile>
  isLoading?: boolean
}

export function ProfileForm({
  initialData,
  onSuccess,
  onSubmit,
  isLoading = false,
}: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: initialData?.full_name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      date_of_birth: initialData?.date_of_birth || '',
      employment_status: (initialData?.employment_status as any) || 'employed',
      monthly_income: initialData?.monthly_income || 0,
      fixed_expenses: initialData?.fixed_expenses || 0,
      savings_goal: initialData?.savings_goal || 0,
      risk_tolerance: (initialData?.risk_tolerance as any) || 'moderate',
      financial_goals: initialData?.financial_goals || [],
      preferred_currency: initialData?.preferred_currency || 'USD',
    },
  })

  const onFormSubmit = async (data: ProfileFormData) => {
    try {
      const result = await onSubmit(data)
      toast.success('Profile saved successfully')
      onSuccess?.(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save profile'
      toast.error(message)
    }
  }

  const isFormLoading = isSubmitting || isLoading

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Personal Information Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Personal Information</h2>

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium mb-1">
            Full Name *
          </label>
          <input
            id="full_name"
            type="text"
            placeholder="John Doe"
            {...register('full_name')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isFormLoading}
          />
          {errors.full_name && (
            <span className="text-red-500 text-sm mt-1 block">{errors.full_name.message}</span>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isFormLoading}
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1 block">{errors.email.message}</span>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...register('phone')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isFormLoading}
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="date_of_birth" className="block text-sm font-medium mb-1">
            Date of Birth
          </label>
          <input
            id="date_of_birth"
            type="date"
            {...register('date_of_birth')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isFormLoading}
          />
        </div>

        {/* Employment Status */}
        <div>
          <label htmlFor="employment_status" className="block text-sm font-medium mb-1">
            Employment Status *
          </label>
          <select
            id="employment_status"
            {...register('employment_status')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isFormLoading}
          >
            <option value="employed">Employed</option>
            <option value="self-employed">Self-Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="student">Student</option>
            <option value="retired">Retired</option>
          </select>
          {errors.employment_status && (
            <span className="text-red-500 text-sm mt-1 block">{errors.employment_status.message}</span>
          )}
        </div>
      </div>

      {/* Financial Information Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Financial Information</h2>

        {/* Monthly Income */}
        <div>
          <label htmlFor="monthly_income" className="block text-sm font-medium mb-1">
            Monthly Income ($) *
          </label>
          <input
            id="monthly_income"
            type="number"
            step="0.01"
            min="0"
            placeholder="5000.00"
            {...register('monthly_income', { valueAsNumber: true })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isFormLoading}
          />
          {errors.monthly_income && (
            <span className="text-red-500 text-sm mt-1 block">{errors.monthly_income.message}</span>
          )}
        </div>

        {/* Fixed Expenses */}
        <div>
          <label htmlFor="fixed_expenses" className="block text-sm font-medium mb-1">
            Fixed Expenses ($) *
          </label>
          <input
            id="fixed_expenses"
            type="number"
            step="0.01"
            min="0"
            placeholder="2000.00"
            {...register('fixed_expenses', { valueAsNumber: true })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isFormLoading}
          />
          {errors.fixed_expenses && (
            <span className="text-red-500 text-sm mt-1 block">{errors.fixed_expenses.message}</span>
          )}
        </div>

        {/* Savings Goal */}
        <div>
          <label htmlFor="savings_goal" className="block text-sm font-medium mb-1">
            Savings Goal ($) *
          </label>
          <input
            id="savings_goal"
            type="number"
            step="0.01"
            min="0"
            placeholder="10000.00"
            {...register('savings_goal', { valueAsNumber: true })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isFormLoading}
          />
          {errors.savings_goal && (
            <span className="text-red-500 text-sm mt-1 block">{errors.savings_goal.message}</span>
          )}
        </div>
      </div>

      {/* Preferences Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Preferences</h2>

        {/* Risk Tolerance */}
        <div>
          <label htmlFor="risk_tolerance" className="block text-sm font-medium mb-1">
            Risk Tolerance *
          </label>
          <select
            id="risk_tolerance"
            {...register('risk_tolerance')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isFormLoading}
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
          {errors.risk_tolerance && (
            <span className="text-red-500 text-sm mt-1 block">{errors.risk_tolerance.message}</span>
          )}
        </div>

        {/* Preferred Currency */}
        <div>
          <label htmlFor="preferred_currency" className="block text-sm font-medium mb-1">
            Preferred Currency
          </label>
          <input
            id="preferred_currency"
            type="text"
            maxLength={3}
            placeholder="USD"
            {...register('preferred_currency')}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isFormLoading}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isFormLoading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isFormLoading ? 'Saving...' : 'Save Profile'}
      </button>
    </form>
  )
}
