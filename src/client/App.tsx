import React from 'react'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import './App.css'

// Mock categories for demo purposes
const mockCategories = [
  { id: 'cat-food', name: 'Food & Dining' },
  { id: 'cat-transport', name: 'Transportation' },
  { id: 'cat-utilities', name: 'Utilities' },
  { id: 'cat-entertainment', name: 'Entertainment' },
  { id: 'cat-health', name: 'Health' },
  { id: 'cat-shopping', name: 'Shopping' },
]

function App() {
  return <AnalyticsDashboard categories={mockCategories} />
}

export default App
