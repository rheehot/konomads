import { test as base, Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

/**
 * Test user credentials for E2E testing
 */
export interface TestUser {
  email: string;
  password: string;
  username?: string;
  fullName?: string;
}

/**
 * Auth fixture interface
 */
export interface AuthFixture {
  loggedInPage: Page;
  guestPage: Page;
  testUser: TestUser;
  login: (page: Page, user?: TestUser) => Promise<void>;
  loginAs: (page: Page, user: TestUser) => Promise<void>;
  logout: (page: Page) => Promise<void>;
  signUp: (page: Page, user: TestUser) => Promise<void>;
  getCurrentUser: (page: Page) => Promise<{ email: string; id: string } | null>;
}

/**
 * Default test user for E2E tests
 */
const defaultTestUser: TestUser = {
  email: 'test-e2e@konomads.com',
  password: 'TestPassword123!',
  username: 'testuser',
  fullName: 'Test User'
};

/**
 * Helper function to create Supabase client for auth operations
 */
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Authentication fixture for Playwright tests
 * Provides authenticated and non-authenticated page instances
 */
export const authTest = base.extend<AuthFixture>({
  testUser: async ({}, use) => {
    await use(defaultTestUser);
  },

  guestPage: async ({ page }, use) => {
    // Ensure page is not authenticated
    await page.context().clearCookies();
    await use(page);
  },

  loggedInPage: async ({ page, testUser }, use) => {
    // Create a fresh context for authenticated user
    const context = page.context();

    // Navigate to login page
    await page.goto('/login');

    // Fill in login form
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    // Submit login form
    await page.click('button[type="submit"]');

    // Wait for navigation to complete (should redirect to home or profile)
    await page.waitForURL(/\/(profile|$)/, { timeout: 5000 });

    // Verify login was successful by checking for authenticated state
    const currentUser = await page.evaluate(() => {
      return localStorage.getItem('supabase.auth.token');
    });

    if (!currentUser) {
      throw new Error('Failed to authenticate test user');
    }

    await use(page);

    // Cleanup: logout after test
    try {
      await page.goto('/api/auth/logout');
    } catch (error) {
      console.error('Error during cleanup logout:', error);
    }
  },

  login: async ({ page }, use) => {
    const loginMethod = async (page: Page, user: TestUser = defaultTestUser) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/(profile|home|$)/, { timeout: 5000 });
    };
    await use(loginMethod);
  },

  loginAs: async ({ page }, use) => {
    const loginAsMethod = async (page: Page, user: TestUser) => {
      await page.goto('/login');
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/(profile|home|$)/, { timeout: 5000 });
    };
    await use(loginAsMethod);
  },

  logout: async ({ page }, use) => {
    const logoutMethod = async (page: Page) => {
      await page.goto('/api/auth/logout');
      await page.waitForURL('/login');
      await page.context().clearCookies();
    };
    await use(logoutMethod);
  },

  signUp: async ({ page }, use) => {
    const signUpMethod = async (page: Page, user: TestUser) => {
      await page.goto('/signup');

      // Fill signup form
      await page.fill('input[name="email"]', user.email);
      await page.fill('input[name="password"]', user.password);

      if (user.username) {
        await page.fill('input[name="username"]', user.username);
      }

      if (user.fullName) {
        await page.fill('input[name="fullName"]', user.fullName);
      }

      // Submit signup form
      await page.click('button[type="submit"]');

      // Wait for redirect or success message
      await page.waitForURL(/\/(profile|login|email-confirm)/, { timeout: 5000 });
    };
    await use(signUpMethod);
  },

  getCurrentUser: async ({ page }, use) => {
    const getCurrentUserMethod = async (page: Page) => {
      return await page.evaluate(async () => {
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
          const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(supabaseUrl, supabaseKey);

          const { data: { user } } = await supabase.auth.getUser();

          return user ? { email: user.email!, id: user.id } : null;
        } catch (error) {
          console.error('Error getting current user:', error);
          return null;
        }
      });
    };
    await use(getCurrentUserMethod);
  }
});

/**
 * Helper function to create a test user in Supabase
 * Use this in beforeAll hooks or setup scripts
 */
export async function createTestUser(user: TestUser): Promise<string> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      data: {
        username: user.username,
        full_name: user.fullName,
      }
    }
  });

  if (error) {
    throw new Error(`Failed to create test user: ${error.message}`);
  }

  return data.user!.id;
}

/**
 * Helper function to delete a test user from Supabase
 * Use this in afterAll hooks or cleanup scripts
 */
export async function deleteTestUser(email: string): Promise<void> {
  const supabase = createSupabaseClient();

  // Get user by email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const user = users.find(u => u.email === email);

  if (user) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
    }
  }
}

/**
 * Helper function to verify email for test user
 * Useful when email confirmation is required
 */
export async function verifyTestUserEmail(email: string): Promise<void> {
  const supabase = createSupabaseClient();

  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    throw new Error(`Failed to list users: ${listError.message}`);
  }

  const user = users.find(u => u.email === email);

  if (user) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    );

    if (updateError) {
      throw new Error(`Failed to verify email: ${updateError.message}`);
    }
  }
}

export { test } from '@playwright/test';
export { expect } from '@playwright/test';
