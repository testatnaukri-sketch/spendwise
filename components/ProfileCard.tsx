import { Profile } from '@/lib/profile-schema'
import { getSpendingMetrics } from '@/lib/profile-utils'

interface ProfileCardProps {
  profile: Profile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const metrics = getSpendingMetrics(profile)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Profile Header */}
      <div>
        <h1 className="text-2xl font-bold">{profile.full_name || 'User Profile'}</h1>
        <p className="text-gray-600">{profile.email}</p>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Employment Status</p>
          <p className="text-lg font-medium">{profile.employment_status || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Risk Tolerance</p>
          <p className="text-lg font-medium">{profile.risk_tolerance || 'Not specified'}</p>
        </div>
        {profile.phone && (
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-lg font-medium">{profile.phone}</p>
          </div>
        )}
        {profile.date_of_birth && (
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="text-lg font-medium">
              {new Date(profile.date_of_birth).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Financial Metrics */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold mb-4">Financial Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded p-4">
            <p className="text-sm text-gray-600">Monthly Income</p>
            <p className="text-2xl font-bold text-blue-600">
              ${metrics.monthlyIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-red-50 rounded p-4">
            <p className="text-sm text-gray-600">Fixed Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              ${metrics.fixedExpenses.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 rounded p-4">
            <p className="text-sm text-gray-600">Available Spending</p>
            <p className="text-2xl font-bold text-green-600">
              ${metrics.availableSpending.toFixed(2)}
            </p>
          </div>
          <div className="bg-purple-50 rounded p-4">
            <p className="text-sm text-gray-600">Savings Rate</p>
            <p className="text-2xl font-bold text-purple-600">
              {metrics.savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Savings Goal */}
      {profile.savings_goal && profile.savings_goal > 0 && (
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">Savings Goal</p>
          <p className="text-2xl font-bold">${profile.savings_goal.toFixed(2)}</p>
        </div>
      )}

      {/* Updated At */}
      <div className="border-t pt-4 text-sm text-gray-500">
        Last updated: {new Date(profile.updated_at).toLocaleDateString()}
      </div>
    </div>
  )
}
