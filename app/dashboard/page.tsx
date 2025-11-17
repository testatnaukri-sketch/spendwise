'use client'

import useSWR from 'swr'
import { useState, useCallback } from 'react'
import { DashboardMetrics, RecentTransaction, SpendingTrend, getDashboardMetrics, getRecentTransactions, getSpendingTrends } from '@/lib/dashboard-data'
import { MetricCard } from '@/components/MetricCard'
import { RecentTransactions } from '@/components/RecentTransactions'
import { SpendingCharts } from '@/components/SpendingCharts'
import { RealtimeSubscription } from '@/components/RealtimeSubscription'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// Mock user ID - in a real app, this would come from authentication
const USER_ID = 'demo-user'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function DashboardContent() {
  const [refreshKey, setRefreshKey] = useState(0)
  
  // SWR fetcher function
  const fetcher = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    return response.json()
  }

  // SWR hooks for data fetching with revalidation
  const { data: metrics, error: metricsError, isLoading: metricsLoading } = useSWR<DashboardMetrics>(
    `/api/dashboard/metrics?userId=${USER_ID}&refresh=${refreshKey}`,
    fetcher,
    {
      refreshInterval: 30000, // Revalidate every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  const { data: transactions, error: transactionsError, isLoading: transactionsLoading } = useSWR<RecentTransaction[]>(
    `/api/dashboard/transactions?userId=${USER_ID}&limit=10&refresh=${refreshKey}`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  const { data: trends, error: trendsError, isLoading: trendsLoading } = useSWR<SpendingTrend[]>(
    `/api/dashboard/trends?userId=${USER_ID}&days=30&refresh=${refreshKey}`,
    fetcher,
    {
      refreshInterval: 60000, // Revalidate trends every minute
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  // Callback for real-time updates
  const handleRealtimeUpdate = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  const hasErrors = metricsError || transactionsError || trendsError
  const isLoading = metricsLoading || transactionsLoading || trendsLoading

  if (hasErrors) {
    throw new Error('Failed to load dashboard data')
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Real-time subscription */}
        <RealtimeSubscription userId={USER_ID} onUpdate={handleRealtimeUpdate} />
        
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-2xl font-bold text-gray-900">Spendwise Dashboard</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="ml-2 text-sm text-gray-600">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Expenses"
              value={formatCurrency(metrics?.totalExpenses || 0)}
              loading={metricsLoading}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <MetricCard
              title="Budget Remaining"
              value={formatCurrency(metrics?.budgetRemaining || 0)}
              changeType={metrics?.budgetRemaining && metrics.budgetRemaining < 0 ? 'decrease' : 'increase'}
              loading={metricsLoading}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              }
            />
            <MetricCard
              title="Monthly Burn Rate"
              value={formatCurrency(metrics?.monthlyBurnRate || 0)}
              loading={metricsLoading}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
            <MetricCard
              title="Goals Progress"
              value={`${Math.round(metrics?.goalsProgress || 0)}%`}
              changeType="increase"
              loading={metricsLoading}
              icon={
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-1">
              <RecentTransactions transactions={transactions || []} loading={transactionsLoading} />
            </div>

            {/* Charts */}
            <div className="lg:col-span-2">
              <SpendingCharts trends={trends || []} loading={trendsLoading} />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}