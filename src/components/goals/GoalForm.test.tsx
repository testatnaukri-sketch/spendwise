import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GoalForm } from './GoalForm';
import { format, addDays } from 'date-fns';

describe('GoalForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  it('should render form fields', () => {
    render(<GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target date/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByText(/create goal/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should validate amount is greater than 0', async () => {
    render(<GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByLabelText(/title/i);
    const amountInput = screen.getByLabelText(/target amount/i);
    const dateInput = screen.getByLabelText(/target date/i);

    fireEvent.change(titleInput, { target: { value: 'Test Goal' } });
    fireEvent.change(amountInput, { target: { value: '0' } });
    fireEvent.change(dateInput, {
      target: { value: format(addDays(new Date(), 30), 'yyyy-MM-dd') },
    });

    const submitButton = screen.getByText(/create goal/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/amount must be greater than 0/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should validate target date is in future', async () => {
    render(<GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByLabelText(/title/i);
    const amountInput = screen.getByLabelText(/target amount/i);
    const dateInput = screen.getByLabelText(/target date/i);

    fireEvent.change(titleInput, { target: { value: 'Test Goal' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(dateInput, {
      target: { value: '2020-01-01' },
    });

    const submitButton = screen.getByText(/create goal/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/target date must be in the future/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid form data', async () => {
    render(<GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const amountInput = screen.getByLabelText(/target amount/i);
    const dateInput = screen.getByLabelText(/target date/i);

    const futureDate = format(addDays(new Date(), 30), 'yyyy-MM-dd');

    fireEvent.change(titleInput, { target: { value: 'Test Goal' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.change(amountInput, { target: { value: '1000' } });
    fireEvent.change(dateInput, { target: { value: futureDate } });

    const submitButton = screen.getByText(/create goal/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Goal',
        description: 'Test description',
        target_amount: 1000,
        target_date: futureDate,
      });
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<GoalForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should populate form with existing goal data', () => {
    const existingGoal = {
      id: '1',
      user_id: 'user1',
      title: 'Existing Goal',
      description: 'Existing description',
      target_amount: 5000,
      current_amount: 2500,
      target_date: '2024-12-31',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      archived_at: null,
      completion_percentage: 50,
      days_remaining: 100,
    };

    render(
      <GoalForm goal={existingGoal} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    expect(screen.getByDisplayValue('Existing Goal')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-12-31')).toBeInTheDocument();
  });
});
