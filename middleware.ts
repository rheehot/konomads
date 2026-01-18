import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // 환경 변수가 설정되지 않은 경우 (배포 환경 체크)
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables')
    // 홈페이지와 공개 페이지는 미들웨어 없이 통과
    const pathname = request.nextUrl.pathname
    const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password']
    const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path))

    if (isPublicPath || pathname.startsWith('/cities')) {
      return NextResponse.next()
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (
    !user &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/register') &&
    !pathname.startsWith('/forgot-password') &&
    !pathname.startsWith('/reset-password') &&
    !pathname.startsWith('/cities') &&
    pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
