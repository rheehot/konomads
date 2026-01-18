/**
 * Playwright Fixtures for Konomads E2E Tests
 *
 * This module exports all custom fixtures and helper functions for E2E testing.
 * Fixtures extend Playwright's base test with project-specific functionality.
 *
 * @module e2e/fixtures
 */

// Export authentication fixtures
export {
  authTest,
  createTestUser,
  deleteTestUser,
  verifyTestUserEmail
} from './auth.fixture';

export type {
  AuthFixture,
  TestUser
} from './auth.fixture';

// Export database fixtures
export {
  databaseTest,
  isDatabaseReady,
  waitForDatabase
} from './database.fixture';

export type {
  DatabaseFixture,
  SeedCity,
  SeedPost,
  SeedMeetup,
  SeedComment
} from './database.fixture';

// Export page fixtures
export {
  pageTest,
  setupAuthPage,
  verifyAccessibility,
  measurePagePerformance
} from './page.fixture';

export type {
  PageFixture,
  ExtendedPage
} from './page.fixture';

// Re-export Playwright basics
export { test, expect } from '@playwright/test';
export type { Page, Locator, BrowserContext } from '@playwright/test';

/**
 * Combined test fixture with all fixtures
 * Use this for tests that need multiple fixture types
 */
import { mergeTests } from '@playwright/test';
import { authTest } from './auth.fixture';
import { databaseTest } from './database.fixture';
import { pageTest } from './page.fixture';

/**
 * Full test fixture combining auth, database, and page fixtures
 * Provides complete functionality for comprehensive E2E tests
 */
export const test = mergeTests(
  authTest,
  databaseTest,
  pageTest
);

/**
 * Common test scenarios using fixtures
 */
export const scenarios = {
  /**
   * Test scenario: Guest user browsing public content
   */
  async guestBrowsing({ guestPage }: import('./auth.fixture').AuthFixture) {
    await guestPage.goto('/');
    await guestPage.waitForSelector('nav');
  },

  /**
   * Test scenario: Authenticated user creating content
   */
  async authenticatedUserCreate({
    loggedInPage,
    supabase
  }: import('./auth.fixture').AuthFixture & import('./database.fixture').DatabaseFixture) {
    // User is already logged in, can create posts, comments, etc.
    await loggedInPage.goto('/posts/new');
  },

  /**
   * Test scenario: Database seeded with test data
   */
  async withSeededDatabase({
    seedDatabase
  }: import('./database.fixture').DatabaseFixture) {
    await seedDatabase();
  }
};

/**
 * Test data generators for common test scenarios
 */
export const testData = {
  /**
   * Generate a random email for testing
   */
  email: () => `test-${Date.now()}@konomads.com`,

  /**
   * Generate a random username for testing
   */
  username: () => `testuser_${Date.now()}`,

  /**
   * Generate a random password for testing
   */
  password: () => `TestPass${Date.now()}!`,

  /**
   * Generate test post data
   */
  post: (overrides = {}) => ({
    title: `Test Post ${Date.now()}`,
    content: 'This is a test post for E2E testing.',
    category: 'general',
    tags: ['test', 'e2e'],
    ...overrides
  }),

  /**
   * Generate test city data
   */
  city: (overrides = {}) => ({
    name: `Test City ${Date.now()}`,
    slug: `test-city-${Date.now()}`,
    description: 'A test city for E2E testing',
    region: 'Test Region',
    wifi_rating: 4,
    cafe_rating: 4,
    cost_rating: 3,
    safety_rating: 5,
    ...overrides
  }),

  /**
   * Generate test meetup data
   */
  meetup: (overrides = {}) => ({
    title: `Test Meetup ${Date.now()}`,
    description: 'A test meetup for E2E testing',
    meetup_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    max_participants: 10,
    ...overrides
  })
};

/**
 * Page URL helpers for common routes
 */
export const routes = {
  home: '/',
  login: '/login',
  signup: '/signup',
  profile: '/profile',
  cities: '/cities',
  posts: '/posts',
  meetups: '/meetups',
  city: (slug: string) => `/cities/${slug}`,
  post: (id: string) => `/posts/${id}`,
  meetup: (id: string) => `/meetups/${id}`,
  user: (id: string) => `/profile/${id}`
};

/**
 * Selectors for common UI elements
 */
export const selectors = {
  // Navigation
  nav: 'nav',
  navLink: (text: string) => `nav a:has-text("${text}")`,

  // Forms
  input: (name: string) => `input[name="${name}"]`,
  textarea: (name: string) => `textarea[name="${name}"]`,
  submitButton: 'button[type="submit"]',

  // Auth
  loginForm: 'form[action*="/login"]',
  signupForm: 'form[action*="/signup"]',
  logoutButton: 'button:has-text("Logout")',

  // Cards
  cityCard: '.city-card',
  postCard: '.post-card',
  meetupCard: '.meetup-card',

  // Actions
  likeButton: 'button[aria-label*="like"]',
  commentButton: 'button[aria-label*="comment"]',
  deleteButton: 'button:has-text("Delete")',
  editButton: 'button:has-text("Edit")',

  // Loading
  loader: '.loader, .spinner',
  skeleton: '.skeleton',

  // Feedback
  toast: '[role="alert"], [role="status"], .toast',
  errorMessage: '.error, [role="alert"].error',
  successMessage: '.success, [role="status"].success'
};

/**
 * Assertion helpers for common test scenarios
 */
export const assertions = {
  /**
   * Assert user is authenticated
   */
  async isAuthenticated(page: import('./page.fixture').ExtendedPage) {
    const user = await page.getAuthUser();
    expect(user).not.toBeNull();
  },

  /**
   * Assert user is not authenticated
   */
  async isNotAuthenticated(page: import('./page.fixture').ExtendedPage) {
    const user = await page.getAuthUser();
    expect(user).toBeNull();
  },

  /**
   * Assert page has heading
   */
  async hasHeading(page: import('./page.fixture').ExtendedPage, text: string) {
    await expect(page.locator('h1, h2')).toContainText(text);
  },

  /**
   * Assert toast message appears
   */
  async hasToast(page: import('./page.fixture').ExtendedPage, message: string) {
    const toast = await page.waitForToast();
    expect(toast).toContain(message);
  }
};
