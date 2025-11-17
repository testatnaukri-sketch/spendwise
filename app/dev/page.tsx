'use client'

import { useState } from 'react'

export default function DevPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleGenerateMockData = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/dev/mock-data?userId=demo-user&action=generate&expenses=30&goals=5', {
        method: 'POST',
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setMessage(`✅ Generated ${result.expenses} expenses and ${result.goals} goals`)
      } else {
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearMockData = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/dev/mock-data?userId=demo-user&action=clear', {
        method: 'POST',
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setMessage('✅ Mock data cleared successfully')
      } else {
        setMessage(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Development Utilities</h1>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Mock Data Generation</h2>
              <p className="text-gray-600 mb-4">
                Generate sample expenses and goals for testing the dashboard. This will clear any existing mock data first.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={handleGenerateMockData}
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Generating...' : 'Generate Mock Data'}
                </button>
                
                <button
                  onClick={handleClearMockData}
                  disabled={isLoading}
                  className="btn-secondary"
                >
                  {isLoading ? 'Clearing...' : 'Clear Mock Data'}
                </button>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {message}
              </div>
            )}

            <div className="border-l-4 border-gray-300 pl-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Links</h2>
              <div className="space-y-2">
                <a href="/dashboard" className="text-primary-600 hover:text-primary-800 underline">
                  → View Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}