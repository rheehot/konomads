import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Profile Edit Page Object Model
 *
 * Represents the profile edit form page where users can update
 * their profile information.
 */
export class ProfileEditPage extends BasePage {
  readonly page: Page;

  // ===========================
  // Selectors
  // ===========================

  // Form container
  readonly formContainer: Locator;
  readonly formTitle: Locator;

  // Avatar section
  readonly avatarContainer: Locator;
  readonly avatarImage: Locator;
  readonly avatarUploadButton: Locator;
  readonly avatarRemoveButton: Locator;
  readonly avatarInput: Locator;

  // Basic info fields
  readonly fullNameInput: Locator;
  readonly usernameInput: Locator;
  readonly bioTextarea: Locator;
  readonly locationInput: Locator;
  readonly websiteInput: Locator;

  // Contact info
  readonly emailInput: Locator;
  readonly phoneInput: Locator;

  // Social links
  readonly githubInput: Locator;
  readonly linkedinInput: Locator;
  readonly twitterInput: Locator;
  readonly instagramInput: Locator;

  // Privacy settings
  readonly emailVisibilityToggle: Locator;
  readonly profileVisibilitySelect: Locator;
  readonly messageToggle: Locator;

  // Notification settings
  readonly emailNotificationsToggle: Locator;
  readonly pushNotificationsToggle: Locator;

  // Form actions
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly previewButton: Locator;
  readonly deleteAccountButton: Locator;

  // Validation messages
  readonly validationErrors: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  // Character counters
  readonly bioCharacterCount: Locator;
  readonly usernameCharacterCount: Locator;

  // Avatar preview modal
  readonly avatarPreviewModal: Locator;
  readonly cropButton: Locator;
  readonly rotateButton: Locator;
  readonly zoomSlider: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Initialize selectors
    this.formContainer = page.locator('[data-testid="profile-edit-form"], form[data-testid="edit-profile"]');
    this.formTitle = page.locator('[data-testid="form-title"], .form-title, h1, h2');

    this.avatarContainer = page.locator('[data-testid="avatar-container"], .avatar-container');
    this.avatarImage = page.locator('[data-testid="avatar-image"], .avatar-image img');
    this.avatarUploadButton = page.locator('button:has-text("변경"), button:has-text("Change"), [data-testid="upload-avatar"]');
    this.avatarRemoveButton = page.locator('button:has-text("제거"), button:has-text("Remove"), [data-testid="remove-avatar"]');
    this.avatarInput = page.locator('input[type="file"][accept*="image"], [data-testid="avatar-input"]');

    this.fullNameInput = page.locator('input[name="full_name"], [data-testid="full-name-input"]');
    this.usernameInput = page.locator('input[name="username"], [data-testid="username-input"]');
    this.bioTextarea = page.locator('textarea[name="bio"], [data-testid="bio-input"]');
    this.locationInput = page.locator('input[name="location"], [data-testid="location-input"]');
    this.websiteInput = page.locator('input[name="website"], [data-testid="website-input"]');

    this.emailInput = page.locator('input[name="email"], [data-testid="email-input"]');
    this.phoneInput = page.locator('input[name="phone"], [data-testid="phone-input"]');

    this.githubInput = page.locator('input[name="github"], [data-testid="github-input"]');
    this.linkedinInput = page.locator('input[name="linkedin"], [data-testid="linkedin-input"]');
    this.twitterInput = page.locator('input[name="twitter"], [data-testid="twitter-input"]');
    this.instagramInput = page.locator('input[name="instagram"], [data-testid="instagram-input"]');

    this.emailVisibilityToggle = page.locator('input[type="checkbox"][name="show_email"], [data-testid="email-visibility-toggle"]');
    this.profileVisibilitySelect = page.locator('select[name="profile_visibility"], [data-testid="visibility-select"]');
    this.messageToggle = page.locator('input[type="checkbox"][name="allow_messages"], [data-testid="message-toggle"]');

    this.emailNotificationsToggle = page.locator('input[type="checkbox"][name="email_notifications"], [data-testid="email-notifications-toggle"]');
    this.pushNotificationsToggle = page.locator('input[type="checkbox"][name="push_notifications"], [data-testid="push-notifications-toggle"]');

