import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Forgot Password Page Object Model
 *
 * Represents the forgot password page (/forgot-password) of the Konomads application.
 * Contains locators and methods for password reset functionality.
 */
export class ForgotPasswordPage extends BasePage {
  // ===========================
  // Page URL
  // ===========================
  readonly url = '/forgot-password';

  // ===========================
  // Page Title Locators
  // ===========================
  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;

  // ===========================
  // Form Locators
  // ===========================
  readonly resetForm: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  // ===========================
  // Message Locators
  // ===========================
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly successContainer: Locator;
  readonly errorContainer: Locator;

  // ===========================
  // Link Locators
  // ===========================
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page);

    // Page Title
    this.pageTitle = page.locator('*:has-text("비밀번호 찾기")').first();
    this.pageSubtitle = page.locator('p:has-text("가입하신 이메일")');

    // Form Elements
    this.resetForm = page.locator('form');
    this.emailInput = page.locator('input[name="email"], input[type="email"], input[id="email"]');
    this.submitButton = page.locator('button[type="submit"]:has-text("비밀번호 재설정 링크 받기")');

    // Messages
    this.successContainer = page.locator('div:has-text("비밀번호 재설정 링크가 이메일로 발송되었습니다"), .bg-green-50, .text-green-600');
    this.errorContainer = page.locator('.bg-red-50, .text-red-600, [role="alert"]');
    this.successMessage = page.locator('div:has-text("발송되었습니다")');
    this.errorMessage = page.locator('div:has-text("가입된 계정을 찾을 수 없습니다")');

    // Links
    this.loginLink = page.locator('.card-footer a:has-text("로그인"), a.text-primary:has-text("로그인")');
  }

  // ===========================
  // Navigation Methods
  // ===========================

  /**
   * Navigate to the forgot password page
   */
  async goto(): Promise<void> {
    await super.goto(this.url);
  }

  // ===========================
  // Form Action Methods
  // ===========================

  /**
   * Fill in the email and submit password reset request
   * @param email - User email address
   */
  async requestReset(email: string): Promise<void> {
    await this.fillEmail(email);
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

  // ===========================
  // Navigation Link Methods
  // ===========================

  /**
   * Click the login link to navigate back to login
   */
  async clickLoginLink(): Promise<void> {
    await this.click(this.loginLink);
  }

  // ===========================
  // Verification Methods
  // ===========================

  /**
   * Verify that the forgot password page is displayed
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Verify that success message is displayed
   */
  async verifySuccessMessageVisible(): Promise<void> {
    await expect(this.successContainer).toBeVisible();
  }

  /**
   * Verify that error message is displayed
   */
  async verifyErrorMessageVisible(): Promise<void> {
    await expect(this.errorContainer).toBeVisible();
  }

  /**
   * Verify that the success message contains expected text
   * @param expectedText - Expected success message text
   */
  async verifySuccessContains(expectedText: string): Promise<void> {
    await expect(this.successContainer).toContainText(expectedText);
  }

  /**
   * Verify that the error message contains expected text
   * @param expectedText - Expected error message text
   */
  async verifyErrorContains(expectedText: string): Promise<void> {
    await expect(this.errorContainer).toContainText(expectedText);
  }

  /**
   * Get the text of the success message
   */
  async getSuccessMessage(): Promise<string> {
    await this.waitForVisible(this.successContainer);
    return await this.getText(this.successContainer);
  }

  /**
   * Get the text of the error message
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorContainer);
    return await this.getText(this.errorContainer);
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
   * Check if the email input has the required attribute
   */
  async isEmailRequired(): Promise<boolean> {
    const required = await this.getAttribute(this.emailInput, 'required');
    return required !== null;
  }

  // ===========================
  // Screenshot Methods
  // ===========================

  /**
   * Take a screenshot of the reset form
   */
  async screenshotForm(): Promise<Buffer> {
    return await this.screenshotElement(this.resetForm, 'forgot-password-form');
  }

  /**
   * Take a screenshot when success message is displayed
   */
  async screenshotSuccess(): Promise<Buffer> {
    return await this.screenshotElement(this.successContainer, 'forgot-password-success');
  }

  /**
   * Take a screenshot when error is displayed
   */
  async screenshotError(): Promise<Buffer> {
    return await this.screenshotElement(this.errorContainer, 'forgot-password-error');
  }
}
