import { createClient } from '../server'
import type { Profiles, ProfilesInsert, ProfilesUpdate } from '@/types/database'

/**
 * Get profile by user ID
 */
export async function getProfileById(userId: string): Promise<Profiles | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

/**
 * Get profile by username
 */
export async function getProfileByUsername(username: string): Promise<Profiles | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

/**
 * Get current user's profile
 */
export async function getCurrentProfile(): Promise<Profiles | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  return getProfileById(user.id)
}

/**
 * Update profile
 */
export async function updateProfile(userId: string, updates: ProfilesUpdate): Promise<Profiles> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update avatar URL
 */
export async function updateAvatar(userId: string, avatarUrl: string): Promise<Profiles> {
  return updateProfile(userId, { avatar_url: avatarUrl })
}

/**
 * Check if username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return true
    throw error
  }
  return !data
}
