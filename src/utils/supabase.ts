import { createClient } from '@supabase/supabase-js'

// Support both browser (Vite) and Node.js (server) environments
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function withAuth<T>(
  callback: (userId: string) => Promise<T>
): Promise<T> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('User not authenticated')
  }
  return callback(user.id)
}
