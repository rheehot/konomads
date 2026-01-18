'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateProfile } from '@/lib/supabase/queries'

interface UpdateProfileState {
  error?: string
  success?: boolean
}

export async function updateProfileAction(
  prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const username = formData.get('username') as string
  const full_name = formData.get('full_name') as string
  const bio = formData.get('bio') as string
  const location = formData.get('location') as string
  const website = formData.get('website') as string

  try {
    await updateProfile(user.id, {
      username: username || null,
      full_name: full_name || null,
      bio: bio || null,
      location: location || null,
      website: website || null,
    })

    revalidatePath('/profile')
    revalidatePath('/profile/[username]', 'page')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || '프로필 업데이트에 실패했습니다.' }
  }
}
