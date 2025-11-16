import { NextRequest, NextResponse } from 'next/server'
import { getRecentTransactions } from '@/lib/dashboard-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const transactions = await getRecentTransactions(userId, limit)
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Recent transactions API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent transactions' },
      { status: 500 }
    )
  }
}