/**
 * Example Test File Using Mock Utilities
 *
 * This file demonstrates how to use the mock utilities in your tests.
 * You can use this as a reference for writing your own tests.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setupSupabaseMocks, mockUser, mockSupabaseClient } from './supabase'

describe('Mock Utilities Examples', () => {
  describe('Basic Setup', () => {
    it('should setup basic mocks', () => {
      const { mockClient, mockAuth, mockStorage, mockData } = setupSupabaseMocks()

      expect(mockClient).toBeDefined()
      expect(mockAuth).toBeDefined()
      expect(mockStorage).toBeDefined()
      expect(mockData).toBeDefined()
    })

    it('should setup with custom data', () => {
      const customProfile = {
        id: 'custom-user-1',
        email: 'custom@example.com',
        username: 'customuser',
        full_name: 'Custom User',
        avatar_url: null,
        bio: null,
        location: null,
        website: null,
        updated_at: new Date().toISOString(),
      }

      const { mockData } = setupSupabaseMocks({
        profiles: [customProfile],
      })

      expect(mockData.profiles).toHaveLength(1)
      expect(mockData.profiles![0].email).toBe('custom@example.com')
    })
  })

  describe('Authentication Mocks', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      const { mockAuth } = setupSupabaseMocks()

      // Setup default authenticated state
      mockAuth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
    })

    it('should get current user', async () => {
      const { mockAuth } = setupSupabaseMocks()

      mockAuth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const { data, error } = await mockAuth.getUser()

      expect(error).toBeNull()
      expect(data.user).toBeDefined()
      expect(data.user.email).toBe('test@example.com')
    })

    it('should sign in with valid credentials', async () => {
      const { mockAuth } = setupSupabaseMocks()

      mockAuth.signInWithPassword.mockResolvedValue({
        data: {
          user: mockUser,
          session: {
            access_token: 'mock-token',
            refresh_token: 'mock-refresh',
            expires_in: 3600,
            token_type: 'bearer',
            user: mockUser,
          },
        },
        error: null,
      })

      const { data, error } = await mockAuth.signInWithPassword({
        email: 'test@example.com',
        password: 'password',
      })

      expect(error).toBeNull()
      expect(data.user).toBeDefined()
      expect(data.session).toBeDefined()
    })

    it('should handle invalid credentials', async () => {
      const { mockAuth } = setupSupabaseMocks()

      mockAuth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials', status: 400 },
      })

      const { data, error } = await mockAuth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrong-password',
      })

      expect(error).toBeDefined()
      expect(data.user).toBeNull()
    })

    it('should sign out user', async () => {
      const { mockAuth } = setupSupabaseMocks()

      mockAuth.signOut.mockResolvedValue({
        data: {},
        error: null,
      })

      const { error } = await mockAuth.signOut()

      expect(error).toBeNull()
    })
  })

  describe('Database Query Mocks', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      setupSupabaseMocks()
    })

    it('should select from profiles table', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from('profiles').select('*').mockResolvedValue({
        data: [
          {
            id: 'user-1',
            email: 'user@example.com',
            username: 'user1',
            full_name: 'User One',
            avatar_url: null,
            bio: null,
            location: null,
            website: null,
            updated_at: new Date().toISOString(),
          },
        ],
        error: null,
      })

      const { data, error } = await mockClient.from('profiles').select('*')

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0].username).toBe('user1')
    })

    it('should insert into posts table', async () => {
      const { mockClient } = setupSupabaseMocks()

      const newPost = {
        id: 'post-1',
        user_id: 'user-1',
        city_id: null,
        title: 'New Post',
        content: 'Post content',
        category: 'general',
        tags: null,
        views: 0,
        likes_count: 0,
        comments_count: 0,
        is_pinned: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockClient.from('posts').select('*').mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: newPost,
          error: null,
        }),
      } as any)

      const queryBuilder = mockClient.from('posts').select('*')
      const { data, error } = await queryBuilder.insert(newPost)

      expect(error).toBeNull()
      expect(data).toBeDefined()
    })

    it('should update profile', async () => {
      const { mockClient } = setupSupabaseMocks()

      const updatedProfile = {
        id: 'user-1',
        email: 'user@example.com',
        username: 'user1',
        full_name: 'Updated Name',
        avatar_url: null,
        bio: 'Updated bio',
        location: null,
        website: null,
        updated_at: new Date().toISOString(),
      }

      mockClient.from('profiles').select('*').mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: updatedProfile,
            error: null,
          }),
        }),
      } as any)

      const queryBuilder = mockClient.from('profiles').select('*')
      const { data, error } = await queryBuilder
        .update({ full_name: 'Updated Name', bio: 'Updated bio' })
        .eq('id', 'user-1')

      expect(error).toBeNull()
      expect(data?.full_name).toBe('Updated Name')
    })

    it('should delete from comments', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from('comments').select('*').mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      } as any)

      const queryBuilder = mockClient.from('comments').select('*')
      const { error } = await queryBuilder.delete().eq('id', 'comment-1')

      expect(error).toBeNull()
    })

    it('should handle single() query', async () => {
      const { mockClient } = setupSupabaseMocks()

      const profile = {
        id: 'user-1',
        email: 'user@example.com',
        username: 'user1',
        full_name: 'User One',
        avatar_url: null,
        bio: null,
        location: null,
        website: null,
        updated_at: new Date().toISOString(),
      }

      mockClient.from('profiles').select('*').mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: profile,
            error: null,
          }),
        }),
      } as any)

      const queryBuilder = mockClient.from('profiles').select('*')
      const { data, error } = await queryBuilder.eq('id', 'user-1').single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data?.id).toBe('user-1')
    })
  })

  describe('Storage Mocks', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      setupSupabaseMocks()
    })

    it('should upload file to storage', async () => {
      const { mockStorage } = setupSupabaseMocks()

      const mockBucket = mockStorage.from('avatars')
      mockBucket.upload.mockResolvedValue({
        data: { path: 'avatars/user-1/avatar.png' },
        error: null,
      })

      const mockFile = new File([''], 'avatar.png', { type: 'image/png' })
      const { data, error } = await mockBucket.upload('user-1/avatar.png', mockFile)

      expect(error).toBeNull()
      expect(data?.path).toBe('avatars/user-1/avatar.png')
    })

    it('should get public URL', async () => {
      const { mockStorage } = setupSupabaseMocks()

      const mockBucket = mockStorage.from('avatars')
      mockBucket.getPublicUrl.mockReturnValue({
        data: { publicUrl: 'https://storage.supabase.co/avatars/user-1/avatar.png' },
      })

      const { data } = mockBucket.getPublicUrl('user-1/avatar.png')

      expect(data.publicUrl).toBe('https://storage.supabase.co/avatars/user-1/avatar.png')
    })

    it('should delete file from storage', async () => {
      const { mockStorage } = setupSupabaseMocks()

      const mockBucket = mockStorage.from('avatars')
      mockBucket.remove.mockResolvedValue({
        data: {},
        error: null,
      })

      const { error } = await mockBucket.remove(['user-1/avatar.png'])

      expect(error).toBeNull()
    })
  })

  describe('Complex Query Scenarios', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      setupSupabaseMocks()
    })

    it('should handle joined queries', async () => {
      const { mockClient } = setupSupabaseMocks()

      const postWithProfile = {
        id: 'post-1',
        user_id: 'user-1',
        city_id: 'city-1',
        title: 'Post with Profile',
        content: 'Content',
        category: 'general',
        tags: ['test'],
        views: 10,
        likes_count: 5,
        comments_count: 2,
        is_pinned: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          id: 'user-1',
          email: 'user@example.com',
          username: 'user1',
          full_name: 'User One',
          avatar_url: null,
          bio: null,
          location: null,
          website: null,
          updated_at: new Date().toISOString(),
        },
      }

      mockClient.from('posts').select('*, profiles(*)').mockResolvedValue({
        data: [postWithProfile],
        error: null,
      })

      const { data, error } = await mockClient
        .from('posts')
        .select('*, profiles(*)')

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data![0].profiles).toBeDefined()
      expect(data![0].profiles.username).toBe('user1')
    })

    it('should handle ordered and limited queries', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from('posts').select('*').mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'post-1',
                title: 'Post 1',
                content: 'Content 1',
                created_at: '2024-01-02T00:00:00Z',
                updated_at: '2024-01-02T00:00:00Z',
                user_id: 'user-1',
                city_id: null,
                category: 'general',
                tags: null,
                views: 0,
                likes_count: 0,
                comments_count: 0,
                is_pinned: false,
              },
              {
                id: 'post-2',
                title: 'Post 2',
                content: 'Content 2',
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z',
                user_id: 'user-1',
                city_id: null,
                category: 'general',
                tags: null,
                views: 0,
                likes_count: 0,
                comments_count: 0,
                is_pinned: false,
              },
            ],
            error: null,
          }),
        }),
      } as any)

      const { data, error } = await mockClient
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      expect(error).toBeNull()
      expect(data).toHaveLength(2)
    })

    it('should handle multiple filters', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from('posts').select('*').mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'post-1',
                title: 'Published Post',
                content: 'Content',
                category: 'published',
                tags: null,
                views: 0,
                likes_count: 0,
                comments_count: 0,
                is_pinned: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user_id: 'user-1',
                city_id: 'city-1',
              },
            ],
            error: null,
          }),
        }),
      } as any)

      const { data, error } = await mockClient
        .from('posts')
        .select('*')
        .eq('user_id', 'user-1')
        .eq('city_id', 'city-1')

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      vi.clearAllMocks()
      setupSupabaseMocks()
    })

    it('should handle database errors', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from('posts').select('*').mockResolvedValue({
        data: null,
        error: {
          message: 'Database connection failed',
          code: 'PGRST301',
          details: '',
          hint: '',
        },
      })

      const { data, error } = await mockClient.from('posts').select('*')

      expect(error).toBeDefined()
      expect(error?.message).toBe('Database connection failed')
      expect(data).toBeNull()
    })

    it('should handle auth errors', async () => {
      const { mockAuth } = setupSupabaseMocks()

      mockAuth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials', status: 401 },
      })

      const { data, error } = await mockAuth.signInWithPassword({
        email: 'test@example.com',
        password: 'wrong',
      })

      expect(error).toBeDefined()
      expect(error?.status).toBe(401)
      expect(data.user).toBeNull()
    })

    it('should handle storage errors', async () => {
      const { mockStorage } = setupSupabaseMocks()

      const mockBucket = mockStorage.from('avatars')
      mockBucket.upload.mockResolvedValue({
        data: null,
        error: { message: 'File too large' },
      })

      const mockFile = new File([''], 'large.png', { type: 'image/png' })
      const { data, error } = await mockBucket.upload('user-1/large.png', mockFile)

      expect(error).toBeDefined()
      expect(error?.message).toBe('File too large')
      expect(data).toBeNull()
    })
  })
})
