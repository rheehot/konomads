'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { deleteMeetup } from '@/lib/supabase/queries'

export async function deleteMeetupAction(meetupId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?error=' + encodeURIComponent('로그인이 필요합니다.'))
  }

  try {
    await deleteMeetup(meetupId)
    revalidatePath('/meetups')
    revalidatePath('/cities/[slug]')
    redirect('/meetups')
  } catch (error: any) {
    redirect(`/meetups/${meetupId}?error=` + encodeURIComponent(error.message || '밋업 삭제에 실패했습니다.'))
  }
}
