import { DashboardMetrics } from '@/lib/dashboard-data'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease'
  icon?: React.ReactNode
  loading?: boolean
}

export function MetricCard({ title, value, change, changeType, icon, loading }: MetricCardProps) {
  if (loading) {
    return (
      <div className="metric-card">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="skeleton h-4 w-24"></div>
            <div className="skeleton h-6 w-6 rounded-full"></div>
          </div>
          <div className="skeleton h-8 w-32 mb-2"></div>
          <div className="skeleton h-4 w-20"></div>
        </div>
      </div>
    )
  }

  const changeColor = changeType === 'increase' ? 'text-success-600' : 'text-danger-600'

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-primary-600">{icon}</div>}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
      {change !== undefined && (
        <div className={`text-sm ${changeColor} flex items-center`}>
          {changeType === 'increase' ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      )}
    </div>
  )
}