import { describe, it, expect } from 'vitest'
import { validateExpenseForm, hasValidationErrors } from '@/lib/validation'
import { ExpenseFormData } from '@/types/expense'

describe('validateExpenseForm', () => {
  const validData: ExpenseFormData = {
    amount: 25.50,
    category: 'Food',
    merchant: 'McDonald\'s',
    date: '2024-01-15',
    paymentMethod: 'credit_card',
    notes: 'Lunch',
    tags: [],
  }

  it('should pass validation with valid data', () => {
    const errors = validateExpenseForm(validData)
    expect(errors).toEqual({})
  })

  it('should fail validation when amount is missing', () => {
    const data = { ...validData, amount: 0 }
    const errors = validateExpenseForm(data)
    expect(errors.amount).toBeDefined()
  })

  it('should fail validation when amount is negative', () => {
    const data = { ...validData, amount: -10 }
    const errors = validateExpenseForm(data)
    expect(errors.amount).toBeDefined()
  })

  it('should fail validation when category is missing', () => {
    const data = { ...validData, category: '' }
    const errors = validateExpenseForm(data)
    expect(errors.category).toBeDefined()
  })

  it('should fail validation when merchant is missing', () => {
    const data = { ...validData, merchant: '' }
    const errors = validateExpenseForm(data)
    expect(errors.merchant).toBeDefined()
  })

  it('should fail validation when date is missing', () => {
    const data = { ...validData, date: '' }
    const errors = validateExpenseForm(data)
    expect(errors.date).toBeDefined()
  })

  it('should fail validation when date is invalid', () => {
    const data = { ...validData, date: 'not-a-date' }
    const errors = validateExpenseForm(data)
    expect(errors.date).toBeDefined()
  })

  it('should fail validation when payment method is missing', () => {
    const data = { ...validData, paymentMethod: '' as any }
    const errors = validateExpenseForm(data)
    expect(errors.paymentMethod).toBeDefined()
  })

  it('should return multiple errors for multiple invalid fields', () => {
    const data = {
      amount: 0,
      category: '',
      merchant: '',
      date: '',
      paymentMethod: '' as any,
    }
    const errors = validateExpenseForm(data)
    expect(Object.keys(errors).length).toBeGreaterThan(1)
  })

  it('should allow empty optional fields', () => {
    const data: ExpenseFormData = {
      amount: 25.50,
      category: 'Food',
      merchant: 'McDonald\'s',
      date: '2024-01-15',
      paymentMethod: 'credit_card',
      notes: '',
      tags: [],
    }
    const errors = validateExpenseForm(data)
    expect(errors).toEqual({})
  })
})

describe('hasValidationErrors', () => {
  it('should return true when there are errors', () => {
    const errors = { amount: 'Amount is required' }
    expect(hasValidationErrors(errors)).toBe(true)
  })

  it('should return false when there are no errors', () => {
    const errors = {}
    expect(hasValidationErrors(errors)).toBe(false)
  })

  it('should return true when there are multiple errors', () => {
    const errors = {
      amount: 'Amount is required',
      category: 'Category is required',
    }
    expect(hasValidationErrors(errors)).toBe(true)
  })
})
