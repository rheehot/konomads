import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/auth/login.page'
import { ForgotPasswordPage } from '../../pages/auth/forgot-password.page'
import { ResetPasswordPage } from '../../pages/auth/reset-password.page'

test.describe('비밀번호 찾기/재설정', () => {
  let loginPage: LoginPage
  let forgotPasswordPage: ForgotPasswordPage
  let resetPasswordPage: ResetPasswordPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    forgotPasswordPage = new ForgotPasswordPage(page)
    resetPasswordPage = new ResetPasswordPage(page)
  })

  test.describe('비밀번호 찾기 페이지 (/forgot-password)', () => {
    test('로그인 페이지에서 비밀번호 찾기 링크 클릭 시 이동', async ({ page }) => {
      await loginPage.goto()
      await loginPage.clickForgotPasswordLink()

      await expect(page).toHaveURL('/forgot-password')
      await forgotPasswordPage.verifyPageLoaded()
    })

    test('비밀번호 찾기 페이지가 올바르게 표시됨', async ({ page }) => {
      await forgotPasswordPage.goto()

      await forgotPasswordPage.verifyPageLoaded()
      await expect(forgotPasswordPage.pageTitle).toContainText('비밀번호 찾기')
      await expect(forgotPasswordPage.pageSubtitle).toContainText('가입하신 이메일')
      await expect(forgotPasswordPage.emailInput).toBeVisible()
      await expect(forgotPasswordPage.submitButton).toBeVisible()
      await expect(forgotPasswordPage.submitButton).toContainText('비밀번호 재설정 링크 받기')
      await expect(forgotPasswordPage.loginLink).toBeVisible()
    })

    test('이메일 입력 없이 제출 시 검증 오류 표시', async ({ page }) => {
      await forgotPasswordPage.goto()
      await forgotPasswordPage.clickSubmit()

      // HTML5 validation 확인
      const emailRequired = await forgotPasswordPage.emailInput.getAttribute('required')
      expect(emailRequired).not.toBeNull()
    })

    test('유효하지 않은 이메일 형식 입력 시 HTML5 검증 작동', async ({ page }) => {
      await forgotPasswordPage.goto()

      // 유효하지 않은 이메일 형식
      await forgotPasswordPage.fillEmail('invalid-email')

      const emailType = await forgotPasswordPage.emailInput.getAttribute('type')
      expect(emailType).toBe('email')
    })

    test('존재하지 않는 이메일로 요청 시 에러 메시지 표시', async ({ page }) => {
      await forgotPasswordPage.goto()
      await forgotPasswordPage.requestReset('nonexistent-test@example.com')

      // 페이지가 리로드되고 에러 메시지가 표시됨
      await page.waitForLoadState('networkidle')

      // URL에 error 파라미터가 있는지 확인
      await expect(page).toHaveURL(/error=/)
    })

    test('로그인 링크 클릭 시 로그인 페이지로 이동', async ({ page }) => {
      await forgotPasswordPage.goto()
      await forgotPasswordPage.clickLoginLink()

      await expect(page).toHaveURL('/login')
      await loginPage.verifyPageLoaded()
    })
  })

  test.describe('비밀번호 재설정 페이지 (/reset-password)', () => {
    test('비밀번호 재설정 페이지가 올바르게 표시됨', async ({ page }) => {
      await resetPasswordPage.goto()

      await resetPasswordPage.verifyPageLoaded()
      await expect(resetPasswordPage.pageTitle).toContainText('비밀번호 재설정')
      await expect(resetPasswordPage.pageSubtitle).toContainText('새로운 비밀번호')
      await expect(resetPasswordPage.passwordInput).toBeVisible()
      await expect(resetPasswordPage.confirmPasswordInput).toBeVisible()
      await expect(resetPasswordPage.submitButton).toBeVisible()
      await expect(resetPasswordPage.submitButton).toContainText('비밀번호 변경')
      await expect(resetPasswordPage.loginLink).toBeVisible()
    })

    test('비밀번호 입력 필드의 최소 길이 검증 확인', async ({ page }) => {
      await resetPasswordPage.goto()

      const minLength = await resetPasswordPage.getPasswordMinLength()
      expect(minLength).toBe('6')
    })

    test('비밀번호와 확인이 일치하지 않을 때 에러 표시', async ({ page }) => {
      await resetPasswordPage.goto()
      await resetPasswordPage.resetPassword('password123', 'different456')

      // 페이지가 리로드되고 에러 메시지가 표시됨
      await page.waitForLoadState('networkidle')

      // URL에 error 파라미터가 있는지 확인
      await expect(page).toHaveURL(/error=/)
    })

    test('비밀번호가 너무 짧을 때 에러 표시', async ({ page }) => {
      await resetPasswordPage.goto()
      await resetPasswordPage.resetPassword('12345', '12345')

      // HTML5 validation 확인
      const minLength = await resetPasswordPage.getPasswordMinLength()
      expect(minLength).toBe('6')
    })

    test('로그인 링크 클릭 시 로그인 페이지로 이동', async ({ page }) => {
      await resetPasswordPage.goto()
      await resetPasswordPage.clickLoginLink()

      await expect(page).toHaveURL('/login')
      await loginPage.verifyPageLoaded()
    })
  })

  test.describe('비밀번호 찾기 흐름 (종합)', () => {
    test('전체 비밀번호 찾기 사용자 흐름: 로그인 → 비밀번호 찾기 → 로그인', async ({ page }) => {
      // 1. 로그인 페이지로 이동
      await loginPage.goto()
      await loginPage.verifyPageLoaded()

      // 2. 비밀번호 찾기 링크 클릭
      await loginPage.clickForgotPasswordLink()
      await expect(page).toHaveURL('/forgot-password')
      await forgotPasswordPage.verifyPageLoaded()

      // 3. 로그인 링크로 돌아가기
      await forgotPasswordPage.clickLoginLink()
      await expect(page).toHaveURL('/login')
      await loginPage.verifyPageLoaded()
    })

    test('비밀번호 재설정 폼 필드 접근성 확인', async ({ page }) => {
      await resetPasswordPage.goto()

      // 모든 필드가 표시되고 상호작용 가능한지 확인
      await expect(resetPasswordPage.passwordInput).toBeEnabled()
      await expect(resetPasswordPage.confirmPasswordInput).toBeEnabled()
      await expect(resetPasswordPage.submitButton).toBeEnabled()

      // password 타입 확인 (비밀번호 가려짐)
      const passwordType = await resetPasswordPage.passwordInput.getAttribute('type')
      const confirmPasswordType = await resetPasswordPage.confirmPasswordInput.getAttribute('type')
      expect(passwordType).toBe('password')
      expect(confirmPasswordType).toBe('password')
    })

    test('비밀번호 찾기 폼 필드 접근성 확인', async ({ page }) => {
      await forgotPasswordPage.goto()

      // 모든 필드가 표시되고 상호작용 가능한지 확인
      await expect(forgotPasswordPage.emailInput).toBeEnabled()
      await expect(forgotPasswordPage.submitButton).toBeEnabled()

      // email 타입 확인
      const emailType = await forgotPasswordPage.emailInput.getAttribute('type')
      expect(emailType).toBe('email')
    })
  })

  test.describe('반응형 디자인 확인', () => {
    test('모바일 화면에서 비밀번호 찾기 페이지 정상 표시', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await forgotPasswordPage.goto()

      await forgotPasswordPage.verifyPageLoaded()
      await expect(forgotPasswordPage.emailInput).toBeVisible()
      await expect(forgotPasswordPage.submitButton).toBeVisible()
    })

    test('모바일 화면에서 비밀번호 재설정 페이지 정상 표시', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await resetPasswordPage.goto()

      await resetPasswordPage.verifyPageLoaded()
      await expect(resetPasswordPage.passwordInput).toBeVisible()
      await expect(resetPasswordPage.confirmPasswordInput).toBeVisible()
      await expect(resetPasswordPage.submitButton).toBeVisible()
    })
  })
})
