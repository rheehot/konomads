import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Avatar Upload Component Object Model
 *
 * Reusable component for handling avatar uploads across the application.
 * This can be used in profile edit, settings, or any page with avatar upload.
 */
export class AvatarUploadComponent extends BasePage {
  readonly page: Page;

  // ===========================
  // Selectors
  // ===========================

  // Avatar container and elements
  readonly container: Locator;
  readonly avatarImage: Locator;
  readonly defaultAvatar: Locator;
  readonly uploadButton: Locator;
  readonly removeButton: Locator;
  readonly fileInput: Locator;

  // Upload modal/dialog
  readonly uploadModal: Locator;
  readonly previewImage: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly cropArea: Locator;

  // Editing tools
  readonly rotateButton: Locator;
  readonly flipHorizontalButton: Locator;
  readonly flipVerticalButton: Locator;
  readonly zoomInButton: Locator;
  readonly zoomOutButton: Locator;
  readonly zoomSlider: Locator;
  readonly resetButton: Locator;

  // Error states
  readonly errorMessage: Locator;
  readonly maxSizeWarning: Locator;
  readonly invalidFormatWarning: Locator;

  // Loading states
  readonly loadingIndicator: Locator;
  readonly uploadingSpinner: Locator;
  readonly progressIndicator: Locator;

  constructor(page: Page, container?: string | Locator) {
    super(page);
    this.page = page;

    // Initialize container if provided
    if (container) {
      this.container = typeof container === 'string'
        ? page.locator(container)
        : container;
    } else {
      this.container = page.locator('[data-testid="avatar-upload"], .avatar-upload-container');
    }

    // Initialize selectors relative to container
    this.avatarImage = this.container.locator('[data-testid="avatar-image"], .avatar-image img');
    this.defaultAvatar = this.container.locator('[data-testid="default-avatar"], .default-avatar');
    this.uploadButton = this.container.locator('button[aria-label*="upload" i], button:has-text("업로드"), .upload-button');
    this.removeButton = this.container.locator('button[aria-label*="remove" i], button:has-text("제거"), .remove-button');
    this.fileInput = this.container.locator('input[type="file"][accept*="image"]');

    this.uploadModal = page.locator('[data-testid="avatar-upload-modal"], .avatar-upload-modal, [role="dialog"]:has(.avatar-preview)');
    this.previewImage = this.uploadModal.locator('[data-testid="avatar-preview"], .avatar-preview img');
    this.confirmButton = this.uploadModal.locator('button:has-text("확인"), button:has-text("Confirm"), button:has-text("완료")');
    this.cancelButton = this.uploadModal.locator('button:has-text("취소"), button:has-text("Cancel")');
    this.cropArea = this.uploadModal.locator('[data-testid="crop-area"], .crop-area');

    this.rotateButton = this.uploadModal.locator('button[aria-label*="rotate" i], button:has([data-lucide="rotate-cw"])');
    this.flipHorizontalButton = this.uploadModal.locator('button[aria-label*="flip horizontal" i]');
    this.flipVerticalButton = this.uploadModal.locator('button[aria-label*="flip vertical" i]');
    this.zoomInButton = this.uploadModal.locator('button[aria-label*="zoom in" i], button:has([data-lucide="plus"])');
    this.zoomOutButton = this.uploadModal.locator('button[aria-label*="zoom out" i], button:has([data-lucide="minus"])');
    this.zoomSlider = this.uploadModal.locator('input[type="range"][data-testid="zoom-slider"], .zoom-slider');
    this.resetButton = this.uploadModal.locator('button:has-text("초기화"), button:has-text("Reset")');

    this.errorMessage = this.container.locator('[data-testid="error-message"], .error-message');
    this.maxSizeWarning = this.container.locator('[data-testid="max-size-warning"], .max-size-warning');
    this.invalidFormatWarning = this.container.locator('[data-testid="invalid-format-warning"], .invalid-format-warning');

    this.loadingIndicator = this.container.locator('[data-testid="loading"], .loading-indicator');
    this.uploadingSpinner = this.uploadModal.locator('.spinner, [data-testid="uploading-spinner"]');
    this.progressIndicator = this.uploadModal.locator('[data-testid="progress"], .progress-indicator');
  }

  // ===========================
  // Upload Operations
  // ===========================

