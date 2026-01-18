# Testing Quick Reference

This guide provides a quick reference for common testing scenarios in the Konomads project.

## Installation

First, ensure all dependencies are installed:

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Import Patterns

### Import from mocks

```typescript
// Import everything from one place
import { setupSupabaseMocks, mockUser, mockSupabaseClient } from '@/__tests__/mocks'

// Import specific utilities
import { setupSupabaseMocks } from '@/__tests__/mocks/supabase'
import { handlers, setupMSW } from '@/__tests__/mocks/handlers'
```

## Common Test Patterns

### Testing React Components

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setupSupabaseMocks } from '@/__tests__/mocks'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setupSupabaseMocks()
  })

  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Testing Auth Functions

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setupSupabaseMocks, mockUser } from '@/__tests__/mocks'
import { signIn } from '@/lib/auth'

describe('Authentication', () => {
  beforeEach(() => {
    const { mockAuth } = setupSupabaseMocks()

    // Mock successful sign in
    mockAuth.signInWithPassword.mockResolvedValue({
      data: {
        user: mockUser,
        session: { /* session data */ }
      },
      error: null,
    })
  })

  it('should sign in user', async () => {
    const result = await signIn('test@example.com', 'password')
    expect(result.user).toBeDefined()
  })
})
```

### Testing Database Queries

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setupSupabaseMocks } from '@/__tests__/mocks'
import { getProfileById } from '@/lib/supabase/queries'

describe('Profile Queries', () => {
  beforeEach(() => {
    const { mockClient } = setupSupabaseMocks({
      profiles: [
        {
          id: 'user-1',
          email: 'test@example.com',
          username: 'testuser',
          // ... other fields
        },
      ],
    })

    // Mock the query
    mockClient.from('profiles').select('*').eq('single').mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: mockData.profiles![0],
        error: null,
      }),
    } as any)
  })

  it('should get profile by id', async () => {
    const profile = await getProfileById('user-1')
    expect(profile).toBeDefined()
    expect(profile?.username).toBe('testuser')
  })
})
```

### Testing Error Cases

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setupSupabaseMocks } from '@/__tests__/mocks'

describe('Error Handling', () => {
  beforeEach(() => {
    const { mockClient } = setupSupabaseMocks()

    // Mock error response
    mockClient.from('posts').select('*').mockResolvedValue({
      data: null,
      error: {
        message: 'Database error',
        code: 'PGRST301',
        details: '',
        hint: '',
      },
    })
  })

  it('should handle errors', async () => {
    const { mockClient } = setupSupabaseMocks()
    const { error } = await mockClient.from('posts').select('*')
    expect(error).toBeDefined()
  })
})
```

## Mocking Strategies

### Strategy 1: Direct Mocking (Recommended for Unit Tests)

```typescript
import { setupSupabaseMocks } from '@/__tests__/mocks'

describe('Unit Test', () => {
  const { mockClient, mockAuth, mockData } = setupSupabaseMocks()

  // Use mockClient, mockAuth directly
  it('works with direct mocks', () => {
    // Test implementation
  })
})
```

### Strategy 2: MSW (Recommended for Integration Tests)

```typescript
import { setupServer } from 'msw/node'
import { handlers } from '@/__tests__/mocks/handlers'

describe('Integration Test', () => {
  const server = setupServer(...handlers)

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('works with MSW', async () => {
    // Test with real HTTP requests mocked by MSW
  })
})
```

## Common Mock Configurations

### Authenticated User

```typescript
const { mockAuth } = setupSupabaseMocks()

mockAuth.getUser.mockResolvedValue({
  data: { user: mockUser },
  error: null,
})
```

### Unauthenticated User

```typescript
const { mockAuth } = setupSupabaseMocks()

mockAuth.getUser.mockResolvedValue({
  data: { user: null },
  error: null,
})
```

### Custom Data

```typescript
const customData = {
  posts: [
    {
      id: 'custom-post-1',
      title: 'Custom Post',
      content: 'Custom content',
      // ... required fields
    },
  ],
}

const { mockData } = setupSupabaseMocks(customData)
```

## Test File Structure

```
__tests__/
├── mocks/           # Mock utilities
├── setup/           # Test setup files
├── unit/            # Unit tests
│   ├── components/
│   └── lib/
├── integration/     # Integration tests
└── e2e/            # End-to-end tests
```

## Best Practices

1. **Clean up after each test**
   ```typescript
   afterEach(() => {
     vi.clearAllMocks()
   })
   ```

2. **Use descriptive test names**
   ```typescript
   it('should redirect to login when user is not authenticated', () => {})
   ```

3. **Test both success and failure cases**
   ```typescript
   it('should succeed with valid credentials', () => {})
   it('should fail with invalid credentials', () => {})
   ```

4. **Keep tests isolated**
   - Don't rely on test order
   - Reset mocks between tests
   - Use fresh data for each test

5. **Mock at the right level**
   - Mock external services (Supabase, APIs)
   - Don't mock the code you're testing
   - Test integration points, not implementations

## Troubleshooting

### Tests are slow

- Use `vi.clearAllMocks()` instead of recreating mocks
- Avoid unnecessary setup in `beforeAll`
- Use `vi.fn()` for simple function mocks

### Mocks not working

- Check import paths
- Ensure mocks are called before tests
- Verify mock configuration

### Tests pass locally but fail in CI

- Check environment variables
- Ensure all dependencies are installed
- Check for platform-specific issues

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)
- [React Testing Library](https://testing-library.com/react)
