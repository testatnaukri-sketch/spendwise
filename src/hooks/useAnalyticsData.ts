import { useState, useCallback, useEffect } from 'react'
import { AnalyticsData, AnalyticsFilters } from '@/types'
import { fetchAnalyticsData } from '@/utils/analyticsData'
import { subDays } from 'date-fns'

interface UseAnalyticsDataState {
  data: AnalyticsData | null
  loading: boolean
  error: Error | null
}

export function useAnalyticsData(initialFilters?: Partial<AnalyticsFilters>) {
  const [state, setState] = useState<UseAnalyticsDataState>({
    data: null,
    loading: true,
    error: null,
  })

  const defaultFilters: AnalyticsFilters = {
    startDate: initialFilters?.startDate || subDays(new Date(), 30),
    endDate: initialFilters?.endDate || new Date(),
    categoryIds: initialFilters?.categoryIds,
    transactionType: initialFilters?.transactionType || 'all',
  }

  const refetch = useCallback(
    async (filters?: AnalyticsFilters) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))
        const data = await fetchAnalyticsData(filters || defaultFilters)
        setState({ data, loading: false, error: null })
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch analytics data'),
        })
      }
    },
    [defaultFilters]
  )

  useEffect(() => {
    refetch()
  }, [refetch])

  return { ...state, refetch }
}
