import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Meetups List Page Object Model
 *
 * Represents the meetups listing page where users can browse and filter meetups.
 * Provides methods for navigating, filtering, searching, and interacting with meetup cards.
 */
export class MeetupsListPage extends BasePage {
  readonly page: Page;

  // ===========================
  // Selectors
  // ===========================

  // Search and filter selectors
  readonly searchInput: Locator;
  readonly sortSelect: Locator;
  readonly cityFilterSelect: Locator;
  readonly statusFilterSelect: Locator;
  readonly resetFiltersButton: Locator;

  // Meetup cards selectors
  readonly meetupCards: Locator;
  readonly createMeetupButton: Locator;
  readonly emptyStateMessage: Locator;
  readonly loadingIndicator: Locator;

  // Pagination selectors
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
    this.sortSelect = page.locator('select[name="sort"], .sort-select');
    this.cityFilterSelect = page.locator('select[name="city"], .city-filter');
    this.statusFilterSelect = page.locator('select[name="status"], .status-filter');
    this.resetFiltersButton = page.locator('button:has-text("초기화"), button:has-text("Reset"), button[aria-label*="reset" i]');

    this.meetupCards = page.locator('[data-testid="meetup-card"], .meetup-card, article.meetup');
    this.createMeetupButton = page.locator('a[href*="/meetups/create"], button:has-text("모임 만들기"), button:has-text("Create Meetup")');
    this.emptyStateMessage = page.locator('.empty-state, [data-testid="empty-state"]');
    this.loadingIndicator = page.locator('.loading, [data-testid="loading"], .spinner');

    this.paginationContainer = page.locator('.pagination, nav[aria-label="pagination"]');
    this.nextPageButton = page.locator('button[aria-label="next"], .pagination-next, a[rel="next"]');
    this.prevPageButton = page.locator('button[aria-label="previous"], .pagination-prev, a[rel="prev"]');
    this.pageInfo = page.locator('.page-info, [data-testid="page-info"]');

