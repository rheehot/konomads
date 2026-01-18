/**
 * Supabase Comments Query Tests
 *
 * Test IDs: DB-029 ~ DB-039
 *
 * Comments Query Tests:
 * - DB-029: getCommentsByPostId returns top-level comments for a post
 * - DB-030: getRepliesByCommentId returns replies for a comment
 * - DB-031: getCommentThread returns all comments with nested structure
 * - DB-032: getCommentsByPostId returns empty array for post with no comments
 * - DB-033: createComment creates a new top-level comment successfully
 * - DB-034: createComment creates a new nested comment successfully
 * - DB-035: createComment throws error on invalid data
 * - DB-036: updateComment updates comment successfully
 * - DB-037: updateComment throws error for non-existent comment
 * - DB-038: deleteComment deletes comment successfully
 * - DB-039: toggleCommentLike toggles like status
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setupSupabaseMocks } from '@/__tests__/mocks'
import * as commentsQueries from '@/lib/supabase/queries/comments'
import type { CommentWithProfile, CommentsInsert, CommentsUpdate } from '@/types/database'

// Mock the createClient function
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('Comments Queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  describe('getCommentsByPostId', () => {
    /**
     * DB-029: getCommentsByPostId returns top-level comments for a post
     */
    it('DB-029: should return top-level comments for a post', async () => {
      const { mockClient } = setupSupabaseMocks({
        comments: [
          {
            id: 'comment-1',
            user_id: 'user-1',
            post_id: 'post-1',
            parent_id: null,
            content: 'Top level comment 1',
            likes_count: 5,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          {
            id: 'comment-2',
            user_id: 'user-2',
            post_id: 'post-1',
            parent_id: null,
            content: 'Top level comment 2',
            likes_count: 3,
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
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await commentsQueries.getCommentsByPostId('post-1')

      expect(result).toHaveLength(2)
      expect(result[0].parent_id).toBeNull()
      expect(result[1].parent_id).toBeNull()
      expect(result[0].profiles).toBeDefined()
      expect(result[0].profiles?.username).toBe('user1')
    })

    /**
     * DB-032: getCommentsByPostId returns empty array for post with no comments
     */
    it('DB-032: should return empty array for post with no comments', async () => {
      const { mockClient } = setupSupabaseMocks({
        comments: [],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await commentsQueries.getCommentsByPostId('post-without-comments')

      expect(result).toEqual([])
    })

    /**
     * DB-029: getCommentsByPostId throws error on database error
     */
    it('DB-029: should throw error on database error', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from = vi.fn((table: string) => {
        if (table === 'comments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                is: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: null,
                    error: {
                      message: 'Database connection failed',
                      code: 'PGRST301',
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

      await expect(commentsQueries.getCommentsByPostId('post-1')).rejects.toThrow()
    })
  })

  describe('getRepliesByCommentId', () => {
    /**
     * DB-030: getRepliesByCommentId returns replies for a comment
     */
    it('DB-030: should return replies for a comment', async () => {
      const { mockClient } = setupSupabaseMocks({
        comments: [
          {
            id: 'reply-1',
            user_id: 'user-2',
            post_id: 'post-1',
            parent_id: 'comment-1',
            content: 'Reply 1',
            likes_count: 2,
            created_at: '2024-01-02T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
          {
            id: 'reply-2',
            user_id: 'user-3',
            post_id: 'post-1',
            parent_id: 'comment-1',
            content: 'Reply 2',
            likes_count: 1,
            created_at: '2024-01-03T00:00:00Z',
            updated_at: '2024-01-03T00:00:00Z',
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
          {
            id: 'user-3',
            email: 'user3@example.com',
            username: 'user3',
            full_name: 'User Three',
            avatar_url: null,
            bio: null,
            location: null,
            website: null,
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await commentsQueries.getRepliesByCommentId('comment-1')

      expect(result).toHaveLength(2)
      expect(result[0].parent_id).toBe('comment-1')
      expect(result[1].parent_id).toBe('comment-1')
      expect(result[0].profiles).toBeDefined()
    })

    /**
     * DB-030: getRepliesByCommentId returns empty array for comment with no replies
     */
    it('DB-030: should return empty array for comment with no replies', async () => {
      const { mockClient } = setupSupabaseMocks({
        comments: [],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await commentsQueries.getRepliesByCommentId('comment-without-replies')

      expect(result).toEqual([])
    })
  })

  describe('getCommentThread', () => {
    /**
     * DB-031: getCommentThread returns all comments with nested structure
     */
    it('DB-031: should return all comments for a post including nested', async () => {
      const { mockClient } = setupSupabaseMocks({
        comments: [
          {
            id: 'comment-1',
            user_id: 'user-1',
            post_id: 'post-1',
            parent_id: null,
            content: 'Parent comment',
            likes_count: 5,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
          {
            id: 'reply-1',
            user_id: 'user-2',
            post_id: 'post-1',
            parent_id: 'comment-1',
            content: 'Nested reply',
            likes_count: 2,
            created_at: '2024-01-02T00:00:00Z',
            updated_at: '2024-01-02T00:00:00Z',
          },
          {
            id: 'comment-2',
            user_id: 'user-3',
            post_id: 'post-1',
            parent_id: null,
            content: 'Another parent comment',
            likes_count: 3,
            created_at: '2024-01-03T00:00:00Z',
            updated_at: '2024-01-03T00:00:00Z',
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
          {
            id: 'user-3',
            email: 'user3@example.com',
            username: 'user3',
            full_name: 'User Three',
            avatar_url: null,
            bio: null,
            location: null,
            website: null,
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await commentsQueries.getCommentThread('post-1')

      expect(result).toHaveLength(3)
      expect(result[0].parent_id).toBeNull()
      expect(result[1].parent_id).toBe('comment-1')
      expect(result[2].parent_id).toBeNull()
    })

    /**
     * DB-031: getCommentThread returns empty array for post with no comments
     */
    it('DB-031: should return empty array for post with no comments', async () => {
      const { mockClient } = setupSupabaseMocks({
        comments: [],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await commentsQueries.getCommentThread('post-without-comments')

      expect(result).toEqual([])
    })
  })

  describe('createComment', () => {
    /**
     * DB-033: createComment creates a new top-level comment successfully
     */
    it('DB-033: should create a new top-level comment successfully', async () => {
      const { mockClient, mockData } = setupSupabaseMocks()

      const newComment: CommentsInsert = {
        user_id: 'user-1',
        post_id: 'post-1',
        parent_id: null,
        content: 'New top-level comment',
        likes_count: 0,
      }

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await commentsQueries.createComment(newComment)

      expect(result).toBeDefined()
      expect(result.content).toBe('New top-level comment')
      expect(result.parent_id).toBeNull()
      expect(mockData.comments).toHaveLength(1) // New comment added
    })

    /**
     * DB-034: createComment creates a new nested comment successfully
     */
    it('DB-034: should create a new nested comment successfully', async () => {
      const { mockClient, mockData } = setupSupabaseMocks()

      const newComment: CommentsInsert = {
        user_id: 'user-2',
        post_id: 'post-1',
        parent_id: 'comment-1',
        content: 'New nested comment',
        likes_count: 0,
      }

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await commentsQueries.createComment(newComment)

      expect(result).toBeDefined()
      expect(result.content).toBe('New nested comment')
      expect(result.parent_id).toBe('comment-1')
      expect(mockData.comments).toHaveLength(1) // New comment added
    })

    /**
     * DB-035: createComment throws error on invalid data
     */
    it('DB-035: should throw error on invalid data', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from = vi.fn((table: string) => {
        if (table === 'comments') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: {
                    message: 'Validation error: content is required',
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

      const invalidComment: CommentsInsert = {
        user_id: '', // Invalid: empty user_id
        post_id: '', // Invalid: empty post_id
        content: '', // Invalid: empty content
      }

      await expect(commentsQueries.createComment(invalidComment)).rejects.toThrow()
    })
  })

  describe('updateComment', () => {
    /**
     * DB-036: updateComment updates comment successfully
     */
    it('DB-036: should update comment successfully', async () => {
      const { mockClient, mockData } = setupSupabaseMocks({
        comments: [
          {
            id: 'comment-1',
            user_id: 'user-1',
            post_id: 'post-1',
            parent_id: null,
            content: 'Original comment',
            likes_count: 5,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const updates: CommentsUpdate = {
        content: 'Updated comment content',
      }

      const result = await commentsQueries.updateComment('comment-1', updates)

      expect(result).toBeDefined()
      expect(result.id).toBe('comment-1')
      expect(result.content).toBe('Updated comment content')
    })

    /**
     * DB-037: updateComment throws error for non-existent comment
     */
    it('DB-037: should throw error for non-existent comment', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from = vi.fn((table: string) => {
        if (table === 'comments') {
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

      const updates: CommentsUpdate = {
        content: 'Updated content',
      }

      await expect(
        commentsQueries.updateComment('non-existent-comment', updates)
      ).rejects.toThrow()
    })
  })

  describe('deleteComment', () => {
    /**
     * DB-038: deleteComment deletes comment successfully
     */
    it('DB-038: should delete comment successfully', async () => {
      const { mockClient } = setupSupabaseMocks()

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      await expect(commentsQueries.deleteComment('comment-1')).resolves.not.toThrow()
    })

    /**
     * DB-038: deleteComment throws error for non-existent comment
     */
    it('DB-038: should throw error for non-existent comment', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from = vi.fn((table: string) => {
        if (table === 'comments') {
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

      await expect(commentsQueries.deleteComment('non-existent-comment')).rejects.toThrow()
    })
  })

  describe('toggleCommentLike', () => {
    /**
     * DB-039: toggleCommentLike adds like when not liked
     */
    it('DB-039: should add like when comment is not liked', async () => {
      const { mockClient } = setupSupabaseMocks({
        comment_likes: [],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await commentsQueries.toggleCommentLike('comment-1', 'user-1')

      expect(result).toBe(true)
    })

    /**
     * DB-039: toggleCommentLike removes like when already liked
     */
    it('DB-039: should remove like when comment is already liked', async () => {
      const { mockClient } = setupSupabaseMocks({
        comment_likes: [
          {
            id: 'like-1',
            comment_id: 'comment-1',
            user_id: 'user-1',
            created_at: '2024-01-01T00:00:00Z',
          },
        ],
      })

      const { createClient } = await import('@/lib/supabase/server')
      vi.mocked(createClient).mockResolvedValue(mockClient as any)

      const result = await commentsQueries.toggleCommentLike('comment-1', 'user-1')

      expect(result).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors in getCommentsByPostId', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from = vi.fn((table: string) => {
        if (table === 'comments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                is: vi.fn().mockReturnValue({
                  order: vi.fn().mockResolvedValue({
                    data: null,
                    error: {
                      message: 'Database connection failed',
                      code: 'PGRST301',
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

      await expect(commentsQueries.getCommentsByPostId('post-1')).rejects.toThrow()
    })

    it('should handle database errors in getRepliesByCommentId', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from = vi.fn((table: string) => {
        if (table === 'comments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: null,
                  error: {
                    message: 'Database connection failed',
                    code: 'PGRST301',
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

      await expect(commentsQueries.getRepliesByCommentId('comment-1')).rejects.toThrow()
    })

    it('should handle database errors in getCommentThread', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from = vi.fn((table: string) => {
        if (table === 'comments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: null,
                  error: {
                    message: 'Database connection failed',
                    code: 'PGRST301',
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

      await expect(commentsQueries.getCommentThread('post-1')).rejects.toThrow()
    })

    it('should handle database errors in updateComment', async () => {
      const { mockClient } = setupSupabaseMocks()

      mockClient.from = vi.fn((table: string) => {
        if (table === 'comments') {
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: null,
                    error: {
                      message: 'Database connection failed',
                      code: 'PGRST301',
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

      const updates: CommentsUpdate = {
        content: 'Updated content',
      }

      await expect(commentsQueries.updateComment('comment-1', updates)).rejects.toThrow()
    })
  })
})
