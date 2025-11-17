import React, { useMemo } from 'react'
import { MonthlyTrend } from '@/types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface MonthlyTrendsProps {
  data: MonthlyTrend[]
  isLoading?: boolean
}

export const MonthlyTrends: React.FC<MonthlyTrendsProps> = ({ data, isLoading }) => {
  const chartData = useMemo(() => {
    return data.map((item) => ({
      month: item.month,
      Income: item.income,
      Expenses: item.expenses,
      Net: item.net,
    }))
  }, [data])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No monthly trend data available</p>
      </div>
    )
  }

  return (
    <div className="w-full h-96 bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Trends</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => `$${value.toFixed(2)}`}
            contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db' }}
          />
          <Legend />
          <Bar dataKey="Income" fill="#10b981" />
          <Bar dataKey="Expenses" fill="#ef4444" />
          <Bar dataKey="Net" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
