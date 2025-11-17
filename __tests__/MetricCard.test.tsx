import { render, screen } from '@testing-library/react'
import { MetricCard } from '../components/MetricCard'

describe('MetricCard Component', () => {
  it('renders metric title and value correctly', () => {
    render(
      <MetricCard
        title="Total Expenses"
        value="$1,234"
      />
    )

    expect(screen.getByText('Total Expenses')).toBeInTheDocument()
    expect(screen.getByText('$1,234')).toBeInTheDocument()
  })

  it('displays loading state correctly', () => {
    render(
      <MetricCard
        title="Total Expenses"
        value="$1,234"
        loading={true}
      />
    )

    // In loading state, the title is replaced with a skeleton
    expect(screen.queryByText('Total Expenses')).not.toBeInTheDocument()
    expect(screen.queryByText('$1,234')).not.toBeInTheDocument()
    // Should have skeleton elements
    expect(document.querySelector('.skeleton')).toBeInTheDocument()
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('displays change indicator correctly', () => {
    render(
      <MetricCard
        title="Monthly Burn Rate"
        value="$2,500"
        change={15}
        changeType="increase"
      />
    )

    expect(screen.getByText('↑ 15%')).toBeInTheDocument()
  })

  it('displays decrease change correctly', () => {
    render(
      <MetricCard
        title="Budget Remaining"
        value="$3,800"
        change={10}
        changeType="decrease"
      />
    )

    expect(screen.getByText('↓ 10%')).toBeInTheDocument()
  })
})