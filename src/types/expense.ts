export type PaymentMethod = 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'other'

export interface Category {
  id: string
  name: string
  icon?: string
}

export interface Expense {
  id: string
  userId: string
  amount: number
  category: string
  merchant: string
  date: string
  paymentMethod: PaymentMethod
  notes?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface ExpenseFormData {
  amount: number
  category: string
  merchant: string
  date: string
  paymentMethod: PaymentMethod
  notes?: string
  tags?: string[]
}

export interface ValidationErrors {
  amount?: string
  category?: string
  merchant?: string
  date?: string
  paymentMethod?: string
}