    this.saveButton = page.locator('button[type="submit"], button:has-text("저장"), button:has-text("Save")');
    this.cancelButton = page.locator('button:has-text("취소"), button:has-text("Cancel")');
    this.previewButton = page.locator('button:has-text("미리보기"), button:has-text("Preview")');
    this.deleteAccountButton = page.locator('button:has-text("계정 삭제"), button:has-text("Delete Account"), button.danger');

    this.validationErrors = page.locator('.error-message, .validation-error, [data-testid="validation-error"]');
    this.successMessage = page.locator('.success-message, [data-testid="success-message"]');
    this.errorMessage = page.locator('.error-message, [data-testid="error-message"]');

    this.bioCharacterCount = page.locator('[data-testid="bio-char-count"], .bio-input + .character-count');
    this.usernameCharacterCount = page.locator('[data-testid="username-char-count"], .username-input + .character-count');

    this.avatarPreviewModal = page.locator('[data-testid="avatar-preview-modal"], .avatar-preview-modal, [role="dialog"]');
    this.cropButton = page.locator('button:has-text("자르기"), button:has-text("Crop")');
    this.rotateButton = page.locator('button:has-text("회전"), button:has-text("Rotate")');
    this.zoomSlider = page.locator('input[type="range"], .zoom-slider');
  }

  // ===========================
  // Navigation
  // ===========================

  /**
   * Navigate to the profile edit page
   */
  async goto(): Promise<void> {
    await this.goto('/profile/edit');
  }

  // ===========================
  // Avatar Management
  // ===========================

  /**
   * Upload a new avatar image
   * @param filePath - Path to the image file
   */
  async uploadAvatar(filePath: string): Promise<void> {
    await this.avatarUploadButton.click();
    await this.avatarInput.setInputFiles(filePath);
    await this.waitForNetworkIdle();
  }

  /**
   * Remove the current avatar
   */
  async removeAvatar(): Promise<void> {
    await this.avatarRemoveButton.click();
    // Confirm removal if there's a confirmation dialog
    const confirmButton = this.page.locator('button:has-text("확인"), button:has-text("Confirm")');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    await this.waitForNetworkIdle();
  }

  /**
   * Click on the avatar to upload (alternative method)
   */
  async clickAvatarUpload(): Promise<void> {
    await this.avatarImage.click();
  }

  /**
   * Crop the uploaded avatar
   */
  async cropAvatar(): Promise<void> {
    if (await this.avatarPreviewModal.isVisible()) {
      await this.cropButton.click();
    }
  }

  /**
   * Rotate the avatar
   * @param times - Number of 90-degree rotations (default: 1)
   */
  async rotateAvatar(times: number = 1): Promise<void> {
    if (await this.avatarPreviewModal.isVisible()) {
      for (let i = 0; i < times; i++) {
        await this.rotateButton.click();
      }
    }
  }

  /**
   * Zoom the avatar
   * @param level - Zoom level (0-100)
   */
  async zoomAvatar(level: number): Promise<void> {
    if (await this.avatarPreviewModal.isVisible()) {
      await this.zoomSlider.fill(level.toString());
    }
  }

  // ===========================
  // Basic Information
  // ===========================

  /**
   * Fill in the full name
   * @param fullName - Full name
   */
  async fillFullName(fullName: string): Promise<void> {
    await this.fullNameInput.fill(fullName);
  }

  /**
   * Fill in the username
   * @param username - Username
   */
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Fill in the bio
   * @param bio - Bio text
   */
  async fillBio(bio: string): Promise<void> {
    await this.bioTextarea.fill(bio);
  }

  /**
   * Fill in the location
   * @param location - Location text
   */
  async fillLocation(location: string): Promise<void> {
    await this.locationInput.fill(location);
  }

  /**
   * Fill in the website URL
   * @param website - Website URL
   */
  async fillWebsite(website: string): Promise<void> {
    await this.websiteInput.fill(website);
  }

  // ===========================
  // Contact Information
  // ===========================

  /**
   * Fill in the email
   * @param email - Email address
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill in the phone number
   * @param phone - Phone number
   */
  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  // ===========================
  // Social Links
  // ===========================

  /**
   * Fill in the GitHub username
   * @param username - GitHub username
   */
  async fillGithub(username: string): Promise<void> {
    await this.githubInput.fill(username);
  }

  /**
   * Fill in the LinkedIn profile URL
   * @param url - LinkedIn profile URL
   */
  async fillLinkedin(url: string): Promise<void> {
    await this.linkedinInput.fill(url);
  }

  /**
   * Fill in the Twitter username
   * @param username - Twitter username
   */
  async fillTwitter(username: string): Promise<void> {
    await this.twitterInput.fill(username);
  }

  /**
   * Fill in the Instagram username
   * @param username - Instagram username
   */
  async fillInstagram(username: string): Promise<void> {
    await this.instagramInput.fill(username);
  }

  /**
   * Fill all social media links
   * @param socialLinks - Object containing social media links
   */
  async fillSocialLinks(socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  }): Promise<void> {
    if (socialLinks.github) await this.fillGithub(socialLinks.github);
    if (socialLinks.linkedin) await this.fillLinkedin(socialLinks.linkedin);
    if (socialLinks.twitter) await this.fillTwitter(socialLinks.twitter);
    if (socialLinks.instagram) await this.fillInstagram(socialLinks.instagram);
  }

  // ===========================
  // Privacy Settings
  // ===========================

  /**
   * Set email visibility
   * @param visible - Whether email should be visible
   */
  async setEmailVisibility(visible: boolean = true): Promise<void> {
    if (visible) {
      await this.emailVisibilityToggle.check();
    } else {
      await this.emailVisibilityToggle.uncheck();
    }
  }

  /**
   * Set profile visibility
   * @param visibility - Visibility level ('public', 'followers', 'private')
   */
  async setProfileVisibility(visibility: 'public' | 'followers' | 'private'): Promise<void> {
    await this.profileVisibilitySelect.selectOption(visibility);
  }

  /**
   * Allow or disallow messages
   * @param allow - Whether to allow messages
   */
  async setAllowMessages(allow: boolean = true): Promise<void> {
    if (allow) {
      await this.messageToggle.check();
    } else {
      await this.messageToggle.uncheck();
    }
  }

  // ===========================
  // Notification Settings
  // ===========================

  /**
   * Enable or disable email notifications
   * @param enabled - Whether to enable email notifications
   */
  async setEmailNotifications(enabled: boolean = true): Promise<void> {
    if (enabled) {
      await this.emailNotificationsToggle.check();
    } else {
      await this.emailNotificationsToggle.uncheck();
    }
  }

  /**
   * Enable or disable push notifications
   * @param enabled - Whether to enable push notifications
   */
  async setPushNotifications(enabled: boolean = true): Promise<void> {
    if (enabled) {
      await this.pushNotificationsToggle.check();
    } else {
      await this.pushNotificationsToggle.uncheck();
    }
  }

  // ===========================
  // Form Actions
  // ===========================

  /**
   * Save the profile changes
   */
  async save(): Promise<void> {
    await this.saveButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Cancel and return to profile
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Preview the profile
   */
  async preview(): Promise<void> {
    await this.previewButton.click();
  }

  /**
   * Click the delete account button
   */
  async clickDeleteAccount(): Promise<void> {
    await this.deleteAccountButton.click();
  }

  // ===========================
  // Complete Form Filling
  // ===========================

  /**
   * Fill in the complete profile form
   * @param profileData - Profile data object
   */
  async fillProfileForm(profileData: {
    fullName?: string;
    username?: string;
    bio?: string;
    location?: string;
    website?: string;
    email?: string;
    phone?: string;
    socialLinks?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      instagram?: string;
    };
    avatarPath?: string;
  }): Promise<void> {
    // Basic info
    if (profileData.fullName) await this.fillFullName(profileData.fullName);
    if (profileData.username) await this.fillUsername(profileData.username);
    if (profileData.bio) await this.fillBio(profileData.bio);
    if (profileData.location) await this.fillLocation(profileData.location);
    if (profileData.website) await this.fillWebsite(profileData.website);

    // Contact info
    if (profileData.email) await this.fillEmail(profileData.email);
    if (profileData.phone) await this.fillPhone(profileData.phone);

    // Social links
    if (profileData.socialLinks) {
      await this.fillSocialLinks(profileData.socialLinks);
    }

    // Avatar
    if (profileData.avatarPath) {
      await this.uploadAvatar(profileData.avatarPath);
    }
  }

  /**
   * Fill in only the required fields
   * @param profileData - Minimal profile data
   */
  async fillRequiredFields(profileData: {
    fullName: string;
    username: string;
  }): Promise<void> {
    await this.fillFullName(profileData.fullName);
    await this.fillUsername(profileData.username);
  }

  // ===========================
  // Assertion Methods
  // ===========================

  /**
   * Verify that the form is displayed
   */
  async verifyFormDisplayed(): Promise<void> {
    await expect(this.formContainer).toBeVisible();
  }

  /**
   * Verify that a specific field has an error
   * @param fieldName - Name of the field
   */
  async verifyFieldError(fieldName: string): Promise<void> {
    const fieldError = this.validationErrors.filter({ hasText: fieldName });
    await expect(fieldError).toBeVisible();
  }

  /**
   * Verify that the form has validation errors
   */
  async verifyHasValidationErrors(): Promise<void> {
    await expect(this.validationErrors.first()).toBeVisible();
  }

  /**
   * Verify that the profile was saved successfully
   */
  async verifySavedSuccessfully(): Promise<void> {
    await expect(this.successMessage).toBeVisible();
  }

  /**
   * Verify that an error message is displayed
   * @param expectedMessage - Expected error message
   */
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  /**
   * Verify the character count for bio
   * @param expectedCount - Expected character count
   */
  async verifyBioCharacterCount(expectedCount: number): Promise<void> {
    const countText = await this.bioCharacterCount.textContent();
    const count = parseInt(countText?.match(/\d+/)?.[0] || '0', 10);
    expect(count).toBe(expectedCount);
  }

  /**
   * Verify the character count for username
   * @param expectedCount - Expected character count
   */
  async verifyUsernameCharacterCount(expectedCount: number): Promise<void> {
    const countText = await this.usernameCharacterCount.textContent();
    const count = parseInt(countText?.match(/\d+/)?.[0] || '0', 10);
    expect(count).toBe(expectedCount);
  }

  /**
   * Verify that a field has a specific value
   * @param field - Field locator
   * @param expectedValue - Expected value
   */
  async verifyFieldValue(field: Locator, expectedValue: string): Promise<void> {
    await expect(field).toHaveValue(expectedValue);
  }

  /**
   * Verify that the avatar is uploaded
   */
  async verifyAvatarUploaded(): Promise<void> {
    await expect(this.avatarImage).toBeVisible();
  }

  /**
   * Verify that a toggle is checked
   * @param toggle - Toggle locator
   */
  async verifyToggleChecked(toggle: Locator): Promise<void> {
    await expect(toggle).toBeChecked();
  }

  // ===========================
  // Utility Methods
  // ===========================

  /**
   * Get all validation error messages
   */
  async getValidationErrors(): Promise<string[]> {
    const errors: string[] = [];
    const errorElements = await this.validationErrors.all();

    for (const error of errorElements) {
      const text = await error.textContent();
      if (text) errors.push(text);
    }

    return errors;
  }

  /**
   * Clear the entire form
   */
  async clearForm(): Promise<void> {
    await this.fullNameInput.fill('');
    await this.usernameInput.fill('');
    await this.bioTextarea.fill('');
    await this.locationInput.fill('');
    await this.websiteInput.fill('');
    await this.emailInput.fill('');
    await this.phoneInput.fill('');
    await this.githubInput.fill('');
    await this.linkedinInput.fill('');
    await this.twitterInput.fill('');
    await this.instagramInput.fill('');
  }

  /**
   * Get the current form values
   */
  async getFormValues(): Promise<{
    fullName: string;
    username: string;
    bio: string;
    location: string;
    website: string;
  }> {
    return {
      fullName: await this.fullNameInput.inputValue(),
      username: await this.usernameInput.inputValue(),
      bio: await this.bioTextarea.inputValue(),
      location: await this.locationInput.inputValue(),
      website: await this.websiteInput.inputValue(),
    };
  }

  /**
   * Wait for the avatar upload to complete
   */
  async waitForAvatarUpload(): Promise<void> {
    await this.waitForNetworkIdle();
    await expect(this.avatarImage).toBeVisible();
  }
}
