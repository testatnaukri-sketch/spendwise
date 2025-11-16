'use client'

import { useState } from 'react'
import { ProfileForm } from './ProfileForm'
import { ProfileCard } from './ProfileCard'
import { useProfile } from '@/lib/hooks/useProfile'
import { ProfileFormData } from '@/lib/profile-schema'

interface ProfilePageProps {
  userId?: string
}

export function ProfilePage({ userId }: ProfilePageProps) {
  const [editMode, setEditMode] = useState(false)
  const { profile, loading, error, isNew, save } = useProfile({ userId })

  if (!userId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">User ID is required to view profile</p>
      </div>
    )
  }

  if (loading && !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading profile: {error.message}</p>
      </div>
    )
  }

  const handleFormSubmit = async (data: Partial<ProfileFormData>) => {
    const result = await save(data)
    setEditMode(false)
    return result
  }

  if (editMode) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-4">
          <button
            onClick={() => setEditMode(false)}
            className="text-blue-500 hover:text-blue-700 mb-4"
          >
            ← Back to Profile
          </button>
        </div>
        <ProfileForm
          initialData={profile}
          onSubmit={handleFormSubmit}
          isLoading={loading}
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {profile && <ProfileCard profile={profile} />}

      {isNew && !editMode && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">
            Complete your profile to get started with Spendwise
          </p>
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => setEditMode(true)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          {isNew ? 'Create Profile' : 'Edit Profile'}
        </button>
      </div>
    </div>
  )
}
