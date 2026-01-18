/**
 * Profile Query Tests (DB-001 ~ DB-006)
 *
 * Test suite for profile-related Supabase query functions.
 * Tests cover successful operations, not found scenarios, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getProfileById,
  getProfileByUsername,
  getCurrentProfile,
  updateProfile,
  updateAvatar,
  isUsernameAvailable,
} from '@/lib/supabase/queries/profiles'
import { createMockSupabaseClient } from '../../../mocks/supabase'
import type { Profiles } from '@/types/database'

// Mock the Supabase server client
const createClientMock = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => createClientMock(),
}))

describe('Profile Queries', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>

  beforeEach(() => {
    vi.clearAllMocks()

    // Create a fresh mock client for each test
    mockClient = createMockSupabaseClient()

    // Setup the mock to return our mock client
    createClientMock.mockResolvedValue(mockClient)
  })

  /**
   * DB-001: getProfileById - Success
   * Should return profile when user ID exists
   */
  describe('getProfileById', () => {
    it('DB-001: should return profile when user ID exists', async () => {
      // Mock the query chain to return expected profile
      createClientMock.mockResolvedValue(mockClient)

      const result = await getProfileById('mock-user-1')

      expect(result).toBeDefined()
      expect(result?.id).toBe('mock-user-1')
      expect(result?.username).toBe('testuser')
      expect(result?.email).toBe('test@example.com')
      expect(mockClient.from).toHaveBeenCalledWith('profiles')
    })

    /**
     * DB-002: getProfileById - Not Found
     * Should return null when user ID does not exist (PGRST116 error code)
     */
    it('DB-002: should return null when user ID does not exist', async () => {
      // Create mock client with no profiles data
      const emptyMockClient = createMockSupabaseClient({ profiles: [] })
      createClientMock.mockResolvedValue(emptyMockClient)

      const result = await getProfileById('non-existent-user')

      expect(result).toBeNull()
    })

    /**
     * DB-003: getProfileById - Error
     * Should throw error when database error occurs (non-PGRST116)
     */
    it('DB-003: should throw error when database error occurs', async () => {
      const errorMockClient = createMockSupabaseClient()

      // Override the query chain to throw an error
      errorMockClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection failed', code: 'CONN_FAILED' },
        }),
      })

      createClientMock.mockResolvedValue(errorMockClient)

      await expect(getProfileById('error-user')).rejects.toEqual({
        message: 'Database connection failed',
        code: 'CONN_FAILED',
      })
    })
  })

  /**
   * getProfileByUsername tests
   */
  describe('getProfileByUsername', () => {
    it('should return profile when username exists', async () => {
      createClientMock.mockResolvedValue(mockClient)

      const result = await getProfileByUsername('testuser')

      expect(result).not.toBeNull()
      expect(result?.username).toBe('testuser')
      expect(mockClient.from).toHaveBeenCalledWith('profiles')
    })

    it('should return null when username does not exist', async () => {
      const emptyMockClient = createMockSupabaseClient({ profiles: [] })
      createClientMock.mockResolvedValue(emptyMockClient)

      const result = await getProfileByUsername('nonexistent')

      expect(result).toBeNull()
    })

    it('should throw error when database error occurs', async () => {
      const errorMockClient = createMockSupabaseClient()

      errorMockClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error', code: 'DB_ERROR' },
        }),
      })

      createClientMock.mockResolvedValue(errorMockClient)

      await expect(getProfileByUsername('error-user')).rejects.toEqual({
        message: 'Database error',
        code: 'DB_ERROR',
      })
    })
  })

  /**
   * getCurrentProfile tests
   */
  describe('getCurrentProfile', () => {
    it('should return current user profile when user is authenticated', async () => {
      createClientMock.mockResolvedValue(mockClient)

      const result = await getCurrentProfile()

      expect(result).not.toBeNull()
      expect(result?.id).toBe('mock-user-1')
      expect(mockClient.auth.getUser).toHaveBeenCalled()
    })

    it('should return null when user is not authenticated', async () => {
      const noAuthMockClient = createMockSupabaseClient()
      noAuthMockClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      createClientMock.mockResolvedValue(noAuthMockClient)

      const result = await getCurrentProfile()

      expect(result).toBeNull()
    })
  })

  /**
   * DB-004: updateProfile - Success
   * Should successfully update profile with provided fields
   */
  describe('updateProfile', () => {
    it('DB-004: should successfully update profile with provided fields', async () => {
      const updates = {
        full_name: 'Updated Name',
        bio: 'Updated bio',
        location: 'Seoul',
      }

      createClientMock.mockResolvedValue(mockClient)

      const result = await updateProfile('mock-user-1', updates)

      expect(result).toBeDefined()
      expect(mockClient.from).toHaveBeenCalledWith('profiles')
    })

    /**
     * DB-005: updateProfile - Partial Update
     * Should successfully update profile with only specified fields
     */
    it('DB-005: should successfully update profile with only specified fields', async () => {
      const updates = {
        bio: 'Just updating the bio',
      }

      createClientMock.mockResolvedValue(mockClient)

      const result = await updateProfile('mock-user-1', updates)

      expect(result).toBeDefined()
      expect(result.id).toBe('mock-user-1')
      expect(mockClient.from).toHaveBeenCalledWith('profiles')
    })

    /**
     * DB-006: updateProfile - Error
     * Should throw error when update fails
     */
    it('DB-006: should throw error when update fails', async () => {
      const updates = {
        full_name: 'Error Name',
      }

      const errorMockClient = createMockSupabaseClient()

      errorMockClient.from.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Update failed', code: 'UPDATE_ERROR' },
        }),
      })

      createClientMock.mockResolvedValue(errorMockClient)

      await expect(updateProfile('mock-user-1', updates)).rejects.toEqual({
        message: 'Update failed',
        code: 'UPDATE_ERROR',
      })
    })
  })

  /**
   * updateAvatar tests
   */
  describe('updateAvatar', () => {
    it('should successfully update avatar URL', async () => {
      const avatarUrl = 'https://example.com/avatar.jpg'

      createClientMock.mockResolvedValue(mockClient)

      const result = await updateAvatar('mock-user-1', avatarUrl)

      expect(result).toBeDefined()
      expect(result.id).toBe('mock-user-1')
      expect(mockClient.from).toHaveBeenCalledWith('profiles')
    })

    it('should throw error when avatar update fails', async () => {
      const errorMockClient = createMockSupabaseClient()

      errorMockClient.from.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Avatar update failed', code: 'AVATAR_ERROR' },
        }),
      })

      createClientMock.mockResolvedValue(errorMockClient)

      await expect(
        updateAvatar('mock-user-1', 'https://example.com/avatar.jpg')
      ).rejects.toEqual({
        message: 'Avatar update failed',
        code: 'AVATAR_ERROR',
      })
    })
  })

  /**
   * isUsernameAvailable tests
   */
  describe('isUsernameAvailable', () => {
    it('should return true when username is available', async () => {
      const emptyMockClient = createMockSupabaseClient({ profiles: [] })
      createClientMock.mockResolvedValue(emptyMockClient)

      const result = await isUsernameAvailable('newusername')

      expect(result).toBe(true)
    })

    it('should return false when username is taken', async () => {
      createClientMock.mockResolvedValue(mockClient)

      const result = await isUsernameAvailable('testuser')

      expect(result).toBe(false)
    })

    it('should throw error when database error occurs', async () => {
      const errorMockClient = createMockSupabaseClient()

      errorMockClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error', code: 'DB_ERROR' },
        }),
      })

      createClientMock.mockResolvedValue(errorMockClient)

      await expect(isUsernameAvailable('error-user')).rejects.toEqual({
        message: 'Database error',
        code: 'DB_ERROR',
      })
    })
  })
})
