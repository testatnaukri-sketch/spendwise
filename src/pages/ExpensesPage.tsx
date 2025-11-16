import React, { useEffect, useState } from 'react'
import { AddExpenseForm } from '@/components/AddExpenseForm'
import { useExpenseStore } from '@/store/expenseStore'
import { useExpenseSync } from '@/hooks/useExpenseSync'
import { ExpenseService } from '@/services/expenseService'

interface ExpensesPageProps {
  userId: string
}

export const ExpensesPage: React.FC<ExpensesPageProps> = ({ userId }) => {
  const { expenses, categories, setCategories, setExpenses, setMerchants } = useExpenseStore()
  const [isLoading, setIsLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useExpenseSync(userId)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        
        const [cats, merchants, exps] = await Promise.all([
          ExpenseService.getCategories(),
          ExpenseService.getMerchants(userId),
          ExpenseService.getExpenses(userId),
        ])

        setCategories(cats)
        setMerchants(merchants)
        setExpenses(exps)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load data'
        setErrorMessage(message)
        console.error('Failed to load initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [userId, setCategories, setMerchants, setExpenses])

  const handleExpenseAdded = () => {
    setSuccessMessage('Expense added successfully!')
    setShowAddForm(false)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const handleError = (error: string) => {
    setErrorMessage(error)
    setTimeout(() => setErrorMessage(null), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="mb-6">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Expense
            </button>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add New Expense</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <AddExpenseForm
                userId={userId}
                onExpenseAdded={handleExpenseAdded}
                onError={handleError}
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading expenses...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {expenses.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No expenses yet. Add one to get started!
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Merchant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.merchant}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense.paymentMethod}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
