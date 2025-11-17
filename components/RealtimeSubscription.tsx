'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface RealtimeSubscriptionProps {
  userId: string
  onUpdate: () => void
}

export function RealtimeSubscription({ userId, onUpdate }: RealtimeSubscriptionProps) {
  useEffect(() => {
    if (!supabase) return

    // Subscribe to expenses changes
    const expensesSubscription = supabase
      .channel('expenses_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          onUpdate()
        }
      )
      .subscribe()

    // Subscribe to goals changes
    const goalsSubscription = supabase
      .channel('goals_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goals',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          onUpdate()
        }
      )
      .subscribe()

    return () => {
      expensesSubscription.unsubscribe()
      goalsSubscription.unsubscribe()
    }
  }, [userId, onUpdate])

  return null
}