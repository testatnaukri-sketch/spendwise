import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { GoalWithProgress, CreateGoalInput, UpdateGoalInput } from '../../types/database';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { validateGoalAmount, validateTargetDate } from '../../utils/goalCalculations';

interface GoalFormProps {
  goal?: GoalWithProgress;
  onSubmit: (data: CreateGoalInput | UpdateGoalInput) => Promise<void>;
  onCancel: () => void;
}

export function GoalForm({ goal, onSubmit, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [targetAmount, setTargetAmount] = useState(goal?.target_amount.toString() || '');
  const [targetDate, setTargetDate] = useState(
    goal?.target_date || format(new Date(), 'yyyy-MM-dd')
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description || '');
      setTargetAmount(goal.target_amount.toString());
      setTargetDate(goal.target_date);
    }
  }, [goal]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    const amount = parseFloat(targetAmount);
    if (!targetAmount || isNaN(amount)) {
      newErrors.targetAmount = 'Valid amount is required';
    } else {
      const amountError = validateGoalAmount(amount);
      if (amountError) {
        newErrors.targetAmount = amountError;
      }
    }

    if (!targetDate) {
      newErrors.targetDate = 'Target date is required';
    } else {
      const dateError = validateTargetDate(targetDate);
      if (dateError) {
        newErrors.targetDate = dateError;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);
      const data = {
        title: title.trim(),
        description: description.trim() || undefined,
        target_amount: parseFloat(targetAmount),
        target_date: targetDate,
      };

      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting goal:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g., Emergency Fund"
        error={errors.title}
        required
      />

      <Textarea
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add more details about your goal..."
        rows={3}
      />

      <Input
        label="Target Amount"
        type="number"
        step="0.01"
        min="0"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        placeholder="0.00"
        error={errors.targetAmount}
        required
      />

      <Input
        label="Target Date"
        type="date"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
        error={errors.targetDate}
        required
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
