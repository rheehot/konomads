import { createClient } from '../server'
import type { Meetups, MeetupsInsert, MeetupsUpdate, MeetupWithDetails, MeetupParticipantsInsert } from '@/types/database'

/**
 * Get all meetups
 */
export async function getMeetups(options?: {
  cityId?: string
  status?: string
  upcoming?: boolean
  limit?: number
}): Promise<MeetupWithDetails[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('meetups')
    .select(`
      *,
      profiles (*),
      cities (*)
    `)

  if (options?.cityId) {
    query = query.eq('city_id', options.cityId)
  }

  if (options?.status) {
    query = query.eq('status', options.status)
  }

  if (options?.upcoming) {
    query = query.gte('meetup_date', new Date().toISOString())
  }

  query = query
    .order('meetup_date', { ascending: true })
    .limit(options?.limit || 20)

  const { data, error } = await query

  if (error) throw error

  // Add participation info if user is logged in
  const meetups = data as MeetupWithDetails[]
  if (user) {
    for (const meetup of meetups) {
      const { data: participant } = await supabase
        .from('meetup_participants')
        .select('*')
        .eq('meetup_id', meetup.id)
        .eq('user_id', user.id)
        .single()

      meetup.is_participant = !!participant
    }
  }

  return meetups
}

/**
 * Get meetup by ID
 */
export async function getMeetupById(meetupId: string): Promise<MeetupWithDetails | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('meetups')
    .select(`
      *,
      profiles (*),
      cities (*)
    `)
    .eq('id', meetupId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  const meetup = data as MeetupWithDetails

  // Add participation info if user is logged in
  if (user) {
    const { data: participant } = await supabase
      .from('meetup_participants')
      .select('*')
      .eq('meetup_id', meetup.id)
      .eq('user_id', user.id)
      .single()

    meetup.is_participant = !!participant
  }

  // Get actual participant count
  const { data: participants } = await supabase
    .from('meetup_participants')
    .select('id', { count: 'exact' })
    .eq('meetup_id', meetup.id)
    .eq('status', 'going')

  meetup.participant_count = participants?.length || 0

  return meetup
}

/**
 * Get meetups by user
 */
export async function getMeetupsByUserId(userId: string): Promise<MeetupWithDetails[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('meetups')
    .select(`
      *,
      profiles (*),
      cities (*)
    `)
    .eq('user_id', userId)
    .order('meetup_date', { ascending: true })

  if (error) throw error
  return (data as MeetupWithDetails[]) || []
}

/**
 * Get meetups user is participating in
 */
export async function getParticipatingMeetups(userId: string): Promise<MeetupWithDetails[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('meetup_participants')
    .select(`
      meetups (
        *,
        profiles (*),
        cities (*)
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'going')
    .gte('meetups.meetup_date', new Date().toISOString())

  if (error) throw error
  return (data?.map((p: any) => p.meetups).filter(Boolean) as MeetupWithDetails[]) || []
}

/**
 * Create a new meetup
 */
export async function createMeetup(meetup: MeetupsInsert): Promise<Meetups> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('meetups')
    .insert(meetup)
    .select()
    .single()

  if (error) throw error

  // Automatically join the creator
  await joinMeetup(data.id, meetup.user_id)

  return data
}

/**
 * Update a meetup
 */
export async function updateMeetup(meetupId: string, updates: MeetupsUpdate): Promise<Meetups> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('meetups')
    .update(updates)
    .eq('id', meetupId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a meetup
 */
export async function deleteMeetup(meetupId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('meetups')
    .delete()
    .eq('id', meetupId)

  if (error) throw error
}

/**
 * Join a meetup
 */
export async function joinMeetup(meetupId: string, userId: string, status: string = 'going'): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('meetup_participants')
    .insert({
      meetup_id: meetupId,
      user_id: userId,
      status
    } as MeetupParticipantsInsert)
    .onConflict('meetup_id, user_id')
    .merge({ status })

  if (error) throw error
}

/**
 * Leave a meetup
 */
export async function leaveMeetup(meetupId: string, userId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('meetup_participants')
    .delete()
    .eq('meetup_id', meetupId)
    .eq('user_id', userId)

  if (error) throw error
}

/**
 * Get participants for a meetup
 */
export async function getMeetupParticipants(meetupId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('meetup_participants')
    .select(`
      *,
      profiles (*)
    `)
    .eq('meetup_id', meetupId)
    .eq('status', 'going')
    .order('joined_at', { ascending: true })

  if (error) throw error
  return data
}
