import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Signup Page Object Model
 *
 * Represents the signup/registration page (/register) of the Konomads application.
 * Contains locators and methods for user registration actions.
 */
export class SignupPage extends BasePage {
  // ===========================
  // Page URL
  // ===========================
  readonly url = '/register';

  // ===========================
  // Page Title Locators
  // ===========================
  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;

  // ===========================
  // Form Locators
  // ===========================
  readonly signupForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly termsCheckbox: Locator;
  readonly privacyCheckbox: Locator;
  readonly submitButton: Locator;

  // ===========================
  // Error Message Locators
  // ===========================
  readonly errorMessage: Locator;
  readonly errorContainer: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  // ===========================
  // Validation Message Locators
  // ===========================
  readonly passwordHint: Locator;
  readonly passwordRequirements: Locator;

  // ===========================
  // Link Locators
  // ===========================
  readonly loginLink: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;
  readonly backToHomeLink: Locator;

  constructor(page: Page) {
    super(page);

    // Page Title
    this.pageTitle = page.locator('h1:has-text("회원가입"), h2:has-text("회원가입"), .card-header:has-text("회원가입")');
    this.pageSubtitle = page.locator('p:has-text("노마드코리아에서"), p:has-text("새로운 여정")');

    // Form Elements
    this.signupForm = page.locator('form');
    this.emailInput = page.locator('input[name="email"], input[type="email"], input[id="email"]');
    this.passwordInput = page.locator('input[name="password"], input[type="password"], input[id="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="password_confirmation"], input[id*="confirm"]');
    this.termsCheckbox = page.locator('input[name="terms"], input[type="checkbox"][id="terms"]');
    this.privacyCheckbox = page.locator('input[name="privacy"], input[type="checkbox"][id="privacy"]');
    this.submitButton = page.locator('button[type="submit"]:has-text("회원가입")');

    // Error Messages
    this.errorContainer = page.locator('div[class*="error"], div[role="alert"], .bg-red-50, .text-red-600');
    this.errorMessage = page.locator('div:has-text("이미 등록된 이메일"), div:has-text("비밀번호는")');
    this.emailError = page.locator('#email-error, [data-testid="email-error"]');
    this.passwordError = page.locator('#password-error, [data-testid="password-error"]');

    // Validation Messages
    this.passwordHint = page.locator('p:has-text("8자 이상"), .text-muted-foreground:has-text("자")');
    this.passwordRequirements = page.locator('[class*="password-requirements"], [data-testid="password-requirements"]');

    // Links
    this.loginLink = page.locator('a:has-text("로그인"), a[href="/login"]');
    this.termsLink = page.locator('a:has-text("이용약관"), a[href="/terms"]');
    this.privacyLink = page.locator('a:has-text("개인정보"), a[href="/privacy"]');
    this.backToHomeLink = page.locator('a[href="/"], a:has-text("홈")');
  }

  // ===========================
  // Navigation Methods
  // ===========================

  /**
   * Navigate to the signup page
   */
  async goto(): Promise<void> {
    await super.goto(this.url);
  }

  // ===========================
  // Form Action Methods
  // ===========================

