import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Post Detail Page Object Model
 *
 * Represents the individual post detail page where users can view
 * complete post information and interact with comments.
 */
export class PostDetailPage extends BasePage {
  readonly page: Page;

  // ===========================
  // Selectors
  // ===========================

  // Header/Title section
  readonly postTitle: Locator;
  readonly postCategory: Locator;
  readonly postBadge: Locator;
  readonly backButton: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly moreOptionsButton: Locator;

  // Post metadata
  readonly postAuthor: Locator;
  readonly postAuthorAvatar: Locator;
  readonly postDate: Locator;
  readonly postViews: Locator;
  readonly postCity: Locator;

  // Post content
  readonly postContent: Locator;
  readonly postTags: Locator;
  readonly postAttachments: Locator;
  readonly postImage: Locator;

  // Engagement buttons
  readonly likeButton: Locator;
  readonly likeCount: Locator;
  readonly bookmarkButton: Locator;
  readonly shareButton: Locator;
  readonly reportButton: Locator;

  // Comments section
  readonly commentsSection: Locator;
  readonly commentsList: Locator;
  readonly commentItem: Locator;
  readonly commentCount: Locator;
  readonly commentInput: Locator;
  readonly submitCommentButton: Locator;
  readonly replyButton: Locator;
  readonly editCommentButton: Locator;
  readonly deleteCommentButton: Locator;
  readonly likeCommentButton: Locator;

  // Comment elements
  readonly commentAuthor: Locator;
  readonly commentContent: Locator;
  readonly commentDate: Locator;
  readonly commentLikes: Locator;

  // Related posts
  readonly relatedPostsSection: Locator;
  readonly relatedPostCards: Locator;

  // Confirmation modals
  readonly deleteConfirmationModal: Locator;
  readonly confirmDeleteButton: Locator;
  readonly cancelDeleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Initialize selectors
    this.postTitle = page.locator('[data-testid="post-title"], .post-title, h1');
    this.postCategory = page.locator('[data-testid="post-category"], .post-category');
    this.postBadge = page.locator('[data-testid="post-badge"], .post-badge, .badge');
    this.backButton = page.locator('button[aria-label*="back" i], a:has([data-lucide="arrow-left"])');
    this.editButton = page.locator('button:has-text("수정"), button:has-text("Edit"), a[href*="/edit"]');
    this.deleteButton = page.locator('button:has-text("삭제"), button:has-text("Delete")');
    this.moreOptionsButton = page.locator('button[aria-label*="more" i], button:has([data-lucide="more-vertical"])');

    this.postAuthor = page.locator('[data-testid="post-author"], .post-author, .author-name');
    this.postAuthorAvatar = page.locator('[data-testid="author-avatar"], .author-avatar');
    this.postDate = page.locator('[data-testid="post-date"], .post-date');
    this.postViews = page.locator('[data-testid="post-views"], .post-views');
    this.postCity = page.locator('[data-testid="post-city"], .post-city');

    this.postContent = page.locator('[data-testid="post-content"], .post-content');
    this.postTags = page.locator('[data-testid="post-tags"], .post-tags .tag');
    this.postAttachments = page.locator('[data-testid="attachments"], .attachments');
    this.postImage = page.locator('[data-testid="post-image"], .post-content img');

    this.likeButton = page.locator('button[aria-label*="like" i], button:has([data-lucide="heart"])');
    this.likeCount = page.locator('[data-testid="like-count"], .like-count');
    this.bookmarkButton = page.locator('button[aria-label*="bookmark" i], button:has([data-lucide="bookmark"])');
    this.shareButton = page.locator('button[aria-label*="share" i], button:has([data-lucide="share"])');
    this.reportButton = page.locator('button:has-text("신고"), button:has-text("Report")');

    this.commentsSection = page.locator('[data-testid="comments-section"], .comments-section');
    this.commentsList = page.locator('[data-testid="comments-list"], .comments-list');
    this.commentItem = page.locator('[data-testid="comment"], .comment');
    this.commentCount = page.locator('[data-testid="comment-count"], .comment-count');
    this.commentInput = page.locator('[data-testid="comment-input"], textarea[name="comment"], .comment-input');
    this.submitCommentButton = page.locator('button:has-text("댓글 작성"), button:has-text("Submit"), button[type="submit"]');
    this.replyButton = page.locator('button:has-text("답글"), button:has-text("Reply")');
    this.editCommentButton = page.locator('button[aria-label*="edit comment" i]');
    this.deleteCommentButton = page.locator('button[aria-label*="delete comment" i]');
    this.likeCommentButton = page.locator('button[aria-label*="like comment" i]');

    this.commentAuthor = page.locator('[data-testid="comment-author"], .comment-author');
    this.commentContent = page.locator('[data-testid="comment-content"], .comment-content');
    this.commentDate = page.locator('[data-testid="comment-date"], .comment-date');
    this.commentLikes = page.locator('[data-testid="comment-likes"], .comment-likes');

