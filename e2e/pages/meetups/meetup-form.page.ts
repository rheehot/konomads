import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Meetup Form Page Object Model
 *
 * Represents the meetup creation/edit form page.
 * Provides methods for filling out and submitting meetup forms.
 */
export class MeetupFormPage extends BasePage {
  readonly page: Page;

  // ===========================
  // Selectors
  // ===========================

  // Form container
  readonly formContainer: Locator;
  readonly formTitle: Locator;

  // Basic info fields
  readonly titleInput: Locator;
  readonly descriptionTextarea: Locator;
  readonly citySelect: Locator;
  readonly locationInput: Locator;

  // Date and time fields
  readonly dateInput: Locator;
  readonly timeInput: Locator;
  readonly durationInput: Locator;
  readonly timezoneSelect: Locator;

  // Participant fields
  readonly maxParticipantsInput: Locator;
  readonly participantLimitToggle: Locator;

  // Image upload
  readonly imageInput: Locator;
  readonly imagePreview: Locator;
  readonly removeImageButton: Locator;
  readonly uploadImageButton: Locator;

  // Tags
  readonly tagsInput: Locator;
  readonly tagSuggestions: Locator;
  readonly selectedTags: Locator;
  readonly removeTagButton: Locator;

  // Additional settings
  readonly statusSelect: Locator;
  readonly isOnlineToggle: Locator;
  readonly meetingUrlInput: Locator;

  // Form actions
  readonly submitButton: Locator;
  readonly saveAsDraftButton: Locator;
  readonly cancelButton: Locator;
  readonly previewButton: Locator;

  // Validation messages
  readonly validationErrors: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Initialize selectors
    this.formContainer = page.locator('[data-testid="meetup-form"], form[data-testid="create-meetup"]');
    this.formTitle = page.locator('[data-testid="form-title"], .form-title, h1, h2');

    this.titleInput = page.locator('input[name="title"], [data-testid="title-input"]');
    this.descriptionTextarea = page.locator('textarea[name="description"], [data-testid="description-input"]');
    this.citySelect = page.locator('select[name="city"], [data-testid="city-select"]');
    this.locationInput = page.locator('input[name="location"], [data-testid="location-input"]');

    this.dateInput = page.locator('input[type="date"], input[name="date"], [data-testid="date-input"]');
    this.timeInput = page.locator('input[type="time"], input[name="time"], [data-testid="time-input"]');
    this.durationInput = page.locator('input[name="duration"], [data-testid="duration-input"]');
    this.timezoneSelect = page.locator('select[name="timezone"], [data-testid="timezone-select"]');

    this.maxParticipantsInput = page.locator('input[name="max_participants"], [data-testid="max-participants"]');
    this.participantLimitToggle = page.locator('input[type="checkbox"][name="has_limit"], [data-testid="limit-toggle"]');

    this.imageInput = page.locator('input[type="file"][accept*="image"], [data-testid="image-input"]');
    this.imagePreview = page.locator('[data-testid="image-preview"], .image-preview');
    this.removeImageButton = page.locator('button:has-text("제거"), button:has-text("Remove"), [data-testid="remove-image"]');
    this.uploadImageButton = page.locator('button:has-text("업로드"), button:has-text("Upload"), [data-testid="upload-image"]');

    this.tagsInput = page.locator('input[name="tags"], [data-testid="tags-input"]');
    this.tagSuggestions = page.locator('[data-testid="tag-suggestions"], .tag-suggestions');
    this.selectedTags = page.locator('[data-testid="selected-tags"], .selected-tags .tag');
    this.removeTagButton = page.locator('.tag button, [data-testid="remove-tag"]');

    this.statusSelect = page.locator('select[name="status"], [data-testid="status-select"]');
    this.isOnlineToggle = page.locator('input[type="checkbox"][name="is_online"], [data-testid="online-toggle"]');
    this.meetingUrlInput = page.locator('input[name="meeting_url"], [data-testid="meeting-url"]');

    this.submitButton = page.locator('button[type="submit"], button:has-text("만들기"), button:has-text("저장"), button:has-text("Create")');
    this.saveAsDraftButton = page.locator('button:has-text("임시 저장"), button:has-text("Save Draft")');
    this.cancelButton = page.locator('button:has-text("취소"), button:has-text("Cancel")');
    this.previewButton = page.locator('button:has-text("미리보기"), button:has-text("Preview")');

