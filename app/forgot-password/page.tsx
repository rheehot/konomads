import { requestPasswordReset } from '../auth/forgot-password/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const errorMessages: Record<string, string> = {
    'Email not confirmed': '이메일 인증이 완료되지 않았습니다.',
    'User not found': '해당 이메일로 가입된 계정을 찾을 수 없습니다.',
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
            비밀번호 찾기
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            가입하신 이메일 주소를 입력해주세요
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
          <form action={requestPasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                입력하신 이메일로 비밀번호 재설정 링크를 보내드립니다.
              </p>
            </div>
            <Button type="submit" className="w-full">
              비밀번호 재설정 링크 받기
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            비밀번호가 기억나셨나요?{' '}
            <Link href="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
