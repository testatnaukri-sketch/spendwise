import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdvisorRecommendations } from '@/lib/advisor';
import { advisorCache } from '@/lib/cache';
import type { PurchaseAdvisorInput, PurchaseAdvisorResponse } from '@/types';
import crypto from 'crypto';

const RequestSchema = z.object({
  recentExpenses: z.array(
    z.object({
      id: z.string(),
      user_id: z.string(),
      amount: z.number(),
      category: z.string(),
      merchant: z.string(),
      description: z.string(),
      date: z.string(),
      created_at: z.string(),
    })
  ),
  budgets: z.array(
    z.object({
      id: z.string(),
      user_id: z.string(),
      category: z.string(),
      limit: z.number(),
      period: z.enum(['monthly', 'yearly']),
      created_at: z.string(),
      updated_at: z.string(),
    })
  ),
  goals: z.array(
    z.object({
      id: z.string(),
      user_id: z.string(),
      title: z.string(),
      target_amount: z.number(),
      current_amount: z.number(),
      deadline: z.string(),
      created_at: z.string(),
    })
  ),
  purchaseContext: z.string().optional(),
});

/**
 * Extract user ID from Authorization header
 * In a real implementation, this would verify a JWT token
 */
function extractUserId(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  // For demo purposes, we'll use a simple approach
  // In production, verify the JWT token here
  const token = authHeader.substring(7);
  // Hash the token to create a consistent user ID
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * POST /api/advisor
 * Get AI-powered purchase recommendations
 * Requires authentication via Bearer token
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract and verify user
    const userId = extractUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid authentication' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = RequestSchema.parse(body);

    // Check cache first
    const cachedResponse = advisorCache.get(userId);
    if (cachedResponse) {
      return NextResponse.json({
        ...cachedResponse,
        cached: true,
      });
    }

    // Get fresh recommendations from OpenAI
    const advisorData = await getAdvisorRecommendations(
      validatedData as PurchaseAdvisorInput,
      userId
    );

    // Create response with ID and user ID
    const response: PurchaseAdvisorResponse = {
      id: crypto.randomUUID(),
      userId,
      ...advisorData,
    };

    // Cache the response
    advisorCache.set(userId, response);

    return NextResponse.json({
      ...response,
      cached: false,
    });
  } catch (error) {
    console.error('Error in advisor endpoint:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('OpenAI')) {
      return NextResponse.json(
        { error: 'Failed to generate recommendations. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/advisor
 * Clear cached advisor response for the current user
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const userId = extractUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid authentication' },
        { status: 401 }
      );
    }

    advisorCache.clear(userId);

    return NextResponse.json({ success: true, message: 'Cache cleared' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
