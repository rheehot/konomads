'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { togglePostLike } from '@/lib/supabase/queries'

export async function togglePostLikeAction(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  try {
    await togglePostLike(postId, user.id)
    revalidatePath('/posts')
    revalidatePath('/posts/[id]')
    revalidatePath('/cities/[slug]')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || '좋아요 처리에 실패했습니다.' }
  }
}
