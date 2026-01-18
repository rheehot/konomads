'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadAvatar } from '@/lib/supabase/storage'

interface UploadAvatarState {
  error?: string
  success?: boolean
}

export async function uploadAvatarAction(
  prevState: UploadAvatarState,
  formData: FormData
): Promise<UploadAvatarState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const file = formData.get('avatar') as File

  if (!file || file.size === 0) {
    return { error: '파일을 선택해주세요.' }
  }

  // Validate file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { error: '이미지 파일만 업로드할 수 있습니다.' }
  }

  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { error: '파일 크기는 2MB 이하여야 합니다.' }
  }

  try {
    const avatarUrl = await uploadAvatar(user.id, file)

    if (!avatarUrl) {
      return { error: '아바타 업로드에 실패했습니다.' }
    }

    revalidatePath('/profile')
    revalidatePath('/profile/[username]', 'page')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || '아바타 업로드에 실패했습니다.' }
  }
}