    this.resultCount = page.locator('[data-testid="result-count"], .result-count');
  }

  // ===========================
  // Navigation
  // ===========================

  /**
   * Navigate to the meetups list page
   */
  async goto(): Promise<void> {
    await this.goto('/meetups');
  }

  /**
   * Navigate to a specific city's meetups
   * @param citySlug - City slug (e.g., 'seoul', 'busan')
   */
  async gotoCityMeetups(citySlug: string): Promise<void> {
    await this.goto(`/cities/${citySlug}/meetups`);
  }

  // ===========================
  // Search and Filter Methods
  // ===========================

  /**
   * Search for meetups by keyword
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
   * Sort meetups by the specified option
   * @param sortOption - Sort option (e.g., 'latest', 'upcoming', 'popular')
   */
  async sortBy(sortOption: string): Promise<void> {
    await this.sortSelect.selectOption(sortOption);
    await this.waitForNetworkIdle();
  }

  /**
   * Filter meetups by city
   * @param cityName - City name to filter by
   */
  async filterByCity(cityName: string): Promise<void> {
    await this.cityFilterSelect.selectOption({ label: cityName });
    await this.waitForNetworkIdle();
  }

  /**
   * Filter meetups by status
   * @param status - Status to filter by (e.g., 'open', 'full', 'closed')
   */
  async filterByStatus(status: string): Promise<void> {
    await this.statusFilterSelect.selectOption(status);
    await this.waitForNetworkIdle();
  }

  /**
   * Reset all filters to default state
   */
  async resetFilters(): Promise<void> {
    if (await this.resetFiltersButton.isVisible()) {
      await this.resetFiltersButton.click();
      await this.waitForNetworkIdle();
    } else {
      // Manually reset if no reset button
      await this.clearSearch();
      await this.sortBy('latest');
      await this.cityFilterSelect.selectOption({ label: '전체' });
      await this.statusFilterSelect.selectOption({ label: '전체' });
    }
  }

  // ===========================
  // Meetup Card Interactions
  // ===========================

  /**
   * Click on a meetup card by index
   * @param index - Zero-based index of the meetup card
   */
  async clickMeetupCard(index: number): Promise<void> {
    const cards = this.meetupCards;
    await cards.nth(index).click();
  }

  /**
   * Click on a meetup card by title
   * @param title - Meetup title to search for
   */
  async clickMeetupByTitle(title: string): Promise<void> {
    const meetupCard = this.page.locator(`[data-testid="meetup-card"]:has-text("${title}"), .meetup-card:has-text("${title}")`);
    await meetupCard.click();
  }

  /**
   * Get the title of a meetup card by index
   * @param index - Zero-based index of the meetup card
   */
  async getMeetupTitle(index: number): Promise<string> {
    const card = this.meetupCards.nth(index);
    const titleLocator = card.locator('[data-testid="meetup-title"], .meetup-title, h2, h3');
    return await titleLocator.textContent() || '';
  }

  /**
   * Get all meetup titles on the page
   */
  async getAllMeetupTitles(): Promise<string[]> {
    const titles: string[] = [];
    const count = await this.meetupCards.count();

    for (let i = 0; i < count; i++) {
      const title = await this.getMeetupTitle(i);
      titles.push(title);
    }

    return titles;
  }

  /**
   * Get meetup details by index
   * @param index - Zero-based index of the meetup card
   */
  async getMeetupDetails(index: number): Promise<{
    title: string;
    date: string;
    location: string;
    participants: number;
    status: string;
  }> {
    const card = this.meetupCards.nth(index);

    const title = await card.locator('[data-testid="meetup-title"], .meetup-title').textContent() || '';
    const date = await card.locator('[data-testid="meetup-date"], .meetup-date').textContent() || '';
    const location = await card.locator('[data-testid="meetup-location"], .meetup-location').textContent() || '';
    const participantsText = await card.locator('[data-testid="participants"], .participants').textContent() || '';
    const status = await card.locator('[data-testid="status"], .status, .badge').textContent() || '';

    const participants = parseInt(participantsText.match(/\d+/)?.[0] || '0', 10);

    return { title, date, location, participants, status };
  }

  // ===========================
  // Pagination Methods
  // ===========================

  /**
   * Go to the next page of meetups
   */
  async goToNextPage(): Promise<void> {
    await this.nextPageButton.click();
    await this.waitForNetworkIdle();
  }

  /**
   * Go to the previous page of meetups
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
  // Create Meetup
  // ===========================

  /**
   * Click the create meetup button
   */
  async clickCreateMeetup(): Promise<void> {
    await this.createMeetupButton.click();
  }

  // ===========================
  // Assertion Methods
  // ===========================

  /**
   * Verify that meetups are displayed
   */
  async verifyMeetupsDisplayed(): Promise<void> {
    await expect(this.meetupCards.first()).toBeVisible();
  }

  /**
   * Verify that a specific meetup is displayed
   * @param title - Meetup title to verify
   */
  async verifyMeetupDisplayed(title: string): Promise<void> {
    const meetupCard = this.page.locator(`.meetup-card:has-text("${title}")`);
    await expect(meetupCard).toBeVisible();
  }

  /**
   * Verify that no meetups are displayed (empty state)
   */
  async verifyNoMeetups(): Promise<void> {
    await expect(this.emptyStateMessage).toBeVisible();
    await expect(this.meetupCards).toHaveCount(0);
  }

  /**
   * Verify the number of meetups displayed
   * @param expectedCount - Expected number of meetup cards
   */
  async verifyMeetupCount(expectedCount: number): Promise<void> {
    await expect(this.meetupCards).toHaveCount(expectedCount);
  }

  /**
   * Verify that search input has the expected value
   * @param expectedValue - Expected search value
   */
  async verifySearchValue(expectedValue: string): Promise<void> {
    await expect(this.searchInput).toHaveValue(expectedValue);
  }

  /**
   * Verify that the result count matches expected
   * @param expectedCount - Expected result count
   */
  async verifyResultCount(expectedCount: number): Promise<void> {
    const countText = await this.resultCount.textContent();
    const count = parseInt(countText?.match(/\d+/)?.[0] || '0', 10);
    expect(count).toBe(expectedCount);
  }

  /**
   * Verify that a specific sort option is selected
   * @param option - Expected selected option
   */
  async verifySortSelected(option: string): Promise<void> {
    const selectedValue = await this.sortSelect.inputValue();
    expect(selectedValue).toContain(option);
  }

  /**
   * Wait for meetups to load
   */
  async waitForMeetupsToLoad(): Promise<void> {
    await this.waitForNetworkIdle();
    await expect(this.loadingIndicator).toBeHidden({ timeout: 10000 }).catch(() => {
      // Loading indicator might not be present, continue
    });
  }

  // ===========================
  // Utility Methods
  // ===========================

  /**
   * Get all visible meetup card locators
   */
  getMeetupCards(): Locator {
    return this.meetupCards;
  }

  /**
   * Check if meetups list is loading
   */
  async isLoading(): Promise<boolean> {
    return await this.loadingIndicator.isVisible().catch(() => false);
  }
}
