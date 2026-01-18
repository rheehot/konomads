/**
 * Supabase Mock Utilities for Testing
 *
 * This file provides comprehensive mocks for Supabase client functionality,
 * including authentication, database queries, and storage operations.
 */

import { vi } from 'vitest'
import type {
  Profiles,
  Cities,
  Posts,
  Comments,
  Meetups,
  MeetupParticipants,
  PostLikes,
  CommentLikes,
} from '@/types/database'

// Mock data types
export type MockData = {
  profiles?: Profiles[]
  cities?: Cities[]
  posts?: Posts[]
  comments?: Comments[]
  meetups?: Meetups[]
  meetup_participants?: MeetupParticipants[]
  post_likes?: PostLikes[]
  comment_likes?: CommentLikes[]
}

// Default mock data
export const defaultMockData: MockData = {
  profiles: [
    {
      id: 'mock-user-1',
      email: 'test@example.com',
      username: 'testuser',
      full_name: 'Test User',
      avatar_url: null,
      bio: null,
      location: null,
      website: null,
      updated_at: new Date().toISOString(),
    },
  ],
  cities: [
    {
      id: 'mock-city-1',
      slug: 'seoul',
      name: '서울',
      name_en: 'Seoul',
      description: 'South Korea\'s capital',
      image_url: null,
      region: 'Seoul Capital Area',
      population: 9720000,
      wifi_rating: 5,
      cafe_rating: 5,
      cost_rating: 3,
      safety_rating: 5,
      community_rating: 4,
      overall_rating: 4.4,
      tags: ['digital-nomad', 'coworking', 'k-culture'],
      is_featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  posts: [
    {
      id: 'mock-post-1',
      user_id: 'mock-user-1',
      city_id: 'mock-city-1',
      title: 'Test Post',
      content: 'This is a test post content',
      category: 'general',
      tags: ['test', 'mock'],
      views: 0,
      likes_count: 0,
      comments_count: 0,
      is_pinned: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  comments: [],
  meetups: [],
  meetup_participants: [],
  post_likes: [],
  comment_likes: [],
}

/**
 * Create a mock Supabase query builder chain
 */
export function createMockQueryBuilder(mockData: MockData = defaultMockData) {
  let currentTable: keyof MockData | null = null
  let selectColumns = '*'
  let filters: Array<{ column: string; operator: string; value: any }> = []
  let limitValue: number | null = null
  let offsetValue: number | null = null
  let orderByColumn: string | null = null
  let orderByAscending = true
  let singleMode = false
  let maybeSingleMode = false

  const queryChain = {
    select: vi.fn((columns: string = '*') => {
      selectColumns = columns
      return queryChain
    }),

    insert: vi.fn((data: any) => {
      if (!currentTable || !mockData[currentTable]) {
        return Promise.resolve({
          data: null,
          error: { message: 'Table not found', code: 'PGRST116' },
        })
      }

      const newItem = Array.isArray(data) ? data : [data]
      mockData[currentTable] = [...(mockData[currentTable] || []), ...newItem]

      return Promise.resolve({
        data: newItem.length === 1 ? newItem[0] : newItem,
        error: null,
      })
    }),

    update: vi.fn((data: any) => {
      return queryChain
    }),

    delete: vi.fn(() => {
      return queryChain
    }),

    eq: vi.fn((column: string, value: any) => {
      filters.push({ column, operator: 'eq', value })
      return queryChain
    }),

    neq: vi.fn((column: string, value: any) => {
      filters.push({ column, operator: 'neq', value })
      return queryChain
    }),

    gt: vi.fn((column: string, value: any) => {
      filters.push({ column, operator: 'gt', value })
      return queryChain
    }),

    gte: vi.fn((column: string, value: any) => {
      filters.push({ column, operator: 'gte', value })
      return queryChain
    }),

    lt: vi.fn((column: string, value: any) => {
      filters.push({ column, operator: 'lt', value })
      return queryChain
    }),

    lte: vi.fn((column: string, value: any) => {
      filters.push({ column, operator: 'lte', value })
      return queryChain
    }),

    like: vi.fn((column: string, value: any) => {
      filters.push({ column, operator: 'like', value })
      return queryChain
    }),

    ilike: vi.fn((column: string, value: any) => {
      filters.push({ column, operator: 'ilike', value })
      return queryChain
    }),

    in: vi.fn((column: string, values: any[]) => {
      filters.push({ column, operator: 'in', value: values })
      return queryChain
    }),

    is: vi.fn((column: string, value: any) => {
      filters.push({ column, operator: 'is', value })
      return queryChain
    }),

    order: vi.fn((column: string, options?: { ascending?: boolean; nullsFirst?: boolean }) => {
      orderByColumn = column
      orderByAscending = options?.ascending !== false
      return queryChain
    }),

    limit: vi.fn((count: number) => {
      limitValue = count
      return queryChain
    }),

    offset: vi.fn((count: number) => {
      offsetValue = count
      return queryChain
    }),

    range: vi.fn((from: number, to: number) => {
      offsetValue = from
      limitValue = to - from + 1
      return queryChain
    }),

    single: vi.fn(() => {
      singleMode = true
      return executeQuery()
    }),

    maybeSingle: vi.fn(() => {
      maybeSingleMode = true
      return executeQuery()
    }),

    then: vi.fn((resolve: any, reject: any) => {
      return executeQuery().then(resolve, reject)
    }),
  }

  function executeQuery() {
    if (!currentTable || !mockData[currentTable]) {
      return Promise.resolve({
        data: null,
        error: { message: 'Table not found', code: 'PGRST116' },
      })
    }

    let results = [...(mockData[currentTable] || [])]

    // Apply filters
    filters.forEach(({ column, operator, value }) => {
      results = results.filter((row: any) => {
        const rowValue = row[column]

        switch (operator) {
          case 'eq':
            return rowValue === value
          case 'neq':
            return rowValue !== value
          case 'gt':
            return rowValue > value
          case 'gte':
            return rowValue >= value
          case 'lt':
            return rowValue < value
          case 'lte':
            return rowValue <= value
          case 'like':
            return typeof rowValue === 'string' && rowValue.includes(value)
          case 'ilike':
            return typeof rowValue === 'string' &&
              rowValue.toLowerCase().includes(value.toLowerCase())
          case 'in':
            return Array.isArray(value) && value.includes(rowValue)
          case 'is':
            return rowValue === null
          default:
            return true
        }
      })
    })

    // Apply ordering
    if (orderByColumn) {
      results.sort((a: any, b: any) => {
        const aVal = a[orderByColumn]
        const bVal = b[orderByColumn]
        if (orderByAscending) {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    }

    // Apply offset
    if (offsetValue !== null) {
      results = results.slice(offsetValue)
    }

    // Apply limit
    if (limitValue !== null) {
      results = results.slice(0, limitValue)
    }

    // Handle select columns (simplified - just returns all for now)
    // In a real implementation, you'd filter columns based on selectColumns

    // Handle single/maybeSingle modes
    if (singleMode) {
      if (results.length === 0) {
        return Promise.resolve({
          data: null,
          error: { message: 'No rows found', code: 'PGRST116' },
        })
      }
      if (results.length > 1) {
        return Promise.resolve({
          data: null,
          error: { message: 'Multiple rows found', code: 'PGRST117' },
        })
      }
      return Promise.resolve({
        data: results[0],
        error: null,
      })
    }

    if (maybeSingleMode) {
      if (results.length === 0) {
        return Promise.resolve({
          data: null,
          error: null,
        })
      }
      if (results.length > 1) {
        return Promise.resolve({
          data: null,
          error: { message: 'Multiple rows found', code: 'PGRST117' },
        })
      }
      return Promise.resolve({
        data: results[0],
        error: null,
      })
    }

    return Promise.resolve({
      data: results,
      error: null,
    })
  }

  return {
    queryChain,
    setTable: (table: keyof MockData) => {
      currentTable = table
      filters = []
      limitValue = null
      offsetValue = null
      orderByColumn = null
      singleMode = false
      maybeSingleMode = false
    },
  }
}

/**
 * Create a mock storage client
 */
export function createMockStorage() {
  const files: Map<string, { path: string; url: string }> = new Map()

  return {
    from: vi.fn((bucket: string) => ({
      upload: vi.fn((path: string, file: File) => {
        const filePath = `${bucket}/${path}`
        const url = `https://mock-storage.supabase.co/${bucket}/${path}`
        files.set(filePath, { path: filePath, url })
        return Promise.resolve({
          data: { path: filePath },
          error: null,
        })
      }),

      remove: vi.fn((paths: string[]) => {
        paths.forEach(path => {
          files.delete(`${bucket}/${path}`)
        })
        return Promise.resolve({
          data: {},
          error: null,
        })
      }),

      getPublicUrl: vi.fn((path: string) => {
        const url = `https://mock-storage.supabase.co/${bucket}/${path}`
        return {
          data: { publicUrl: url },
        }
      }),

      list: vi.fn((path?: string, options?: any) => {
        const prefix = path ? `${bucket}/${path}` : bucket
        const allFiles = Array.from(files.keys())
          .filter(key => key.startsWith(prefix))
          .map(key => ({
            name: key.replace(`${bucket}/`, ''),
            id: key,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_accessed_at: new Date().toISOString(),
            metadata: null,
          }))

        return Promise.resolve({
          data: allFiles,
          error: null,
        })
      }),

      download: vi.fn((path: string) => {
        const filePath = `${bucket}/${path}`
        const file = files.get(filePath)
        if (file) {
          return Promise.resolve({
            data: new Blob(),
            error: null,
          })
        }
        return Promise.resolve({
          data: null,
          error: { message: 'File not found' },
        })
      }),

      createSignedUrl: vi.fn((path: string, expiresIn: number) => {
        const url = `https://mock-storage.supabase.co/${bucket}/${path}?expires=${expiresIn}`
        return Promise.resolve({
          data: { signedUrl: url },
          error: null,
        })
      }),
    })),
  }
}

/**
 * Mock user data
 */
export const mockUser = {
  id: 'mock-user-1',
  email: 'test@example.com',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  phone_confirmed_at: null,
  last_sign_in_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  app_metadata: {
    provider: 'email',
    providers: ['email'],
  },
  user_metadata: {
    username: 'testuser',
    full_name: 'Test User',
  },
  identites: [],
  factors: [],
  aud: 'authenticated',
  role: 'authenticated',
}

/**
 * Create a mock auth client
 */
export function createMockAuth(customUser: Partial<typeof mockUser> = {}) {
  let currentUser: typeof mockUser | null = { ...mockUser, ...customUser }
  let session = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: currentUser,
  }

  return {
    getUser: vi.fn(() => {
      return Promise.resolve({
        data: { user: currentUser },
        error: null,
      })
    }),

    signInWithPassword: vi.fn((credentials: { email: string; password: string }) => {
      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        currentUser = mockUser
        session.user = currentUser
        return Promise.resolve({
          data: { user: currentUser, session },
          error: null,
        })
      }
      return Promise.resolve({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials', status: 400 },
      })
    }),

    signUp: vi.fn((credentials: { email: string; password: string; options?: any }) => {
      const newUser = {
        ...mockUser,
        id: `new-user-${Date.now()}`,
        email: credentials.email,
        user_metadata: credentials.options?.data || {},
      }
      currentUser = newUser
      session.user = currentUser
      return Promise.resolve({
        data: { user: newUser, session },
        error: null,
      })
    }),

    signOut: vi.fn(() => {
      currentUser = null
      session.user = null
      return Promise.resolve({
        data: {},
        error: null,
      })
    }),

    refreshSession: vi.fn(() => {
      return Promise.resolve({
        data: { session },
        error: null,
      })
    }),

    getSession: vi.fn(() => {
      return Promise.resolve({
        data: { session: currentUser ? session : null },
        error: null,
      })
    }),

    updateUser: vi.fn((attributes: any) => {
      if (currentUser) {
        currentUser = {
          ...currentUser,
          ...attributes,
          user_metadata: {
            ...currentUser.user_metadata,
            ...attributes.data,
          },
        }
        session.user = currentUser
      }
      return Promise.resolve({
        data: { user: currentUser },
        error: null,
      })
    }),

    resetPasswordForEmail: vi.fn((email: string) => {
      return Promise.resolve({
        data: {},
        error: null,
      })
    }),

    onAuthStateChange: vi.fn((callback: any) => {
      if (currentUser) {
        callback('INITIAL_SESSION', session)
      }
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      }
    }),
  }
}

/**
 * Create a complete mock Supabase client
 */
export function createMockSupabaseClient(mockData?: MockData) {
  const data = mockData || defaultMockData
  const { queryChain, setTable } = createMockQueryBuilder(data)
  const mockAuth = createMockAuth()
  const mockStorage = createMockStorage()

  return {
    auth: mockAuth,

    from: vi.fn((table: string) => {
      setTable(table as keyof MockData)
      return queryChain
    }),

    storage: mockStorage,

    // Channel support (for realtime subscriptions)
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(() => ({
          then: vi.fn((cb: any) => cb()),
        })),
      })),
    })),

    // Remove all channels
    removeAllChannels: vi.fn(),

    // Get channels
    getChannels: vi.fn(() => []),
  }
}

/**
 * Reset all mock data to defaults
 */
export function resetMockData() {
  return { ...defaultMockData }
}

/**
 * Helper function to setup Supabase mocks in tests
 */
export function setupSupabaseMocks(customData?: Partial<MockData>) {
  const mockData = {
    ...defaultMockData,
    ...customData,
  }

  const mockClient = createMockSupabaseClient(mockData)

  return {
    mockClient,
    mockData,
    mockAuth: mockClient.auth,
    mockStorage: mockClient.storage,
  }
}

// Export factory function for easy importing
export const mockSupabaseClient = createMockSupabaseClient

// Export types
export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>
export type MockAuth = ReturnType<typeof createMockAuth>
export type MockStorage = ReturnType<typeof createMockStorage>
export type MockQueryBuilder = ReturnType<typeof createMockQueryBuilder>['queryChain']
