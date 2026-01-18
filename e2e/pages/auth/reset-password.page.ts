import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Reset Password Page Object Model
 *
 * Represents the reset password page (/reset-password) of the Konomads application.
 * Contains locators and methods for updating user password.
 */
export class ResetPasswordPage extends BasePage {
  // ===========================
  // Page URL
  // ===========================
  readonly url = '/reset-password';

  // ===========================
  // Page Title Locators
  // ===========================
  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;

  // ===========================
  // Form Locators
  // ===========================
  readonly resetForm: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
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
    this.pageTitle = page.locator('*:has-text("비밀번호 재설정")').first();
    this.pageSubtitle = page.locator('p:has-text("새로운 비밀번호")');

    // Form Elements
    this.resetForm = page.locator('form');
    this.passwordInput = page.locator('input[name="password"], input[id="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"], input[id="confirmPassword"]');
    this.submitButton = page.locator('button[type="submit"]:has-text("비밀번호 변경")');

    // Messages
    this.successContainer = page.locator('.bg-green-50, .text-green-600');
    this.errorContainer = page.locator('.bg-red-50, .text-red-600, [role="alert"]');
    this.successMessage = page.locator('div:has-text("성공적으로")');
    this.errorMessage = page.locator('div:has-text("일치하지 않습니다"), div:has-text("최소 6자")');

    // Links
    this.loginLink = page.locator('.card-footer a:has-text("로그인"), a.text-primary:has-text("로그인")');
  }

  // ===========================
  // Navigation Methods
  // ===========================

  /**
   * Navigate to the reset password page
   */
  async goto(): Promise<void> {
    await super.goto(this.url);
  }

  // ===========================
  // Form Action Methods
  // ===========================

  /**
   * Fill in the password form and submit
   * @param password - New password
   * @param confirmPassword - Password confirmation
   */
  async resetPassword(password: string, confirmPassword: string): Promise<void> {
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword);
    await this.clickSubmit();
  }

  /**
   * Fill in the password field
   * @param password - New password
   */
  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  /**
   * Fill in the confirm password field
   * @param password - Password confirmation
   */
  async fillConfirmPassword(password: string): Promise<void> {
    await this.fill(this.confirmPasswordInput, password);
  }

  /**
   * Click the submit button
   */
  async clickSubmit(): Promise<void> {
    await this.click(this.submitButton);
  }

  /**
   * Clear the password field
   */
  async clearPassword(): Promise<void> {
    await this.clear(this.passwordInput);
  }

  /**
   * Clear the confirm password field
   */
  async clearConfirmPassword(): Promise<void> {
    await this.clear(this.confirmPasswordInput);
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.clearPassword();
    await this.clearConfirmPassword();
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
   * Verify that the reset password page is displayed
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
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
   * Verify that the error message contains password mismatch text
   */
  async verifyPasswordMismatchError(): Promise<void> {
    await expect(this.errorContainer).toContainText('일치하지 않습니다');
  }

  /**
   * Verify that the error message contains password too short text
   */
  async verifyPasswordTooShortError(): Promise<void> {
    await expect(this.errorContainer).toContainText('최소 6자');
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
   * Check if the password input is visible
   */
  async isPasswordInputVisible(): Promise<boolean> {
    return await this.isVisible(this.passwordInput);
  }

  /**
   * Check if the confirm password input is visible
   */
  async isConfirmPasswordInputVisible(): Promise<boolean> {
    return await this.isVisible(this.confirmPasswordInput);
  }

  /**
   * Check if the submit button is enabled
   */
  async isSubmitButtonEnabled(): Promise<boolean> {
    return await this.submitButton.isEnabled();
  }

  /**
   * Get the current value of the password input
   */
  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  /**
   * Get the current value of the confirm password input
   */
  async getConfirmPasswordValue(): Promise<string> {
    return await this.confirmPasswordInput.inputValue();
  }

  /**
   * Check if the password input has the minlength attribute
   */
  async getPasswordMinLength(): Promise<string | null> {
    return await this.getAttribute(this.passwordInput, 'minlength');
  }

  // ===========================
  // Screenshot Methods
  // ===========================

  /**
   * Take a screenshot of the reset form
   */
  async screenshotForm(): Promise<Buffer> {
    return await this.screenshotElement(this.resetForm, 'reset-password-form');
  }

  /**
   * Take a screenshot when success message is displayed
   */
  async screenshotSuccess(): Promise<Buffer> {
    return await this.screenshotElement(this.successContainer, 'reset-password-success');
  }

  /**
   * Take a screenshot when error is displayed
   */
  async screenshotError(): Promise<Buffer> {
    return await this.screenshotElement(this.errorContainer, 'reset-password-error');
  }
}
