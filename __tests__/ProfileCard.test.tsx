import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProfileCard } from '@/components/ProfileCard'
import { Profile } from '@/lib/profile-schema'

describe('ProfileCard', () => {
  const mockProfile: Profile = {
    id: 'test-id',
    user_id: 'test-user',
    full_name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    date_of_birth: '1990-01-01',
    employment_status: 'employed',
    monthly_income: 5000,
    fixed_expenses: 2000,
    savings_goal: 10000,
    risk_tolerance: 'moderate',
    financial_goals: ['emergency fund'],
    preferred_currency: 'USD',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  it('should render profile information correctly', () => {
    render(<ProfileCard profile={mockProfile} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('should display employment status', () => {
    render(<ProfileCard profile={mockProfile} />)

    expect(screen.getByText('Employment Status')).toBeInTheDocument()
    expect(screen.getByText('employed')).toBeInTheDocument()
  })

  it('should display risk tolerance', () => {
    render(<ProfileCard profile={mockProfile} />)

    expect(screen.getByText('Risk Tolerance')).toBeInTheDocument()
    expect(screen.getByText('moderate')).toBeInTheDocument()
  })

  it('should display phone number', () => {
    render(<ProfileCard profile={mockProfile} />)

    expect(screen.getByText('+1234567890')).toBeInTheDocument()
  })

  it('should display financial metrics', () => {
    render(<ProfileCard profile={mockProfile} />)

    expect(screen.getByText('Monthly Income')).toBeInTheDocument()
    expect(screen.getByText('$5000.00')).toBeInTheDocument()

    expect(screen.getByText('Fixed Expenses')).toBeInTheDocument()
    expect(screen.getByText('$2000.00')).toBeInTheDocument()

    expect(screen.getByText('Available Spending')).toBeInTheDocument()
    expect(screen.getByText('$3000.00')).toBeInTheDocument()

    expect(screen.getByText('Savings Rate')).toBeInTheDocument()
    expect(screen.getByText('60.0%')).toBeInTheDocument()
  })

  it('should display savings goal', () => {
    render(<ProfileCard profile={mockProfile} />)

    expect(screen.getByText('Savings Goal')).toBeInTheDocument()
    expect(screen.getByText('$10000.00')).toBeInTheDocument()
  })

  it('should handle missing phone number', () => {
    const profileWithoutPhone = { ...mockProfile, phone: null }
    render(<ProfileCard profile={profileWithoutPhone} />)

    expect(screen.queryByText('+1234567890')).not.toBeInTheDocument()
  })

  it('should handle missing employment status', () => {
    const profileWithoutEmployment = { ...mockProfile, employment_status: null }
    render(<ProfileCard profile={profileWithoutEmployment} />)

    expect(screen.getByText('Not specified')).toBeInTheDocument()
  })

  it('should handle zero savings goal', () => {
    const profileWithoutGoal = { ...mockProfile, savings_goal: 0 }
    render(<ProfileCard profile={profileWithoutGoal} />)

    expect(screen.queryByText('Savings Goal')).not.toBeInTheDocument()
  })

  it('should display date in localized format', () => {
    render(<ProfileCard profile={mockProfile} />)

    const dateElement = screen.getByText(/1\/1\/1990|01\/01\/1990/)
    expect(dateElement).toBeInTheDocument()
  })
})
