import { NextRequest, NextResponse } from 'next/server'
import { getSpendingTrends } from '@/lib/dashboard-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const days = parseInt(searchParams.get('days') || '30')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const trends = await getSpendingTrends(userId, days)
    return NextResponse.json(trends)
  } catch (error) {
    console.error('Spending trends API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spending trends' },
      { status: 500 }
    )
  }
}