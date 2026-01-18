import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Posts List Page Object Model
 *
 * Represents the community posts listing page where users can browse
 * and filter posts/discussions.
 */
export class PostsPage extends BasePage {
  readonly page: Page;

  // ===========================
  // Selectors
  // ===========================

  // Search and filter selectors
  readonly searchInput: Locator;
  readonly categoryTabs: Locator;
  readonly sortSelect: Locator;
  readonly cityFilterSelect: Locator;
  readonly resetFiltersButton: Locator;

  // Post cards selectors
  readonly postCards: Locator;
  readonly pinnedPosts: Locator;
  readonly regularPosts: Locator;
  readonly createPostButton: Locator;
  readonly emptyStateMessage: Locator;
  readonly loadingIndicator: Locator;

  // Post card elements
  readonly postTitle: Locator;
  readonly postContent: Locator;
  readonly postAuthor: Locator;
  readonly postDate: Locator;
  readonly postLikes: Locator;
  readonly postComments: Locator;
  readonly postViews: Locator;
  readonly postTags: Locator;

  // Pagination
  readonly paginationContainer: Locator;
  readonly nextPageButton: Locator;
  readonly prevPageButton: Locator;
  readonly pageInfo: Locator;

  // Result count
  readonly resultCount: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Initialize selectors
    this.searchInput = page.locator('input[placeholder*="검색"], input[placeholder*="search" i], input[name="search"]');
    this.categoryTabs = page.locator('[data-testid="category-tabs"], .category-tabs button, .category-tabs a');
    this.sortSelect = page.locator('select[name="sort"], .sort-select');
    this.cityFilterSelect = page.locator('select[name="city"], .city-filter');
    this.resetFiltersButton = page.locator('button:has-text("초기화"), button:has-text("Reset")');

    this.postCards = page.locator('[data-testid="post-card"], .post-card, article.post');
    this.pinnedPosts = page.locator('[data-testid="pinned-posts"], .pinned-posts .post-card');
    this.regularPosts = page.locator('[data-testid="posts-list"], .posts-list .post-card');
    this.createPostButton = page.locator('a[href*="/posts/create"], button:has-text("글쓰기"), button:has-text("New Post")');
    this.emptyStateMessage = page.locator('.empty-state, [data-testid="empty-state"]');
    this.loadingIndicator = page.locator('.loading, [data-testid="loading"], .spinner');

    this.postTitle = page.locator('[data-testid="post-title"], .post-title, h2, h3');
    this.postContent = page.locator('[data-testid="post-content"], .post-content, .post-excerpt');
    this.postAuthor = page.locator('[data-testid="post-author"], .post-author, .author-name');
    this.postDate = page.locator('[data-testid="post-date"], .post-date');
    this.postLikes = page.locator('[data-testid="post-likes"], .post-likes');
    this.postComments = page.locator('[data-testid="post-comments"], .post-comments');
    this.postViews = page.locator('[data-testid="post-views"], .post-views');
    this.postTags = page.locator('[data-testid="post-tags"], .post-tags .tag');

    this.paginationContainer = page.locator('.pagination, nav[aria-label="pagination"]');
    this.nextPageButton = page.locator('button[aria-label="next"], .pagination-next');
    this.prevPageButton = page.locator('button[aria-label="previous"], .pagination-prev');
    this.pageInfo = page.locator('.page-info, [data-testid="page-info"]');

