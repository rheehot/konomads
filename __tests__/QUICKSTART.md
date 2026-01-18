# Vitest Testing Quick Start

## Installation

After pulling the latest changes, install the new dependencies:

```bash
npm install
```

## Run Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI interface
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Create Your First Test

### 1. Unit Test Example

Create a test file for utilities:

```typescript
// __tests__/lib/my-util.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from '@/lib/my-util'

describe('myFunction', () => {
  it('should work correctly', () => {
    expect(myFunction('input')).toBe('expected-output')
  })
})
```

### 2. Component Test Example

Create a test file for components:

```typescript
// __tests__/components/my-component.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MyComponent } from '@/components/my-component'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## Test File Locations

Place test files in the `__tests__` directory mirroring your source structure:

```
__tests__/
  ├── lib/              # Test files for lib/ utilities
  ├── components/       # Test files for components/
  └── app/             # Test files for app/ routes and actions
```

## Available Assertions

With `@testing-library/jest-dom`, you can use:

```typescript
expect(element).toBeInTheDocument()
expect(element).toHaveTextContent('text')
expect(element).toHaveClass('class-name')
expect(element).toBeVisible()
expect(element).toBeDisabled()
```

## Mocking

The test setup includes mocks for:

- Next.js router (`next/navigation`)
- Next.js Image component
- Supabase client

You can add more mocks in `__tests__/setup/test-setup.ts`.

## Learn More

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
