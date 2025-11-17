import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GoalsList } from './GoalsList';
import { supabase } from '../../lib/supabase';

vi.mock('../../lib/supabase');

describe('GoalsList Integration', () => {
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
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockResolvedValue({ data: mockGoals, error: null }),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn().mockResolvedValue({ error: null }),
    };

    (supabase.from as any).mockReturnValue(mockQuery);
    (supabase.channel as any).mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    });
    (supabase.removeChannel as any).mockReturnValue(undefined);
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: { id: 'user1' } },
    });
  });

  it('should render goals list', async () => {
    render(<GoalsList />);

    await waitFor(() => {
      expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
    });
  });

  it('should open create modal when clicking New Goal button', async () => {
    render(<GoalsList />);

    await waitFor(() => {
      expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
    });

    const newGoalButton = screen.getAllByText(/new goal/i)[0];
    fireEvent.click(newGoalButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Goal')).toBeInTheDocument();
    });
  });

  it('should filter goals by search query', async () => {
    const multipleGoals = [
      ...mockGoals,
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

    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockResolvedValue({ data: multipleGoals, error: null }),
    };

    (supabase.from as any).mockReturnValue(mockQuery);

    render(<GoalsList />);

    await waitFor(() => {
      expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      expect(screen.getByText('Vacation Fund')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search goals/i);
    fireEvent.change(searchInput, { target: { value: 'Emergency' } });

    await waitFor(() => {
      expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      expect(screen.queryByText('Vacation Fund')).not.toBeInTheDocument();
    });
  });

  it('should sort goals by different criteria', async () => {
    const multipleGoals = [
      {
        id: '1',
        user_id: 'user1',
        title: 'Goal A',
        description: null,
        target_amount: 10000,
        current_amount: 2000,
        target_date: '2024-12-31',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        archived_at: null,
      },
      {
        id: '2',
        user_id: 'user1',
        title: 'Goal B',
        description: null,
        target_amount: 5000,
        current_amount: 4000,
        target_date: '2024-06-30',
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        archived_at: null,
      },
    ];

    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockResolvedValue({ data: multipleGoals, error: null }),
    };

    (supabase.from as any).mockReturnValue(mockQuery);

    render(<GoalsList />);

    await waitFor(() => {
      expect(screen.getByText('Goal A')).toBeInTheDocument();
    });

    const sortSelect = screen.getByRole('combobox');
    fireEvent.change(sortSelect, { target: { value: 'progress_desc' } });

    const goalCards = screen.getAllByRole('heading', { level: 3 });
    expect(goalCards[0].textContent).toBe('Goal B');
  });

  it('should display empty state when no goals exist', async () => {
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockResolvedValue({ data: [], error: null }),
    };

    (supabase.from as any).mockReturnValue(mockQuery);

    render(<GoalsList />);

    await waitFor(() => {
      expect(
        screen.getByText(/no active goals. create your first goal to get started/i)
      ).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Network error' },
      }),
    };

    (supabase.from as any).mockReturnValue(mockQuery);

    render(<GoalsList />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it('should show archived goals when checkbox is checked', async () => {
    const archivedGoals = [
      {
        ...mockGoals[0],
        archived_at: '2024-01-15T00:00:00Z',
      },
    ];

    let currentIncludeArchived = false;

    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      is: vi.fn().mockImplementation((column, value) => {
        currentIncludeArchived = value === null;
        return Promise.resolve({
          data: currentIncludeArchived ? mockGoals : [],
          error: null,
        });
      }),
    };

    (supabase.from as any).mockReturnValue(mockQuery);

    render(<GoalsList />);

    await waitFor(() => {
      expect(screen.queryByText('Emergency Fund')).not.toBeInTheDocument();
    });

    const archivedCheckbox = screen.getByLabelText(/show archived/i);
    fireEvent.click(archivedCheckbox);

    await waitFor(() => {
      expect(mockQuery.is).toHaveBeenCalled();
    });
  });
});
