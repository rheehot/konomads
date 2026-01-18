'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createMeetup } from '@/lib/supabase/queries'

export async function createMeetupAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?error=' + encodeURIComponent('로그인이 필요합니다.'))
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const city_id = formData.get('city_id') as string
  const location = formData.get('location') as string
  const meetup_date = formData.get('meetup_date') as string
  const max_participants = formData.get('max_participants') as string
  const tags = formData.get('tags') as string

  if (!title || !description || !city_id || !meetup_date) {
    redirect('/meetups/new?error=' + encodeURIComponent('필수 항목을 모두 입력해주세요.'))
  }

  try {
    await createMeetup({
      user_id: user.id,
      city_id,
      title,
      description,
      location: location || null,
      meetup_date: new Date(meetup_date).toISOString(),
      max_participants: max_participants ? parseInt(max_participants) : null,
      tags: tags ? tags.split(',').map(t => t.trim()) : null,
    })

    revalidatePath('/meetups')
    revalidatePath('/cities/[slug]')
    redirect('/meetups')
  } catch (error: any) {
    redirect('/meetups/new?error=' + encodeURIComponent(error.message || '밋업 생성에 실패했습니다.'))
  }
}
