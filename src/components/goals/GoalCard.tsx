import React from 'react';
import { Calendar, Target, TrendingUp, AlertCircle, Edit, Archive } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { GoalWithProgress } from '../../types/database';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { isDeadlineNear, isOverdue } from '../../utils/goalCalculations';

interface GoalCardProps {
  goal: GoalWithProgress;
  onEdit: (goal: GoalWithProgress) => void;
  onArchive: (id: string) => void;
  onAddUpdate: (goal: GoalWithProgress) => void;
}

export function GoalCard({ goal, onEdit, onArchive, onAddUpdate }: GoalCardProps) {
  const isNearDeadline = isDeadlineNear(goal.target_date);
  const isPastDue = isOverdue(goal.target_date);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {goal.title}
          </h3>
          {goal.description && (
            <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(goal)}
            className="text-gray-600 hover:text-blue-600 transition-colors"
            title="Edit goal"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={() => onArchive(goal.id)}
            className="text-gray-600 hover:text-red-600 transition-colors"
            title="Archive goal"
          >
            <Archive size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Target size={16} />
            <span>
              ${goal.current_amount.toFixed(2)} / ${goal.target_amount.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={16} />
            <span>{format(parseISO(goal.target_date), 'MMM d, yyyy')}</span>
          </div>
        </div>

        <ProgressBar percentage={goal.completion_percentage} />

        {(isNearDeadline || isPastDue) && (
          <div className={`flex items-center gap-2 text-sm ${isPastDue ? 'text-red-600' : 'text-orange-600'}`}>
            <AlertCircle size={16} />
            <span>
              {isPastDue
                ? `Overdue by ${Math.abs(goal.days_remaining)} days`
                : `${goal.days_remaining} days remaining`}
            </span>
          </div>
        )}

        {!isPastDue && !isNearDeadline && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>{goal.days_remaining} days remaining</span>
          </div>
        )}

        <div className="pt-2">
          <Button
            onClick={() => onAddUpdate(goal)}
            variant="primary"
            size="sm"
            className="w-full"
          >
            <TrendingUp size={16} className="mr-2" />
            Add Progress
          </Button>
        </div>
      </div>
    </div>
  );
}
