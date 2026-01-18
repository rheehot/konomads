'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { deletePost } from '@/lib/supabase/queries'

export async function deletePostAction(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?error=' + encodeURIComponent('로그인이 필요합니다.'))
  }

  try {
    await deletePost(postId)
    revalidatePath('/posts')
    revalidatePath('/cities/[slug]')
    redirect('/posts')
  } catch (error: any) {
    redirect(`/posts/${postId}?error=` + encodeURIComponent(error.message || '게시글 삭제에 실패했습니다.'))
  }
}
