# Konomads - E2E 테스트 구조 가이드

## 📋 목차

1. [개요](#개요)
2. [폴더 구조](#폴더-구조)
3. [주요 구성 요소](#주요-구성-요소)
4. [테스트 실행 방법](#테스트-실행-방법)
5. [테스트 작성 가이드](#테스트-작성-가이드)
6. [모범 사례](#모범-사례)

---

## 개요

Konomads E2E 테스트는 **Playwright**를 사용하여 작성됩니다. Page Object Model (POM) 패턴을 따르며, 재사용 가능한 Fixture와 Page Object를 활용하여 유지보수성을 높입니다.

### 기술 스택

- **테스트 프레임워크**: Playwright (@playwright/test)
- **언어**: TypeScript
- **백엔드**: Supabase
- **패턴**: Page Object Model (POM)

---

## 폴더 구조

```
konomads/
├── e2e/
│   ├── fixtures/                    # 테스트 픽스처 (재사용 가능한 테스트 설정)
│   │   ├── auth.fixture.ts          # 인증 상태 관리
│   │   ├── database.fixture.ts      # DB 초기화/정리
│   │   ├── page.fixture.ts          # 확장된 Page 객체
│   │   └── index.ts                 # 픽스처 통합 export
│   │
│   ├── pages/                       # Page Object Model
│   │   ├── base.page.ts             # 기본 페이지 클래스
│   │   ├── home.page.ts             # 홈페이지
│   │   ├── auth/                    # 인증 관련 페이지
│   │   │   ├── login.page.ts
│   │   │   ├── signup.page.ts
│   │   │   └── auth.actions.ts
│   │   ├── cities/                  # 도시 관련 페이지
│   │   │   ├── cities-list.page.ts
│   │   │   ├── city-detail.page.ts
│   │   │   └── city-card.component.ts
│   │   ├── meetups/                 # 밋업 관련 페이지
│   │   ├── community/               # 커뮤니티 관련 페이지
│   │   └── profile/                 # 프로필 관련 페이지
│   │
│   ├── tests/                       # 실제 E2E 테스트 파일
│   │   ├── smoke/                   # 스모크 테스트 (핵심 경로)
│   │   ├── auth/                    # 인증 흐름 테스트
│   │   ├── cities/                  # 도시 탐색 테스트
│   │   ├── meetups/                 # 밋업 테스트
│   │   ├── community/               # 커뮤니티 테스트
│   │   ├── profile/                 # 프로필 테스트
│   │   ├── navigation/              # 네비게이션 테스트
│   │   ├── api-testing/             # API 테스트
│   │   ├── accessibility/           # 접근성 테스트
│   │   ├── visual/                  # 시각적 회귀 테스트
│   │   └── performance/             # 성능 테스트
│   │
│   ├── utils/                       # 테스트 유틸리티
│   │   ├── api-helpers.ts           # Supabase API 헬퍼
│   │   ├── data-helpers.ts          # 테스트 데이터 생성
│   │   ├── selectors.ts             # 셀렉터 상수
│   │   └── assertions.ts            # 커스텀 어서션
│   │
│   ├── data/                        # 테스트 데이터
│   │   ├── users.json               # 테스트 사용자
│   │   ├── cities.json              # 테스트 도시 데이터
│   │   ├── posts.json               # 테스트 게시글
│   │   ├── meetups.json             # 테스트 밋업
│   │   └── index.ts                 # 데이터 로더
│   │
│   ├── global-setup.ts              # 전체 테스트 전 실행
│   ├── global-teardown.ts           # 전체 테스트 후 정리
│   └── tsconfig.json                # E2E 테스트용 TS 설정
│
├── playwright.config.ts             # Playwright 설정
├── playwright-report/               # HTML 보고서 (생성됨)
└── test-results/                    # 테스트 결과 (생성됨)
```

---

## 주요 구성 요소

### 1. Fixtures (`e2e/fixtures/`)

테스트에서 재사용 가능한 설정과 헬퍼 함수를 제공합니다.

#### `auth.fixture.ts`
```typescript
// 인증된 페이지와 비인증 페이지를 제공
test('authenticated user test', async ({ loggedInPage }) => {
  await loggedInPage.goto('/profile')
  // 로그인된 상태로 테스트
})

test('guest user test', async ({ guestPage }) => {
  await guestPage.goto('/cities')
  // 비인증 상태로 테스트
})
```

#### `database.fixture.ts`
```typescript
// DB 초기화, 테스트 데이터 생성/정리
test('with seeded data', async ({ page, createTestCity, cleanup }) => {
  const city = await createTestCity({ name: 'Test City' })
  await page.goto(`/cities/${city.slug}`)
  // 테스트 후 자동 정리
})
```

#### `page.fixture.ts`
```typescript
// 확장된 Page 객체
test('using custom page methods', async ({ page }) => {
  await page.waitForNetworkIdle()
  await page.fillForm('#signup-form', { email: 'test@example.com' })
})
```

### 2. Page Objects (`e2e/pages/`)

페이지 구조와 상호작용을 캡슐화합니다.

```typescript
// 사용 예시
import { LoginPage } from '../pages/auth/login.page'

test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login('user@example.com', 'password123')
  await loginPage.expectSuccessfulLogin()
})
```

### 3. Utils (`e2e/utils/`)

공통으로 사용하는 유틸리티 함수들입니다.

- **api-helpers.ts**: Supabase 직접 호출 (테스트 데이터 설정)
- **data-helpers.ts**: 랜덤 데이터 생성
- **selectors.ts**: 자주 사용하는 셀렉터 상수
- **assertions.ts**: 커스텀 어서션

### 4. Test Data (`e2e/data/`)

테스트용 정적 데이터와 템플릿입니다.

```typescript
import { testData } from '../data'

test('with test user', async ({ page }) => {
  const user = testData.users.valid[0]
  // user.email, user.password 사용
})
```

---

## 테스트 실행 방법

### 기본 명령어

```bash
# 모든 테스트 실행 (헤드리스 모드)
npm run test:e2e

# UI 모드로 테스트 실행 (개발용, 권장)
npm run test:e2e:ui

# 특정 테스트 파일 실행
npx playwright test e2e/tests/auth/login.spec.ts

# 특정 브라우저에서 실행
npx playwright test --project=chromium
npx playwright test --project=firefox

# 디버그 모드
npx playwright test --debug

# 시각적 디버거
npx playwright test --debug --headed
```

### package.json 스크립트

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:report": "playwright show-report"
  }
}
```

### 테스트 결과 확인

#### 1. 터미널 출력

```bash
$ npm run test:e2e

Running 15 tests using 5 workers

  ✓ [chromium] › auth/login.spec.ts:23:3 › successful login (2.1s)
  ✓ [chromium] › auth/login.spec.ts:45:3 › login with invalid credentials (1.8s)
  ✓ [chromium] › cities/city-browsing.spec.ts:12:3 › browse cities (2.5s)
  ...

  15 passed (12.3s)
```

#### 2. HTML 보고서

```bash
# 테스트 실행 후 자동 생성
npm run test:e2e:report

# 또는
npx playwright show-report
```

브라우저에서 `playwright-report/index.html` 열기

#### 3. JSON 결과

```bash
# CI/CD 파이프라인용
test-results/results.json
test-results/junit.xml
```

#### 4. 실패 시 스크린샷/비디오

```
test-results/
├── auth-login-successful-login-chromium/
│   ├── screenshot-1.png
│   ├── screenshot-2.png
│   └── video.webm
```

---

## 테스트 작성 가이드

### 기본 템플릿

```typescript
import { test, expect } from '@e2e/fixtures'
import { HomePage } from '@e2e/pages/home.page'

test.describe('홈페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('메인 섹션이 표시되어야 함', async ({ page }) => {
    const homePage = new HomePage(page)

    await expect(homePage.heroTitle).toBeVisible()
    await expect(homePage.cityGrid).toBeVisible()
  })

  test('도시 카드 클릭 시 상세 페이지로 이동', async ({ page }) => {
    const homePage = new HomePage(page)

    await homePage.clickFirstCityCard()

    await expect(page).toHaveURL(/\/cities\/[a-z0-9-]+/)
  })
})
```

### 인증이 필요한 테스트

```typescript
import { test } from '@e2e/fixtures'
import { ProfilePage } from '@e2e/pages/profile/profile.page'

test('프로필 수정', async ({ loggedInPage }) => {
  const profilePage = new ProfilePage(loggedInPage)

  await profilePage.goto()
  await profilePage.editProfile({ bio: 'Updated bio' })

  await expect(profilePage.successMessage).toBeVisible()
})
```

### DB 데이터가 필요한 테스트

```typescript
import { test } from '@e2e/fixtures'

test('도시 상세 페이지', async ({ page, createTestCity, cleanup }) => {
  const city = await createTestCity({
    name: 'Test City',
    region: '테스트 지역',
  })

  await page.goto(`/cities/${city.slug}`)

  await expect(page.locator('h1')).toContainText('Test City')

  // cleanup은 테스트 후 자동 호출됨
})
```

---

## 모범 사례

### 1. Page Object 사용

❌ **나쁜 예:**
```typescript
await page.locator('.email-input').fill('test@example.com')
await page.locator('.password-input').fill('password')
await page.locator('.login-button').click()
```

✅ **좋은 예:**
```typescript
const loginPage = new LoginPage(page)
await loginPage.login('test@example.com', 'password')
```

### 2. 명확한 테스트 이름

❌ **나쁜 예:**
```typescript
test('test1', async () => { ... })
test('로그인', async () => { ... })
```

✅ **좋은 예:**
```typescript
test('유효한 자격증명으로 로그인해야 함', async () => { ... })
test('잘못된 비밀번호로 로그인 시도 시 에러 메시지 표시', async () => { ... })
```

### 3. 데이터 격리

각 테스트는 독립적이어야 합니다.

```typescript
test.each([
  { email: 'user1@test.com', name: 'User One' },
  { email: 'user2@test.com', name: 'User Two' },
])('$name 등록', async ({ page, createTestUser }, { email, name }) => {
  // 각 테스트가 고유한 데이터 사용
  await createTestUser({ email, name })
  // ...
})
```

### 4. 적절한 대기

❌ **나쁜 예:**
```typescript
await page.waitForTimeout(5000) // 절대 사용하지 마세요
```

✅ **좋은 예:**
```typescript
await page.waitForURL('**/dashboard')
await page.waitForSelector('.success-message')
await expect(page.locator('.loading')).not.toBeVisible()
```

### 5. 셀렉터 안정성

❌ **나쁜 예:**
```typescript
page.locator('div > div:nth-child(3) > button')
page.locator('.btn-primary') // 클래스명 변경 위험
```

✅ **좋은 예:**
```typescript
page.getByTestId('login-button')
page.getByRole('button', { name: '로그인' })
page.getByLabel('이메일')
```

---

## 환경 변수 설정

`.env` 파일에 다음을 추가하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 테스트 설정
BASE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 추가 리소스

- [Playwright 공식 문서](https://playwright.dev)
- [Page Object Model 가이드](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
