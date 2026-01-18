import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Meetup Detail Page Object Model
 *
 * Represents the individual meetup detail page where users can view
 * complete meetup information and join/leave the meetup.
 */
export class MeetupDetailPage extends BasePage {
  readonly page: Page;

  // ===========================
  // Selectors
  // ===========================

  // Header/Title section
  readonly meetupTitle: Locator;
  readonly meetupStatus: Locator;
  readonly meetupBadge: Locator;
  readonly backButton: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  // Meetup information
  readonly meetupDescription: Locator;
  readonly meetupDate: Locator;
  readonly meetupTime: Locator;
  readonly meetupLocation: Locator;
  readonly meetupCity: Locator;

  // Participant information
  readonly participantList: Locator;
  readonly participantCount: Locator;
  readonly maxParticipants: Locator;
  readonly availableSlots: Locator;
  readonly joinButton: Locator;
  readonly leaveButton: Locator;

  // Organizer information
  readonly organizerName: Locator;
  readonly organizerAvatar: Locator;
  readonly organizerBio: Locator;
  readonly messageOrganizerButton: Locator;

  // Tags and categories
  readonly tagsContainer: Locator;
  readonly tag: Locator;

  // Interactive elements
  readonly shareButton: Locator;
  readonly likeButton: Locator;
  readonly bookmarkButton: Locator;
  readonly reportButton: Locator;

  // Comments section
  readonly commentsSection: Locator;
  readonly commentInput: Locator;
  readonly submitCommentButton: Locator;
  readonly commentsList: Locator;

  // Map
  readonly mapContainer: Locator;
  readonly viewOnMapButton: Locator;

  // Confirmation modals
  readonly deleteConfirmationModal: Locator;
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Initialize selectors
    this.meetupTitle = page.locator('[data-testid="meetup-title"], .meetup-title, h1');
    this.meetupStatus = page.locator('[data-testid="meetup-status"], .meetup-status');
    this.meetupBadge = page.locator('[data-testid="meetup-badge"], .meetup-badge, .badge');
    this.backButton = page.locator('button[aria-label*="back" i], a:has([data-lucide="arrow-left"])');
    this.editButton = page.locator('button:has-text("수정"), button:has-text("Edit"), a[href*="/edit"]');
    this.deleteButton = page.locator('button:has-text("삭제"), button:has-text("Delete")');

    this.meetupDescription = page.locator('[data-testid="meetup-description"], .meetup-description');
    this.meetupDate = page.locator('[data-testid="meetup-date"], .meetup-date');
    this.meetupTime = page.locator('[data-testid="meetup-time"], .meetup-time');
    this.meetupLocation = page.locator('[data-testid="meetup-location"], .meetup-location');
    this.meetupCity = page.locator('[data-testid="meetup-city"], .meetup-city');

    this.participantList = page.locator('[data-testid="participant-list"], .participant-list');
    this.participantCount = page.locator('[data-testid="participant-count"], .participant-count');
    this.maxParticipants = page.locator('[data-testid="max-participants"], .max-participants');
    this.availableSlots = page.locator('[data-testid="available-slots"], .available-slots');
    this.joinButton = page.locator('button:has-text("참가하기"), button:has-text("Join")');
    this.leaveButton = page.locator('button:has-text("참가 취소"), button:has-text("Leave")');

    this.organizerName = page.locator('[data-testid="organizer-name"], .organizer-name');
    this.organizerAvatar = page.locator('[data-testid="organizer-avatar"], .organizer-avatar');
    this.organizerBio = page.locator('[data-testid="organizer-bio"], .organizer-bio');
    this.messageOrganizerButton = page.locator('button:has-text("메시지"), button:has-text("Message")');

    this.tagsContainer = page.locator('[data-testid="tags"], .tags-container');
    this.tag = page.locator('[data-testid="tag"], .tag, .badge');

    this.shareButton = page.locator('button[aria-label*="share" i], button:has([data-lucide="share"])');
    this.likeButton = page.locator('button[aria-label*="like" i], button:has([data-lucide="heart"])');
    this.bookmarkButton = page.locator('button[aria-label*="bookmark" i], button:has([data-lucide="bookmark"])');
    this.reportButton = page.locator('button:has-text("신고"), button:has-text("Report")');

    this.commentsSection = page.locator('[data-testid="comments-section"], .comments-section');
    this.commentInput = page.locator('[data-testid="comment-input"], textarea[name="comment"], .comment-input');
    this.submitCommentButton = page.locator('button:has-text("댓글 작성"), button:has-text("Submit"), button[type="submit"]');
    this.commentsList = page.locator('[data-testid="comments-list"], .comments-list');

    this.mapContainer = page.locator('[data-testid="map"], .map-container');
    this.viewOnMapButton = page.locator('button:has-text("지도 보기"), button:has-text("View on Map")');

