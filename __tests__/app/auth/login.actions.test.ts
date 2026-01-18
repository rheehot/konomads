/**
 * Test ID: AUTH-001 ~ AUTH-006
 * Login Action Tests
 *
 * AUTH-001: Successful login with valid credentials
 * AUTH-002: Login with invalid email format
 * AUTH-003: Login with incorrect password
 * AUTH-004: Login with network error
 * AUTH-005: Login redirects to home after success
 * AUTH-006: Login displays error message on failure
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockRedirect, mockRevalidatePath } from '@/__tests__/setup/test-setup'
import { setupSupabaseMocks } from '@/__tests__/mocks'

describe('Login Action', () => {
  let mockAuth: ReturnType<typeof setupSupabaseMocks>['mockAuth']

  beforeEach(() => {
    vi.clearAllMocks()
    const mocks = setupSupabaseMocks()
    mockAuth = mocks.mockAuth
    mockRedirect.mockReset()
    mockRevalidatePath.mockReset()
  })

  describe('AUTH-001: Successful login with valid credentials', () => {
    it('should successfully login with valid email and password', async () => {
      // Mock successful login
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: 'mock-user-1',
            email: 'test@example.com',
            email_confirmed_at: new Date().toISOString(),
            aud: 'authenticated',
            role: 'authenticated',
            app_metadata: { provider: 'email', providers: ['email'] },
            user_metadata: { username: 'testuser', full_name: 'Test User' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: null,
          },
        },
        error: null,
      })

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password')

      await login(formData)

      // Verify signInWithPassword was called with correct credentials
      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      })

      // Verify revalidatePath was called
      expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')

      // Verify redirect was called to home
      expect(mockRedirect).toHaveBeenCalledWith('/')
    })

    it('should handle case-insensitive email', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: 'mock-user-1',
            email: 'Test@Example.com',
            email_confirmed_at: new Date().toISOString(),
            aud: 'authenticated',
            role: 'authenticated',
            app_metadata: { provider: 'email', providers: ['email'] },
            user_metadata: { username: 'testuser', full_name: 'Test User' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: null,
          },
        },
        error: null,
      })

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'Test@Example.com')
      formData.append('password', 'password')

      await login(formData)

      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'Test@Example.com',
        password: 'password',
      })
    })
  })

  describe('AUTH-002: Login with invalid email format', () => {
    it('should redirect to login with error for invalid email format', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Unable to validate email address: invalid format',
          status: 400,
          name: 'AuthApiError',
        },
      })

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'invalid-email')
      formData.append('password', 'password')

      await login(formData)

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining('/login?error=')
      )
      const redirectCall = mockRedirect.mock.calls[0][0] as string
      expect(redirectCall).toContain('Unable%20to%20validate%20email%20address')
    })

    it('should handle empty email', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Email is required',
          status: 400,
          name: 'AuthApiError',
        },
      })

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', '')
      formData.append('password', 'password')

      await login(formData)

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining('/login?error=')
      )
    })
  })

  describe('AUTH-003: Login with incorrect password', () => {
    it('should redirect to login with error for incorrect password', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Invalid login credentials',
          status: 400,
          name: 'AuthApiError',
        },
      })

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'wrongpassword')

      await login(formData)

      expect(mockAuth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrongpassword',
      })

      expect(mockRedirect).toHaveBeenCalledWith(
        '/login?error=Invalid%20login%20credentials'
      )
    })

    it('should handle empty password', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Password is required',
          status: 400,
          name: 'AuthApiError',
        },
      })

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', '')

      await login(formData)

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.stringContaining('/login?error=')
      )
    })
  })

  describe('AUTH-004: Login with network error', () => {
    it('should handle network timeout errors', async () => {
      mockAuth.signInWithPassword.mockRejectedValueOnce(
        new Error('Network timeout')
      )

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password')

      await expect(login(formData)).rejects.toThrow('Network timeout')
    })

    it('should handle connection refused errors', async () => {
      mockAuth.signInWithPassword.mockRejectedValueOnce(
        new Error('Connection refused')
      )

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password')

      await expect(login(formData)).rejects.toThrow('Connection refused')
    })

    it('should handle generic network errors', async () => {
      mockAuth.signInWithPassword.mockRejectedValueOnce(
        new Error('Failed to fetch')
      )

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password')

      await expect(login(formData)).rejects.toThrow('Failed to fetch')
    })
  })

  describe('AUTH-005: Login redirects to home after success', () => {
    it('should redirect to home page after successful login', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: 'mock-user-1',
            email: 'test@example.com',
            email_confirmed_at: new Date().toISOString(),
            aud: 'authenticated',
            role: 'authenticated',
            app_metadata: { provider: 'email', providers: ['email'] },
            user_metadata: { username: 'testuser', full_name: 'Test User' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: null,
          },
        },
        error: null,
      })

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password')

      await login(formData)

      expect(mockRedirect).toHaveBeenCalledWith('/')
      expect(mockRedirect).toHaveBeenCalledTimes(1)
    })

    it('should revalidate path before redirect', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: 'mock-user-1',
            email: 'test@example.com',
            email_confirmed_at: new Date().toISOString(),
            aud: 'authenticated',
            role: 'authenticated',
            app_metadata: { provider: 'email', providers: ['email'] },
            user_metadata: { username: 'testuser', full_name: 'Test User' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: null,
          },
        },
        error: null,
      })

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password')

      await login(formData)

      expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
    })
  })

  describe('AUTH-006: Login displays error message on failure', () => {
    it('should display "Invalid login credentials" error message', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Invalid login credentials',
          status: 400,
          name: 'AuthApiError',
        },
      })

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'wrongpassword')

      await login(formData)

      const redirectCall = mockRedirect.mock.calls[0][0] as string
      expect(redirectCall).toContain('Invalid%20login%20credentials')
    })

    it('should display "Email not confirmed" error message', async () => {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Email not confirmed',
          status: 400,
          name: 'AuthApiError',
        },
      })

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password')

      await login(formData)

      const redirectCall = mockRedirect.mock.calls[0][0] as string
      expect(redirectCall).toContain('Email%20not%20confirmed')
    })

    it('should URL encode the error message', async () => {
      const errorMessage = 'Invalid login credentials: Email or password is incorrect'
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: errorMessage,
          status: 400,
          name: 'AuthApiError',
        },
      })

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'wrongpassword')

      await login(formData)

      const redirectCall = mockRedirect.mock.calls[0][0] as string
      expect(redirectCall).toContain('Invalid%20login%20credentials%3A')
    })

    it('should handle special characters in error messages', async () => {
      const errorMessage = 'Error: Invalid credentials <script>alert("xss")</script>'
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: errorMessage,
          status: 400,
          name: 'AuthApiError',
        },
      })

      const { login } = await import('@/app/auth/login/actions')

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'wrongpassword')

      await login(formData)

      const redirectCall = mockRedirect.mock.calls[0][0] as string
      // Verify special characters are URL encoded
      expect(redirectCall).toContain('%3C')
    })
  })
})