    this.validationErrors = page.locator('.error-message, .validation-error, [data-testid="validation-error"]');
    this.successMessage = page.locator('.success-message, [data-testid="success-message"]');
    this.errorMessage = page.locator('.error-message, [data-testid="error-message"]');
  }

  // ===========================
  // Navigation
  // ===========================

  /**
   * Navigate to the create meetup page
   */
  async gotoCreate(): Promise<void> {
    await this.goto('/meetups/create');
  }

  /**
   * Navigate to the edit meetup page
   * @param meetupId - Meetup ID to edit
   */
  async gotoEdit(meetupId: string): Promise<void> {
    await this.goto(`/meetups/${meetupId}/edit`);
  }

  // ===========================
  // Form Filling - Basic Info
  // ===========================

  /**
   * Fill in the meetup title
   * @param title - Meetup title
   */
  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  /**
   * Fill in the meetup description
   * @param description - Meetup description
   */
  async fillDescription(description: string): Promise<void> {
    await this.descriptionTextarea.fill(description);
  }

  /**
   * Select a city
   * @param cityName - City name to select
   */
  async selectCity(cityName: string): Promise<void> {
    await this.citySelect.selectOption({ label: cityName });
  }

  /**
   * Fill in the location
   * @param location - Physical location address
   */
  async fillLocation(location: string): Promise<void> {
    await this.locationInput.fill(location);
  }

  // ===========================
  // Form Filling - Date and Time
  // ===========================

  /**
   * Set the meetup date
   * @param date - Date string in YYYY-MM-DD format
   */
  async setDate(date: string): Promise<void> {
    await this.dateInput.fill(date);
  }

  /**
   * Set the meetup time
   * @param time - Time string in HH:MM format
   */
  async setTime(time: string): Promise<void> {
    await this.timeInput.fill(time);
  }

  /**
   * Set the meetup duration
   * @param hours - Duration in hours
   * @param minutes - Duration in minutes (optional)
   */
  async setDuration(hours: number, minutes: number = 0): Promise<void> {
    const duration = `${hours}h ${minutes}m`;
    await this.durationInput.fill(duration);
  }

  /**
   * Set the timezone
   * @param timezone - Timezone identifier (e.g., 'Asia/Seoul')
   */
  async setTimezone(timezone: string): Promise<void> {
    await this.timezoneSelect.selectOption(timezone);
  }

  /**
   * Set date and time using a Date object
   * @param date - Date object
   */
  async setDateTime(date: Date): Promise<void> {
    const isoString = date.toISOString();
    const datePart = isoString.split('T')[0];
    const timePart = isoString.split('T')[1].substring(0, 5);

    await this.setDate(datePart);
    await this.setTime(timePart);
  }

  // ===========================
  // Form Filling - Participants
  // ===========================

  /**
   * Set the maximum number of participants
   * @param maxParticipants - Maximum number of participants
   */
  async setMaxParticipants(maxParticipants: number): Promise<void> {
    // Check if we need to enable the limit first
    const limitToggle = await this.participantLimitToggle;
    const isChecked = await limitToggle.isChecked();

    if (!isChecked) {
      await limitToggle.check();
    }

    await this.maxParticipantsInput.fill(maxParticipants.toString());
  }

  /**
   * Remove participant limit (unlimited participants)
   */
  async removeParticipantLimit(): Promise<void> {
    const limitToggle = await this.participantLimitToggle;
    const isChecked = await limitToggle.isChecked();

    if (isChecked) {
      await limitToggle.uncheck();
    }
  }

  // ===========================
  // Form Filling - Image Upload
  // ===========================

  /**
   * Upload an image for the meetup
   * @param filePath - Path to the image file
   */
  async uploadImage(filePath: string): Promise<void> {
    await this.imageInput.setInputFiles(filePath);
    await this.waitForVisible(this.imagePreview);
  }

  /**
   * Remove the uploaded image
   */
  async removeImage(): Promise<void> {
    await this.removeImageButton.click();
  }

  /**
   * Click the upload image button (triggers file picker)
   */
  async clickUploadImage(): Promise<void> {
    await this.uploadImageButton.click();
  }

  // ===========================
  // Form Filling - Tags
  // ===========================

  /**
   * Add a tag to the meetup
   * @param tag - Tag text to add
   */
  async addTag(tag: string): Promise<void> {
    await this.tagsInput.fill(tag);
    await this.page.keyboard.press('Enter');
    await this.waitForNetworkIdle();
  }

  /**
   * Add multiple tags
   * @param tags - Array of tag strings
   */
  async addTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.addTag(tag);
    }
  }

  /**
   * Remove a tag by its text
   * @param tag - Tag text to remove
   */
  async removeTag(tag: string): Promise<void> {
    const tagElement = this.selectedTags.filter({ hasText: tag });
    await tagElement.locator(this.removeTagButton).click();
  }

  /**
   * Clear all tags
   */
  async clearAllTags(): Promise<void> {
    const tags = await this.selectedTags.all();
    for (const tag of tags) {
      await tag.locator(this.removeTagButton).click();
    }
  }

  /**
   * Select a tag from suggestions
   * @param tag - Tag text to select from suggestions
   */
  async selectTagFromSuggestions(tag: string): Promise<void> {
    await this.tagsInput.fill(tag);
    await this.tagSuggestions.locator(`text=${tag}`).click();
  }

  // ===========================
  // Form Filling - Settings
  // ===========================

  /**
   * Set the meetup status
   * @param status - Status value (e.g., 'open', 'draft', 'closed')
   */
  async setStatus(status: string): Promise<void> {
    await this.statusSelect.selectOption(status);
  }

  /**
   * Set as online meetup
   * @param isOnline - Whether the meetup is online
   */
  async setOnline(isOnline: boolean = true): Promise<void> {
    if (isOnline) {
      await this.isOnlineToggle.check();
    } else {
      await this.isOnlineToggle.uncheck();
    }
  }

  /**
   * Set the meeting URL for online meetups
   * @param url - Meeting URL (Zoom, Google Meet, etc.)
   */
  async setMeetingUrl(url: string): Promise<void> {
    await this.meetingUrlInput.fill(url);
  }

  // ===========================
  // Form Actions
  // ===========================

  /**
   * Submit the form to create/update the meetup
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Save the meetup as a draft
   */
  async saveAsDraft(): Promise<void> {
    await this.saveAsDraftButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Cancel and return to the previous page
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Click the preview button to see how the meetup will look
   */
  async preview(): Promise<void> {
    await this.previewButton.click();
  }

  // ===========================
  // Complete Form Filling
  // ===========================

  /**
   * Fill in the complete meetup form with all required fields
   * @param meetupData - Meetup data object
   */
  async fillMeetupForm(meetupData: {
    title: string;
    description: string;
    city: string;
    location: string;
    date: string;
    time: string;
    maxParticipants?: number;
    tags?: string[];
    imageUrl?: string;
    isOnline?: boolean;
    meetingUrl?: string;
  }): Promise<void> {
    // Basic info
    await this.fillTitle(meetupData.title);
    await this.fillDescription(meetupData.description);
    await this.selectCity(meetupData.city);
    await this.fillLocation(meetupData.location);

    // Date and time
    await this.setDate(meetupData.date);
    await this.setTime(meetupData.time);

    // Participants
    if (meetupData.maxParticipants) {
      await this.setMaxParticipants(meetupData.maxParticipants);
    } else {
      await this.removeParticipantLimit();
    }

    // Tags
    if (meetupData.tags && meetupData.tags.length > 0) {
      await this.addTags(meetupData.tags);
    }

    // Image
    if (meetupData.imageUrl) {
      await this.uploadImage(meetupData.imageUrl);
    }

    // Online meeting
    if (meetupData.isOnline) {
      await this.setOnline(true);
      if (meetupData.meetingUrl) {
        await this.setMeetingUrl(meetupData.meetingUrl);
      }
    }
  }

  /**
   * Fill in only the required fields
   * @param meetupData - Minimal meetup data
   */
  async fillRequiredFields(meetupData: {
    title: string;
    description: string;
    city: string;
    date: string;
    time: string;
  }): Promise<void> {
    await this.fillTitle(meetupData.title);
    await this.fillDescription(meetupData.description);
    await this.selectCity(meetupData.city);
    await this.setDate(meetupData.date);
    await this.setTime(meetupData.time);
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
   * Verify that the form submitted successfully
   */
  async verifySubmittedSuccessfully(): Promise<void> {
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
   * Verify that a field has a specific value
   * @param selector - Field selector
   * @param expectedValue - Expected value
   */
  async verifyFieldValue(selector: Locator, expectedValue: string): Promise<void> {
    await expect(selector).toHaveValue(expectedValue);
  }

  /**
   * Verify that the submit button is disabled
   */
  async verifySubmitDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  /**
   * Verify that tags are selected
   * @param expectedTags - Expected tags
   */
  async verifyTagsSelected(expectedTags: string[]): Promise<void> {
    const count = await this.selectedTags.count();
    expect(count).toBe(expectedTags.length);

    for (const tag of expectedTags) {
      await expect(this.selectedTags.filter({ hasText: tag })).toBeVisible();
    }
  }

  /**
   * Verify that the image is uploaded
   */
  async verifyImageUploaded(): Promise<void> {
    await expect(this.imagePreview).toBeVisible();
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
    await this.titleInput.fill('');
    await this.descriptionTextarea.fill('');
    await this.locationInput.fill('');
    await this.clearAllTags();
    await this.removeImage();
  }

  /**
   * Get the current form values
   */
  async getFormValues(): Promise<{
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
  }> {
    return {
      title: await this.titleInput.inputValue(),
      description: await this.descriptionTextarea.inputValue(),
      location: await this.locationInput.inputValue(),
      date: await this.dateInput.inputValue(),
      time: await this.timeInput.inputValue(),
    };
  }
}
