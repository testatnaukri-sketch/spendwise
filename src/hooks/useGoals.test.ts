import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGoals } from './useGoals';
import { supabase } from '../lib/supabase';

vi.mock('../lib/supabase');

describe('useGoals', () => {
  const mockGoals = [
    {
      id: '1',
      user_id: 'user1',
      title: 'Emergency Fund',
      description: 'Save for emergencies',
      target_amount: 10000,
      current_amount: 5000,
      target_date: '2024-12-31',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      archived_at: null,
    },
    {
      id: '2',
      user_id: 'user1',
      title: 'Vacation Fund',
      description: null,
      target_amount: 5000,
      current_amount: 1000,
      target_date: '2024-06-30',
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      archived_at: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
    };

    (supabase.from as any).mockReturnValue(mockQuery);
    (supabase.channel as any).mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    });
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: { id: 'user1' } },
    });
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useGoals());
    expect(result.current.loading).toBe(true);
    expect(result.current.goals).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch goals on mount', async () => {
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockResolvedValue({ data: mockGoals, error: null }),
    };

    (supabase.from as any).mockReturnValue(mockQuery);

    const { result } = renderHook(() => useGoals());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.goals.length).toBe(2);
    expect(result.current.goals[0].title).toBe('Emergency Fund');
  });

  it('should handle fetch errors', async () => {
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Network error' },
      }),
    };

    (supabase.from as any).mockReturnValue(mockQuery);

    const { result } = renderHook(() => useGoals());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.goals).toEqual([]);
  });

  it('should create a goal with optimistic update', async () => {
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
    };

    (supabase.from as any).mockReturnValue(mockQuery);

    const { result } = renderHook(() => useGoals());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newGoal = {
      title: 'New Goal',
      description: 'Test goal',
      target_amount: 1000,
      target_date: '2024-12-31',
    };

    await result.current.createGoal(newGoal);

    expect(mockQuery.insert).toHaveBeenCalled();
  });

  it('should update a goal with rollback on error', async () => {
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockResolvedValue({ data: mockGoals, error: null }),
      update: vi.fn().mockResolvedValue({
        error: { message: 'Update failed' },
      }),
      eq: vi.fn().mockReturnThis(),
    };

    (supabase.from as any).mockReturnValue(mockQuery);

    const { result } = renderHook(() => useGoals());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialGoalsLength = result.current.goals.length;

    try {
      await result.current.updateGoal('1', { title: 'Updated Title' });
    } catch (error) {
      expect(result.current.goals.length).toBe(initialGoalsLength);
    }
  });

  it('should archive a goal', async () => {
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockResolvedValue({ data: mockGoals, error: null }),
      update: vi.fn().mockResolvedValue({ error: null }),
      eq: vi.fn().mockReturnThis(),
    };

    (supabase.from as any).mockReturnValue(mockQuery);

    const { result } = renderHook(() => useGoals());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.archiveGoal('1');

    expect(mockQuery.update).toHaveBeenCalledWith({
      archived_at: expect.any(String),
    });
  });

  it('should enrich goals with progress data', async () => {
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockResolvedValue({ data: mockGoals, error: null }),
    };

    (supabase.from as any).mockReturnValue(mockQuery);

    const { result } = renderHook(() => useGoals());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.goals[0]).toHaveProperty('completion_percentage');
    expect(result.current.goals[0]).toHaveProperty('days_remaining');
    expect(result.current.goals[0].completion_percentage).toBe(50);
  });
});
