# Testing Mocks Documentation

This directory contains comprehensive mocking utilities for testing the Konomads application. It includes mocks for Supabase client, authentication, database queries, and storage operations.

## Overview

The mocking system is split into two main parts:

1. **`supabase.ts`** - Direct Supabase client mocks (vi.mock approach)
2. **`handlers.ts`** - MSW (Mock Service Worker) handlers for HTTP requests

## Installation

The mocks require MSW to be installed:

```bash
npm install --save-dev msw
```

## Usage

### Basic Supabase Client Mocking

The easiest way to mock Supabase in your tests is to use the `setupSupabaseMocks` function:

```typescript
import { setupSupabaseMocks } from '@/__tests__/mocks'

describe('My Component', () => {
  beforeEach(() => {
    // Setup with default mock data
    const { mockClient, mockAuth, mockData } = setupSupabaseMocks()

    // Or setup with custom mock data
    const customMocks = setupSupabaseMocks({
      profiles: [
        {
          id: 'custom-user-1',
          email: 'custom@example.com',
          username: 'customuser',
          // ... other fields
        },
      ],
    })
  })

  it('should work with mocked Supabase', async () => {
    // Your test code here
  })
})
```

### Using Mock Directly

You can also create mock instances directly:

```typescript
import { mockSupabaseClient, mockUser } from '@/__tests__/mocks'

describe('My Test', () => {
  const mockClient = mockSupabaseClient()

  it('tests auth', async () => {
    // Mock successful login
    mockClient.auth.signInWithPassword.mockResolvedValueOnce({
      data: {
        user: mockUser,
        session: { /* session data */ }
      },
      error: null,
    })

    // Test your auth logic
  })
})
```

### Testing Database Queries

```typescript
import { setupSupabaseMocks } from '@/__tests__/mocks'

describe('Database Queries', () => {
  const { mockClient, mockData } = setupSupabaseMocks({
    posts: [
      {
        id: 'post-1',
        title: 'Test Post',
        content: 'Test content',
        // ... other fields
      },
    ],
  })

  it('should fetch posts', async () => {
    // The mock will return the configured data
    const { data } = await mockClient.from('posts').select('*')
    expect(data).toHaveLength(1)
    expect(data[0].title).toBe('Test Post')
  })
})
```

### Testing Authentication

```typescript
import { setupSupabaseMocks, mockUser } from '@/__tests__/mocks'

describe('Authentication', () => {
  const { mockAuth } = setupSupabaseMocks()

  it('should sign in user', async () => {
    mockAuth.signInWithPassword.mockResolvedValueOnce({
      data: {
        user: mockUser,
        session: { /* session */ }
      },
      error: null,
    })

    // Test sign in
  })

  it('should get current user', async () => {
    mockAuth.getUser.mockResolvedValueOnce({
      data: { user: mockUser },
      error: null,
    })

    // Test getting user
  })
})
```

### Testing Storage Operations

```typescript
import { setupSupabaseMocks } from '@/__tests__/mocks'

describe('Storage', () => {
  const { mockStorage } = setupSupabaseMocks()

  it('should upload file', async () => {
    const mockBucket = mockStorage.from('avatars')

    mockBucket.upload.mockResolvedValueOnce({
      data: { path: 'avatars/test.png' },
      error: null,
    })

    // Test file upload
  })

  it('should get public URL', async () => {
    const mockBucket = mockStorage.from('avatars')

    mockBucket.getPublicUrl.mockReturnValueOnce({
      data: { publicUrl: 'https://example.com/avatars/test.png' }
    })

    // Test getting public URL
  })
})
```

## Using MSW Handlers

For more realistic HTTP request mocking, use the MSW handlers:

```typescript
import { setupMSW, http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { handlers, updateMockDataStore } from '@/__tests__/mocks/handlers'

describe('With MSW', () => {
  const server = setupServer(...handlers)

  beforeAll(() => server.listen())
  afterEach(() => {
    server.resetHandlers()
    // Reset mock data after each test
    updateMockDataStore({})
  })
  afterAll(() => server.close())

  it('should handle API requests', async () => {
    // Test API calls that go through MSW handlers
  })
})
```

### Custom MSW Handlers

