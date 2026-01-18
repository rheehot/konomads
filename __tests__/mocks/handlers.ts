/**
 * MSW (Mock Service Worker) Handlers for Testing
 *
 * This file provides HTTP request handlers for mocking API calls in tests,
 * including Supabase REST API endpoints and custom application endpoints.
 */

import { http, HttpResponse } from 'msw'
import { defaultMockData, type MockData } from './supabase'

// Base URL for Supabase (can be configured via environment variable)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'mock-anon-key'

// In-memory data store (can be customized per test)
let mockDataStore: MockData = { ...defaultMockData }

/**
 * Reset mock data to defaults
 */
export function resetMockDataStore() {
  mockDataStore = { ...defaultMockData }
}

/**
 * Update mock data store
 */
export function updateMockDataStore(updates: Partial<MockData>) {
  mockDataStore = { ...mockDataStore, ...updates }
}

/**
 * Get current mock data store
 */
export function getMockDataStore() {
  return { ...mockDataStore }
}

/**
 * Helper to create Supabase API response headers
 */
function createSupabaseHeaders() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  }
}

/**
 * Helper to create Supabase error response
 */
function createSupabaseError(message: string, code: string, status: number = 400) {
  return HttpResponse.json(
    {
      message,
      code,
      hints: [],
      details: '',
    },
    { status }
  )
}

/**
 * Helper to extract filter parameters from Supabase query string
 */
function parseFilters(url: URL) {
  const filters: Array<{ column: string; operator: string; value: any }> = []

  // Parse eq filters
  url.searchParams.forEach((value, key) => {
    if (key.startsWith('') && key.includes('=')) {
      const [column, operator] = key.split('=')
      if (operator === 'eq') {
        filters.push({ column, operator: 'eq', value })
      }
    }
  })

  // Parse and filter
  url.searchParams.forEach((value, key) => {
    if (key.startsWith('') && key.includes('.')) {
      const [column, operator] = key.split('.')
      if (operator === 'eq') {
        filters.push({ column, operator: 'eq', value })
      }
    }
  })

  return filters
}

/**
 * Helper to filter data array based on URL parameters
 */
function filterData(data: any[], url: URL, tableName: string) {
  let results = [...data]

  // Filter by ID in URL path (e.g., /profiles?id=eq.123)
  const idParam = url.searchParams.get('id')
  if (idParam) {
    const match = idParam.match(/^eq\.(.+)$/)
    if (match) {
      results = results.filter(row => row.id === match[1])
    }
  }

  // Parse and apply filters
  url.searchParams.forEach((value, key) => {
    // Handle eq filters: column=eq.value
    if (value.includes('eq.')) {
      const column = key
      const filterValue = value.replace('eq.', '')
      results = results.filter(row => row[column] === filterValue)
    }
  })

  // Handle order
  const order = url.searchParams.get('order')
  if (order) {
    const ascending = url.searchParams.get('order_nullsfirst') !== 'false'
    results.sort((a, b) => {
      const aVal = a[order]
      const bVal = b[order]
      return ascending ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
    })
  }

  // Handle limit
  const limit = url.searchParams.get('limit')
  if (limit) {
    results = results.slice(0, parseInt(limit, 10))
  }

  // Handle offset
  const offset = url.searchParams.get('offset')
  if (offset) {
    results = results.slice(parseInt(offset, 10))
  }

  // Handle select single row
  const select = url.searchParams.get('select')
  if (select === '*' && !url.searchParams.has('limit') && results.length === 0) {
    return { data: null, error: { code: 'PGRST116' } }
  }

  return results
}

/**
 * Auth handlers
 */
export const authHandlers = [
  // Get user
  http.get(`${SUPABASE_URL}/auth/v1/user`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
      return createSupabaseError('Missing authorization header', 'JWT_INVALID', 401)
    }

    // Return mock user
    return HttpResponse.json(
      {
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
      { status: 200 }
    )
  }),

  // Sign in
  http.post(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }

    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        access_token: 'mock-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
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
      })
    }

    return createSupabaseError('Invalid login credentials', 'invalid_credentials', 400)
  }),

  // Sign up
  http.post(`${SUPABASE_URL}/auth/v1/signup`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }

    return HttpResponse.json({
      access_token: 'mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: {
        id: `new-user-${Date.now()}`,
        email: body.email,
        email_confirmed_at: null,
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: { provider: 'email', providers: ['email'] },
        user_metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
  }),

  // Sign out
  http.post(`${SUPABASE_URL}/auth/v1/logout`, () => {
    return HttpResponse.json({}, { status: 200 })
  }),

  // Refresh session
  http.post(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, () => {
    return HttpResponse.json({
      access_token: 'new-mock-access-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'new-mock-refresh-token',
    })
  }),

  // Reset password
  http.post(`${SUPABASE_URL}/auth/v1/recover`, async ({ request }) => {
    const body = await request.json() as { email: string }
    return HttpResponse.json({}, { status: 200 })
  }),
]

