import { Router, Request, Response } from 'express'
import {
  fetchAnalyticsData,
  fetchCategorySpends,
  fetchMonthlyTrends,
  fetchForecastProjections,
} from '@/utils/analyticsData'
import { AnalyticsFilters } from '@/types'
import { validateDateRange } from '@/utils/filtering'

export const analyticsRouter = Router()

// Get analytics data
analyticsRouter.post('/data', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, categoryIds, transactionType } = req.body as AnalyticsFilters

    const validation = validateDateRange(new Date(startDate), new Date(endDate))
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }

    const filters: AnalyticsFilters = {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      categoryIds,
      transactionType,
    }

    const data = await fetchAnalyticsData(filters)
    res.json(data)
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch analytics data',
    })
  }
})

// Get category spends
analyticsRouter.post('/categories', async (req: Request, res: Response) => {
  try {
    const filters = req.body as AnalyticsFilters

    const data = await fetchCategorySpends(filters)
    res.json(data)
  } catch (error) {
    console.error('Error fetching category spends:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch category spends',
    })
  }
})

// Get monthly trends
analyticsRouter.get('/trends', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string
    const months = parseInt(req.query.months as string) || 12

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    const data = await fetchMonthlyTrends(userId, months)
    res.json(data)
  } catch (error) {
    console.error('Error fetching monthly trends:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch monthly trends',
    })
  }
})
