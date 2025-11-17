import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, calculatePercentage } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format a positive number as USD currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
    })

    it('should format zero as currency', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should format a negative number as currency', () => {
      expect(formatCurrency(-100)).toBe('-$100.00')
    })
  })

  describe('formatDate', () => {
    it('should format a date string', () => {
      const date = '2024-01-15'
      expect(formatDate(date)).toMatch(/Jan 15, 2024/)
    })

    it('should format a Date object', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date)).toMatch(/Jan 15, 2024/)
    })
  })

  describe('calculatePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25)
      expect(calculatePercentage(50, 200)).toBe(25)
    })

    it('should handle zero total', () => {
      expect(calculatePercentage(50, 0)).toBe(0)
    })

    it('should round to nearest integer', () => {
      expect(calculatePercentage(33, 100)).toBe(33)
      expect(calculatePercentage(66.6, 100)).toBe(67)
    })
  })
})
