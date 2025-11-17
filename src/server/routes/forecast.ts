import { Router, Request, Response } from 'express'
import { fetchForecastProjections } from '@/utils/analyticsData'

export const forecastRouter = Router()

// Get forecast projections
forecastRouter.get('/projections', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string
    const months = parseInt(req.query.months as string) || 3

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }

    if (months < 1 || months > 12) {
      return res.status(400).json({ error: 'months must be between 1 and 12' })
    }

    const data = await fetchForecastProjections(userId, months)
    res.json(data)
  } catch (error) {
    console.error('Error fetching forecast projections:', error)
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch forecast projections',
    })
  }
})
