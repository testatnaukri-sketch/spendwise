import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  Goal,
  GoalWithProgress,
  CreateGoalInput,
  UpdateGoalInput,
  CreateGoalUpdateInput,
} from '../types/database';
import { enrichGoalWithProgress } from '../utils/goalCalculations';

interface UseGoalsReturn {
  goals: GoalWithProgress[];
  loading: boolean;
  error: string | null;
  createGoal: (input: CreateGoalInput) => Promise<void>;
  updateGoal: (id: string, input: UpdateGoalInput) => Promise<void>;
  archiveGoal: (id: string) => Promise<void>;
  unarchiveGoal: (id: string) => Promise<void>;
  addGoalUpdate: (input: CreateGoalUpdateInput) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useGoals(includeArchived = false): UseGoalsReturn {
  const [goals, setGoals] = useState<GoalWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (!includeArchived) {
        query = query.is('archived_at', null);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const enrichedGoals = (data || []).map(enrichGoalWithProgress);
      setGoals(enrichedGoals);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  }, [includeArchived]);

  useEffect(() => {
    fetchGoals();

    const channel = supabase
      .channel('goals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goals',
        },
        () => {
          fetchGoals();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'goal_updates',
        },
        () => {
          fetchGoals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchGoals]);

  const createGoal = async (input: CreateGoalInput) => {
    try {
      setError(null);

      const optimisticGoal: Goal = {
        id: `temp-${Date.now()}`,
        user_id: 'temp',
        title: input.title,
        description: input.description || null,
        target_amount: input.target_amount,
        current_amount: 0,
        target_date: input.target_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        archived_at: null,
      };

      setGoals((prev) => [enrichGoalWithProgress(optimisticGoal), ...prev]);

      const { data: userData } = await supabase.auth.getUser();
      
      const { error: createError } = await supabase.from('goals').insert({
        user_id: userData.user?.id || '',
        title: input.title,
        description: input.description,
        target_amount: input.target_amount,
        target_date: input.target_date,
      });

      if (createError) {
        setGoals((prev) => prev.filter((g) => g.id !== optimisticGoal.id));
        throw createError;
      }

      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create goal');
      throw err;
    }
  };

  const updateGoal = async (id: string, input: UpdateGoalInput) => {
    try {
      setError(null);

      const previousGoals = [...goals];
      setGoals((prev) =>
        prev.map((goal) =>
          goal.id === id
            ? enrichGoalWithProgress({ ...goal, ...input, updated_at: new Date().toISOString() })
            : goal
        )
      );

      const { error: updateError } = await supabase
        .from('goals')
        .update(input)
        .eq('id', id);

      if (updateError) {
        setGoals(previousGoals);
        throw updateError;
      }

      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update goal');
      throw err;
    }
  };

  const archiveGoal = async (id: string) => {
    try {
      setError(null);

      const previousGoals = [...goals];
      setGoals((prev) => prev.filter((goal) => goal.id !== id));

      const { error: archiveError } = await supabase
        .from('goals')
        .update({ archived_at: new Date().toISOString() })
        .eq('id', id);

      if (archiveError) {
        setGoals(previousGoals);
        throw archiveError;
      }

      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive goal');
      throw err;
    }
  };

  const unarchiveGoal = async (id: string) => {
    try {
      setError(null);

      const { error: unarchiveError } = await supabase
        .from('goals')
        .update({ archived_at: null })
        .eq('id', id);

      if (unarchiveError) {
        throw unarchiveError;
      }

      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unarchive goal');
      throw err;
    }
  };

  const addGoalUpdate = async (input: CreateGoalUpdateInput) => {
    try {
      setError(null);

      const goal = goals.find((g) => g.id === input.goal_id);
      if (goal) {
        const newCurrentAmount = goal.current_amount + input.amount;
        setGoals((prev) =>
          prev.map((g) =>
            g.id === input.goal_id
              ? enrichGoalWithProgress({ ...g, current_amount: newCurrentAmount })
              : g
          )
        );
      }

      const { error: insertError } = await supabase
        .from('goal_updates')
        .insert({
          goal_id: input.goal_id,
          amount: input.amount,
          note: input.note,
        });

      if (insertError) {
        await fetchGoals();
        throw insertError;
      }

      const { error: updateError } = await supabase.rpc('increment_goal_amount', {
        goal_id: input.goal_id,
        amount_to_add: input.amount,
      });

      if (updateError) {
        const currentGoal = goals.find((g) => g.id === input.goal_id);
        if (currentGoal) {
          const { error: manualUpdateError } = await supabase
            .from('goals')
            .update({ current_amount: currentGoal.current_amount + input.amount })
            .eq('id', input.goal_id);

          if (manualUpdateError) {
            throw manualUpdateError;
          }
        }
      }

      await fetchGoals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add goal update');
      throw err;
    }
  };

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    archiveGoal,
    unarchiveGoal,
    addGoalUpdate,
    refetch: fetchGoals,
  };
}
