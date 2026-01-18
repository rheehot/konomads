/**
 * Test ID: AUTH-007 ~ AUTH-012
 * Signup Action Tests
 *
 * AUTH-007: Successful signup with valid data
 * AUTH-008: Signup with duplicate email
 * AUTH-009: Signup with password validation
 * AUTH-010: Signup with email format validation
 * AUTH-011: Signup redirects to home after success
 * AUTH-012: Signup creates user profile
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { signup } from '@/app/auth/signup/actions'
import { createMockSupabaseClient } from '@/__tests__/mocks'

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

const mockRedirect = vi.mocked(require('next/navigation').redirect)
const mockRevalidatePath = vi.mocked(require('next/cache').revalidatePath)

describe('Signup Action', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase = createMockSupabaseClient()
  })

  describe('AUTH-007: Successful signup with valid data', () => {
    it('should successfully signup with valid email and password', async () => {
      // Mock successful signup
      const newUser = {
        id: `new-user-${Date.now()}`,
        email: 'newuser@example.com',
        email_confirmed_at: null,
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {
          email_confirmed: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: null,
        },
        error: null,
      })

      // Mock auto-login after signup
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: newUser,
          },
        },
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'newuser@example.com')
      formData.append('password', 'SecurePassword123!')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      // Verify signUp was called with correct data
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'SecurePassword123!',
        options: {
          emailRedirectTo: expect.stringContaining('/auth/callback'),
          data: {
            email_confirmed: true,
          },
        },
      })

      // Verify auto-login was attempted
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'SecurePassword123!',
      })

      // Verify revalidatePath was called
      expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')

      // Verify redirect was called to home
      expect(mockRedirect).toHaveBeenCalledWith('/')
    })

    it('should handle email_confirmed option correctly', async () => {
      const newUser = {
        id: `new-user-${Date.now()}`,
        email: 'newuser@example.com',
        email_confirmed_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {
          email_confirmed: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: null,
        },
        error: null,
      })

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: newUser,
          },
        },
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'newuser@example.com')
      formData.append('password', 'SecurePassword123!')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      const signUpCall = mockSupabase.auth.signUp.mock.calls[0][0]
      expect(signUpCall.options.data.email_confirmed).toBe(true)
    })
  })

  describe('AUTH-008: Signup with duplicate email', () => {
    it('should redirect to register with error for duplicate email', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'User already registered',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'existing@example.com')
      formData.append('password', 'password')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      expect(mockRedirect).toHaveBeenCalledWith(
        '/register?error=User%20already%20registered'
      )
    })

    it('should handle "duplicate email" error message format', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'duplicate email',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'existing@example.com')
      formData.append('password', 'password')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining('duplicate%20email')
      )
    })

    it('should not attempt login if signup fails', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'User already registered',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'existing@example.com')
      formData.append('password', 'password')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled()
    })
  })

  describe('AUTH-009: Signup with password validation', () => {
    it('should handle weak password error', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Password should be at least 6 characters',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'newuser@example.com')
      formData.append('password', '123')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining('Password%20should%20be%20at%20least%206%20characters')
      )
    })

    it('should handle empty password', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Password is required',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'newuser@example.com')
      formData.append('password', '')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining('Password%20is%20required')
      )
    })

    it('should handle password complexity requirements', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Password must contain letters, numbers, and special characters',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'newuser@example.com')
      formData.append('password', 'simple')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining('Password%20must%20contain')
      )
    })
  })

  describe('AUTH-010: Signup with email format validation', () => {
    it('should handle invalid email format', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Unable to validate email address: invalid format',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'invalid-email')
      formData.append('password', 'password')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining('Unable%20to%20validate%20email%20address')
      )
    })

    it('should handle empty email', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Email is required',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', '')
      formData.append('password', 'password')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining('Email%20is%20required')
      )
    })

    it('should handle email without @ symbol', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Invalid email format',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'invalidemail.com')
      formData.append('password', 'password')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining('Invalid%20email%20format')
      )
    })

    it('should handle email with spaces', async () => {
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Email address cannot contain spaces',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'user @example.com')
      formData.append('password', 'password')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining('Email%20address%20cannot%20contain%20spaces')
      )
    })
  })

  describe('AUTH-011: Signup redirects to home after success', () => {
    it('should redirect to home page after successful signup and auto-login', async () => {
      const newUser = {
        id: `new-user-${Date.now()}`,
        email: 'newuser@example.com',
        email_confirmed_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {
          email_confirmed: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: null,
        },
        error: null,
      })

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: newUser,
          },
        },
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'newuser@example.com')
      formData.append('password', 'SecurePassword123!')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      expect(mockRedirect).toHaveBeenCalledWith('/')
      expect(mockRedirect).toHaveBeenCalledTimes(1)
    })

    it('should revalidate path before redirect', async () => {
      const newUser = {
        id: `new-user-${Date.now()}`,
        email: 'newuser@example.com',
        email_confirmed_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {
          email_confirmed: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: null,
        },
        error: null,
      })

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: newUser,
          },
        },
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'newuser@example.com')
      formData.append('password', 'SecurePassword123!')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
      expect(mockRevalidatePath).toHaveBeenCalled()
    })
  })

  describe('AUTH-012: Signup creates user profile', () => {
    it('should handle auto-login after signup', async () => {
      const newUser = {
        id: `new-user-${Date.now()}`,
        email: 'newuser@example.com',
        email_confirmed_at: null,
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {
          email_confirmed: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: null,
        },
        error: null,
      })

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: newUser,
          },
        },
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'newuser@example.com')
      formData.append('password', 'SecurePassword123!')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      // Verify that signInWithPassword was called for auto-login
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'SecurePassword123!',
      })
    })

    it('should redirect with error if auto-login fails after successful signup', async () => {
      const newUser = {
        id: `new-user-${Date.now()}`,
        email: 'newuser@example.com',
        email_confirmed_at: null,
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {
          email_confirmed: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: null,
        },
        error: null,
      })

      // Mock auto-login failure
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Invalid login credentials',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'newuser@example.com')
      formData.append('password', 'SecurePassword123!')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      // Verify redirect with error message
      expect(mockRedirect).toHaveBeenCalledWith(
        '/register?error=회원가입%20성공하나%20자동%20로그인에%20실패했습니다.%20로그인%20페이지에서%20로그인해주세요.'
      )
    })

    it('should use correct email redirect URL in options', async () => {
      const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
      process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com'

      const newUser = {
        id: `new-user-${Date.now()}`,
        email: 'newuser@example.com',
        email_confirmed_at: null,
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {
          email_confirmed: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: null,
        },
        error: null,
      })

      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: newUser,
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: newUser,
          },
        },
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const formData = new FormData()
      formData.append('email', 'newuser@example.com')
      formData.append('password', 'SecurePassword123!')

      const { signup: signupAction } = await import('@/app/auth/signup/actions')
      await signupAction(formData)

      const signUpCall = mockSupabase.auth.signUp.mock.calls[0][0]
      expect(signUpCall.options.emailRedirectTo).toContain('/auth/callback')

      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl
    })
  })
})