You can override handlers for specific tests:

```typescript
import { http, HttpResponse } from 'msw'

server.use(
  http.get('https://your-project.supabase.co/rest/v1/posts', () => {
    return HttpResponse.json([
      { id: 'custom-1', title: 'Custom Post' }
    ])
  })
)
```

## Mock Data Structure

The default mock data includes all database tables:

```typescript
interface MockData {
  profiles?: Profiles[]
  cities?: Cities[]
  posts?: Posts[]
  comments?: Comments[]
  meetups?: Meetups[]
  meetup_participants?: MeetupParticipants[]
  post_likes?: PostLikes[]
  comment_likes?: CommentLikes[]
}
```

## Error Testing

Test error scenarios with the built-in error handlers:

```typescript
import { errorScenarios } from '@/__tests__/mocks/handlers'

describe('Error Handling', () => {
  it('should handle auth errors', () => {
    // Use auth error handler
    server.use(errorScenarios.auth.invalidToken)
    // Test error handling
  })

  it('should handle rate limiting', () => {
    server.use(errorScenarios.rateLimit)
    // Test rate limit handling
  })

  it('should handle server errors', () => {
    server.use(errorScenarios.serverError)
    // Test server error handling
  })

  it('should handle network errors', () => {
    server.use(errorScenarios.networkError)
    // Test network error handling
  })
})
```

## Query Chain Mocking

The mock query builder supports all common Supabase query methods:

```typescript
// Select
mockClient.from('posts').select('*')

// Filter
mockClient.from('posts').select('*').eq('id', 'post-1')
mockClient.from('posts').select('*').in('id', ['post-1', 'post-2'])

// Order
mockClient.from('posts').select('*').order('created_at', { ascending: false })

// Limit/Offset
mockClient.from('posts').select('*').limit(10).offset(20)

// Single/MaybeSingle
mockClient.from('posts').select('*').eq('id', 'post-1').single()
mockClient.from('posts').select('*').eq('id', 'post-1').maybeSingle()

// Insert
mockClient.from('posts').insert({ title: 'New Post', content: 'Content' })

// Update
mockClient.from('posts').update({ title: 'Updated' }).eq('id', 'post-1')

// Delete
mockClient.from('posts').delete().eq('id', 'post-1')
```

## Best Practices

1. **Always reset mocks** between tests to avoid state leakage
2. **Use descriptive mock data** that reflects real-world scenarios
3. **Test both success and error cases**
4. **Keep mock data minimal** - only include what's needed for the test
5. **Use custom mock data** when testing specific scenarios
6. **Mock at the right level** - mock Supabase directly for unit tests, use MSW for integration tests

## Example: Full Test Suite

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { setupSupabaseMocks, mockUser } from '@/__tests__/mocks'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    const { mockClient, mockAuth } = setupSupabaseMocks()

    // Setup default authenticated state
    mockAuth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    // Mock database queries
    mockClient.from('posts').select('*').mockResolvedValue({
      data: [
        {
          id: 'post-1',
          title: 'Test Post',
          content: 'Test Content',
        },
      ],
      error: null,
    })
  })

  it('should display posts', async () => {
    render(<MyComponent />)
    expect(await screen.findByText('Test Post')).toBeInTheDocument()
  })

  it('should handle errors', async () => {
    const { mockClient } = setupSupabaseMocks()
    mockClient.from('posts').select('*').mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    })

    render(<MyComponent />)
    expect(await screen.findByText('Error loading posts')).toBeInTheDocument()
  })
})
```

## Troubleshooting

### Mocks not working

Make sure you're importing from the correct path:
```typescript
import { setupSupabaseMocks } from '@/__tests__/mocks'
```

### Tests timing out

Ensure async operations are properly awaited:
```typescript
// Good
const result = await mockClient.from('posts').select('*')

// Bad
const result = mockClient.from('posts').select('*')
```

### Mock state leaking between tests

Reset mocks in `beforeEach`:
```typescript
beforeEach(() => {
  vi.clearAllMocks()
  const { mockClient } = setupSupabaseMocks()
})
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Supabase Documentation](https://supabase.com/docs)
- [Testing Library Documentation](https://testing-library.com/)