  /**
   * Upload an avatar from a file path
   * @param filePath - Path to the image file
   * @param options - Upload options
   */
  async uploadAvatar(
    filePath: string,
    options?: {
      crop?: boolean;
      rotate?: number;
      zoom?: number;
      confirm?: boolean;
    }
  ): Promise<void> {
    // Click upload button or directly set files
    await this.uploadButton.click();
    await this.fileInput.setInputFiles(filePath);

    // Wait for upload modal to appear
    await this.waitForUploadModal();

    // Apply edits if options provided
    if (options) {
      if (options.rotate) {
        await this.rotate(options.rotate);
      }
      if (options.zoom) {
        await this.zoom(options.zoom);
      }
    }

    // Confirm upload (default: true)
    if (options?.confirm !== false) {
      await this.confirm();
    }

    // Wait for upload to complete
    await this.waitForUploadComplete();
  }

  /**
   * Upload an avatar from a buffer
   * @param buffer - File buffer
   * @param filename - Filename to use
   */
  async uploadAvatarFromBuffer(buffer: Buffer, filename: string): Promise<void> {
    await this.fileInput.setInputFiles({
      name: filename,
      mimeType: 'image/jpeg',
      buffer,
    });
    await this.waitForUploadModal();
  }

  /**
   * Remove the current avatar
   */
  async removeAvatar(): Promise<void> {
    await this.removeButton.click();

    // Confirm removal if prompted
    const confirmDialog = this.page.locator('button:has-text("확인"), button:has-text("Confirm")');
    if (await confirmDialog.isVisible({ timeout: 2000 })) {
      await confirmDialog.click();
    }

    await this.waitForNetworkIdle();
  }

  // ===========================
  // Editing Operations
  // ===========================

  /**
   * Rotate the avatar
   * @param degrees - Number of 90-degree rotations (default: 1)
   */
  async rotate(degrees: number = 1): Promise<void> {
    for (let i = 0; i < degrees; i++) {
      await this.rotateButton.click();
      await this.waitFor(100); // Brief pause for visual update
    }
  }

  /**
   * Flip the avatar horizontally
   */
  async flipHorizontal(): Promise<void> {
    await this.flipHorizontalButton.click();
  }

  /**
   * Flip the avatar vertically
   */
  async flipVertical(): Promise<void> {
    await this.flipVerticalButton.click();
  }

  /**
   * Zoom in
   * @param steps - Number of zoom steps
   */
  async zoomIn(steps: number = 1): Promise<void> {
    for (let i = 0; i < steps; i++) {
      await this.zoomInButton.click();
      await this.waitFor(100);
    }
  }

  /**
   * Zoom out
   * @param steps - Number of zoom steps
   */
  async zoomOut(steps: number = 1): Promise<void> {
    for (let i = 0; i < steps; i++) {
      await this.zoomOutButton.click();
      await this.waitFor(100);
    }
  }

  /**
   * Set zoom level directly
   * @param level - Zoom level (0-100)
   */
  async zoom(level: number): Promise<void> {
    await this.zoomSlider.fill(level.toString());
  }

  /**
   * Reset all edits to original
   */
  async resetEdits(): Promise<void> {
    await this.resetButton.click();
  }

  // ===========================
  // Modal Operations
  // ===========================

  /**
   * Confirm the avatar upload
   */
  async confirm(): Promise<void> {
    await this.confirmButton.click();
  }

  /**
   * Cancel the avatar upload
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await expect(this.uploadModal).toBeHidden();
  }

  /**
   * Wait for upload modal to appear
   */
  async waitForUploadModal(): Promise<void> {
    await expect(this.uploadModal).toBeVisible({ timeout: 5000 });
  }

