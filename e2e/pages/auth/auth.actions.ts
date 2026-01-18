import { Page, expect } from '@playwright/test';
import { LoginPage } from './login.page';
import { SignupPage } from './signup.page';
import { BasePage } from '../base.page';

/**
 * Authentication Actions
 *
 * Shared authentication helper methods that can be used across tests.
 * Provides high-level authentication workflows combining login and signup actions.
 */
export class AuthActions {
  readonly page: Page;
  readonly loginPage: LoginPage;
  readonly signupPage: SignupPage;
  readonly basePage: BasePage;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.signupPage = new SignupPage(page);
    this.basePage = new BasePage(page);
  }

  // ===========================
  // User Login Methods
  // ===========================

  /**
   * Perform complete login flow
   * @param email - User email address
   * @param password - User password
   * @param expectSuccess - Whether login should succeed (default: true)
   */
  async login(email: string, password: string, expectSuccess: boolean = true): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.verifyPageLoaded();

    await this.loginPage.login(email, password);

    if (expectSuccess) {
      await this.loginPage.verifyRedirectAfterLogin();
    } else {
      await this.loginPage.verifyErrorMessageVisible();
    }
  }

  /**
   * Login with credentials and navigate to specific URL
   * @param email - User email address
   * @param password - User password
   * @param redirectTo - URL to navigate after login
   */
  async loginAndRedirect(email: string, password: string, redirectTo: string): Promise<void> {
    await this.login(email, password);
    await this.basePage.goto(redirectTo);
  }

  /**
   * Quick login method (minimal validation)
   * @param email - User email address
   * @param password - User password
   */
  async quickLogin(email: string, password: string): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.login(email, password);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login as admin user (if applicable)
   * @param adminEmail - Admin email address
   * @param adminPassword - Admin password
   */
  async loginAsAdmin(adminEmail: string, adminPassword: string): Promise<void> {
    await this.login(adminEmail, adminPassword);
    await this.verifyAdminAccess();
  }

  // ===========================
  // User Signup Methods
  // ===========================

  /**
   * Perform complete signup flow
   * @param email - User email address
   * @param password - User password
   * @param acceptTerms - Whether to accept terms (default: true)
   * @param expectSuccess - Whether signup should succeed (default: true)
   */
  async signup(email: string, password: string, acceptTerms: boolean = true, expectSuccess: boolean = true): Promise<void> {
    await this.signupPage.goto();
    await this.signupPage.verifyPageLoaded();

    await this.signupPage.signup(email, password, acceptTerms);

    if (expectSuccess) {
      await this.signupPage.verifyRedirectAfterSignup();
    } else {
      await this.signupPage.verifyErrorMessageVisible();
    }
  }

  /**
   * Quick signup method (minimal validation)
   * @param email - User email address
   * @param password - User password
   */
  async quickSignup(email: string, password: string): Promise<void> {
    await this.signupPage.goto();
    await this.signupPage.signup(email, password, true);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Generate a unique email for testing
   * @param prefix - Email prefix (default: 'test')
   * @returns Unique email address
   */
  generateUniqueEmail(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}.${timestamp}.${random}@test.com`;
  }

  /**
   * Signup with a unique auto-generated email
   * @param password - Password to use
   * @returns The generated email address
   */
  async signupWithUniqueEmail(password: string): Promise<string> {
    const email = this.generateUniqueEmail('konomads');
    await this.signup(email, password);
    return email;
  }

  // ===========================
  // Logout Methods
  // ===========================

  /**
   * Logout from the application
   * Assumes there's a logout button/link in the UI
   */
  async logout(): Promise<void> {
    const logoutButton = this.page.locator('button:has-text("로그아웃"), a:has-text("로그아웃"), [data-testid="logout"]');
    await logoutButton.click();
    await this.page.waitForLoadState('networkidle');
    await this.verifyLoggedOut();
  }

  /**
   * Logout by navigating directly to logout endpoint (if available)
   */
  async logoutViaApi(): Promise<void> {
    await this.page.goto('/auth/logout');
    await this.page.waitForLoadState('networkidle');
  }

  // ===========================
  // Verification Methods
  // ===========================

  /**
   * Verify that user is logged in
   * Checks for common indicators of authenticated state
   */
  async verifyLoggedIn(): Promise<void> {
    // Check for profile link or user menu
    const profileLink = this.page.locator('a[href="/profile"], [data-testid="user-menu"]');
    await expect(profileLink).toBeVisible();

    // Check that login button is not visible
    const loginButton = this.page.locator('a:has-text("로그인"), [data-testid="login-button"]');
    await expect(loginButton).not.toBeVisible();
  }

  /**
   * Verify that user is logged out
   * Checks for common indicators of unauthenticated state
   */
  async verifyLoggedOut(): Promise<void> {
    // Check that we're redirected to home or login page
    const url = this.page.url();
    const isHomePage = url.includes('/') && !url.includes('/profile');
    const isLoginPage = url.includes('/login');

    if (!isHomePage && !isLoginPage) {
      throw new Error(`Expected to be on home or login page, but was on ${url}`);
    }
  }

  /**
   * Verify that user has admin access
   */
  async verifyAdminAccess(): Promise<void> {
    const adminIndicator = this.page.locator('[data-testid="admin-badge"], a:has-text("관리자"), [data-testid="admin-panel"]');
    await expect(adminIndicator).toBeVisible();
  }

  /**
   * Verify that current user is not an admin
   */
  async verifyNotAdmin(): Promise<void> {
    const adminIndicator = this.page.locator('[data-testid="admin-badge"], a:has-text("관리자")');
    await expect(adminIndicator).not.toBeVisible();
  }

  // ===========================
  // Navigation Methods
  // ===========================

  /**
   * Navigate to login page
   */
  async gotoLogin(): Promise<void> {
    await this.loginPage.goto();
  }

  /**
   * Navigate to signup page
   */
  async gotoSignup(): Promise<void> {
    await this.signupPage.goto();
  }

  /**
   * Navigate from login to signup
   */
  async navigateLoginToSignup(): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.clickSignupLink();
    await this.signupPage.verifyPageLoaded();
  }

  /**
   * Navigate from signup to login
   */
  async navigateSignupToLogin(): Promise<void> {
    await this.signupPage.goto();
    await this.signupPage.clickLoginLink();
    await this.loginPage.verifyPageLoaded();
  }

  // ===========================
  // Test User Credentials
  // ===========================

  /**
   * Get test user credentials from environment variables
   * @returns Test user credentials or null
   */
  getTestCredentials(): { email: string; password: string } | null {
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;

    if (email && password) {
      return { email, password };
    }

    return null;
  }

  /**
   * Get admin credentials from environment variables
   * @returns Admin credentials or null
   */
  getAdminCredentials(): { email: string; password: string } | null {
    const email = process.env.ADMIN_USER_EMAIL;
    const password = process.env.ADMIN_USER_PASSWORD;

    if (email && password) {
      return { email, password };
    }

    return null;
  }

  /**
   * Login with test user credentials from environment
   */
  async loginWithTestUser(): Promise<void> {
    const credentials = this.getTestCredentials();

    if (!credentials) {
      throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD environment variables are not set');
    }

    await this.login(credentials.email, credentials.password);
  }

  /**
   * Login with admin credentials from environment
   */
  async loginWithAdminUser(): Promise<void> {
    const credentials = this.getAdminCredentials();

    if (!credentials) {
      throw new Error('ADMIN_USER_EMAIL and ADMIN_USER_PASSWORD environment variables are not set');
    }

    await this.login(credentials.email, credentials.password);
  }

  // ===========================
  // Session Management
  // ===========================

  /**
   * Save authentication state to file
   * @param filename - File to save state to
   */
  async saveAuthState(filename: string = 'auth-state.json'): Promise<void> {
    await this.page.context().storageState({ path: `test-results/${filename}` });
  }

  /**
   * Load authentication state from file
   * Note: This must be called before creating a new browser context
   * @param filename - File to load state from
   */
  static async loadAuthState(filename: string = 'auth-state.json'): Promise<string> {
    return `test-results/${filename}`;
  }

  // ===========================
  // Password Reset Methods
  // ===========================

  /**
   * Navigate to forgot password page
   */
  async gotoForgotPassword(): Promise<void> {
    await this.loginPage.goto();
    await this.loginPage.clickForgotPasswordLink();
  }

  /**
   * Request password reset
   * @param email - Email address for password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    await this.gotoForgotPassword();
    const emailInput = this.page.locator('input[name="email"], input[type="email"]');
    await emailInput.fill(email);
    const submitButton = this.page.locator('button[type="submit"]');
    await submitButton.click();
  }

  // ===========================
  // Email Verification Methods
  // ===========================

  /**
   * Verify email address (if verification link is available)
   * @param verificationToken - Email verification token
   */
  async verifyEmail(verificationToken: string): Promise<void> {
    await this.page.goto(`/auth/verify?token=${verificationToken}`);
    await this.page.waitForLoadState('networkidle');
  }

  // ===========================
  // Account Deletion Methods
  // ===========================

  /**
   * Delete user account (if feature is available)
   * @param password - User password for confirmation
   */
  async deleteAccount(password: string): Promise<void> {
    await this.page.goto('/profile/settings');
    const deleteButton = this.page.locator('button:has-text("계정 삭제"), button:has-text("탈퇴")');
    await deleteButton.click();

    // Confirm password if required
    const passwordInput = this.page.locator('input[type="password"]');
    if (await passwordInput.isVisible()) {
      await passwordInput.fill(password);
    }

    const confirmButton = this.page.locator('button:has-text("확인"), button:has-text("탈퇴하기")');
    await confirmButton.click();

    await this.verifyLoggedOut();
  }
}

/**
 * Test user credentials interface
 */
export interface TestUser {
  email: string;
  password: string;
  name?: string;
  isAdmin?: boolean;
}

/**
 * Create a test user object
 * @param partialUser - Partial user data
 * @returns Complete test user object
 */
export function createTestUser(partialUser: Partial<TestUser> = {}): TestUser {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  return {
    email: partialUser.email || `test.${timestamp}.${random}@test.com`,
    password: partialUser.password || 'Test1234!',
    name: partialUser.name || `Test User ${timestamp}`,
    isAdmin: partialUser.isAdmin || false,
  };
}
