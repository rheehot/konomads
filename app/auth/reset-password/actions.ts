'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // 비밀번호 확인 검증
  if (password !== confirmPassword) {
    redirect('/reset-password?error=' + encodeURIComponent('비밀번호가 일치하지 않습니다.'))
  }

  // 비밀번호 길이 검증
  if (password.length < 6) {
    redirect('/reset-password?error=' + encodeURIComponent('비밀번호는 최소 6자 이상이어야 합니다.'))
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  })

  if (error) {
    redirect('/reset-password?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/login?success=' + encodeURIComponent('비밀번호가 성공적으로 변경되었습니다.'))
}