    this.relatedPostsSection = page.locator('[data-testid="related-posts"], .related-posts');
    this.relatedPostCards = page.locator('[data-testid="related-post"], .related-post .post-card');

    this.deleteConfirmationModal = page.locator('[data-testid="delete-modal"], .delete-modal, [role="dialog"]');
    this.confirmDeleteButton = page.locator('button:has-text("확인"), button:has-text("Confirm"), button.danger');
    this.cancelDeleteButton = page.locator('button:has-text("취소"), button:has-text("Cancel")');
  }

  // ===========================
  // Navigation
  // ===========================

  /**
   * Navigate to a specific post detail page
   * @param postId - Post ID or slug
   */
  async goto(postId: string): Promise<void> {
    await this.goto(`/posts/${postId}`);
  }

  /**
   * Click the back button to return to the previous page
   */
  async goBack(): Promise<void> {
    await this.backButton.click();
  }

  // ===========================
  // Post Information
  // ===========================

  /**
   * Get the post title
   */
  async getTitle(): Promise<string> {
    return await this.postTitle.textContent() || '';
  }

  /**
   * Get the post category
   */
  async getCategory(): Promise<string> {
    return await this.postCategory.textContent() || '';
  }

  /**
   * Get the post content
   */
  async getContent(): Promise<string> {
    return await this.postContent.textContent() || '';
  }

  /**
   * Get the post author name
   */
  async getAuthor(): Promise<string> {
    return await this.postAuthor.textContent() || '';
  }

  /**
   * Get the post date
   */
  async getDate(): Promise<string> {
    return await this.postDate.textContent() || '';
  }

  /**
   * Get the post views count
   */
  async getViews(): Promise<number> {
    const text = await this.postViews.textContent() || '0';
    return parseInt(text.match(/\d+/)?.[0] || '0', 10);
  }

  /**
   * Get the post city
   */
  async getCity(): Promise<string> {
    return await this.postCity.textContent() || '';
  }

  /**
   * Get all post tags
   */
  async getTags(): Promise<string[]> {
    const tags: string[] = [];
    const tagElements = await this.postTags.all();

    for (const tag of tagElements) {
      const text = await tag.textContent();
      if (text) tags.push(text);
    }

    return tags;
  }

  /**
   * Get complete post information
   */
  async getPostInfo(): Promise<{
    title: string;
    category: string;
    content: string;
    author: string;
    date: string;
    views: number;
    city: string;
    tags: string[];
  }> {
    return {
      title: await this.getTitle(),
      category: await this.getCategory(),
      content: await this.getContent(),
      author: await this.getAuthor(),
      date: await this.getDate(),
      views: await this.getViews(),
      city: await this.getCity(),
      tags: await this.getTags(),
    };
  }

  // ===========================
  // Post Engagement
  // ===========================

  /**
   * Like/unlike the post
   */
  async toggleLike(): Promise<void> {
    await this.likeButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Get the like count
   */
  async getLikeCount(): Promise<number> {
    const text = await this.likeCount.textContent() || '0';
    return parseInt(text.match(/\d+/)?.[0] || '0', 10);
  }

  /**
   * Check if the post is liked
   */
  async isLiked(): Promise<boolean> {
    const classList = await this.likeButton.getAttribute('class') || '';
    return classList.includes('active') || classList.includes('liked');
  }

  /**
   * Bookmark/unbookmark the post
   */
  async toggleBookmark(): Promise<void> {
    await this.bookmarkButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Check if the post is bookmarked
   */
  async isBookmarked(): Promise<boolean> {
    const classList = await this.bookmarkButton.getAttribute('class') || '';
    return classList.includes('active') || classList.includes('bookmarked');
  }

  /**
   * Share the post
   */
  async share(): Promise<void> {
    await this.shareButton.click();
  }

  /**
   * Report the post
   */
  async report(): Promise<void> {
    await this.reportButton.click();
  }

  // ===========================
  // Post Management
  // ===========================

  /**
   * Click the edit button to edit the post
   */
  async clickEdit(): Promise<void> {
    await this.editButton.click();
  }

  /**
   * Delete the post
   */
  async delete(): Promise<void> {
    await this.deleteButton.click();
    await expect(this.deleteConfirmationModal).toBeVisible();
    await this.confirmDeleteButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Delete the post but cancel the operation
   */
  async deleteAndCancel(): Promise<void> {
    await this.deleteButton.click();
    await expect(this.deleteConfirmationModal).toBeVisible();
    await this.cancelDeleteButton.click();
  }

  /**
   * Click the more options button
   */
  async clickMoreOptions(): Promise<void> {
    await this.moreOptionsButton.click();
  }

  // ===========================
  // Comments
  // ===========================

  /**
   * Add a comment to the post
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
  async getComments(): Promise<Array<{ author: string; content: string; date: string; likes: number }>> {
    const comments: Array<{ author: string; content: string; date: string; likes: number }> = [];
    const commentElements = await this.commentItem.all();

    for (const comment of commentElements) {
      const author = await comment.locator(this.commentAuthor).textContent() || '';
      const content = await comment.locator(this.commentContent).textContent() || '';
      const date = await comment.locator(this.commentDate).textContent() || '';
      const likesText = await comment.locator(this.commentLikes).textContent() || '0';
      const likes = parseInt(likesText.match(/\d+/)?.[0] || '0', 10);

      comments.push({ author, content, date, likes });
    }

    return comments;
  }

  /**
   * Get the number of comments
   */
  async getCommentCount(): Promise<number> {
    const countText = await this.commentCount.textContent() || '0';
    return parseInt(countText.match(/\d+/)?.[0] || '0', 10);
  }

  /**
   * Click the reply button on a comment by index
   * @param index - Zero-based index of the comment
   */
  async replyToComment(index: number): Promise<void> {
    const comment = this.commentItem.nth(index);
    await comment.locator(this.replyButton).click();
  }

  /**
   * Edit a comment by index
   * @param index - Zero-based index of the comment
   * @param newContent - New comment content
   */
  async editComment(index: number, newContent: string): Promise<void> {
    const comment = this.commentItem.nth(index);
    await comment.locator(this.editCommentButton).click();
    const editInput = comment.locator('textarea, input[type="text"]');
    await editInput.fill(newContent);
    await comment.locator('button[type="submit"], button:has-text("저장")').click();
    await this.waitForNetworkIdle();
  }

  /**
   * Delete a comment by index
   * @param index - Zero-based index of the comment
   */
  async deleteComment(index: number): Promise<void> {
    const comment = this.commentItem.nth(index);
    await comment.locator(this.deleteCommentButton).click();
    await this.waitForNetworkIdle();
  }

  /**
   * Like/unlike a comment by index
   * @param index - Zero-based index of the comment
   */
  async toggleLikeComment(index: number): Promise<void> {
    const comment = this.commentItem.nth(index);
    await comment.locator(this.likeCommentButton).click();
    await this.waitForNetworkIdle();
  }

  // ===========================
  // Related Posts
  // ===========================

  /**
   * Get all related post titles
   */
  async getRelatedPostTitles(): Promise<string[]> {
    const titles: string[] = [];
    const posts = await this.relatedPostCards.all();

    for (const post of posts) {
      const title = await post.locator('.post-title, h2, h3').textContent();
      if (title) titles.push(title);
    }

    return titles;
  }

  /**
   * Click on a related post by index
   * @param index - Zero-based index of the related post
   */
  async clickRelatedPost(index: number): Promise<void> {
    await this.relatedPostCards.nth(index).click();
  }

  // ===========================
  // Assertion Methods
  // ===========================

  /**
   * Verify that the post page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.postTitle).toBeVisible();
    await expect(this.postContent).toBeVisible();
  }

  /**
   * Verify the post title
   * @param expectedTitle - Expected post title
   */
  async verifyTitle(expectedTitle: string): Promise<void> {
    await expect(this.postTitle).toContainText(expectedTitle);
  }

  /**
   * Verify the post content
   * @param expectedContent - Expected content fragment
   */
  async verifyContent(expectedContent: string): Promise<void> {
    await expect(this.postContent).toContainText(expectedContent);
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
   * Verify the comment count
   * @param expectedCount - Expected comment count
   */
  async verifyCommentCount(expectedCount: number): Promise<void> {
    const count = await this.getCommentCount();
    expect(count).toBeGreaterThanOrEqual(expectedCount);
  }

  /**
   * Verify that tags are displayed
   * @param expectedTags - Expected tags
   */
  async verifyTags(expectedTags: string[]): Promise<void> {
    const tags = await this.getTags();
    expect(tags).toEqual(expect.arrayContaining(expectedTags));
  }

  /**
   * Verify that the post is liked
   */
  async verifyIsLiked(): Promise<void> {
    const isLiked = await this.isLiked();
    expect(isLiked).toBe(true);
  }

  /**
   * Verify that the post is bookmarked
   */
  async verifyIsBookmarked(): Promise<void> {
    const isBookmarked = await this.isBookmarked();
    expect(isBookmarked).toBe(true);
  }

  /**
   * Verify the author name
   * @param expectedAuthor - Expected author name
   */
  async verifyAuthor(expectedAuthor: string): Promise<void> {
    await expect(this.postAuthor).toContainText(expectedAuthor);
  }

  /**
   * Verify the post category
   * @param expectedCategory - Expected category
   */
  async verifyCategory(expectedCategory: string): Promise<void> {
    await expect(this.postCategory).toContainText(expectedCategory);
  }

  // ===========================
  // Utility Methods
  // ===========================

  /**
   * Wait for the page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForLoadState();
    await expect(this.postTitle).toBeVisible();
    await expect(this.postContent).toBeVisible();
  }

  /**
   * Scroll to the comments section
   */
  async scrollToComments(): Promise<void> {
    await this.commentsSection.scrollIntoViewIfNeeded();
  }

  /**
   * Check if the current user is the author
   */
  async isAuthor(): Promise<boolean> {
    return await this.editButton.isVisible();
  }
}
