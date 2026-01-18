'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { joinMeetup, leaveMeetup } from '@/lib/supabase/queries'

export async function joinMeetupAction(meetupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  try {
    await joinMeetup(meetupId, user.id, 'going')
    revalidatePath('/meetups')
    revalidatePath('/meetups/[id]')
    revalidatePath('/cities/[slug]')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || '밋업 참가에 실패했습니다.' }
  }
}

export async function leaveMeetupAction(meetupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  try {
    await leaveMeetup(meetupId, user.id)
    revalidatePath('/meetups')
    revalidatePath('/meetups/[id]')
    revalidatePath('/cities/[slug]')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || '밋업 참가 취소에 실패했습니다.' }
  }
}
