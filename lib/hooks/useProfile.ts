import { useState, useEffect, useCallback } from 'react'
import { Profile, ProfileFormData } from '../profile-schema'
import { fetchProfile, updateProfile, createProfile } from '../profile-utils'

interface UseProfileOptions {
  userId?: string
  autoFetch?: boolean
}

interface UseProfileState {
  profile: Profile | null
  loading: boolean
  error: Error | null
  isNew: boolean
}

export function useProfile({
  userId,
  autoFetch = true,
}: UseProfileOptions = {}): UseProfileState & {
  refetch: () => Promise<void>
  save: (data: Partial<ProfileFormData>) => Promise<Profile>
} {
  const [state, setState] = useState<UseProfileState>({
    profile: null,
    loading: true,
    error: null,
    isNew: false,
  })

  const refetch = useCallback(async () => {
    if (!userId) {
      setState((prev) => ({ ...prev, loading: false, error: null }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const profile = await fetchProfile(userId)
      setState((prev) => ({
        ...prev,
        profile,
        isNew: !profile,
        loading: false,
        error: null,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to fetch profile'),
      }))
    }
  }, [userId])

  const save = useCallback(
    async (data: Partial<ProfileFormData>): Promise<Profile> => {
      if (!userId) {
        throw new Error('User ID is required')
      }

      setState((prev) => ({ ...prev, loading: true }))

      try {
        let result: Profile

        if (state.isNew) {
          result = await createProfile(userId, data)
        } else {
          result = await updateProfile(userId, data)
        }

        setState((prev) => ({
          ...prev,
          profile: result,
          isNew: false,
          loading: false,
          error: null,
        }))

        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to save profile')
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err,
        }))
        throw err
      }
    },
    [userId, state.isNew]
  )

  useEffect(() => {
    if (autoFetch && userId) {
      refetch()
    }
  }, [userId, autoFetch, refetch])

  return {
    ...state,
    refetch,
    save,
  }
}