    this.resultCount = page.locator('[data-testid="result-count"], .result-count');
  }

  // ===========================
  // Navigation
  // ===========================

  /**
   * Navigate to the posts list page
   */
  async goto(): Promise<void> {
    await this.goto('/posts');
  }

  /**
   * Navigate to posts for a specific city
   * @param citySlug - City slug (e.g., 'seoul', 'busan')
   */
  async gotoCityPosts(citySlug: string): Promise<void> {
    await this.goto(`/cities/${citySlug}/posts`);
  }

  // ===========================
  // Search and Filter Methods
  // ===========================

  /**
   * Search for posts by keyword
   * @param keyword - Search keyword
   */
  async search(keyword: string): Promise<void> {
    await this.searchInput.fill(keyword);
    await this.waitForNetworkIdle();
  }

  /**
   * Clear the search input
   */
  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.waitForNetworkIdle();
  }

  /**
   * Select a category tab
   * @param category - Category name (e.g., '전체', '질문', '정보')
   */
  async selectCategory(category: string): Promise<void> {
    await this.categoryTabs.filter({ hasText: category }).click();
    await this.waitForNetworkIdle();
  }

  /**
   * Sort posts by the specified option
   * @param sortOption - Sort option (e.g., 'latest', 'popular', 'most-liked')
   */
  async sortBy(sortOption: string): Promise<void> {
    await this.sortSelect.selectOption(sortOption);
    await this.waitForNetworkIdle();
  }

  /**
   * Filter posts by city
   * @param cityName - City name to filter by
   */
  async filterByCity(cityName: string): Promise<void> {
    await this.cityFilterSelect.selectOption({ label: cityName });
    await this.waitForNetworkIdle();
  }

  /**
   * Reset all filters to default state
   */
  async resetFilters(): Promise<void> {
    if (await this.resetFiltersButton.isVisible()) {
      await this.resetFiltersButton.click();
    } else {
      await this.clearSearch();
      await this.selectCategory('전체');
      await this.sortBy('latest');
    }
    await this.waitForNetworkIdle();
  }

  // ===========================
  // Post Card Interactions
  // ===========================

  /**
   * Click on a post card by index
   * @param index - Zero-based index of the post card
   */
  async clickPostCard(index: number): Promise<void> {
    await this.postCards.nth(index).click();
  }

  /**
   * Click on a post card by title
   * @param title - Post title to search for
   */
  async clickPostByTitle(title: string): Promise<void> {
    const postCard = this.page.locator(`.post-card:has-text("${title}")`);
    await postCard.click();
  }

  /**
   * Get the title of a post card by index
   * @param index - Zero-based index of the post card
   */
  async getPostTitle(index: number): Promise<string> {
    const card = this.postCards.nth(index);
    const titleLocator = card.locator(this.postTitle);
    return await titleLocator.textContent() || '';
  }

  /**
   * Get all post titles on the page
   */
  async getAllPostTitles(): Promise<string[]> {
    const titles: string[] = [];
    const count = await this.postCards.count();

    for (let i = 0; i < count; i++) {
      const title = await this.getPostTitle(i);
      titles.push(title);
    }

    return titles;
  }

  /**
   * Get post details by index
   * @param index - Zero-based index of the post card
   */
  async getPostDetails(index: number): Promise<{
    title: string;
    content: string;
    author: string;
    date: string;
    likes: number;
    comments: number;
    views: number;
    tags: string[];
  }> {
    const card = this.postCards.nth(index);

    const title = await card.locator(this.postTitle).textContent() || '';
    const content = await card.locator(this.postContent).textContent() || '';
    const author = await card.locator(this.postAuthor).textContent() || '';
    const date = await card.locator(this.postDate).textContent() || '';

    const likesText = await card.locator(this.postLikes).textContent() || '0';
    const commentsText = await card.locator(this.postComments).textContent() || '0';
    const viewsText = await card.locator(this.postViews).textContent() || '0';

    const likes = parseInt(likesText.match(/\d+/)?.[0] || '0', 10);
    const comments = parseInt(commentsText.match(/\d+/)?.[0] || '0', 10);
    const views = parseInt(viewsText.match(/\d+/)?.[0] || '0', 10);

    const tags: string[] = [];
    const tagElements = await card.locator(this.postTags).all();
    for (const tag of tagElements) {
      const text = await tag.textContent();
      if (text) tags.push(text);
    }

    return { title, content, author, date, likes, comments, views, tags };
  }

  /**
   * Get pinned posts
   */
  async getPinnedPosts(): Promise<string[]> {
    const titles: string[] = [];
    const count = await this.pinnedPosts.count();

    for (let i = 0; i < count; i++) {
      const title = await this.pinnedPosts.nth(i).locator(this.postTitle).textContent();
      if (title) titles.push(title);
    }

    return titles;
  }

  // ===========================
  // Post Interactions
  // ===========================

  /**
   * Like a post by index
   * @param index - Zero-based index of the post
   */
  async likePost(index: number): Promise<void> {
    const card = this.postCards.nth(index);
    const likeButton = card.locator('button[aria-label*="like" i], button:has([data-lucide="heart"])');
    await likeButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Bookmark a post by index
   * @param index - Zero-based index of the post
   */
  async bookmarkPost(index: number): Promise<void> {
    const card = this.postCards.nth(index);
    const bookmarkButton = card.locator('button[aria-label*="bookmark" i], button:has([data-lucide="bookmark"])');
    await bookmarkButton.click();
    await this.waitForNetworkIdle();
  }

  // ===========================
  // Pagination Methods
  // ===========================

  /**
   * Go to the next page of posts
   */
  async goToNextPage(): Promise<void> {
    await this.nextPageButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Go to the previous page of posts
   */
  async goToPrevPage(): Promise<void> {
    await this.prevPageButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Check if there is a next page
   */
  async hasNextPage(): Promise<boolean> {
    return await this.nextPageButton.isEnabled();
  }

  /**
   * Check if there is a previous page
   */
  async hasPrevPage(): Promise<boolean> {
    return await this.prevPageButton.isEnabled();
  }

  /**
   * Get current page information
   */
  async getPageInfo(): Promise<{ current: number; total: number }> {
    const text = await this.pageInfo.textContent() || '';
    const matches = text.match(/(\d+)\s*\/\s*(\d+)/);
    if (matches) {
      return {
        current: parseInt(matches[1], 10),
        total: parseInt(matches[2], 10),
      };
    }
    return { current: 1, total: 1 };
  }

  // ===========================
  // Create Post
  // ===========================

  /**
   * Click the create post button
   */
  async clickCreatePost(): Promise<void> {
    await this.createPostButton.click();
  }

  // ===========================
  // Assertion Methods
  // ===========================

  /**
   * Verify that posts are displayed
   */
  async verifyPostsDisplayed(): Promise<void> {
    await expect(this.postCards.first()).toBeVisible();
  }

  /**
   * Verify that a specific post is displayed
   * @param title - Post title to verify
   */
  async verifyPostDisplayed(title: string): Promise<void> {
    const postCard = this.page.locator(`.post-card:has-text("${title}")`);
    await expect(postCard).toBeVisible();
  }

  /**
   * Verify that no posts are displayed (empty state)
   */
  async verifyNoPosts(): Promise<void> {
    await expect(this.emptyStateMessage).toBeVisible();
    await expect(this.postCards).toHaveCount(0);
  }

  /**
   * Verify the number of posts displayed
   * @param expectedCount - Expected number of post cards
   */
  async verifyPostCount(expectedCount: number): Promise<void> {
    await expect(this.postCards).toHaveCount(expectedCount);
  }

  /**
   * Verify that a specific category is selected
   * @param category - Expected selected category
   */
  async verifyCategorySelected(category: string): Promise<void> {
    const selectedTab = this.categoryTabs.filter({ hasText: category });
    await expect(selectedTab).toHaveAttribute('aria-selected', 'true');
  }

  /**
   * Verify that pinned posts are displayed at the top
   */
  async verifyPinnedPostsFirst(): Promise<void> {
    const firstPost = this.postCards.first();
    await expect(firstPost.locator('[data-testid="pinned-badge"], .pinned-badge')).toBeVisible();
  }

  /**
   * Verify the result count
   * @param expectedCount - Expected result count
   */
  async verifyResultCount(expectedCount: number): Promise<void> {
    const countText = await this.resultCount.textContent();
    const count = parseInt(countText?.match(/\d+/)?.[0] || '0', 10);
    expect(count).toBe(expectedCount);
  }

  /**
   * Wait for posts to load
   */
  async waitForPostsToLoad(): Promise<void> {
    await this.waitForNetworkIdle();
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  // ===========================
  // Utility Methods
  // ===========================

  /**
   * Get all visible post card locators
   */
  getPostCards(): Locator {
    return this.postCards;
  }

  /**
   * Check if posts list is loading
   */
  async isLoading(): Promise<boolean> {
    return await this.loadingIndicator.isVisible().catch(() => false);
  }
}
