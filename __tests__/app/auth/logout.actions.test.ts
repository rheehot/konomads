/**
 * Test ID: AUTH-013 ~ AUTH-015
 * Logout Action Tests
 *
 * AUTH-013: Successful logout
 * AUTH-014: Logout redirects to home after success
 * AUTH-015: Logout clears session properly
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logout } from '@/app/auth/logout/actions'
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

describe('Logout Action', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase = createMockSupabaseClient()
  })

  describe('AUTH-013: Successful logout', () => {
    it('should successfully logout and call signOut', async () => {
      // Mock successful signOut
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        data: {},
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')
      await logoutAction()

      // Verify signOut was called
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1)
      expect(mockSupabase.auth.signOut).toHaveBeenCalledWith()
    })

    it('should handle logout when no user is logged in', async () => {
      // Mock signOut when no user is logged in
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        data: {},
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')
      await logoutAction()

      // Should still call signOut even if no user is logged in
      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })

    it('should handle signOut errors gracefully', async () => {
      // Mock signOut error
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Error signing out',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')

      // Should not throw error, but still call signOut
      await logoutAction()
      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('AUTH-014: Logout redirects to home after success', () => {
    it('should redirect to home page after successful logout', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        data: {},
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')
      await logoutAction()

      // Verify redirect was called to home
      expect(mockRedirect).toHaveBeenCalledWith('/')
      expect(mockRedirect).toHaveBeenCalledTimes(1)
    })

    it('should redirect to home even if signOut has an error', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        data: null,
        error: {
          message: 'Error signing out',
          status: 400,
          name: 'AuthApiError',
        },
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')
      await logoutAction()

      // Should still redirect to home
      expect(mockRedirect).toHaveBeenCalledWith('/')
    })

    it('should revalidate path before redirect', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        data: {},
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')
      await logoutAction()

      // Verify revalidatePath was called
      expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
      expect(mockRevalidatePath).toHaveBeenCalled()
    })
  })

  describe('AUTH-015: Logout clears session properly', () => {
    it('should clear session by calling signOut', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        data: {},
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')
      await logoutAction()

      // Verify signOut was called to clear session
      expect(mockSupabase.auth.signOut).toHaveBeenCalledWith()
    })

    it('should revalidate path to refresh layout', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        data: {},
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')
      await logoutAction()

      // Verify revalidatePath was called with layout
      expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
    })

    it('should complete logout flow in correct order', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        data: {},
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')
      await logoutAction()

      // Verify order: signOut -> revalidatePath -> redirect
      expect(mockSupabase.auth.signOut).toHaveBeenCalledBefore(mockRevalidatePath)
      expect(mockRevalidatePath).toHaveBeenCalledBefore(mockRedirect)
    })

    it('should handle session clearing after multiple logins', async () => {
      // Mock first signOut
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        data: {},
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')

      // First logout
      await logoutAction()
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1)

      // Reset mock for second logout
      mockSupabase.auth.signOut.mockClear()
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        data: {},
        error: null,
      })
      mockRedirect.mockClear()
      mockRevalidatePath.mockClear()

      // Second logout
      await logoutAction()
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1)
    })

    it('should not throw any errors during session cleanup', async () => {
      mockSupabase.auth.signOut.mockResolvedValueOnce({
        data: {},
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')

      // Should not throw any errors
      await expect(logoutAction()).resolves.not.toThrow()
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle network errors during signOut', async () => {
      mockSupabase.auth.signOut.mockRejectedValueOnce(
        new Error('Network error')
      )

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')

      // Should still attempt to handle the error
      await expect(logoutAction()).resolves.not.toThrow()
    })

    it('should handle timeout errors during signOut', async () => {
      mockSupabase.auth.signOut.mockRejectedValueOnce(
        new Error('Request timeout')
      )

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')

      // Should handle timeout gracefully
      await expect(logoutAction()).resolves.not.toThrow()
    })

    it('should verify only one signOut call per logout action', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        data: {},
        error: null,
      })

      vi.doMock('@/lib/supabase/server', () => ({
        createClient: vi.fn(() => Promise.resolve(mockSupabase)),
      }))

      const { logout: logoutAction } = await import('@/app/auth/logout/actions')
      await logoutAction()

      // Verify signOut was called exactly once
      expect(mockSupabase.auth.signOut).toHaveBeenCalledTimes(1)
    })
  })
})
