import React, { useState } from 'react'
import { AnalyticsFilters as AnalyticsFiltersType } from '@/types'
import { useAnalyticsData } from '@/hooks/useAnalyticsData'
import { SummaryStats } from './SummaryStats'
import { AnalyticsFilters } from './AnalyticsFilters'
import { ExportControls } from './ExportControls'
import { CategoryBreakdown } from './CategoryBreakdown'
import { MonthlyTrends } from './MonthlyTrends'
import { AnomaliesPanel } from './AnomaliesPanel'
import { AlertCircle } from 'lucide-react'
import { subDays } from 'date-fns'

interface AnalyticsDashboardProps {
  categories?: Array<{ id: string; name: string }>
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ categories = [] }) => {
  const [filters, setFilters] = useState<AnalyticsFiltersType>({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    transactionType: 'all',
  })

  const { data, loading, error, refetch } = useAnalyticsData(filters)

  const handleFiltersChange = (newFilters: AnalyticsFiltersType) => {
    setFilters(newFilters)
    refetch(newFilters)
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your spending patterns and financial insights</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Error Loading Analytics</h3>
              <p className="text-red-700 text-sm mt-1">{error.message}</p>
              <button
                onClick={() => refetch(filters)}
                className="text-red-600 hover:text-red-700 font-medium text-sm mt-2 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Export Controls */}
        <ExportControls data={data} isLoading={loading} />

        {/* Filters */}
        <AnalyticsFilters
          onFiltersChange={handleFiltersChange}
          isLoading={loading}
          categories={categories}
        />

        {/* Summary Stats */}
        {data && (
          <SummaryStats
            incomeTotal={data.incomeTotal}
            expensesTotal={data.expensesTotal}
            balance={data.balance}
            isLoading={loading}
          />
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {data && (
            <>
              <CategoryBreakdown data={data.categorySpends} isLoading={loading} />
              <div className="lg:col-span-2">
                <MonthlyTrends data={data.monthlyTrends} isLoading={loading} />
              </div>
            </>
          )}
        </div>

        {/* Anomalies Panel */}
        {data && <AnomaliesPanel anomalies={data.anomalies} isLoading={loading} />}
      </div>
    </div>
  )
}
