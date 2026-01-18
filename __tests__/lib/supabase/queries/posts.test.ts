/**
 * Supabase Posts Query Tests
 *
 * Test IDs: DB-016 ~ DB-028
 *
 * Posts Query Tests:
 * - DB-016: getPosts returns all posts with profiles and cities
 * - DB-017: getPosts filters by cityId
 * - DB-018: getPosts filters by category
 * - DB-019: getPosts applies limit and offset
 * - DB-020: getPostById returns post with profile and city
 * - DB-021: getPostById returns null for non-existent post
 * - DB-022: createPost creates a new post successfully
 * - DB-023: createPost throws error on invalid data
 * - DB-024: updatePost updates post successfully
 * - DB-025: updatePost throws error for non-existent post
 * - DB-026: deletePost deletes post successfully
 * - DB-027: deletePost throws error for non-existent post
 * - DB-028: togglePostLike toggles like status
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setupSupabaseMocks } from '@/__tests__/mocks'
import * as postsQueries from '@/lib/supabase/queries/posts'
import type { PostWithProfile, PostsInsert, PostsUpdate } from '@/types/database'

// Mock the createClient function
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('Posts Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  describe('getPosts', () => {
    /**
     * DB-016: getPosts returns all posts with profiles and cities
     */
    it('DB-016: should return all posts with profiles and cities', async () => {
      const { mockClient } = setupSupabaseMocks({
        posts: [
          {
            id: 'post-1',
            user_id: 'user-1',
            city_id: 'city-1',
            title: 'Test Post 1',
            content: 'Content 1',
            category: 'general',
            tags: ['test'],
            views: 10,
            likes_count: 5,
            comments_count: 2,
            is_pinned: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          {
            id: 'post-2',
            user_id: 'user-2',
            city_id: 'city-2',
            title: 'Test Post 2',
            content: 'Content 2',
            category: 'question',
            tags: ['help'],
            views: 5,
            likes_count: 2,
            comments_count: 1,
            is_pinned: true,
            created_at: '2024-01-02T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
        ],
        profiles: [
          {
            id: 'user-1',
            email: 'user1@example.com',
            username: 'user1',
            full_name: 'User One',
            avatar_url: null,
            bio: null,
            location: null,
            website: null,
            updated_at: '2024-01-01T00:00:00Z',
          },
          {
            id: 'user-2',
            email: 'user2@example.com',
            username: 'user2',
            full_name: 'User Two',
            avatar_url: null,
            bio: null,
            location: null,
            website: null,
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        cities: [
          {
            id: 'city-1',
            slug: 'seoul',
            name: '서울',
            name_en: 'Seoul',
            description: null,
            image_url: null,
            region: null,
            population: null,
            wifi_rating: null,
            cafe_rating: null,
            cost_rating: null,
            safety_rating: null,
            community_rating: null,
            overall_rating: null,
            tags: null,
            is_featured: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          {
            id: 'city-2',
            slug: 'busan',
            name: '부산',
            name_en: 'Busan',
            description: null,
            image_url: null,
            region: null,
            population: null,
            wifi_rating: null,
            cafe_rating: null,
            cost_rating: null,
            safety_rating: null,
            community_rating: null,
            overall_rating: null,
            tags: null,
            is_featured: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      // Mock createClient to return our mock client
      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.getPosts()

      expect(result).toHaveLength(2)
      expect(result[0].profiles).toBeDefined()
      expect(result[0].cities).toBeDefined()
      expect(result[0].profiles?.username).toBe('user1')
      expect(result[1].profiles?.username).toBe('user2')
    })

    /**
     * DB-017: getPosts filters by cityId
     */
    it('DB-017: should filter posts by cityId', async () => {
      const { mockClient } = setupSupabaseMocks({
        posts: [
          {
            id: 'post-1',
            user_id: 'user-1',
            city_id: 'city-1',
            title: 'Seoul Post',
            content: 'Content',
            category: 'general',
            tags: [],
            views: 0,
            likes_count: 0,
            comments_count: 0,
            is_pinned: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        profiles: [
          {
            id: 'user-1',
            email: 'user1@example.com',
            username: 'user1',
            full_name: 'User One',
            avatar_url: null,
            bio: null,
            location: null,
            website: null,
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        cities: [
          {
            id: 'city-1',
            slug: 'seoul',
            name: '서울',
            name_en: 'Seoul',
            description: null,
            image_url: null,
            region: null,
            population: null,
            wifi_rating: null,
            cafe_rating: null,
            cost_rating: null,
            safety_rating: null,
            community_rating: null,
            overall_rating: null,
            tags: null,
            is_featured: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.getPosts({ cityId: 'city-1' })

      expect(result).toHaveLength(1)
      expect(result[0].city_id).toBe('city-1')
    })

    /**
     * DB-018: getPosts filters by category
     */
    it('DB-018: should filter posts by category', async () => {
      const { mockClient } = setupSupabaseMocks({
        posts: [
          {
            id: 'post-1',
            user_id: 'user-1',
            city_id: 'city-1',
            title: 'Question Post',
            content: 'Content',
            category: 'question',
            tags: [],
            views: 0,
            likes_count: 0,
            comments_count: 0,
            is_pinned: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        profiles: [
          {
            id: 'user-1',
            email: 'user1@example.com',
            username: 'user1',
            full_name: 'User One',
            avatar_url: null,
            bio: null,
            location: null,
            website: null,
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        cities: [
          {
            id: 'city-1',
            slug: 'seoul',
            name: '서울',
            name_en: 'Seoul',
            description: null,
            image_url: null,
            region: null,
            population: null,
            wifi_rating: null,
            cafe_rating: null,
            cost_rating: null,
            safety_rating: null,
            community_rating: null,
            overall_rating: null,
            tags: null,
            is_featured: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.getPosts({ category: 'question' })

      expect(result).toHaveLength(1)
      expect(result[0].category).toBe('question')
    })

    /**
     * DB-019: getPosts applies limit and offset
     */
    it('DB-019: should apply limit and offset pagination', async () => {
      const { mockClient } = setupSupabaseMocks({
        posts: [
          {
            id: 'post-2',
            user_id: 'user-2',
            city_id: 'city-2',
            title: 'Post 2',
            content: 'Content 2',
            category: 'general',
            tags: [],
            views: 0,
            likes_count: 0,
            comments_count: 0,
            is_pinned: false,
            created_at: '2024-01-02T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
        ],
        profiles: [
          {
            id: 'user-2',
            email: 'user2@example.com',
            username: 'user2',
            full_name: 'User Two',
            avatar_url: null,
            bio: null,
            location: null,
            website: null,
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        cities: [
          {
            id: 'city-2',
            slug: 'busan',
            name: '부산',
            name_en: 'Busan',
            description: null,
            image_url: null,
            region: null,
            population: null,
            wifi_rating: null,
            cafe_rating: null,
            cost_rating: null,
            safety_rating: null,
            community_rating: null,
            overall_rating: null,
            tags: null,
            is_featured: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.getPosts({ limit: 10, offset: 10 })

      expect(result).toHaveLength(1)
    })

    /**
     * DB-019: getPosts returns empty array when no posts exist
     */
    it('DB-019: should return empty array when no posts exist', async () => {
      const { mockClient } = setupSupabaseMocks({
        posts: [],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.getPosts()

      expect(result).toEqual([])
    })
  })

  describe('getPostById', () => {
    /**
     * DB-020: getPostById returns post with profile and city
     */
    it('DB-020: should return post with profile and city', async () => {
      const { mockClient } = setupSupabaseMocks({
        posts: [
          {
            id: 'post-1',
            user_id: 'user-1',
            city_id: 'city-1',
            title: 'Test Post',
            content: 'Test content',
            category: 'general',
            tags: ['test'],
            views: 10,
            likes_count: 5,
            comments_count: 2,
            is_pinned: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        profiles: [
          {
            id: 'user-1',
            email: 'user1@example.com',
            username: 'user1',
            full_name: 'User One',
            avatar_url: null,
            bio: null,
            location: null,
            website: null,
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        cities: [
          {
            id: 'city-1',
            slug: 'seoul',
            name: '서울',
            name_en: 'Seoul',
            description: null,
            image_url: null,
            region: null,
            population: null,
            wifi_rating: null,
            cafe_rating: null,
            cost_rating: null,
            safety_rating: null,
            community_rating: null,
            overall_rating: null,
            tags: null,
            is_featured: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.getPostById('post-1')

      expect(result).toBeDefined()
      expect(result?.id).toBe('post-1')
      expect(result?.profiles).toBeDefined()
      expect(result?.cities).toBeDefined()
      expect(result?.profiles?.username).toBe('user1')
    })

    /**
     * DB-021: getPostById returns null for non-existent post
     */
    it('DB-021: should return null for non-existent post', async () => {
      const { mockClient } = setupSupabaseMocks({
        posts: [],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.getPostById('non-existent-post')

      expect(result).toBeNull()
    })
  })

  describe('createPost', () => {
    /**
     * DB-022: createPost creates a new post successfully
     */
    it('DB-022: should create a new post successfully', async () => {
      const { mockClient, mockData } = setupSupabaseMocks()

      const newPost: PostsInsert = {
        user_id: 'user-1',
        city_id: 'city-1',
        title: 'New Post',
        content: 'New post content',
        category: 'general',
        tags: ['new', 'test'],
      }

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.createPost(newPost)

      expect(result).toBeDefined()
      expect(result.title).toBe('New Post')
      expect(result.content).toBe('New post content')
      expect(mockData.posts).toHaveLength(2) // Original 1 + new 1
    })

    /**
     * DB-023: createPost throws error on invalid data
     */
    it('DB-023: should throw error on invalid data', async () => {
      const { mockClient } = setupSupabaseMocks()

      // Override the insert mock to return an error
      mockClient.from = vi.fn((table: string) => {
        if (table === 'posts') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: {
                    message: 'Validation error: user_id is required',
                    code: '23502',
                  },
                }),
              }),
            }),
          }
        }
        return {}
      }) as any

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const invalidPost: PostsInsert = {
        user_id: '', // Invalid: empty user_id
        title: '', // Invalid: empty title
        content: '', // Invalid: empty content
        category: 'invalid',
      }

      await expect(postsQueries.createPost(invalidPost)).rejects.toThrow()
    })
  })

  describe('updatePost', () => {
    /**
     * DB-024: updatePost updates post successfully
     */
    it('DB-024: should update post successfully', async () => {
      const { mockClient, mockData } = setupSupabaseMocks({
        posts: [
          {
            id: 'post-1',
            user_id: 'user-1',
            city_id: 'city-1',
            title: 'Original Title',
            content: 'Original content',
            category: 'general',
            tags: ['test'],
            views: 10,
            likes_count: 5,
            comments_count: 2,
            is_pinned: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const updates: PostsUpdate = {
        title: 'Updated Title',
        content: 'Updated content',
      }

      const result = await postsQueries.updatePost('post-1', updates)

      expect(result).toBeDefined()
      expect(result.id).toBe('post-1')
      expect(result.title).toBe('Updated Title')
      expect(result.content).toBe('Updated content')
    })

    /**
     * DB-025: updatePost throws error for non-existent post
     */
    it('DB-025: should throw error for non-existent post', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from = vi.fn((table: string) => {
        if (table === 'posts') {
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: null,
                    error: {
                      message: 'No rows found',
                      code: 'PGRST116',
                    },
                  }),
                }),
              }),
            }),
          }
        }
        return {}
      }) as any

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const updates: PostsUpdate = {
        title: 'Updated Title',
      }

      await expect(postsQueries.updatePost('non-existent-post', updates)).rejects.toThrow()
    })
  })

  describe('deletePost', () => {
    /**
     * DB-026: deletePost deletes post successfully
     */
    it('DB-026: should delete post successfully', async () => {
      const { mockClient } = setupSupabaseMocks()

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      await expect(postsQueries.deletePost('post-1')).resolves.not.toThrow()
    })

    /**
     * DB-027: deletePost throws error for non-existent post
     */
    it('DB-027: should throw error for non-existent post', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from = vi.fn((table: string) => {
        if (table === 'posts') {
          return {
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: null,
                error: {
                  message: 'No rows found',
                  code: 'PGRST116',
                },
              }),
            }),
          }
        }
        return {}
      }) as any

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      await expect(postsQueries.deletePost('non-existent-post')).rejects.toThrow()
    })
  })

  describe('togglePostLike', () => {
    /**
     * DB-028: togglePostLike adds like when not liked
     */
    it('DB-028: should add like when post is not liked', async () => {
      const { mockClient } = setupSupabaseMocks({
        post_likes: [],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.togglePostLike('post-1', 'user-1')

      expect(result).toBe(true)
    })

    /**
     * DB-028: togglePostLike removes like when already liked
     */
    it('DB-028: should remove like when post is already liked', async () => {
      const { mockClient } = setupSupabaseMocks({
        post_likes: [
          {
            id: 'like-1',
            post_id: 'post-1',
            user_id: 'user-1',
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.togglePostLike('post-1', 'user-1')

      expect(result).toBe(false)
    })
  })

  describe('hasUserLikedPost', () => {
    it('should return true when user has liked post', async () => {
      const { mockClient } = setupSupabaseMocks({
        post_likes: [
          {
            id: 'like-1',
            post_id: 'post-1',
            user_id: 'user-1',
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.hasUserLikedPost('post-1', 'user-1')

      expect(result).toBe(true)
    })

    it('should return false when user has not liked post', async () => {
      const { mockClient } = setupSupabaseMocks({
        post_likes: [],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.hasUserLikedPost('post-1', 'user-1')

      expect(result).toBe(false)
    })
  })

  describe('getPostsByUserId', () => {
    it('should return posts by user id', async () => {
      const { mockClient } = setupSupabaseMocks({
        posts: [
          {
            id: 'post-1',
            user_id: 'user-1',
            city_id: 'city-1',
            title: 'User Post 1',
            content: 'Content 1',
            category: 'general',
            tags: [],
            views: 0,
            likes_count: 0,
            comments_count: 0,
            is_pinned: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        profiles: [
          {
            id: 'user-1',
            email: 'user1@example.com',
            username: 'user1',
            full_name: 'User One',
            avatar_url: null,
            bio: null,
            location: null,
            website: null,
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        cities: [
          {
            id: 'city-1',
            slug: 'seoul',
            name: '서울',
            name_en: 'Seoul',
            description: null,
            image_url: null,
            region: null,
            population: null,
            wifi_rating: null,
            cafe_rating: null,
            cost_rating: null,
            safety_rating: null,
            community_rating: null,
            overall_rating: null,
            tags: null,
            is_featured: false,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await postsQueries.getPostsByUserId('user-1')

      expect(result).toHaveLength(1)
      expect(result[0].user_id).toBe('user-1')
    })
  })
})