  /**
   * Fill in the signup form and submit
   * @param email - User email address
   * @param password - User password
   * @param acceptTerms - Whether to accept terms (default: true)
   */
  async signup(email: string, password: string, acceptTerms: boolean = true): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);

    if (confirmPasswordInput) {
      await this.fillConfirmPassword(password);
    }

    if (acceptTerms) {
      await this.acceptTerms();
    }

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
   * Fill in the confirm password field
   * @param password - Password to confirm
   */
  async fillConfirmPassword(password: string): Promise<void> {
    const hasConfirmPassword = await this.confirmPasswordInput.count();
    if (hasConfirmPassword > 0) {
      await this.fill(this.confirmPasswordInput, password);
    }
  }

  /**
   * Click the submit button
   */
  async clickSubmit(): Promise<void> {
    await this.click(this.submitButton);
  }

  /**
   * Accept the terms and conditions checkbox
   */
  async acceptTerms(): Promise<void> {
    const isChecked = await this.termsCheckbox.isChecked();
    if (!isChecked) {
      await this.check(this.termsCheckbox);
    }
  }

  /**
   * Accept the privacy policy checkbox
   */
  async acceptPrivacy(): Promise<void> {
    const hasPrivacyCheckbox = await this.privacyCheckbox.count();
    if (hasPrivacyCheckbox > 0) {
      const isChecked = await this.privacyCheckbox.isChecked();
      if (!isChecked) {
        await this.check(this.privacyCheckbox);
      }
    }
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.clear(this.emailInput);
    await this.clear(this.passwordInput);

    const hasConfirmPassword = await this.confirmPasswordInput.count();
    if (hasConfirmPassword > 0) {
      await this.clear(this.confirmPasswordInput);
    }
  }

  // ===========================
  // Navigation Link Methods
  // ===========================

  /**
   * Click the login link to navigate to login page
   */
  async clickLoginLink(): Promise<void> {
    await this.click(this.loginLink);
  }

  /**
   * Click the terms of service link
   */
  async clickTermsLink(): Promise<void> {
    // Open in new tab to avoid losing form data
    await this.click(this.termsLink);
  }

  /**
   * Click the privacy policy link
   */
  async clickPrivacyLink(): Promise<void> {
    // Open in new tab to avoid losing form data
    await this.click(this.privacyLink);
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
   * Verify that the signup page is displayed
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
   * Verify specific error message for duplicate email
   */
  async verifyDuplicateEmailError(): Promise<void> {
    await this.verifyErrorContains('이미 등록된 이메일');
  }

  /**
   * Verify specific error message for weak password
   */
  async verifyWeakPasswordError(): Promise<void> {
    await this.verifyErrorContains('비밀번호');
    await this.verifyErrorContains('자 이상');
  }

  /**
   * Verify password requirements hint is visible
   */
  async verifyPasswordHintVisible(): Promise<boolean> {
    return await this.passwordHint.isVisible();
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
   * Check if the confirm password input is visible
   */
  async isConfirmPasswordVisible(): Promise<boolean> {
    const count = await this.confirmPasswordInput.count();
    return count > 0 && await this.isVisible(this.confirmPasswordInput);
  }

  /**
   * Check if the terms checkbox is visible
   */
  async isTermsCheckboxVisible(): Promise<boolean> {
    return await this.isVisible(this.termsCheckbox);
  }

  /**
   * Check if the submit button is enabled
   */
  async isSubmitButtonEnabled(): Promise<boolean> {
    return await this.submitButton.isEnabled();
  }

  /**
   * Check if the terms checkbox is checked
   */
  async isTermsChecked(): Promise<boolean> {
    return await this.termsCheckbox.isChecked();
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

  /**
   * Check if the terms checkbox has the required attribute
   */
  async isTermsRequired(): Promise<boolean> {
    const required = await this.getAttribute(this.termsCheckbox, 'required');
    return required !== null;
  }

  // ===========================
  // Validation Methods
  // ===========================

  /**
   * Attempt to signup with empty credentials
   * and verify validation is triggered
   */
  async signupWithEmptyCredentials(): Promise<void> {
    await this.clearForm();
    await this.clickSubmit();
  }

  /**
   * Attempt to signup with invalid email format
   * @param invalidEmail - Invalid email address
   * @param password - Any password
   */
  async signupWithInvalidEmail(invalidEmail: string, password: string): Promise<void> {
    await this.fillEmail(invalidEmail);
    await this.fillPassword(password);
    await this.acceptTerms();
    await this.clickSubmit();
  }

  /**
   * Attempt to signup with weak password
   * @param email - Valid email address
   * @param weakPassword - Weak password (less than 8 characters)
   */
  async signupWithWeakPassword(email: string, weakPassword: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(weakPassword);
    await this.acceptTerms();
    await this.clickSubmit();
  }

  /**
   * Attempt to signup without accepting terms
   * @param email - Valid email address
   * @param password - Valid password
   */
  async signupWithoutAcceptingTerms(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    // Don't accept terms
    await this.clickSubmit();
  }

  /**
   * Verify password meets minimum requirements
   * @param password - Password to validate
   */
  isPasswordValid(password: string): boolean {
    return password.length >= 8;
  }

  // ===========================
  // Screenshot Methods
  // ===========================

  /**
   * Take a screenshot of the signup form
   */
  async screenshotSignupForm(): Promise<Buffer> {
    return await this.screenshotElement(this.signupForm, 'signup-form');
  }

  /**
   * Take a screenshot when an error is displayed
   */
  async screenshotError(): Promise<Buffer> {
    return await this.screenshotElement(this.errorContainer, 'signup-error');
  }

  // ===========================
  // URL Verification
  // ===========================

  /**
   * Verify that current URL is the signup page
   */
  async verifyUrl(): Promise<void> {
    await this.verifyUrl(this.url);
  }

  /**
   * Verify that user has been redirected after successful signup
   * Usually redirects to home page or email confirmation page
   */
  async verifyRedirectAfterSignup(): Promise<void> {
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
    // Verify we're no longer on the signup page
    await expect(this.page).not.toHaveURL(new RegExp(this.url));
  }
}