/**
 * REST API handlers for Supabase tables
 */
export const restHandlers = [
  // Profiles table
  http.get(`${SUPABASE_URL}/rest/v1/profiles`, ({ request }) => {
    const url = new URL(request.url)
    const results = filterData(mockDataStore.profiles || [], url, 'profiles')

    // Handle single row request
    const select = url.searchParams.get('select')
    if (select?.includes('*') && !url.searchParams.has('limit')) {
      // Check if requesting by id
      const idParam = url.searchParams.toString()
      if (idParam.includes('id=eq.')) {
        if (results.length === 0) {
          return HttpResponse.json(null, { status: 200 })
        }
        return HttpResponse.json(results[0], { status: 200 })
      }
    }

    return HttpResponse.json(results, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  http.post(`${SUPABASE_URL}/rest/v1/profiles`, async ({ request }) => {
    const newItem = await request.json()
    mockDataStore.profiles = [...(mockDataStore.profiles || []), newItem]
    return HttpResponse.json(newItem, {
      status: 201,
      headers: createSupabaseHeaders(),
    })
  }),

  http.patch(`${SUPABASE_URL}/rest/v1/profiles`, async ({ request }) => {
    const url = new URL(request.url)
    const updates = await request.json()

    const idParam = url.searchParams.get('id')
    if (idParam?.startsWith('eq.')) {
      const id = idParam.replace('eq.', '')
      mockDataStore.profiles = mockDataStore.profiles?.map(profile =>
        profile.id === id ? { ...profile, ...updates } : profile
      )
    }

    return HttpResponse.json(updates, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  // Cities table
  http.get(`${SUPABASE_URL}/rest/v1/cities`, ({ request }) => {
    const url = new URL(request.url)
    const results = filterData(mockDataStore.cities || [], url, 'cities')

    return HttpResponse.json(results, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  http.post(`${SUPABASE_URL}/rest/v1/cities`, async ({ request }) => {
    const newItem = await request.json()
    mockDataStore.cities = [...(mockDataStore.cities || []), newItem]
    return HttpResponse.json(newItem, {
      status: 201,
      headers: createSupabaseHeaders(),
    })
  }),

  // Posts table
  http.get(`${SUPABASE_URL}/rest/v1/posts`, ({ request }) => {
    const url = new URL(request.url)
    const results = filterData(mockDataStore.posts || [], url, 'posts')

    return HttpResponse.json(results, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  http.post(`${SUPABASE_URL}/rest/v1/posts`, async ({ request }) => {
    const newItem = await request.json()
    mockDataStore.posts = [...(mockDataStore.posts || []), newItem]
    return HttpResponse.json(newItem, {
      status: 201,
      headers: createSupabaseHeaders(),
    })
  }),

  http.patch(`${SUPABASE_URL}/rest/v1/posts`, async ({ request }) => {
    const url = new URL(request.url)
    const updates = await request.json()

    const idParam = url.searchParams.get('id')
    if (idParam?.startsWith('eq.')) {
      const id = idParam.replace('eq.', '')
      mockDataStore.posts = mockDataStore.posts?.map(post =>
        post.id === id ? { ...post, ...updates } : post
      )
    }

    return HttpResponse.json(updates, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/posts`, async ({ request }) => {
    const url = new URL(request.url)

    const idParam = url.searchParams.get('id')
    if (idParam?.startsWith('eq.')) {
      const id = idParam.replace('eq.', '')
      mockDataStore.posts = mockDataStore.posts?.filter(post => post.id !== id)
    }

    return HttpResponse.json({}, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  // Comments table
  http.get(`${SUPABASE_URL}/rest/v1/comments`, ({ request }) => {
    const url = new URL(request.url)
    const results = filterData(mockDataStore.comments || [], url, 'comments')

    return HttpResponse.json(results, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  http.post(`${SUPABASE_URL}/rest/v1/comments`, async ({ request }) => {
    const newItem = await request.json()
    mockDataStore.comments = [...(mockDataStore.comments || []), newItem]
    return HttpResponse.json(newItem, {
      status: 201,
      headers: createSupabaseHeaders(),
    })
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/comments`, async ({ request }) => {
    const url = new URL(request.url)

    const idParam = url.searchParams.get('id')
    if (idParam?.startsWith('eq.')) {
      const id = idParam.replace('eq.', '')
      mockDataStore.comments = mockDataStore.comments?.filter(comment => comment.id !== id)
    }

    return HttpResponse.json({}, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  // Meetups table
  http.get(`${SUPABASE_URL}/rest/v1/meetups`, ({ request }) => {
    const url = new URL(request.url)
    const results = filterData(mockDataStore.meetups || [], url, 'meetups')

    return HttpResponse.json(results, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  http.post(`${SUPABASE_URL}/rest/v1/meetups`, async ({ request }) => {
    const newItem = await request.json()
    mockDataStore.meetups = [...(mockDataStore.meetups || []), newItem]
    return HttpResponse.json(newItem, {
      status: 201,
      headers: createSupabaseHeaders(),
    })
  }),

  http.patch(`${SUPABASE_URL}/rest/v1/meetups`, async ({ request }) => {
    const url = new URL(request.url)
    const updates = await request.json()

    const idParam = url.searchParams.get('id')
    if (idParam?.startsWith('eq.')) {
      const id = idParam.replace('eq.', '')
      mockDataStore.meetups = mockDataStore.meetups?.map(meetup =>
        meetup.id === id ? { ...meetup, ...updates } : meetup
      )
    }

    return HttpResponse.json(updates, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/meetups`, async ({ request }) => {
    const url = new URL(request.url)

    const idParam = url.searchParams.get('id')
    if (idParam?.startsWith('eq.')) {
      const id = idParam.replace('eq.', '')
      mockDataStore.meetups = mockDataStore.meetups?.filter(meetup => meetup.id !== id)
    }

    return HttpResponse.json({}, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  // Meetup participants table
  http.get(`${SUPABASE_URL}/rest/v1/meetup_participants`, ({ request }) => {
    const url = new URL(request.url)
    const results = filterData(mockDataStore.meetup_participants || [], url, 'meetup_participants')

    return HttpResponse.json(results, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  http.post(`${SUPABASE_URL}/rest/v1/meetup_participants`, async ({ request }) => {
    const newItem = await request.json()
    mockDataStore.meetup_participants = [
      ...(mockDataStore.meetup_participants || []),
      newItem,
    ]
    return HttpResponse.json(newItem, {
      status: 201,
      headers: createSupabaseHeaders(),
    })
  }),

  // Post likes table
  http.get(`${SUPABASE_URL}/rest/v1/post_likes`, ({ request }) => {
    const url = new URL(request.url)
    const results = filterData(mockDataStore.post_likes || [], url, 'post_likes')

    return HttpResponse.json(results, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  http.post(`${SUPABASE_URL}/rest/v1/post_likes`, async ({ request }) => {
    const newItem = await request.json()
    mockDataStore.post_likes = [...(mockDataStore.post_likes || []), newItem]

    // Increment likes_count on the post
    if (newItem.post_id) {
      mockDataStore.posts = mockDataStore.posts?.map(post =>
        post.id === newItem.post_id
          ? { ...post, likes_count: post.likes_count + 1 }
          : post
      )
    }

    return HttpResponse.json(newItem, {
      status: 201,
      headers: createSupabaseHeaders(),
    })
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/post_likes`, async ({ request }) => {
    const url = new URL(request.url)
    const postParam = url.searchParams.get('post_id')
    const userParam = url.searchParams.get('user_id')

    if (postParam?.startsWith('eq.') && userParam?.startsWith('eq.')) {
      const postId = postParam.replace('eq.', '')
      const userId = userParam.replace('eq.', '')

      const like = mockDataStore.post_likes?.find(
        l => l.post_id === postId && l.user_id === userId
      )

      if (like) {
        mockDataStore.post_likes = mockDataStore.post_likes?.filter(l => l.id !== like.id)

        // Decrement likes_count on the post
        mockDataStore.posts = mockDataStore.posts?.map(post =>
          post.id === postId
            ? { ...post, likes_count: Math.max(0, post.likes_count - 1) }
            : post
        )
      }
    }

    return HttpResponse.json({}, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  // Comment likes table
  http.get(`${SUPABASE_URL}/rest/v1/comment_likes`, ({ request }) => {
    const url = new URL(request.url)
    const results = filterData(mockDataStore.comment_likes || [], url, 'comment_likes')

    return HttpResponse.json(results, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),

  http.post(`${SUPABASE_URL}/rest/v1/comment_likes`, async ({ request }) => {
    const newItem = await request.json()
    mockDataStore.comment_likes = [...(mockDataStore.comment_likes || []), newItem]

    // Increment likes_count on the comment
    if (newItem.comment_id) {
      mockDataStore.comments = mockDataStore.comments?.map(comment =>
        comment.id === newItem.comment_id
          ? { ...comment, likes_count: comment.likes_count + 1 }
          : comment
      )
    }

    return HttpResponse.json(newItem, {
      status: 201,
      headers: createSupabaseHeaders(),
    })
  }),

  http.delete(`${SUPABASE_URL}/rest/v1/comment_likes`, async ({ request }) => {
    const url = new URL(request.url)
    const commentParam = url.searchParams.get('comment_id')
    const userParam = url.searchParams.get('user_id')

    if (commentParam?.startsWith('eq.') && userParam?.startsWith('eq.')) {
      const commentId = commentParam.replace('eq.', '')
      const userId = userParam.replace('eq.', '')

      const like = mockDataStore.comment_likes?.find(
        l => l.comment_id === commentId && l.user_id === userId
      )

      if (like) {
        mockDataStore.comment_likes = mockDataStore.comment_likes?.filter(l => l.id !== like.id)

        // Decrement likes_count on the comment
        mockDataStore.comments = mockDataStore.comments?.map(comment =>
          comment.id === commentId
            ? { ...comment, likes_count: Math.max(0, comment.likes_count - 1) }
            : comment
        )
      }
    }

    return HttpResponse.json({}, {
      status: 200,
      headers: createSupabaseHeaders(),
    })
  }),
]

/**
 * Storage handlers for Supabase storage
 */
export const storageHandlers = [
  // Upload file
  http.post(`${SUPABASE_URL}/storage/v1/bucket/:bucket/*`, async ({ params }) => {
    const { bucket } = params
    const path = params['*']

    return HttpResponse.json(
      {
        Key: `${bucket}/${path}`,
      },
      { status: 200 }
    )
  }),

  // Get public URL
  http.get(`${SUPABASE_URL}/storage/v1/bucket/:bucket/*`, ({ params }) => {
    const { bucket } = params
    const path = params['*']
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`

    return HttpResponse.json(
      { publicUrl },
      { status: 200 }
    )
  }),

  // Delete file
  http.delete(`${SUPABASE_URL}/storage/v1/bucket/:bucket/*`, () => {
    return HttpResponse.json({}, { status: 200 })
  }),

  // List files
  http.get(`${SUPABASE_URL}/storage/v1/bucket/:bucket`, ({ request }) => {
    const url = new URL(request.url)
    const prefix = url.searchParams.get('prefix') || ''

    return HttpResponse.json(
      [],
      { status: 200 }
    )
  }),

  // Create signed URL
  http.post(`${SUPABASE_URL}/storage/v1/bucket/:bucket/*/sign`, async ({ request, params }) => {
    const { bucket } = params
    const path = params['*']
    const body = await request.json() as { expiresIn: number }

    const signedUrl = `${SUPABASE_URL}/storage/v1/object/sign/${bucket}/${path}?expires=${body.expiresIn}`

    return HttpResponse.json(
      { signedUrl },
      { status: 200 }
    )
  }),
]

/**
 * Error handlers for testing error scenarios
 */
export const errorHandlers = [
  // Authentication errors
  http.get(`${SUPABASE_URL}/auth/v1/user`, () => {
    return createSupabaseError('Invalid JWT', 'JWT_INVALID', 401)
  }),

  // Rate limiting
  http.get(`${SUPABASE_URL}/rest/v1/*`, () => {
    return createSupabaseError('Rate limit exceeded', 'RATE_LIMIT', 429)
  }),

  // Server errors
  http.get(`${SUPABASE_URL}/rest/v1/*`, () => {
    return createSupabaseError('Internal server error', 'INTERNAL_ERROR', 500)
  }),

  // Network errors (timeout)
  http.get(`${SUPABASE_URL}/rest/v1/*`, () => {
    return HttpResponse.error()
  }),
]

/**
 * Combine all handlers
 */
export const handlers = [
  ...authHandlers,
  ...restHandlers,
  ...storageHandlers,
]

/**
 * Helper to setup MSW for testing
 */
export function setupMSW(customData?: Partial<MockData>) {
  if (customData) {
    updateMockDataStore(customData)
  }
  return handlers
}

/**
 * Error scenario helpers
 */
export const errorScenarios = {
  auth: {
    invalidToken: errorHandlers[0],
  },
  rateLimit: errorHandlers[1],
  serverError: errorHandlers[2],
  networkError: errorHandlers[3],
}
