import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Post Form Page Object Model
 *
 * Represents the post creation/edit form page.
 * Provides methods for filling out and submitting post forms.
 */
export class PostFormPage extends BasePage {
  readonly page: Page;

  // ===========================
  // Selectors
  // ===========================

  // Form container
  readonly formContainer: Locator;
  readonly formTitle: Locator;

  // Basic info fields
  readonly titleInput: Locator;
  readonly contentTextarea: Locator;
  readonly categorySelect: Locator;
  readonly citySelect: Locator;

  // Rich text editor
  readonly editor: Locator;
  readonly boldButton: Locator;
  readonly italicButton: Locator;
  readonly linkButton: Locator;
  readonly imageButton: Locator;
  readonly codeBlockButton: Locator;
  readonly listButton: Locator;

  // Tags
  readonly tagsInput: Locator;
  readonly tagSuggestions: Locator;
  readonly selectedTags: Locator;
  readonly removeTagButton: Locator;

  // Image upload
  readonly imageInput: Locator;
  readonly imagePreview: Locator;
  readonly removeImageButton: Locator;

  // Attachments
  readonly attachmentInput: Locator;
  readonly attachmentList: Locator;
  readonly removeAttachmentButton: Locator;

  // Post settings
  readonly isPinnedToggle: Locator;
  readonly allowCommentsToggle: Locator;

  // Form actions
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly previewButton: Locator;
  readonly saveDraftButton: Locator;

  // Validation messages
  readonly validationErrors: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  // Character counter
  readonly characterCount: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Initialize selectors
    this.formContainer = page.locator('[data-testid="post-form"], form[data-testid="create-post"]');
    this.formTitle = page.locator('[data-testid="form-title"], .form-title, h1, h2');

    this.titleInput = page.locator('input[name="title"], [data-testid="title-input"]');
    this.contentTextarea = page.locator('textarea[name="content"], [data-testid="content-input"]');
    this.categorySelect = page.locator('select[name="category"], [data-testid="category-select"]');
    this.citySelect = page.locator('select[name="city"], [data-testid="city-select"]');

    // Rich text editor toolbar buttons
    this.editor = page.locator('[data-testid="editor"], .rich-text-editor, .editor-content');
    this.boldButton = page.locator('button[aria-label*="bold" i], button[data-action="bold"]');
    this.italicButton = page.locator('button[aria-label*="italic" i], button[data-action="italic"]');
    this.linkButton = page.locator('button[aria-label*="link" i], button[data-action="link"]');
    this.imageButton = page.locator('button[aria-label*="image" i], button[data-action="image"]');
    this.codeBlockButton = page.locator('button[aria-label*="code" i], button[data-action="code"]');
    this.listButton = page.locator('button[aria-label*="list" i], button[data-action="list"]');

    this.tagsInput = page.locator('input[name="tags"], [data-testid="tags-input"]');
    this.tagSuggestions = page.locator('[data-testid="tag-suggestions"], .tag-suggestions');
    this.selectedTags = page.locator('[data-testid="selected-tags"], .selected-tags .tag');
    this.removeTagButton = page.locator('.tag button, [data-testid="remove-tag"]');

    this.imageInput = page.locator('input[type="file"][accept*="image"], [data-testid="image-input"]');
    this.imagePreview = page.locator('[data-testid="image-preview"], .image-preview');
    this.removeImageButton = page.locator('button:has-text("제거"), button:has-text("Remove"), [data-testid="remove-image"]');

    this.attachmentInput = page.locator('input[type="file"][accept*="attachment"], [data-testid="attachment-input"]');
    this.attachmentList = page.locator('[data-testid="attachments"], .attachments-list');
    this.removeAttachmentButton = page.locator('.attachment button[aria-label*="remove" i]');

    this.isPinnedToggle = page.locator('input[type="checkbox"][name="is_pinned"], [data-testid="pinned-toggle"]');
    this.allowCommentsToggle = page.locator('input[type="checkbox"][name="allow_comments"], [data-testid="comments-toggle"]');

    this.submitButton = page.locator('button[type="submit"], button:has-text("게시"), button:has-text("작성"), button:has-text("Post")');
    this.cancelButton = page.locator('button:has-text("취소"), button:has-text("Cancel")');
    this.previewButton = page.locator('button:has-text("미리보기"), button:has-text("Preview")');
    this.saveDraftButton = page.locator('button:has-text("임시 저장"), button:has-text("Save Draft")');

