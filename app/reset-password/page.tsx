import { updatePassword } from '../auth/reset-password/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 비밀번호 재설정 링크를 통해 온 사용자인지 확인
  // Supabase가 자동으로 세션을 처리하므로 별도의 access_token 처리가 필요 없음

  const errorMessages: Record<string, string> = {
    'Password is too short': '비밀번호는 최소 6자 이상이어야 합니다.',
    'Password should contain at least one character': '비밀번호를 입력해주세요.',
  }

  const { error, success } = await searchParams
  const errorMessage = error
    ? (errorMessages[error] || error)
    : null

  const successMessage = success || null

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            비밀번호 재설정
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            새로운 비밀번호를 입력해주세요
          </p>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {successMessage}
            </div>
          )}
          <form action={updatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">새 비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="새 비밀번호 (최소 6자)"
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="비밀번호 확인"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full">
              비밀번호 변경
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            <Link href="/login" className="text-primary hover:underline">
              로그인 페이지로 이동
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