  /**
   * Wait for upload to complete
   */
  async waitForUploadComplete(): Promise<void> {
    await expect(this.uploadModal).toBeHidden({ timeout: 10000 });
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 });
  }

  // ===========================
  // Drag and Drop Operations
  // ===========================

  /**
   * Drag and drop a file onto the upload area
   * @param filePath - Path to the file
   */
  async dragAndDrop(filePath: string): Promise<void> {
    const dropZone = this.container.locator('[data-testid="drop-zone"], .drop-zone');

    // Create the file to drop
    const file = {
      name: filePath.split('/').pop() || 'avatar.jpg',
      mimeType: 'image/jpeg',
      buffer: await this.page.evaluate(() => new Buffer([])),
    };

    // Simulate drag and drop events
    await dropZone.dispatchEvent('dragover', { bubbles: true });
    await dropZone.dispatchEvent('drop', {
      bubbles: true,
      dataTransfer: {
        files: [file],
      },
    });

    await this.waitForUploadModal();
  }

  // ===========================
  // State Checks
  // ===========================

  /**
   * Check if avatar is currently set (not default)
   */
  async hasAvatar(): Promise<boolean> {
    const isVisible = await this.avatarImage.isVisible();
    if (!isVisible) return false;

    const src = await this.avatarImage.getAttribute('src') || '';
    return !src.includes('default') && !src.includes('placeholder');
  }

  /**
   * Check if default avatar is shown
   */
  async isDefaultAvatar(): Promise<boolean> {
    return await this.defaultAvatar.isVisible();
  }

  /**
   * Check if upload button is visible
   */
  async canUpload(): Promise<boolean> {
    return await this.uploadButton.isVisible();
  }

  /**
   * Check if remove button is visible (only when avatar is set)
   */
  async canRemove(): Promise<boolean> {
    return await this.removeButton.isVisible();
  }

  /**
   * Check if upload modal is open
   */
  async isModalOpen(): Promise<boolean> {
    return await this.uploadModal.isVisible();
  }

  /**
   * Check if currently uploading
   */
  async isUploading(): Promise<boolean> {
    return await this.loadingIndicator.isVisible() ||
           await this.uploadingSpinner.isVisible();
  }

  /**
   * Check if there's an error
   */
  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  // ===========================
  // Getters
  // ===========================

  /**
   * Get the avatar image URL
   */
  async getAvatarUrl(): Promise<string> {
    return await this.avatarImage.getAttribute('src') || '';
  }

  /**
   * Get the error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Get the current zoom level
   */
  async getZoomLevel(): Promise<number> {
    const value = await this.zoomSlider.inputValue();
    return parseInt(value, 10);
  }

  /**
   * Get the upload progress percentage
   */
  async getUploadProgress(): Promise<number> {
    const text = await this.progressIndicator.textContent() || '0%';
    return parseInt(text.replace('%', ''), 10);
  }

  // ===========================
  // Assertion Methods
  // ===========================

  /**
   * Verify that avatar is displayed
   */
  async verifyAvatarDisplayed(): Promise<void> {
    await expect(this.avatarImage).toBeVisible();
  }

  /**
   * Verify that default avatar is displayed
   */
  async verifyDefaultAvatarDisplayed(): Promise<void> {
    await expect(this.defaultAvatar).toBeVisible();
  }

  /**
   * Verify that avatar is removed
   */
  async verifyAvatarRemoved(): Promise<void> {
    await expect(this.defaultAvatar).toBeVisible();
    await expect(this.removeButton).toBeHidden();
  }

  /**
   * Verify upload modal is open
   */
  async verifyModalOpen(): Promise<void> {
    await expect(this.uploadModal).toBeVisible();
  }

  /**
   * Verify upload modal is closed
   */
  async verifyModalClosed(): Promise<void> {
    await expect(this.uploadModal).toBeHidden();
  }

  /**
   * Verify an error message is displayed
   * @param expectedMessage - Expected error message
   */
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  /**
   * Verify max size warning is displayed
   */
  async verifyMaxSizeWarning(): Promise<void> {
    await expect(this.maxSizeWarning).toBeVisible();
  }

  /**
   * Verify invalid format warning is displayed
   */
  async verifyInvalidFormatWarning(): Promise<void> {
    await expect(this.invalidFormatWarning).toBeVisible();
  }

  /**
   * Verify the avatar URL matches expected
   * @param expectedUrl - Expected URL (or partial URL)
   */
  async verifyAvatarUrl(expectedUrl: string): Promise<void> {
    const actualUrl = await this.getAvatarUrl();
    expect(actualUrl).toContain(expectedUrl);
  }

  /**
   * Verify upload is complete
   */
  async verifyUploadComplete(): Promise<void> {
    await expect(this.loadingIndicator).toBeHidden();
    await expect(this.uploadModal).toBeHidden();
  }

  // ===========================
  // Utility Methods
  // ===========================

  /**
   * Take a screenshot of the avatar preview
   */
  async capturePreview(): Promise<Buffer> {
    return await this.previewImage.screenshot();
  }

  /**
   * Get the dimensions of the crop area
   */
  async getCropAreaDimensions(): Promise<{ width: number; height: number }> {
    const box = await this.cropArea.boundingBox();
    return {
      width: box?.width || 0,
      height: box?.height || 0,
    };
  }

  /**
   * Wait for the avatar to be ready (loaded)
   */
  async waitForAvatarReady(): Promise<void> {
    await expect(this.avatarImage).toBeVisible();
    await this.avatarImage.evaluate(img =>
      img.complete && typeof img.naturalWidth !== 'undefined'
    );
  }

  /**
   * Clear any errors
   */
  async clearErrors(): Promise<void> {
    const clearButton = this.container.locator('button:has-text("닫기"), button:has-text("Close")');
    if (await clearButton.isVisible()) {
      await clearButton.click();
    }
  }
}
