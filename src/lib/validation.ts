import { ExpenseFormData, ValidationErrors } from '@/types/expense'

export const validateExpenseForm = (data: Partial<ExpenseFormData>): ValidationErrors => {
  const errors: ValidationErrors = {}

  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Amount must be greater than 0'
  }

  if (!data.category || data.category.trim() === '') {
    errors.category = 'Category is required'
  }

  if (!data.merchant || data.merchant.trim() === '') {
    errors.merchant = 'Merchant name is required'
  }

  if (!data.date || data.date.trim() === '') {
    errors.date = 'Date is required'
  }

  const dateObj = new Date(data.date || '')
  if (isNaN(dateObj.getTime())) {
    errors.date = 'Please enter a valid date'
  }

  if (!data.paymentMethod || data.paymentMethod.trim() === '') {
    errors.paymentMethod = 'Payment method is required'
  }

  return errors
}

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0
}
