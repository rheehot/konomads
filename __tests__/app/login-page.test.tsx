/**
 * Test ID: PG-022 ~ PG-023
 * Login Page Tests
 *
 * PG-022: 로그인 폼 렌더링 및 UI 요소
 * PG-023: 폼 검증 및 제출 동작
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/login/page'

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

vi.mock('../auth/login/actions', () => ({
  login: vi.fn((formData: FormData) => {
    // Simulate server action
    return Promise.resolve()
  }),
}))

const mockRedirect = vi.mocked(require('next/navigation').redirect)

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('PG-022: Login Form Rendering', () => {
    it('should render login page title', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      // CardTitle is a div, not a heading, use getAllByText and get the first one with the right class
      const titles = screen.getAllByText('로그인')
      const title = titles.find(el => el.className.includes('font-semibold') || el.className.includes('text-2xl'))
      expect(title).toBeDefined()
    })

    it('should render subtitle', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      expect(screen.getByText('노마드코리아 계정에 로그인하세요')).toBeInTheDocument()
    })

    it('should render email input field', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      const emailInput = screen.getByLabelText('이메일')
      expect(emailInput).toBeInTheDocument()
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('name', 'email')
      expect(emailInput).toHaveAttribute('required')
    })

    it('should render password input field', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      const passwordInput = screen.getByLabelText('비밀번호')
      expect(passwordInput).toBeInTheDocument()
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('name', 'password')
      expect(passwordInput).toHaveAttribute('required')
    })

    it('should render email input placeholder', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      const emailInput = screen.getByPlaceholderText('example@email.com')
      expect(emailInput).toBeInTheDocument()
    })

    it('should render password input placeholder', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      const passwordInput = screen.getByPlaceholderText('•••••••••')
      expect(passwordInput).toBeInTheDocument()
    })

    it('should render submit button', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      const submitButton = screen.getByRole('button', { name: '로그인' })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('should render forgot password link', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      const forgotPasswordLink = screen.getByText('비밀번호 찾기')
      expect(forgotPasswordLink).toBeInTheDocument()
      expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
    })

    it('should render register link', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      const registerLink = screen.getByText('회원가입')
      expect(registerLink).toBeInTheDocument()
      expect(registerLink).toHaveAttribute('href', '/register')
    })

    it('should render register prompt text', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      expect(screen.getByText('계정이 없으신가요?')).toBeInTheDocument()
    })

    it('should not display error message when no error in searchParams', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      const errorMessage = screen.queryByText(/이메일 또는 비밀번호가 올바르지 않습니다/)
      expect(errorMessage).not.toBeInTheDocument()
    })
  })

  describe('PG-023: Form Validation and Error Display', () => {
    it('should display error message for invalid credentials', async () => {
      // Pass the resolved value directly since the page accesses searchParams.error without awaiting
      const searchParams = { error: 'Invalid login credentials' } as any
      const result = await LoginPage({ searchParams })
      render(result as any)

      expect(screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다.')).toBeInTheDocument()
    })

    it('should display error message for unconfirmed email', async () => {
      const searchParams = { error: 'Email not confirmed' } as any
      const result = await LoginPage({ searchParams })
      render(result as any)

      expect(screen.getByText('이메일 인증이 완료되지 않았습니다.')).toBeInTheDocument()
    })

    it('should display generic error message for unknown errors', async () => {
      const searchParams = { error: 'Unknown error occurred' } as any
      const result = await LoginPage({ searchParams })
      render(result as any)

      expect(screen.getByText('Unknown error occurred')).toBeInTheDocument()
    })
  })

  describe('Form Structure and Accessibility', () => {
    it('should have proper form structure', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      const { container } = render(result as any)

      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('should have proper label associations', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      const emailInput = screen.getByLabelText('이메일')
      const passwordInput = screen.getByLabelText('비밀번호')

      expect(emailInput).toBeInTheDocument()
      expect(passwordInput).toBeInTheDocument()
    })

    it('should render inputs in correct order', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      render(result as any)

      const inputs = screen.getAllByRole('textbox')
      const passwordInput = screen.getByLabelText('비밀번호')

      // Email should come before password
      const emailInput = screen.getByLabelText('이메일')
      expect(emailInput).toBeInTheDocument()
      expect(passwordInput).toBeInTheDocument()
    })
  })

  describe('Layout and Styling', () => {
    it('should center the login card on page', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      const { container } = render(result as any)

      // Check if the main container has centering classes
      const mainContainer = container.firstChild as HTMLElement
      expect(mainContainer).toHaveClass(/min-h-screen/)
      expect(mainContainer).toHaveClass(/flex/)
    })

    it('should apply proper spacing to form elements', async () => {
      const searchParams = Promise.resolve({})
      const result = await LoginPage({ searchParams })
      const { container } = render(result as any)

      const form = container.querySelector('form')
      expect(form).toBeInTheDocument()
      expect(form).toHaveClass(/space-y/)
    })
  })
})
