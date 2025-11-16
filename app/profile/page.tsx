'use client'

import { ProfilePage } from '@/components/ProfilePage'

export default function Page() {
  // In a real app, this would come from auth context
  const userId = 'demo-user'

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <ProfilePage userId={userId} />
      </div>
    </main>
  )
}
