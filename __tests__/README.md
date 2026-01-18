# Testing with Vitest

This project uses Vitest as the testing framework, along with React Testing Library for component testing.

## Installation

First, install the dependencies:

```bash
npm install
```

## Running Tests

- Run all tests in watch mode: `npm test`
- Run tests with UI interface: `npm run test:ui`
- Run tests with coverage report: `npm run test:coverage`

## Test Structure

Tests should be placed in the `__tests__` directory, mirroring the project structure:

```
__tests__/
  ├── setup/
  │   └── test-setup.ts    # Global test configuration
  ├── middleware/
  │   └── middleware.test.ts     # MW-001 ~ MW-005: Middleware tests
  ├── accessibility/
  │   ├── a11y.test.tsx          # A11Y-001 ~ A11Y-005: Accessibility tests
  │   ├── contrast.test.ts       # Color contrast utilities
  │   └── accessibility-integration.test.tsx  # Integration tests
  ├── lib/
  │   └── utils.test.ts     # Utility function tests
  ├── components/
  │   └── ui/
  │       └── button.test.tsx  # Component tests
  ├── mocks/
  │   ├── supabase.ts       # Supabase mock utilities
  │   └── example.test.ts   # Mock usage examples
  └── app/
      └── [feature]/
          └── actions.test.ts  # Server action tests
```

## Test IDs

### Middleware Tests (MW-001 ~ MW-005)

#### MW-001: 인증된 사용자-보호경로
Test that authenticated users can access protected routes

#### MW-002: 인증 안 된 사용자-보호경로
Test that unauthenticated users are redirected to login when accessing protected routes

#### MW-003: 인증 안 된 사용자-공개경로
Test that unauthenticated users can access public routes

**Note:** The current middleware implementation only allows unauthenticated access to `/login`, `/register`, and `/cities` routes. All other routes redirect to login.

#### MW-004: 인증된 사용자-로그인페이지
Test that authenticated users accessing login page are not redirected

#### MW-005: 토큰 만료
Test behavior when authentication token is expired or invalid

**File:** `/__tests__/middleware/middleware.test.ts`

### Accessibility Tests (A11Y-001 ~ A11Y-005)

#### A11Y-001: 키보드 네비게이션
Test that all interactive elements are accessible via keyboard

#### A11Y-002: ARIA 라벨
Test that all interactive elements have proper ARIA labels

#### A11Y-003: 색상 대비
Test that text and interactive elements meet WCAG AA contrast requirements

#### A11Y-004: 스크린 리더
Test that content is properly announced by screen readers

#### A11Y-005: 포커스 표시
Test that focus indicators are clearly visible

**Files:** `/__tests__/accessibility/a11y.test.tsx`, `/__tests__/accessibility/accessibility-integration.test.tsx`

## Writing Tests

### Unit Tests (Utilities/Functions)

```typescript
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
})
```

### Component Tests

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})
```

### Middleware Tests

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from '@/middleware'

describe('Middleware Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect unauthenticated users from protected routes', async () => {
    const mockRequest = {
      nextUrl: { pathname: '/profile', clone: vi.fn() },
      cookies: { getAll: vi.fn(), set: vi.fn() },
    } as any

    // Mock Supabase auth to return no user
    // ...

    const response = await middleware(mockRequest)
    expect(response.status).toBe(307)
  })
})
```

### Accessibility Tests

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import userEvent from '@testing-library/user-event'

describe('Accessibility Tests', () => {
  it('should be keyboard accessible', async () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button')

    const user = userEvent.setup()
    await user.tab()

    expect(button).toHaveFocus()
  })
})
```

## Mock Utilities

The project includes comprehensive mock utilities for Supabase:

### Usage Example

```typescript
import { setupSupabaseMocks, mockUser } from '@/__tests__/mocks'

describe('My Test', () => {
  beforeEach(() => {
    const { mockAuth, mockClient } = setupSupabaseMocks()

    // Mock authenticated state
    mockAuth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
  })

  it('should work with mocked Supabase', async () => {
    // Your test code here
  })
})
```

### Available Mocks

- `setupSupabaseMocks()` - Setup complete Supabase client mocks
- `createMockSupabaseClient()` - Create mock Supabase client
- `createMockAuth()` - Create mock authentication client
- `createMockStorage()` - Create mock storage client
- `createMockQueryBuilder()` - Create mock query builder

See `/__tests__/mocks/example.test.ts` for comprehensive examples.

## Color Contrast Testing

The project includes utilities for testing color contrast:

```typescript
import {
  calculateContrastRatio,
  meetsWCAAANormal,
  meetsWCAALarge,
} from '@/__tests__/accessibility/contrast.test'

// Calculate contrast ratio
const ratio = calculateContrastRatio('#000000', '#ffffff')
console.log(`Contrast ratio: ${ratio}:1`) // 21:1

// Check WCAG compliance
if (meetsWCAAANormal(ratio)) {
  console.log('Meets WCAG AA for normal text')
}
```

### Standards

- **WCAG AA Normal:** 4.5:1 contrast ratio
- **WCAG AA Large:** 3:1 contrast ratio
- **WCAG AAA Normal:** 7:1 contrast ratio
- **WCAG AAA Large:** 4.5:1 contrast ratio

## WCAG 2.1 Compliance

These tests verify compliance with the following WCAG 2.1 criteria:

### Level A
- 1.3.1 Info and Relationships
- 2.1.1 Keyboard
- 2.1.2 No Keyboard Trap
- 2.4.1 Bypass Blocks
- 2.4.4 Link Purpose
- 3.3.2 Labels or Instructions
- 4.1.2 Name, Role, Value

### Level AA
- 1.4.3 Contrast (Minimum)
- 2.1.3 Focus Order
- 2.4.7 Focus Visible
- 2.5.3 Label in Name

### Level AAA
- 1.4.6 Contrast (Enhanced)

## Configuration

- **Vitest config**: `vitest.config.ts`
- **Test setup**: `__tests__/setup/test-setup.ts`
- **Coverage**: Configured to exclude test files and configurations

## Features

- jsdom environment for DOM testing
- TypeScript path aliases (@/) support
- Jest-dom matchers for better assertions
- Automatic cleanup after each test
- Next.js router and navigation mocks
- Supabase client mocks
- Accessibility testing utilities
- Color contrast calculation tools
