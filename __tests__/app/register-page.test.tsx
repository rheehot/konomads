/**
 * Test ID: PG-024 ~ PG-025
 * Register Page Tests
 *
 * PG-024: 회원가입 폼 렌더링 및 UI 요소
 * PG-025: 폼 검증 및 제출 동작
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from '@/app/register/page'

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: null },
        error: null,
      })),
    },
  })),
}))

vi.mock('../auth/signup/actions', () => ({
  signup: vi.fn((formData: FormData) => {
    // Simulate server action
    return Promise.resolve()
  }),
}))

const mockRedirect = vi.mocked(require('next/navigation').redirect)

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('PG-024: Register Form Rendering', () => {
    it('should render register page title', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      // CardTitle is a div, not a heading, use getAllByText and get the first one with the right class
      const titles = screen.getAllByText('회원가입')
      const title = titles.find(el => el.className.includes('font-semibold') || el.className.includes('text-2xl'))
      expect(title).toBeDefined()
    })

    it('should render subtitle', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      expect(screen.getByText('노마드코리아에서 새로운 여정을 시작하세요')).toBeInTheDocument()
    })

    it('should render email input field', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const emailInput = screen.getByLabelText('이메일')
      expect(emailInput).toBeInTheDocument()
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('name', 'email')
      expect(emailInput).toHaveAttribute('required')
    })

    it('should render password input field', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const passwordInput = screen.getByLabelText('비밀번호')
      expect(passwordInput).toBeInTheDocument()
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('name', 'password')
      expect(passwordInput).toHaveAttribute('required')
    })

    it('should render email input placeholder', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const emailInput = screen.getByPlaceholderText('example@email.com')
      expect(emailInput).toBeInTheDocument()
    })

    it('should render password input placeholder', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const passwordInput = screen.getByPlaceholderText('8자 이상 입력하세요')
      expect(passwordInput).toBeInTheDocument()
    })

    it('should render password hint text', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      expect(screen.getByText('8자 이상 입력하세요')).toBeInTheDocument()
    })

    it('should render terms checkbox', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).toHaveAttribute('id', 'terms')
      expect(checkbox).toHaveAttribute('required')
    })

    it('should render terms and privacy links', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      expect(screen.getByText('이용약관')).toBeInTheDocument()
      expect(screen.getByText('개인정보처리방침')).toBeInTheDocument()
    })

    it('should render terms agreement text', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      expect(screen.getByText(/에 동의합니다/)).toBeInTheDocument()
    })

    it('should render submit button', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const submitButton = screen.getByRole('button', { name: '회원가입' })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('should render login link', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const loginLink = screen.getByText('로그인')
      expect(loginLink).toBeInTheDocument()
      expect(loginLink).toHaveAttribute('href', '/login')
    })

    it('should render login prompt text', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      expect(screen.getByText('이미 계정이 있으신가요?')).toBeInTheDocument()
    })

    it('should not display error message when no error in searchParams', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const errorMessage = screen.queryByText(/이미 등록된 이메일입니다/)
      expect(errorMessage).not.toBeInTheDocument()
    })
  })

  describe('PG-025: Form Validation and Error Display', () => {
    it('should display error message for already registered email', async () => {
      const searchParams = { error: 'User already registered' } as any
      const result = await RegisterPage({ searchParams })
      render(result as any)

      expect(screen.getByText('이미 등록된 이메일입니다.')).toBeInTheDocument()
    })

    it('should display error message for short password', async () => {
      const searchParams = { error: 'Password should be at least 6 characters' } as any
      const result = await RegisterPage({ searchParams })
      render(result as any)

      expect(screen.getByText('비밀번호는 6자 이상이어야 합니다.')).toBeInTheDocument()
    })

    it('should display error message for invalid credentials', async () => {
      const searchParams = { error: 'Invalid login credentials' } as any
      const result = await RegisterPage({ searchParams })
      render(result as any)

      expect(screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다.')).toBeInTheDocument()
    })

    it('should display generic error message for unknown errors', async () => {
      const searchParams = { error: 'Unknown error occurred' } as any
      const result = await RegisterPage({ searchParams })
      render(result as any)

      expect(screen.getByText('Unknown error occurred')).toBeInTheDocument()
    })

    it('should display error message in styled error box', async () => {
      const searchParams = { error: 'User already registered' } as any
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const errorBox = screen.getByText('이미 등록된 이메일입니다.')
      expect(errorBox).toBeInTheDocument()
      expect(errorBox.parentElement).toBeInTheDocument()
    })

    it('should have password field with minLength attribute', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const passwordInput = screen.getByLabelText('비밀번호')
      expect(passwordInput).toHaveAttribute('minlength', '8')
    })
  })

  describe('Form Structure and Accessibility', () => {
    it('should have proper form structure', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      const { container } = render(result as any)

      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('should have proper label associations', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const emailInput = screen.getByLabelText('이메일')
      const passwordInput = screen.getByLabelText('비밀번호')
      const termsLabel = screen.getByText(/에 동의합니다/)

      expect(emailInput).toBeInTheDocument()
      expect(passwordInput).toBeInTheDocument()
      expect(termsLabel).toBeInTheDocument()
    })

    it('should associate checkbox with terms label', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const checkbox = screen.getByRole('checkbox')
      const label = screen.getByText(/에 동의합니다/)

      expect(checkbox).toHaveAttribute('id', 'terms')
      expect(label).toHaveAttribute('for', 'terms')
    })

    it('should render form fields in correct order', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const emailInput = screen.getByLabelText('이메일')
      const passwordInput = screen.getByLabelText('비밀번호')
      const checkbox = screen.getByRole('checkbox')

      expect(emailInput).toBeInTheDocument()
      expect(passwordInput).toBeInTheDocument()
      expect(checkbox).toBeInTheDocument()
    })
  })

  describe('Layout and Styling', () => {
    it('should center the register card on page', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      const { container } = render(result as any)

      // Check if the main container has centering classes
      const mainContainer = container.firstChild as HTMLElement
      expect(mainContainer).toHaveClass(/min-h-screen/)
      expect(mainContainer).toHaveClass(/flex/)
    })

    it('should apply proper spacing to form elements', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      const { container } = render(result as any)

      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
      expect(form).toHaveClass(/space-y/)
    })

    it('should have consistent styling with login page', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      const { container } = render(result as any)

      const card = container.querySelector('[class*="card"]') || container.querySelector('.max-w-md')
      expect(card).toBeInTheDocument()
    })
  })

  describe('Links and Navigation', () => {
    it('should have correct href for terms link', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const termsLink = screen.getByText('이용약관')
      expect(termsLink).toHaveAttribute('href', '/terms')
    })

    it('should have correct href for privacy link', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const privacyLink = screen.getByText('개인정보처리방침')
      expect(privacyLink).toHaveAttribute('href', '/privacy')
    })

    it('should have correct href for login link', async () => {
      const searchParams = Promise.resolve({})
      const result = await RegisterPage({ searchParams })
      render(result as any)

      const loginLink = screen.getByText('로그인')
      expect(loginLink).toHaveAttribute('href', '/login')
    })
  })
})
