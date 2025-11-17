import { differenceInDays, parseISO, isPast } from 'date-fns';
import type { Goal, GoalWithProgress } from '../types/database';

export function calculateCompletionPercentage(
  currentAmount: number,
  targetAmount: number
): number {
  if (targetAmount <= 0) return 0;
  const percentage = (currentAmount / targetAmount) * 100;
  return Math.min(Math.max(percentage, 0), 100);
}

export function calculateDaysRemaining(targetDate: string): number {
  const target = parseISO(targetDate);
  const today = new Date();
  return differenceInDays(target, today);
}

export function isDeadlineNear(targetDate: string, threshold: number = 30): boolean {
  const daysRemaining = calculateDaysRemaining(targetDate);
  return daysRemaining >= 0 && daysRemaining <= threshold;
}

export function isOverdue(targetDate: string): boolean {
  return isPast(parseISO(targetDate)) && calculateDaysRemaining(targetDate) < 0;
}

export function enrichGoalWithProgress(goal: Goal): GoalWithProgress {
  return {
    ...goal,
    completion_percentage: calculateCompletionPercentage(
      goal.current_amount,
      goal.target_amount
    ),
    days_remaining: calculateDaysRemaining(goal.target_date),
  };
}

export function validateGoalAmount(amount: number): string | null {
  if (amount <= 0) {
    return 'Amount must be greater than 0';
  }
  if (!isFinite(amount)) {
    return 'Amount must be a valid number';
  }
  return null;
}

export function validateTargetDate(dateString: string): string | null {
  try {
    const date = parseISO(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return 'Target date must be in the future';
    }
    return null;
  } catch {
    return 'Invalid date format';
  }
}
