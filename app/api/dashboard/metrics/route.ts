import { NextRequest, NextResponse } from 'next/server'
import { getDashboardMetrics } from '@/lib/dashboard-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const metrics = await getDashboardMetrics(userId)
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Dashboard metrics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    )
  }
}