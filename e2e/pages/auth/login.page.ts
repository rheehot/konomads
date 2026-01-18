import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Login Page Object Model
 *
 * Represents the login page (/login) of the Konomads application.
 * Contains locators and methods for authentication actions.
 */
export class LoginPage extends BasePage {
  // ===========================
  // Page URL
  // ===========================
  readonly url = '/login';

  // ===========================
  // Page Title Locators
  // ===========================
  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;

  // ===========================
  // Form Locators
  // ===========================
  readonly loginForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  // ===========================
  // Error Message Locators
  // ===========================
  readonly errorMessage: Locator;
  readonly errorContainer: Locator;

  // ===========================
  // Link Locators
  // ===========================
  readonly signupLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly backToHomeLink: Locator;

  constructor(page: Page) {
    super(page);

    // Page Title
    this.pageTitle = page.locator('*:has-text("로그인")').first();
    this.pageSubtitle = page.locator('p:has-text("노마드코리아 계정"), p:has-text("계정에 로그인")');

    // Form Elements
    this.loginForm = page.locator('form');
    this.emailInput = page.locator('input[name="email"], input[type="email"], input[id="email"]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], input[id="password"]');
    this.submitButton = page.locator('button[type="submit"]:has-text("로그인")');

    // Error Messages
    this.errorContainer = page.locator('div[class*="error"], div[role="alert"], .bg-red-50, .text-red-600');
    this.errorMessage = page.locator('div:has-text("이메일 또는 비밀번호"), div:has-text("올바르지 않습니다")');

    // Links
    this.signupLink = page.locator('a:has-text("회원가입"), a[href="/register"]');
    this.forgotPasswordLink = page.locator('a:has-text("비밀번호 찾기"), a[href="/forgot-password"]');
    this.backToHomeLink = page.locator('a[href="/"], a:has-text("홈")');
  }

  // ===========================
  // Navigation Methods
  // ===========================

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await super.goto(this.url);
  }

  // ===========================
  // Form Action Methods
  // ===========================

  /**
   * Fill in the login form and submit
   * @param email - User email address
   * @param password - User password
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSubmit();
  }

  /**
   * Fill in the email field
   * @param email - Email address
   */
  async fillEmail(email: string): Promise<void> {
    await this.fill(this.emailInput, email);
  }

  /**
   * Fill in the password field
   * @param password - Password
   */
  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Click the submit button
   */
  async clickSubmit(): Promise<void> {
    await this.click(this.submitButton);
  }

  /**
   * Clear the email field
   */
  async clearEmail(): Promise<void> {
    await this.clear(this.emailInput);
  }

  /**
   * Clear the password field
   */
  async clearPassword(): Promise<void> {
    await this.clear(this.passwordInput);
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.clearEmail();
    await this.clearPassword();
  }

  // ===========================
  // Navigation Link Methods
  // ===========================

  /**
   * Click the signup link to navigate to registration
   */
  async clickSignupLink(): Promise<void> {
    await this.click(this.signupLink);
  }

  /**
   * Click the forgot password link
   */
  async clickForgotPasswordLink(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Click the back to home link
   */
  async clickBackToHome(): Promise<void> {
    await this.click(this.backToHomeLink);
  }

  // ===========================
  // Verification Methods
  // ===========================

  /**
   * Verify that the login page is displayed
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Verify that an error message is displayed
   */
  async verifyErrorMessageVisible(): Promise<void> {
    await expect(this.errorContainer).toBeVisible();
  }

  /**
   * Verify that an error message is NOT displayed
   */
  async verifyNoErrorMessage(): Promise<void> {
    await expect(this.errorContainer).not.toBeVisible();
  }

  /**
   * Get the text of the error message
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorContainer);
    return await this.getText(this.errorContainer);
  }

  /**
   * Verify that the error message contains specific text
   * @param expectedText - Expected error message text
   */
  async verifyErrorContains(expectedText: string): Promise<void> {
    await expect(this.errorContainer).toContainText(expectedText);
  }

  /**
   * Verify specific error message for invalid credentials
   */
  async verifyInvalidCredentialsError(): Promise<void> {
    await this.verifyErrorContains('이메일 또는 비밀번호');
    await this.verifyErrorContains('올바르지 않습니다');
  }

  /**
   * Verify specific error message for unconfirmed email
   */
  async verifyEmailNotConfirmedError(): Promise<void> {
    await this.verifyErrorContains('이메일 인증');
    await this.verifyErrorContains('완료되지 않았습니다');
  }

  // ===========================
  // Form State Methods
  // ===========================

  /**
   * Check if the email input is visible
   */
  async isEmailInputVisible(): Promise<boolean> {
    return await this.isVisible(this.emailInput);
  }

  /**
   * Check if the password input is visible
   */
  async isPasswordInputVisible(): Promise<boolean> {
    return await this.isVisible(this.passwordInput);
  }

  /**
   * Check if the submit button is enabled
   */
  async isSubmitButtonEnabled(): Promise<boolean> {
    return await this.submitButton.isEnabled();
  }

  /**
   * Get the current value of the email input
   */
  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  /**
   * Get the current value of the password input
   */
  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  /**
   * Check if the email input has the required attribute
   */
  async isEmailRequired(): Promise<boolean> {
    const required = await this.getAttribute(this.emailInput, 'required');
    return required !== null;
  }

  /**
   * Check if the password input has the required attribute
   */
  async isPasswordRequired(): Promise<boolean> {
    const required = await this.getAttribute(this.passwordInput, 'required');
    return required !== null;
  }

  // ===========================
  // Validation Methods
  // ===========================

  /**
   * Attempt to login with empty credentials
   * and verify validation is triggered
   */
  async loginWithEmptyCredentials(): Promise<void> {
    await this.clearForm();
    await this.clickSubmit();
  }

  /**
   * Attempt to login with invalid email format
   * @param invalidEmail - Invalid email address
   */
  async loginWithInvalidEmail(invalidEmail: string): Promise<void> {
    await this.fillEmail(invalidEmail);
    await this.fillPassword('anyPassword123');
    await this.clickSubmit();
  }

  /**
   * Attempt to login with correct email but wrong password
   * @param email - Valid email address
   * @param wrongPassword - Incorrect password
   */
  async loginWithWrongPassword(email: string, wrongPassword: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(wrongPassword);
    await this.clickSubmit();
  }

  // ===========================
  // Screenshot Methods
  // ===========================

  /**
   * Take a screenshot of the login form
   */
  async screenshotLoginForm(): Promise<Buffer> {
    return await this.screenshotElement(this.loginForm, 'login-form');
  }

  /**
   * Take a screenshot when an error is displayed
   */
  async screenshotError(): Promise<Buffer> {
    return await this.screenshotElement(this.errorContainer, 'login-error');
  }

  // ===========================
  // URL Verification
  // ===========================

  /**
   * Verify that current URL is the login page
   */
  async verifyUrl(): Promise<void> {
    await this.verifyUrl(this.url);
  }

  /**
   * Verify that user has been redirected after successful login
   * Usually redirects to home page or a specific redirect URL
   */
  async verifyRedirectAfterLogin(): Promise<void> {
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
    // Verify we're no longer on the login page
    await expect(this.page).not.toHaveURL(new RegExp(this.url));
  }
}
