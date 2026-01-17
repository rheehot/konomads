'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Email confirmation 없이 회원가입
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      data: {
        email_confirmed: true,
      }
    }
  })

  if (error) {
    console.error('Signup error:', error)
    redirect('/register?error=' + encodeURIComponent(error.message))
  }

  // 회원가입 후 바로 로그인 (세션 생성)
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    console.error('Auto-login error:', signInError)
    redirect('/register?error=' + encodeURIComponent('회원가입 성공하나 자동 로그인에 실패했습니다. 로그인 페이지에서 로그인해주세요.'))
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