    this.validationErrors = page.locator('.error-message, .validation-error, [data-testid="validation-error"]');
    this.successMessage = page.locator('.success-message, [data-testid="success-message"]');
    this.errorMessage = page.locator('.error-message, [data-testid="error-message"]');

    this.characterCount = page.locator('[data-testid="char-count"], .character-count');
  }

  // ===========================
  // Navigation
  // ===========================

  /**
   * Navigate to the create post page
   */
  async gotoCreate(): Promise<void> {
    await this.goto('/posts/create');
  }

  /**
   * Navigate to the edit post page
   * @param postId - Post ID to edit
   */
  async gotoEdit(postId: string): Promise<void> {
    await this.goto(`/posts/${postId}/edit`);
  }

  // ===========================
  // Form Filling - Basic Info
  // ===========================

  /**
   * Fill in the post title
   * @param title - Post title
   */
  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  /**
   * Fill in the post content using plain text
   * @param content - Post content
   */
  async fillContent(content: string): Promise<void> {
    await this.contentTextarea.fill(content);
  }

  /**
   * Fill in the post content using rich text editor
   * @param content - Post content (can include HTML)
   */
  async fillRichTextContent(content: string): Promise<void> {
    await this.editor.fill(content);
  }

  /**
   * Select a category
   * @param categoryName - Category name to select (e.g., '질문', '정보', '자유')
   */
  async selectCategory(categoryName: string): Promise<void> {
    await this.categorySelect.selectOption({ label: categoryName });
  }

  /**
   * Select a city
   * @param cityName - City name to select
   */
  async selectCity(cityName: string): Promise<void> {
    await this.citySelect.selectOption({ label: cityName });
  }

  // ===========================
  // Rich Text Editor Actions
  // ===========================

  /**
   * Format selected text as bold
   */
  async makeBold(): Promise<void> {
    await this.boldButton.click();
  }

  /**
   * Format selected text as italic
   */
  async makeItalic(): Promise<void> {
    await this.italicButton.click();
  }

  /**
   * Insert a link
   * @param url - URL to insert
   * @param text - Link text (optional)
   */
  async insertLink(url: string, text?: string): Promise<void> {
    await this.linkButton.click();
    // Assuming a modal or input appears
    const urlInput = this.page.locator('input[placeholder*="url" i], input[name="url"]');
    await urlInput.fill(url);
    if (text) {
      const textInput = this.page.locator('input[placeholder*="text" i], input[name="link-text"]');
      await textInput.fill(text);
    }
    await this.page.locator('button:has-text("확인"), button:has-text("Insert")').click();
  }

  /**
   * Insert an image
   * @param url - Image URL
   * @param alt - Alt text for the image
   */
  async insertImage(url: string, alt?: string): Promise<void> {
    await this.imageButton.click();
    const urlInput = this.page.locator('input[placeholder*="url" i], input[name="image-url"]');
    await urlInput.fill(url);
    if (alt) {
      const altInput = this.page.locator('input[placeholder*="alt" i], input[name="alt-text"]');
      await altInput.fill(alt);
    }
    await this.page.locator('button:has-text("확인"), button:has-text("Insert")').click();
  }

  /**
   * Insert a code block
   * @param code - Code content
   * @param language - Programming language (optional)
   */
  async insertCodeBlock(code: string, language?: string): Promise<void> {
    await this.codeBlockButton.click();
    const codeInput = this.page.locator('textarea[name="code"], .code-input');
    await codeInput.fill(code);
    if (language) {
      const langSelect = this.page.locator('select[name="language"], .language-select');
      await langSelect.selectOption(language);
    }
    await this.page.locator('button:has-text("확인"), button:has-text("Insert")').click();
  }

  /**
   * Insert a list
   * @param items - Array of list items
   */
  async insertList(items: string[]): Promise<void> {
    await this.listButton.click();
    for (const item of items) {
      await this.editor.press('Enter');
      await this.editor.type(item);
    }
  }

  // ===========================
  // Tags
  // ===========================

  /**
   * Add a tag to the post
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
  // Images and Attachments
  // ===========================

  /**
   * Upload a cover image for the post
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
   * Upload an attachment
   * @param filePath - Path to the attachment file
   */
  async uploadAttachment(filePath: string): Promise<void> {
    await this.attachmentInput.setInputFiles(filePath);
    await this.waitForNetworkIdle();
  }

  /**
   * Remove an attachment by index
   * @param index - Zero-based index of the attachment
   */
  async removeAttachment(index: number): Promise<void> {
    const attachments = await this.attachmentList.locator('.attachment').all();
    await attachments[index].locator(this.removeAttachmentButton).click();
  }

  // ===========================
  // Post Settings
  // ===========================

  /**
   * Set the post as pinned
   * @param pinned - Whether to pin the post
   */
  async setPinned(pinned: boolean = true): Promise<void> {
    if (pinned) {
      await this.isPinnedToggle.check();
    } else {
      await this.isPinnedToggle.uncheck();
    }
  }

  /**
   * Enable or disable comments
   * @param allow - Whether to allow comments
   */
  async setAllowComments(allow: boolean = true): Promise<void> {
    if (allow) {
      await this.allowCommentsToggle.check();
    } else {
      await this.allowCommentsToggle.uncheck();
    }
  }

  // ===========================
  // Form Actions
  // ===========================

  /**
   * Submit the form to create/update the post
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Save the post as a draft
   */
  async saveDraft(): Promise<void> {
    await this.saveDraftButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Cancel and return to the previous page
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Click the preview button to see how the post will look
   */
  async preview(): Promise<void> {
    await this.previewButton.click();
  }

  // ===========================
  // Complete Form Filling
  // ===========================

  /**
   * Fill in the complete post form with all fields
   * @param postData - Post data object
   */
  async fillPostForm(postData: {
    title: string;
    content: string;
    category: string;
    city?: string;
    tags?: string[];
    imageUrl?: string;
    attachments?: string[];
    isPinned?: boolean;
    allowComments?: boolean;
  }): Promise<void> {
    // Basic info
    await this.fillTitle(postData.title);
    await this.fillContent(postData.content);
    await this.selectCategory(postData.category);

    if (postData.city) {
      await this.selectCity(postData.city);
    }

    // Tags
    if (postData.tags && postData.tags.length > 0) {
      await this.addTags(postData.tags);
    }

    // Image
    if (postData.imageUrl) {
      await this.uploadImage(postData.imageUrl);
    }

    // Attachments
    if (postData.attachments && postData.attachments.length > 0) {
      for (const attachment of postData.attachments) {
        await this.uploadAttachment(attachment);
      }
    }

    // Settings
    if (postData.isPinned !== undefined) {
      await this.setPinned(postData.isPinned);
    }

    if (postData.allowComments !== undefined) {
      await this.setAllowComments(postData.allowComments);
    }
  }

  /**
   * Fill in only the required fields
   * @param postData - Minimal post data
   */
  async fillRequiredFields(postData: {
    title: string;
    content: string;
    category: string;
  }): Promise<void> {
    await this.fillTitle(postData.title);
    await this.fillContent(postData.content);
    await this.selectCategory(postData.category);
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
   * Verify the character count
   * @param expectedCount - Expected character count
   */
  async verifyCharacterCount(expectedCount: number): Promise<void> {
    const countText = await this.characterCount.textContent();
    const count = parseInt(countText?.match(/\d+/)?.[0] || '0', 10);
    expect(count).toBe(expectedCount);
  }

  /**
   * Verify that the image is uploaded
   */
  async verifyImageUploaded(): Promise<void> {
    await expect(this.imagePreview).toBeVisible();
  }

  /**
   * Verify that attachments are uploaded
   * @param expectedCount - Expected number of attachments
   */
  async verifyAttachmentsUploaded(expectedCount: number): Promise<void> {
    const count = await this.attachmentList.locator('.attachment').count();
    expect(count).toBe(expectedCount);
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
    await this.contentTextarea.fill('');
    await this.clearAllTags();
    await this.removeImage();
  }

  /**
   * Get the current form values
   */
  async getFormValues(): Promise<{
    title: string;
    content: string;
    category: string;
  }> {
    return {
      title: await this.titleInput.inputValue(),
      content: await this.contentTextarea.inputValue(),
      category: await this.categorySelect.inputValue(),
    };
  }

  /**
   * Type content with rich text formatting
   * @param text - Text to type
   * @param format - Optional formatting ('bold', 'italic', 'code')
   */
  async typeContent(text: string, format?: 'bold' | 'italic' | 'code'): Promise<void> {
    if (format === 'bold') {
      await this.makeBold();
    } else if (format === 'italic') {
      await this.makeItalic();
    } else if (format === 'code') {
      await this.insertCodeBlock(text);
    }

    await this.editor.type(text);
  }
}
