import { describe, it, expect } from 'vitest';
import {
  calculateCompletionPercentage,
  calculateDaysRemaining,
  isDeadlineNear,
  isOverdue,
  validateGoalAmount,
  validateTargetDate,
} from './goalCalculations';
import { format, addDays, subDays } from 'date-fns';

describe('goalCalculations', () => {
  describe('calculateCompletionPercentage', () => {
    it('should calculate correct percentage', () => {
      expect(calculateCompletionPercentage(50, 100)).toBe(50);
      expect(calculateCompletionPercentage(25, 100)).toBe(25);
      expect(calculateCompletionPercentage(100, 100)).toBe(100);
    });

    it('should not exceed 100%', () => {
      expect(calculateCompletionPercentage(150, 100)).toBe(100);
    });

    it('should not go below 0%', () => {
      expect(calculateCompletionPercentage(-10, 100)).toBe(0);
    });

    it('should handle zero target amount', () => {
      expect(calculateCompletionPercentage(50, 0)).toBe(0);
    });
  });

  describe('calculateDaysRemaining', () => {
    it('should calculate positive days for future dates', () => {
      const futureDate = format(addDays(new Date(), 10), 'yyyy-MM-dd');
      const days = calculateDaysRemaining(futureDate);
      expect(days).toBeGreaterThanOrEqual(9);
      expect(days).toBeLessThanOrEqual(10);
    });

    it('should calculate negative days for past dates', () => {
      const pastDate = format(subDays(new Date(), 5), 'yyyy-MM-dd');
      const days = calculateDaysRemaining(pastDate);
      expect(days).toBeLessThan(0);
    });
  });

  describe('isDeadlineNear', () => {
    it('should return true for dates within threshold', () => {
      const nearDate = format(addDays(new Date(), 15), 'yyyy-MM-dd');
      expect(isDeadlineNear(nearDate, 30)).toBe(true);
    });

    it('should return false for dates beyond threshold', () => {
      const farDate = format(addDays(new Date(), 45), 'yyyy-MM-dd');
      expect(isDeadlineNear(farDate, 30)).toBe(false);
    });

    it('should return false for past dates', () => {
      const pastDate = format(subDays(new Date(), 5), 'yyyy-MM-dd');
      expect(isDeadlineNear(pastDate, 30)).toBe(false);
    });
  });

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      const pastDate = format(subDays(new Date(), 5), 'yyyy-MM-dd');
      expect(isOverdue(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = format(addDays(new Date(), 5), 'yyyy-MM-dd');
      expect(isOverdue(futureDate)).toBe(false);
    });
  });

  describe('validateGoalAmount', () => {
    it('should return null for valid amounts', () => {
      expect(validateGoalAmount(100)).toBeNull();
      expect(validateGoalAmount(0.01)).toBeNull();
      expect(validateGoalAmount(1000000)).toBeNull();
    });

    it('should return error for zero or negative amounts', () => {
      expect(validateGoalAmount(0)).toBe('Amount must be greater than 0');
      expect(validateGoalAmount(-10)).toBe('Amount must be greater than 0');
    });

    it('should return error for invalid numbers', () => {
      expect(validateGoalAmount(Infinity)).toBe('Amount must be a valid number');
      expect(validateGoalAmount(NaN)).toBe('Amount must be a valid number');
    });
  });

  describe('validateTargetDate', () => {
    it('should return null for future dates', () => {
      const futureDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');
      expect(validateTargetDate(futureDate)).toBeNull();
    });

    it('should return error for past dates', () => {
      const pastDate = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      expect(validateTargetDate(pastDate)).toBe('Target date must be in the future');
    });

    it('should return error for invalid date format', () => {
      expect(validateTargetDate('invalid-date')).toBe('Invalid date format');
    });
  });
});
