# Konomads - 비밀번호 찾기 기능 개발 계획

## 📋 목차

1. [개요](#개요)
2. [기능 상세](#기능-상세)
3. [기술 구현](#기술-구현)
4. [파일 구조](#파일-구조)
5. [배포 가이드](#배포-가이드)
6. [테스트 결과](#테스트-결과)
7. [에러 및 해결](#에러-및-해결)

---

## 개요

### 프로젝트 정보
- **프로젝트명**: 노마드코리아 (Konomads)
- **기술 스택**: Next.js 16.1.2 (Turbopack), Supabase, TypeScript, Playwright
- **배포 플랫폼**: Vercel
- **목적**: 노마드를 위한 한국 도시 정보 공유 플랫폼의 비밀번호 찾기/재설정 기능 개발

### 개발 범위
1. 비밀번호 찾기 페이지 (`/forgot-password`)
2. 비밀번호 재설정 페이지 (`/reset-password`)
3. Supabase 이메일 인증 연동
4. E2E 테스트 자동화 (96개 테스트 케이스)
5. 배포 환경 설정

---

## 기능 상세

### 1. 비밀번호 찾기 (/forgot-password)

**기능 설명**:
- 사용자가 이메일 주소를 입력하여 비밀번호 재설정 링크 요청
- Supabase `resetPasswordForEmail` API를 통해 이메일 발송
- 성공/실패 메시지 표시

**UI/UX**:
- 이메일 입력 필드 (HTML5 이메일 검증)
- "비밀번호 재설정 링크 받기" 버튼
- 로그인 페이지로 이동 링크
- 성공/에러 메시지 표시 영역

**Server Action**:
```typescript
// app/auth/forgot-password/actions.ts
export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })

  if (error) {
    redirect('/forgot-password?error=' + encodeURIComponent(error.message))
  }

  redirect('/forgot-password?success=' + encodeURIComponent('비밀번호 재설정 링크가 이메일로 발송되었습니다.'))
}
```

### 2. 비밀번호 재설정 (/reset-password)

**기능 설명**:
- 이메일 링크를 통해 접속
- 새 비밀번호 입력 및 확인
- 비밀번호 일치 검증
- 최소 길이 검증 (6자 이상)

**UI/UX**:
- 새 비밀번호 입력 필드 (type="password", minLength="6")
- 비밀번호 확인 입력 필드
- "비밀번호 변경" 버튼
- 로그인 페이지로 이동 링크
- 성공/에러 메시지 표시 영역

**Server Action**:
```typescript
// app/auth/reset-password/actions.ts
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
```

### 3. Middleware 수정

**목적**: 비인증 사용자에게 비밀번호 찾기/재설정 페이지 접근 허용

**변경 사항**:
```typescript
// middleware.ts
const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password']

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
```

**환경 변수 체크 추가** (배포 환경 대응):
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  const pathname = request.nextUrl.pathname
  const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password']
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path))

  if (isPublicPath || pathname.startsWith('/cities')) {
    return NextResponse.next()
  }
}
```

---

## 기술 구현

### 1. Next.js 16 호환성

**searchParams Promise 처리**

Next.js 16에서 `searchParams`가 Promise로 변경되어 `await` 필요.

**수정 전 (에러)**:
```typescript
export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessage = searchParams.error  // ❌ 에러
}
```

**수정 후**:
```typescript
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { error, success } = await searchParams  // ✅
  const errorMessage = error ? (errorMessages[error] || error) : null
  const successMessage = success || null
}
```

**적용 파일**:
- `app/login/page.tsx`
- `app/forgot-password/page.tsx`
- `app/reset-password/page.tsx`
- `app/register/page.tsx`

### 2. Supabase 타입 문제 해결

**문제**: `user.access_token` 속성이 존재하지 않음

**해결**: 불필요한 코드 제거 (Supabase가 자동으로 세션 처리)

```typescript
// ❌ 제거 전
const accessToken = user?.access_token || (typeof window !== 'undefined' && ...)

// ✅ 제거 후
// 비밀번호 재설정 링크를 통해 온 사용자인지 확인
// Supabase가 자동으로 세션을 처리하므로 별도의 access_token 처리가 필요 없음
```

### 3. 빌드 에러 수정

| 에러 | 해결 방법 |
|------|----------|
| Missing radix-ui packages | `npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-label` |
| e2e 폴더 TypeScript 컴파일 | `tsconfig.json`에 `"exclude": ["node_modules", "e2e"]` 추가 |
| Supabase onConflict 타입 에러 | `.insert().onConflict()`를 `.upsert()`로 변경 |
| Middleware pathname 타입 에러 | `pathname` 변수 추출 후 비교 |

---

## 파일 구조

### 생성된 파일

| 파일 | 설명 |
|------|------|
| `app/forgot-password/page.tsx` | 비밀번호 찾기 페이지 컴포넌트 |
| `app/reset-password/page.tsx` | 비밀번호 재설정 페이지 컴포넌트 |
| `app/auth/forgot-password/actions.ts` | 비밀번호 재설정 이메일 발송 액션 |
| `app/auth/reset-password/actions.ts` | 비밀번호 업데이트 액션 |
| `e2e/pages/auth/forgot-password.page.ts` | 비밀번호 찾기 POM |
| `e2e/pages/auth/reset-password.page.ts` | 비밀번호 재설정 POM |
| `e2e/tests/auth/password-reset.spec.ts` | E2E 테스트 슈트 (16개 테스트) |

### 수정된 파일

| 파일 | 수정 내용 |
|------|-----------|
| `middleware.ts` | `/`, `/forgot-password`, `/reset-password` 경로 허용, 환경 변수 체크 추가 |
| `app/login/page.tsx` | 비밀번호 찾기 링크, 성공 메시지 처리, searchParams Promise 처리 |
| `e2e/pages/auth/login.page.ts` | pageTitle 셀렉터 수정 |
| `e2e/pages/base.page.ts` | fill/type/clear/getAttribute/isVisible/isHidden/getText 버그 수정 |
| `e2e/pages/index.ts` | 새로운 Page Object export 추가 |
| `tsconfig.json` | e2e 폴더 제외 |
| `lib/supabase/queries/meetups.ts` | upsert 메서드 사용 |

---

## 배포 가이드

### 1. 환경 변수 설정

**로컬 개발** (.env.local):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://inzarcsnfdxkxxghtiun.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Vercel Dashboard 설정**:
1. Vercel Dashboard → 프로젝트 → Settings → Environment Variables
2. 다음 변수 추가:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://inzarcsnfdxkxxghtiun.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**Supabase 키 가져오기**:
1. [Supabase Dashboard](https://supabase.com/dashboard) → 프로젝트
2. Settings → API → Project API keys
3. `anon public` 키 복사

### 2. 명령어

```bash
# 로컬 개발
npm run dev

# 빌드
npm run build

# E2E 테스트
npm run test:e2e

# E2E 테스트 (UI 모드)
npm run test:e2e:ui

# 특정 테스트만 실행
npx playwright test e2e/tests/auth/password-reset.spec.ts
```

---

## 테스트 결과

### E2E 테스트 결과

```
Running 96 tests using 4 workers
96 passed (46.1s)
```

### 테스트 커버리지
- **Chromium**: 16 passed
- **Firefox**: 16 passed
- **WebKit (Safari)**: 16 passed
- **Mobile Chrome**: 16 passed
- **Mobile Safari**: 16 passed
- **Tablet**: 16 passed

### 테스트 케이스

**비밀번호 찾기 페이지** (`/forgot-password`):
1. 로그인 페이지에서 비밀번호 찾기 링크 클릭 시 이동
2. 비밀번호 찾기 페이지 올바른 표시
3. 이메일 입력 없이 제출 시 검증 오류 표시
4. 유효하지 않은 이메일 형식 입력 시 HTML5 검증 작동
5. 존재하지 않는 이메일로 요청 시 에러 메시지 표시
6. 로그인 링크 클릭 시 로그인 페이지로 이동

**비밀번호 재설정 페이지** (`/reset-password`):
1. 비밀번호 재설정 페이지 올바른 표시
2. 비밀번호 입력 필드의 최소 길이 검증 확인
3. 비밀번호와 확인이 일치하지 않을 때 에러 표시
4. 비밀번호가 너무 짧을 때 에러 표시
5. 로그인 링크 클릭 시 로그인 페이지로 이동

**종합 테스트**:
1. 전체 비밀번호 찾기 사용자 흐름
2. 비밀번호 재설정 폼 필드 접근성
3. 비밀번호 찾기 폼 필드 접근성

**반응형 디자인**:
1. 모바일 화면에서 비밀번호 찾기 페이지 정상 표시
2. 모바일 화면에서 비밀번호 재설정 페이지 정상 표시

---

## 에러 및 해결

### 1. 검색 파라미터 에러 (Next.js 16)

**에러 메시지**:
```
Error: Route "/login" used `searchParams.error`. `searchParams` is a Promise and must be unwrapped with `await` or `React.use()` before accessing its properties.
```

**해결**: 모든 페이지에서 `searchParams`를 Promise 타입으로 변경 후 `await`

### 2. 빌드 타입 에러

| 에러 | 해결 |
|------|------|
| `Property 'access_token' does not exist on type 'User'` | 불필요한 access_token 코드 제거 |
| `Cannot find module '@radix-ui/react-dialog'` | `npm install`로 패키지 설치 |
| `Property 'onConflict' does not exist` | `.insert().onConflict()`를 `.upsert()`로 변경 |
| TypeScript 비교 에러 (middleware) | `pathname` 변수 추출 후 비교 |

### 3. 배포 에러 (Vercel)

**에러**: `500: INTERNAL_SERVER_ERROR - Code: MIDDLEWARE_INVOCATION_FAILED`

**원인**: 배포 환경에서 Supabase 환경 변수 미설정

**해결**:
1. `.env.local`에 올바른 Supabase 키 입력
2. Vercel Dashboard에 환경 변수 설정

**올바른 키 형식**:
```bash
# ❌ 잘못된 형식
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sbp_ffefcac31df20d4768d29e21ca918f42f34c8053

# ✅ 올바른 형식 (JWT)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluemFyY3NuZmR4a3h4Z2h0aXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NTE1NzIsImV4cCI6MjA4MjEyNzU3Mn0.UUmtJs-ebAv_s4-V9fhyOpoO1yz5tfesDYn_xRGr9OM
```

---

## 향후 개선 사항

- [ ] 비밀번호 복잡도 요구사항 (특수 문자, 숫자 등)
- [ ] 비밀번호 재설정 링크 유효기간 설정
- [ ] 이메일 템플릿 커스터마이징
- [ ] 비밀번호 변경 알림 이메일 발송
- [ ] 비밀번호 만료 정책 구현

---

## 참고 자료

- [Next.js 16 searchParams 문서](https://nextjs.org/docs/messages/sync-dynamic-apis)
- [Supabase 비밀번호 재설정 가이드](https://supabase.com/docs/guides/auth/server-side/password-reset)
- [Playwright E2E 테스트](https://playwright.dev/)
- [Vercel 환경 변수 가이드](https://vercel.com/docs/projects/environment-variables)

---

## 커밋 기록

```
4a67208 키값 수정
389e3bd 배포시 에러 fix
1477fa8 현재까지모두저장
85b55d9 비밀번호찾기수정
6a5e1d9 테스트진행까지완료
```
