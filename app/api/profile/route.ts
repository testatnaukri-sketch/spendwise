import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { profileFormSchema, profileSchema } from '@/lib/profile-schema'

/**
 * GET /api/profile?userId=<userId>
 * Fetch user profile
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not initialized' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      // Log error without PII
      console.error('[Profile API] Error fetching profile:', { code: error.code })
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { data: null },
        { status: 200 }
      )
    }

    // Validate retrieved data
    const validatedData = profileSchema.safeParse(data)
    if (!validatedData.success) {
      console.error('[Profile API] Invalid profile data structure')
      return NextResponse.json(
        { error: 'Invalid profile data' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: validatedData.data }, { status: 200 })
  } catch (error) {
    console.error('[Profile API] Unexpected error fetching profile')
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/profile
 * Create a new profile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    // Validate form data
    const validationResult = profileFormSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not initialized' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: body.user_id,
        ...validationResult.data,
      })
      .select()
      .single()

    if (error) {
      console.error('[Profile API] Error creating profile:', { code: error.code })
      return NextResponse.json(
        { error: 'Failed to create profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('[Profile API] Unexpected error creating profile')
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/profile
 * Update user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    // Validate form data (partial update)
    const validationResult = profileFormSchema.partial().safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid profile data', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not initialized' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...validationResult.data,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', body.user_id)
      .select()
      .single()

    if (error) {
      console.error('[Profile API] Error updating profile:', { code: error.code })
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[Profile API] Unexpected error updating profile')
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/profile?userId=<userId>
 * Delete user profile
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not initialized' },
        { status: 500 }
      )
    }

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('[Profile API] Error deleting profile:', { code: error.code })
      return NextResponse.json(
        { error: 'Failed to delete profile' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[Profile API] Unexpected error deleting profile')
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
