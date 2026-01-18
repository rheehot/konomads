import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E Test Configuration for Konomads
 *
 * 환경 변수:
 * - BASE_URL: 테스트 대상 URL (기본: http://localhost:3000)
 * - E2E_SUPABASE_URL: Supabase 테스트 DB URL
 * - E2E_SUPABASE_ANON_KEY: Supabase 익명 키
 */
export default defineConfig({
  // ===========================
  // 테스트 디렉토리 설정
  // ===========================
  testDir: './e2e/tests',

  // ===========================
  // 병렬 실행 설정
  // ===========================
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // ===========================
  // 테스트 파일 매칭
  // ===========================
  testMatch: '**/*.spec.ts',

  // ===========================
  // 타임아웃 설정
  // ===========================
  timeout: 30 * 1000, // 각 테스트 30초
  expect: {
    timeout: 5 * 1000, // 어서션 5초
  },

  // ===========================
  // 보고서 설정
  // ===========================
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  // ===========================
  // 공유 설정
  // ===========================
  use: {
    // 기본 URL
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    // 추적 설정 (실패 시 보존)
    trace: 'retain-on-failure',

    // 스크린샷 설정 (실패 시만)
    screenshot: 'only-on-failure',

    // 비디오 설정 (실패 시 보존)
    video: 'retain-on-failure',

    // 네비게이션 타임아웃
    navigationTimeout: 15 * 1000,

    // 액션 타임아웃
    actionTimeout: 10 * 1000,

    // 로그 설정
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // 테스트 전후 실행 스크립트 (상태 저장 등)
    storageState: {
      cookies: [],
      origins: [],
    },
  },

  // ===========================
  // 프로젝트 (브라우저/디바이스) 설정
  // ===========================
  projects: [
    // --- Desktop Browsers ---
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // --- Mobile Devices ---
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    // --- Tablet ---
    {
      name: 'Tablet',
      use: { ...devices['iPad Pro'] },
    },

    // --- Dedicated Test Suites ---
    {
      name: 'smoke',
      testMatch: '**/smoke/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'accessibility',
      testMatch: '**/accessibility/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'visual',
      testMatch: '**/visual/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        // 시각적 테스트는 항상 스크린샷 저장
        screenshot: 'only-on-failure',
      },
    },

    {
      name: 'api-testing',
      testMatch: '**/api-testing/*.spec.ts',
      // API 테스트는 브라우저 불필요
      use: {}, // 'headed' 옵션 없음
    },
  ],

  // ===========================
  // 테스트 서버 (개발용)
  // ===========================
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   port: 3000,
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  //   stdout: 'pipe',
  //   stderr: 'pipe',
  // },

  // ===========================
  // 출력 디렉토리
  // ===========================
  outputDir: 'test-results',

  // ===========================
  // 전역 설정
  // ===========================
  // globalSetup: './e2e/global-setup.ts',
  // globalTeardown: './e2e/global-teardown.ts',
})
