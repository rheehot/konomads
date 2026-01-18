import { expect, afterEach, beforeEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})

// Mock console methods in test environment to reduce noise
const originalError = console.error
const originalWarn = console.warn

beforeEach(() => {
  console.error = (...args: any[]) => {
    // Filter out specific React warnings if needed
    const errorMessage = args[0]
    if (
      typeof errorMessage === 'string' &&
      (errorMessage.includes('Warning: ') ||
        errorMessage.includes('Not implemented:'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }

  console.warn = (...args: any[]) => {
    // Filter out specific warnings if needed
    const warnMessage = args[0]
    if (
      typeof warnMessage === 'string' &&
      warnMessage.includes('Not implemented:')
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterEach(() => {
  // Restore console methods
  console.error = originalError
  console.warn = originalWarn
})

// Mock Next.js router
export const mockRedirect = vi.fn()
export const mockRevalidatePath = vi.fn()

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}))

// Mock Next.js image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    // Return a simple object representation instead of JSX
    return {
      type: 'img',
      props: { src, alt, ...props },
    }
  },
}))

// Mock Supabase client with comprehensive mocks
// Import the mock setup function
import { setupSupabaseMocks } from '../mocks'

// Setup mocks for client-side Supabase
vi.mock('@/lib/supabase/client', () => {
  const { mockClient } = setupSupabaseMocks()
  return {
    createClient: vi.fn(() => mockClient),
  }
})

// Setup mocks for server-side Supabase
vi.mock('@/lib/supabase/server', () => {
  const { mockClient } = setupSupabaseMocks()
  return {
    createClient: vi.fn(() => Promise.resolve(mockClient)),
  }
})

// Mock Next.js cookies for server-side Supabase
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    set: vi.fn(),
  })),
}))
