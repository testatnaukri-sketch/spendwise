import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ExpenseFormData, ValidationErrors } from '@/types/expense'
import { validateExpenseForm, hasValidationErrors } from '@/lib/validation'
import { useExpenseStore } from '@/store/expenseStore'
import { useMerchantSuggestions } from '@/hooks/useMerchantSuggestions'
import { ExpenseService } from '@/services/expenseService'

interface AddExpenseFormProps {
  userId: string
  onExpenseAdded?: () => void
  onError?: (error: string) => void
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({
  userId,
  onExpenseAdded,
  onError,
}) => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [merchantInput, setMerchantInput] = useState('')
  const [showMerchantSuggestions, setShowMerchantSuggestions] = useState(false)
  const [showTagInput, setShowTagInput] = useState(false)
  const [tagInput, setTagInput] = useState('')

  const { register, watch, handleSubmit, reset, setValue } = useForm<ExpenseFormData>({
    defaultValues: {
      amount: 0,
      category: '',
      merchant: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'credit_card',
      notes: '',
      tags: [],
    },
  })

  const { categories, addExpense, addMerchant } = useExpenseStore()
  const merchantSuggestions = useMerchantSuggestions(merchantInput)
  const tags = watch('tags') || []

  const onSubmit = async (data: ExpenseFormData) => {
    const errors = validateExpenseForm(data)
    
    if (hasValidationErrors(errors)) {
      setValidationErrors(errors)
      return
    }

    setValidationErrors({})
    setIsSubmitting(true)

    try {
      const expense = await ExpenseService.createExpense(userId, data)
      addExpense(expense)
      if (data.merchant) {
        addMerchant(data.merchant)
      }
      reset()
      setMerchantInput('')
      setTagInput('')
      setShowMerchantSuggestions(false)
      setShowTagInput(false)
      onExpenseAdded?.()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add expense'
      setValidationErrors({ merchant: errorMessage })
      onError?.(errorMessage)
      console.error('Failed to add expense:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMerchantSelect = (merchant: string) => {
    setValue('merchant', merchant)
    setMerchantInput(merchant)
    setShowMerchantSuggestions(false)
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput)) {
      setValue('tags', [...tags, tagInput])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setValue('tags', tags.filter((t) => t !== tag))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Amount *
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount', { valueAsNumber: true })}
          className={`w-full px-3 py-2 border rounded-md ${
            validationErrors.amount ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {validationErrors.amount && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.amount}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category *
        </label>
        <select
          id="category"
          {...register('category')}
          className={`w-full px-3 py-2 border rounded-md ${
            validationErrors.category ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        {validationErrors.category && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="merchant" className="block text-sm font-medium mb-1">
          Merchant *
        </label>
        <div className="relative">
          <input
            id="merchant"
            type="text"
            placeholder="Enter merchant name"
            value={merchantInput}
            onChange={(e) => {
              setMerchantInput(e.target.value)
              setValue('merchant', e.target.value)
              setShowMerchantSuggestions(true)
            }}
            onFocus={() => setShowMerchantSuggestions(true)}
            className={`w-full px-3 py-2 border rounded-md ${
              validationErrors.merchant ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {showMerchantSuggestions && merchantSuggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              {merchantSuggestions.slice(0, 5).map((merchant) => (
                <li key={merchant}>
                  <button
                    type="button"
                    onClick={() => handleMerchantSelect(merchant)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    {merchant}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {validationErrors.merchant && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.merchant}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium mb-1">
          Date *
        </label>
        <input
          id="date"
          type="date"
          {...register('date')}
          className={`w-full px-3 py-2 border rounded-md ${
            validationErrors.date ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {validationErrors.date && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.date}</p>
        )}
      </div>

      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-medium mb-1">
          Payment Method *
        </label>
        <select
          id="paymentMethod"
          {...register('paymentMethod')}
          className={`w-full px-3 py-2 border rounded-md ${
            validationErrors.paymentMethod ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="credit_card">Credit Card</option>
          <option value="debit_card">Debit Card</option>
          <option value="cash">Cash</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="other">Other</option>
        </select>
        {validationErrors.paymentMethod && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.paymentMethod}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          placeholder="Optional notes about this expense"
          {...register('notes')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        {showTagInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 py-2 bg-gray-200 rounded-md"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowTagInput(false)}
              className="px-3 py-2 bg-gray-200 rounded-md"
            >
              Done
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowTagInput(true)}
            className="px-3 py-2 text-sm border border-dashed border-gray-300 rounded-md hover:bg-gray-50"
          >
            + Add Tag
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  )
}
