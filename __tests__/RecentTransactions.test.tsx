import { render, screen } from '@testing-library/react'
import { RecentTransactions } from '../components/RecentTransactions'

const mockTransactions = [
  {
    id: '1',
    amount: 50.99,
    description: 'Grocery shopping',
    category: 'Food',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    amount: 25.00,
    description: 'Coffee',
    category: 'Food',
    created_at: '2024-01-15T08:15:00Z',
  },
]

describe('RecentTransactions Component', () => {
  it('renders transaction list correctly', () => {
    render(
      <RecentTransactions
        transactions={mockTransactions}
        loading={false}
      />
    )

    expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
    expect(screen.getByText('Grocery shopping')).toBeInTheDocument()
    expect(screen.getByText('Coffee')).toBeInTheDocument()
    expect(screen.getByText('-$50.99')).toBeInTheDocument()
    expect(screen.getByText('-$25.00')).toBeInTheDocument()
  })

  it('displays empty state when no transactions', () => {
    render(
      <RecentTransactions
        transactions={[]}
        loading={false}
      />
    )

    expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
    expect(screen.getByText('No transactions yet')).toBeInTheDocument()
    expect(screen.getByText('Start tracking your expenses to see them here')).toBeInTheDocument()
  })

  it('displays loading state correctly', () => {
    render(
      <RecentTransactions
        transactions={[]}
        loading={true}
      />
    )

    expect(screen.getByText('Recent Transactions')).toBeInTheDocument()
    // Should show skeleton loaders
    expect(screen.queryByText('No transactions yet')).not.toBeInTheDocument()
  })

  it('displays transaction categories correctly', () => {
    render(
      <RecentTransactions
        transactions={mockTransactions}
        loading={false}
      />
    )

    // Category should be displayed in a badge
    const categoryBadges = screen.getAllByText('Food')
    expect(categoryBadges.length).toBeGreaterThan(0)
    expect(categoryBadges[0]).toHaveClass('text-xs', 'px-2', 'py-1', 'bg-gray-100', 'text-gray-600', 'rounded-full')
  })
})