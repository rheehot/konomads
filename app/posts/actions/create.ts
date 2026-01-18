'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createPost } from '@/lib/supabase/queries'

export async function createPostAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?error=' + encodeURIComponent('로그인이 필요합니다.'))
  }

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const city_id = formData.get('city_id') as string
  const category = formData.get('category') as string || 'general'
  const tags = formData.get('tags') as string

  if (!title || !content) {
    redirect('/posts/new?error=' + encodeURIComponent('제목과 내용을 입력해주세요.'))
  }

  try {
    await createPost({
      user_id: user.id,
      city_id: city_id || null,
      title,
      content,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()) : null,
    })

    revalidatePath('/')
    revalidatePath('/posts')
    revalidatePath('/cities/[slug]')
    redirect('/posts')
  } catch (error: any) {
    redirect('/posts/new?error=' + encodeURIComponent(error.message || '게시글 작성에 실패했습니다.'))
  }
}
