import React, { useState } from 'react';
import type { GoalWithProgress, CreateGoalUpdateInput } from '../../types/database';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface GoalUpdateFormProps {
  goal: GoalWithProgress;
  onSubmit: (data: CreateGoalUpdateInput) => Promise<void>;
  onCancel: () => void;
}

export function GoalUpdateForm({ goal, onSubmit, onCancel }: GoalUpdateFormProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum)) {
      newErrors.amount = 'Valid amount is required';
    } else if (amountNum === 0) {
      newErrors.amount = 'Amount cannot be zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);
      await onSubmit({
        goal_id: goal.id,
        amount: parseFloat(amount),
        note: note.trim() || undefined,
      });
    } catch (error) {
      console.error('Error adding goal update:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const newTotal = goal.current_amount + parseFloat(amount || '0');
  const remainingAmount = goal.target_amount - newTotal;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Current:</span>
          <span className="font-medium">${goal.current_amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Target:</span>
          <span className="font-medium">${goal.target_amount.toFixed(2)}</span>
        </div>
        {!isNaN(parseFloat(amount)) && parseFloat(amount) !== 0 && (
          <>
            <div className="border-t pt-2 flex justify-between text-sm">
              <span className="text-gray-600">New Total:</span>
              <span className="font-semibold text-blue-600">
                ${newTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining:</span>
              <span className={`font-semibold ${remainingAmount <= 0 ? 'text-green-600' : 'text-gray-900'}`}>
                ${Math.max(remainingAmount, 0).toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>

      <Input
        label="Amount"
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount to add or subtract"
        error={errors.amount}
        required
      />

      <Textarea
        label="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note about this update..."
        rows={3}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? 'Adding...' : 'Add Update'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
