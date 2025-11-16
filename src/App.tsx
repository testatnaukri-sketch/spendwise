import React, { useState, useEffect } from 'react'
import { ExpensesPage } from '@/pages/ExpensesPage'
import { supabase } from '@/lib/supabase'

function App() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        
        const session = data?.session
        if (session?.user) {
          setUserId(session.user.id)
        } else {
          setUserId('demo-user')
        }
      } catch (error) {
        console.error('Failed to get session:', error)
        setUserId('demo-user')
      } finally {
        setIsLoading(false)
      }
    }

    getSession()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return userId ? <ExpensesPage userId={userId} /> : null
}

export default App
