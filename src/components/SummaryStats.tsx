import React from 'react'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface SummaryStatsProps {
  incomeTotal: number
  expensesTotal: number
  balance: number
  isLoading?: boolean
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({
  incomeTotal,
  expensesTotal,
  balance,
  isLoading,
}) => {
  const stats = [
    {
      label: 'Total Income',
      value: incomeTotal,
      icon: TrendingUp,
      color: 'bg-green-100',
      textColor: 'text-green-700',
    },
    {
      label: 'Total Expenses',
      value: expensesTotal,
      icon: TrendingDown,
      color: 'bg-red-100',
      textColor: 'text-red-700',
    },
    {
      label: 'Balance',
      value: balance,
      icon: DollarSign,
      color: balance >= 0 ? 'bg-blue-100' : 'bg-orange-100',
      textColor: balance >= 0 ? 'text-blue-700' : 'text-orange-700',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-300 h-8 w-32 rounded"></div>
                  ) : (
                    `$${stat.value.toFixed(2)}`
                  )}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
