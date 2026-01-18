'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createComment, toggleCommentLike } from '@/lib/supabase/queries'

interface CommentState {
  error?: string
  success?: boolean
}

export async function createCommentAction(
  prevState: CommentState,
  formData: FormData
): Promise<CommentState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  const post_id = formData.get('post_id') as string
  const content = formData.get('content') as string
  const parent_id = formData.get('parent_id') as string || null

  if (!content || !content.trim()) {
    return { error: '댓글 내용을 입력해주세요.' }
  }

  try {
    await createComment({
      user_id: user.id,
      post_id,
      parent_id,
      content: content.trim(),
    })

    revalidatePath('/posts/[id]')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || '댓글 작성에 실패했습니다.' }
  }
}

export async function toggleCommentLikeAction(commentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }

  try {
    await toggleCommentLike(commentId, user.id)
    revalidatePath('/posts/[id]')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || '좋아요 처리에 실패했습니다.' }
  }
}
