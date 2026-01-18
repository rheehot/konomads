# Konomads E2E Tests

End-to-end testing setup for Konomads using Playwright.

## Structure

```
e2e/
├── data/                      # Test data fixtures
│   ├── users.json            # Test user accounts
│   ├── cities.json           # Sample city data
│   ├── posts.json            # Sample post data
│   ├── meetups.json          # Sample meetup data
│   ├── index.ts              # Data loader and helper functions
│   └── README.md             # Test data documentation
├── tests/                    # Test files (organized by feature)
│   ├── auth/                # Authentication tests
│   ├── cities/              # City browsing tests
│   ├── posts/               # Post functionality tests
│   ├── meetups/             # Meetup functionality tests
│   ├── profile/             # User profile tests
│   ├── smoke/               # Smoke tests (critical paths)
│   ├── accessibility/       # Accessibility tests
│   ├── visual/              # Visual regression tests
│   ├── api-testing/         # API integration tests
│   └── performance/         # Performance tests
├── pages/                   # Page object models
├── utils/                   # Test utilities and helpers
├── fixtures/                # Test fixtures and extensions
├── global-setup.ts          # Global setup before all tests
├── global-teardown.ts       # Global cleanup after all tests
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## Setup

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. Install Playwright browsers:
```bash
npx playwright install
```

### Running Tests

Run all E2E tests:
```bash
npm run test:e2e
```

Run tests in specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

Run specific test file:
```bash
npx playwright test tests/auth/login.spec.ts
```

Run tests in headed mode (see browser):
```bash
npx playwright test --headed
```

Run tests with UI mode:
```bash
npx playwright test --ui
```

Debug tests:
```bash
npx playwright test --debug
```

### Test Organization

#### By Feature
Tests are organized by feature in subdirectories under `tests/`:
- `auth/` - Login, signup, password reset
- `cities/` - City browsing, search, filtering
- `posts/` - Creating, reading, updating posts
- `meetups/` - Creating, joining meetups
- `profile/` - User profile management

#### By Type
Specialized test suites:
- `smoke/` - Critical path tests (run first)
- `accessibility/` - A11y compliance tests
- `visual/` - Visual regression tests
- `api-testing/` - API integration tests
- `performance/` - Performance benchmarks

### Test Data

Test data is managed through JSON files in `e2e/data/`:
- `users.json` - Test user accounts
- `cities.json` - Sample city data
- `posts.json` - Sample post data
- `meetups.json` - Sample meetup data

Data is automatically:
- Created before all tests run (global-setup.ts)
- Cleaned up after all tests complete (global-teardown.ts)

See [e2e/data/README.md](./data/README.md) for detailed documentation.

### Configuration

Playwright configuration is in `playwright.config.ts`:
- Test directory: `./e2e/tests`
- Base URL: `http://localhost:3000`
- Parallel execution: Enabled (except in CI)
- Automatic server startup: Enabled (dev server)
- Reporters: HTML, JSON, JUnit, List

### TypeScript Configuration

E2E tests have their own TypeScript config in `e2e/tsconfig.json`:
- Path aliases configured for `@/*`, `@/e2e/*`
- Playwright types included
- Strict mode enabled

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test'

test('test description', async ({ page }) => {
  // Arrange
  await page.goto('/some-page')

  // Act
  await page.click('button')
  await page.fill('input', 'value')

  // Assert
  await expect(page).toHaveURL('/expected-url')
  await expect(page.locator('h1')).toContainText('Expected Title')
})
```

### Using Test Data

```typescript
import { test, expect } from '@playwright/test'
import { primaryUser, seoulCity } from '@/e2e/data'

test('user can view city', async ({ page }) => {
  await page.goto(`/cities/${seoulCity.slug}`)
  await expect(page.locator('h1')).toContainText(seoulCity.name_en)
})

test('user can login', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=email]', primaryUser.email)
  await page.fill('[name=password]', primaryUser.password)
  await page.click('button[type=submit]')
  await expect(page).toHaveURL('/dashboard')
})
```

### Page Object Model

Create reusable page objects in `e2e/pages/`:

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.page.fill('[name=email]', email)
    await this.page.fill('[name=password]', password)
    await this.page.click('button[type=submit]')
  }
}

// Usage in tests
import { LoginPage } from '@/e2e/pages/LoginPage'

test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login(primaryUser.email, primaryUser.password)
  await expect(page).toHaveURL('/dashboard')
})
```

### Test Fixtures

Create custom fixtures in `e2e/fixtures/`:

```typescript
// fixtures/test.ts
import { test as base } from '@playwright/test'

type TestFixtures = {
  authenticatedPage: Page
}

export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login before test
    await page.goto('/login')
    await page.fill('[name=email]', process.env.TEST_USER_EMAIL!)
    await page.fill('[name=password]', process.env.TEST_USER_PASSWORD!)
    await page.click('button[type=submit]')
    await page.waitForURL('/dashboard')

    await use(page)

    // Cleanup after test
    await page.goto('/logout')
  },
})

export { expect } from '@playwright/test'
```

## Continuous Integration

Tests run automatically in CI with:
- Single worker (no parallel execution)
- 2 retries on failure
- All browsers (Chromium, Firefox, WebKit)
- Headless mode
- HTML and JUnit reports generated

## Debugging

### View Test Results
```bash
npx playwright show-report
```

### Debug Specific Test
```bash
npx playwright test --debug tests/auth/login.spec.ts
```

### Trace Viewer
When tests fail, Playwright saves a trace file. View it:
```bash
npx playwright show-trace test-results/[test-name]/trace.zip
```

### Screenshot Comparison
For visual regression tests, view diff:
```bash
# Compare screenshots
npx playwright test --project=visual
```

## Best Practices

1. **Test Isolation**: Each test should be independent and clean up after itself
2. **Data Management**: Use test data fixtures, don't create data in tests
3. **Selectors**: Use stable selectors (data-testid, aria labels) over CSS classes
4. **Wait Strategies**: Use explicit waits (waitForSelector) over implicit waits
5. **Assertions**: Use specific assertions (toContainText) over generic ones
6. **Page Objects**: Reuse page objects for common interactions
7. **Test Organization**: Group related tests in describe blocks
8. **Meaningful Names**: Use descriptive test names that explain what is being tested

## Troubleshooting

### Tests Fail Due to Missing Data
- Ensure global-setup ran successfully
- Check `.test-data.json` exists
- Verify Supabase credentials are correct

### Server Won't Start
- Check if port 3000 is already in use
- Ensure dev dependencies are installed
- Check for syntax errors in app code

### Browser Won't Launch
- Run `npx playwright install`
- Check system dependencies for browser

### Tests Timeout
- Increase timeout in playwright.config.ts
- Check network connectivity
- Verify server is running

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Data Documentation](./data/README.md)
- [Supabase Documentation](https://supabase.com/docs)