    this.deleteConfirmationModal = page.locator('[data-testid="delete-modal"], .delete-modal, [role="dialog"]');
    this.confirmDeleteButton = page.locator('button:has-text("확인"), button:has-text("Confirm"), button.danger');
    this.cancelDeleteButton = page.locator('button:has-text("취소"), button:has-text("Cancel")');
  }

  // ===========================
  // Navigation
  // ===========================

  /**
   * Navigate to a specific meetup detail page
   * @param meetupId - Meetup ID or slug
   */
  async goto(meetupId: string): Promise<void> {
    await this.goto(`/meetups/${meetupId}`);
  }

  /**
   * Click the back button to return to the previous page
   */
  async goBack(): Promise<void> {
    await this.backButton.click();
  }

  // ===========================
  // Meetup Information
  // ===========================

  /**
   * Get the meetup title
   */
  async getTitle(): Promise<string> {
    return await this.meetupTitle.textContent() || '';
  }

  /**
   * Get the meetup status
   */
  async getStatus(): Promise<string> {
    return await this.meetupStatus.textContent() || '';
  }

  /**
   * Get the meetup description
   */
  async getDescription(): Promise<string> {
    return await this.meetupDescription.textContent() || '';
  }

  /**
   * Get the meetup date and time
   */
  async getDateTime(): Promise<{ date: string; time: string }> {
    const date = await this.meetupDate.textContent() || '';
    const time = await this.meetupTime.textContent() || '';
    return { date, time };
  }

  /**
   * Get the meetup location
   */
  async getLocation(): Promise<string> {
    return await this.meetupLocation.textContent() || '';
  }

  /**
   * Get the meetup city
   */
  async getCity(): Promise<string> {
    return await this.meetupCity.textContent() || '';
  }

  /**
   * Get all meetup tags
   */
  async getTags(): Promise<string[]> {
    const tags: string[] = [];
    const tagElements = await this.tag.all();

    for (const tag of tagElements) {
      const text = await tag.textContent();
      if (text) tags.push(text);
    }

    return tags;
  }

  /**
   * Get complete meetup information
   */
  async getMeetupInfo(): Promise<{
    title: string;
    status: string;
    description: string;
    date: string;
    time: string;
    location: string;
    city: string;
    tags: string[];
  }> {
    return {
      title: await this.getTitle(),
      status: await this.getStatus(),
      description: await this.getDescription(),
      date: (await this.getDateTime()).date,
      time: (await this.getDateTime()).time,
      location: await this.getLocation(),
      city: await this.getCity(),
      tags: await this.getTags(),
    };
  }

  // ===========================
  // Participant Management
  // ===========================

  /**
   * Get the current number of participants
   */
  async getParticipantCount(): Promise<number> {
    const text = await this.participantCount.textContent() || '0';
    return parseInt(text.match(/\d+/)?.[0] || '0', 10);
  }

  /**
   * Get the maximum number of participants
   */
  async getMaxParticipants(): Promise<number> {
    const text = await this.maxParticipants.textContent() || '0';
    return parseInt(text.match(/\d+/)?.[0] || '0', 10);
  }

  /**
   * Get the number of available slots
   */
  async getAvailableSlots(): Promise<number> {
    const text = await this.availableSlots.textContent() || '0';
    return parseInt(text.match(/\d+/)?.[0] || '0', 10);
  }

  /**
   * Join the meetup
   */
  async join(): Promise<void> {
    await this.joinButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Leave the meetup
   */
  async leave(): Promise<void> {
    await this.leaveButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Check if the user has joined the meetup
   */
  async hasJoined(): Promise<boolean> {
    return await this.leaveButton.isVisible();
  }

  /**
   * Check if the meetup is full
   */
  async isFull(): Promise<boolean> {
    const status = await this.getStatus();
    return status.toLowerCase().includes('full') || status.includes('마감');
  }

  /**
   * Get list of participant names
   */
  async getParticipantNames(): Promise<string[]> {
    const names: string[] = [];
    const participants = await this.participantList.locator('.participant-name').all();

    for (const participant of participants) {
      const text = await participant.textContent();
      if (text) names.push(text);
    }

    return names;
  }

  // ===========================
  // Organizer Information
  // ===========================

  /**
   * Get the organizer name
   */
  async getOrganizerName(): Promise<string> {
    return await this.organizerName.textContent() || '';
  }

  /**
   * Get the organizer bio
   */
  async getOrganizerBio(): Promise<string> {
    return await this.organizerBio.textContent() || '';
  }

  /**
   * Click on the organizer profile to view their profile
   */
  async viewOrganizerProfile(): Promise<void> {
    await this.organizerName.click();
  }

  /**
   * Click the message organizer button
   */
  async messageOrganizer(): Promise<void> {
    await this.messageOrganizerButton.click();
  }

  // ===========================
  // Actions
  // ===========================

  /**
   * Click the edit button to edit the meetup
   */
  async clickEdit(): Promise<void> {
    await this.editButton.click();
  }

  /**
   * Click the delete button and confirm deletion
   */
  async delete(): Promise<void> {
    await this.deleteButton.click();
    await expect(this.deleteConfirmationModal).toBeVisible();
    await this.confirmDeleteButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Click the delete button but cancel the deletion
   */
  async deleteAndCancel(): Promise<void> {
    await this.deleteButton.click();
    await expect(this.deleteConfirmationModal).toBeVisible();
    await this.cancelDeleteButton.click();
  }

  /**
   * Like/unlike the meetup
   */
  async toggleLike(): Promise<void> {
    await this.likeButton.click();
  }

  /**
   * Bookmark/unbookmark the meetup
   */
  async toggleBookmark(): Promise<void> {
    await this.bookmarkButton.click();
  }

  /**
   * Share the meetup
   */
  async share(): Promise<void> {
    await this.shareButton.click();
  }

  /**
   * Report the meetup
   */
  async report(): Promise<void> {
    await this.reportButton.click();
  }

  /**
   * View the meetup location on a map
   */
  async viewOnMap(): Promise<void> {
    await this.viewOnMapButton.click();
  }

  // ===========================
  // Comments
  // ===========================

  /**
   * Add a comment to the meetup
   * @param comment - Comment text
   */
  async addComment(comment: string): Promise<void> {
    await this.commentInput.fill(comment);
    await this.submitCommentButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Get all comments
   */
  async getComments(): Promise<string[]> {
    const comments: string[] = [];
    const commentElements = await this.commentsList.locator('.comment-text, .comment-content').all();

    for (const comment of commentElements) {
      const text = await comment.textContent();
      if (text) comments.push(text);
    }

    return comments;
  }

  /**
   * Get the number of comments
   */
  async getCommentCount(): Promise<number> {
    return await this.commentsList.locator('.comment').count();
  }

  // ===========================
  // Assertion Methods
  // ===========================

  /**
   * Verify that the meetup page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.meetupTitle).toBeVisible();
    await expect(this.meetupDescription).toBeVisible();
  }

  /**
   * Verify the meetup title
   * @param expectedTitle - Expected meetup title
   */
  async verifyTitle(expectedTitle: string): Promise<void> {
    await expect(this.meetupTitle).toContainText(expectedTitle);
  }

  /**
   * Verify that the join button is visible
   */
  async verifyCanJoin(): Promise<void> {
    await expect(this.joinButton).toBeVisible();
    await expect(this.leaveButton).toBeHidden();
  }

  /**
   * Verify that the leave button is visible (user has joined)
   */
  async verifyHasJoined(): Promise<void> {
    await expect(this.leaveButton).toBeVisible();
    await expect(this.joinButton).toBeHidden();
  }

  /**
   * Verify that the meetup is full
   */
  async verifyMeetupFull(): Promise<void> {
    await expect(this.joinButton).toBeDisabled();
    const status = await this.getStatus();
    expect(status.toLowerCase()).toContain('full');
  }

  /**
   * Verify that the edit button is visible
   */
  async verifyCanEdit(): Promise<void> {
    await expect(this.editButton).toBeVisible();
  }

  /**
   * Verify that the delete button is visible
   */
  async verifyCanDelete(): Promise<void> {
    await expect(this.deleteButton).toBeVisible();
  }

  /**
   * Verify that a comment is displayed
   * @param comment - Comment text to verify
   */
  async verifyCommentDisplayed(comment: string): Promise<void> {
    await expect(this.commentsList).toContainText(comment);
  }

  /**
   * Verify the participant count
   * @param expectedCount - Expected participant count
   */
  async verifyParticipantCount(expectedCount: number): Promise<void> {
    const count = await this.getParticipantCount();
    expect(count).toBe(expectedCount);
  }

  /**
   * Verify the meetup status
   * @param expectedStatus - Expected status
   */
  async verifyStatus(expectedStatus: string): Promise<void> {
    await expect(this.meetupStatus).toContainText(expectedStatus);
  }

  /**
   * Verify that tags are displayed
   * @param expectedTags - Expected tags
   */
  async verifyTags(expectedTags: string[]): Promise<void> {
    const tags = await this.getTags();
    expect(tags).toEqual(expect.arrayContaining(expectedTags));
  }

  // ===========================
  // Utility Methods
  // ===========================

  /**
   * Wait for the page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForLoadState();
    await expect(this.meetupTitle).toBeVisible();
  }

  /**
   * Check if the current user is the organizer
   */
  async isOrganizer(): Promise<boolean> {
    return await this.editButton.isVisible();
  }
}
