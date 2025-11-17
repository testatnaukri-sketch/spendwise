import { NextRequest, NextResponse } from 'next/server'
import { generateMockExpenses, generateMockGoals, clearMockData } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    switch (action) {
      case 'generate':
        const expenseCount = parseInt(searchParams.get('expenses') || '20')
        const goalCount = parseInt(searchParams.get('goals') || '5')
        
        await clearMockData(userId)
        const expenses = await generateMockExpenses(userId, expenseCount)
        const goals = await generateMockGoals(userId, goalCount)
        
        return NextResponse.json({
          success: true,
          expenses: expenses.length,
          goals: goals.length,
        })

      case 'clear':
        await clearMockData(userId)
        return NextResponse.json({ success: true, message: 'Mock data cleared' })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Mock data API error:', error)
    return NextResponse.json(
      { error: 'Failed to manage mock data' },
      { status: 500 }
    )
  }
}