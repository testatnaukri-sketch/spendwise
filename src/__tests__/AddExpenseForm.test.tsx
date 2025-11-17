import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AddExpenseForm } from '@/components/AddExpenseForm'
import { useExpenseStore } from '@/store/expenseStore'
import * as ExpenseServiceModule from '@/services/expenseService'

vi.mock('@/services/expenseService')

describe('AddExpenseForm', () => {
  const mockUserId = 'user-123'
  const mockOnExpenseAdded = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    useExpenseStore.setState({
      expenses: [],
      categories: [
        { id: '1', name: 'Food' },
        { id: '2', name: 'Transport' },
      ],
      merchants: ['Restaurant', 'Taxi'],
      isLoading: false,
      error: null,
    })

    vi.mocked(ExpenseServiceModule.ExpenseService.createExpense).mockResolvedValue({
      id: 'exp-123',
      userId: mockUserId,
      amount: 50.00,
      category: 'Food',
      merchant: 'Restaurant',
      date: '2024-01-15',
      paymentMethod: 'credit_card',
      notes: 'Test expense',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  })

  it('should render the form with all fields', () => {
    render(
      <AddExpenseForm userId={mockUserId} />
    )

    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Merchant/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Payment Method/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add Expense/i })).toBeInTheDocument()
  })

  it('should render categories from the store', () => {
    render(<AddExpenseForm userId={mockUserId} />)
    const select = screen.getByLabelText(/Category/i)
    expect(select).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText('Transport')).toBeInTheDocument()
  })

  it('should display validation errors for empty required fields', async () => {
    render(<AddExpenseForm userId={mockUserId} />)
    const submitButton = screen.getByRole('button', { name: /Add Expense/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Amount must be greater than 0/i)).toBeInTheDocument()
      expect(screen.getByText(/Category is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Merchant name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Date is required/i)).toBeInTheDocument()
    })
  })

  it('should validate negative amounts', async () => {
    render(<AddExpenseForm userId={mockUserId} />)
    const amountInput = screen.getByLabelText(/Amount/i)
    fireEvent.change(amountInput, { target: { value: '-10' } })

    const submitButton = screen.getByRole('button', { name: /Add Expense/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Amount must be greater than 0/i)).toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    render(
      <AddExpenseForm
        userId={mockUserId}
        onExpenseAdded={mockOnExpenseAdded}
      />
    )

    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: '50' },
    })
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: 'Food' },
    })
    fireEvent.change(screen.getByLabelText(/Merchant/i), {
      target: { value: 'Restaurant' },
    })
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: '2024-01-15' },
    })

    const submitButton = screen.getByRole('button', { name: /Add Expense/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(ExpenseServiceModule.ExpenseService.createExpense).toHaveBeenCalledWith(
        mockUserId,
        expect.objectContaining({
          amount: 50,
          category: 'Food',
          merchant: 'Restaurant',
          date: '2024-01-15',
        })
      )
    })

    await waitFor(() => {
      expect(mockOnExpenseAdded).toHaveBeenCalled()
    })
  })

  it('should show merchant suggestions', async () => {
    render(<AddExpenseForm userId={mockUserId} />)
    const merchantInput = screen.getByLabelText(/Merchant/i)

    fireEvent.focus(merchantInput)
    fireEvent.change(merchantInput, { target: { value: 'Rest' } })

    await waitFor(() => {
      const restaurantOption = screen.getByText('Restaurant')
      expect(restaurantOption).toBeInTheDocument()
    })
  })

  it('should select merchant from suggestions', async () => {
    render(<AddExpenseForm userId={mockUserId} />)
    const merchantInput = screen.getByLabelText(/Merchant/i) as HTMLInputElement

    fireEvent.focus(merchantInput)
    fireEvent.change(merchantInput, { target: { value: 'Rest' } })

    await waitFor(() => {
      const restaurantOption = screen.getByText('Restaurant')
      fireEvent.click(restaurantOption)
    })

    expect(merchantInput.value).toBe('Restaurant')
  })

  it('should add and remove tags', async () => {
    render(<AddExpenseForm userId={mockUserId} />)

    const addTagButton = screen.getByRole('button', { name: /\+ Add Tag/i })
    fireEvent.click(addTagButton)

    const tagInput = screen.getByPlaceholderText(/Add a tag/i)
    fireEvent.change(tagInput, { target: { value: 'urgent' } })

    const addButton = screen.getByRole('button', { name: /^Add$/ })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('urgent')).toBeInTheDocument()
    })
  })

  it('should handle submission errors', async () => {
    const error = new Error('Network error')
    vi.mocked(ExpenseServiceModule.ExpenseService.createExpense).mockRejectedValueOnce(error)

    render(
      <AddExpenseForm
        userId={mockUserId}
        onError={mockOnError}
      />
    )

    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: '50' },
    })
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: 'Food' },
    })
    fireEvent.change(screen.getByLabelText(/Merchant/i), {
      target: { value: 'Restaurant' },
    })
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: '2024-01-15' },
    })

    const submitButton = screen.getByRole('button', { name: /Add Expense/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Network error')
    })
  })

  it('should disable submit button while submitting', async () => {
    render(<AddExpenseForm userId={mockUserId} />)

    fireEvent.change(screen.getByLabelText(/Amount/i), {
      target: { value: '50' },
    })
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: 'Food' },
    })
    fireEvent.change(screen.getByLabelText(/Merchant/i), {
      target: { value: 'Restaurant' },
    })
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: '2024-01-15' },
    })

    const submitButton = screen.getByRole('button', {
      name: /Add Expense/i,
    }) as HTMLButtonElement
    fireEvent.click(submitButton)

    expect(submitButton.disabled).toBe(true)

    await waitFor(() => {
      expect(submitButton.disabled).toBe(false)
    })
  })
})
