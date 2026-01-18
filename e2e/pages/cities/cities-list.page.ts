import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * Cities List Page Object Model
 *
 * Represents the cities list page (/cities) of the Konomads application.
 * Contains locators and methods for browsing and filtering cities.
 */
export class CitiesListPage extends BasePage {
  // ===========================
  // Page URL
  // ===========================
  readonly url = '/cities';

  // ===========================
  // Header Section Locators
  // ===========================
  readonly pageHeader: Locator;
  readonly pageTitle: Locator;
  readonly pageSubtitle: Locator;

  // ===========================
  // Filter Section Locators
  // ===========================
  readonly filterSection: Locator;
  readonly searchInput: Locator;
  readonly sortDropdown: Locator;
  readonly regionDropdown: Locator;
  readonly filterResetButton: Locator;

  // ===========================
  // Results Section Locators
  // ===========================
  readonly resultsSection: Locator;
  readonly cityGrid: Locator;
  readonly cityCards: Locator;
  readonly cityCardByName: (name: string) => Locator;
  readonly resultCount: Locator;
  readonly resultCountText: Locator;

  // ===========================
  // Empty State Locators
  // ===========================
  readonly emptyState: Locator;
  readonly emptyStateMessage: Locator;
  readonly emptyStateIcon: Locator;

  // ===========================
  // Sort Options
  // ===========================
  readonly sortOptions = {
    popular: '인기순',
    rating: '평점순',
    costLow: '저렴한순',
    costHigh: '비싼순',
  };

  // ===========================
  // Navigation Locators
  // ===========================
  readonly backButton: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    super(page);

    // Header Section
    this.pageHeader = page.locator('section:has-text("모든 도시"), section:has-text("🌏")');
    this.pageTitle = page.locator('h1:has-text("모든 도시 보기"), h1:has-text("🌏")');
    this.pageSubtitle = page.locator('p:has-text("노마드를 위한 완벽한 도시")');

    // Filter Section
    this.filterSection = page.locator('section.sticky, section:has(input[type="text"])');
    this.searchInput = page.locator('input[placeholder*="검색"], input[type="text"]').first();
    this.sortDropdown = page.locator('select:has-text("인기순"), select').nth(0);
    this.regionDropdown = page.locator('select:has-text("전체 지역"), select').nth(1);
    this.filterResetButton = page.locator('button:has-text("필터 초기화"), button:has-text("초기화")');

    // Results Section
    this.resultsSection = page.locator('section:has-text("개의 도시")');
    this.cityGrid = page.locator('div.grid:has(a[href*="/cities/"]), div[class*="grid-cols"]');
    this.cityCards = page.locator('a[href*="/cities/"]');
    this.cityCardByName = (name: string) => page.locator(`a[href*="/cities/"]:has-text("${name}")`);
    this.resultCount = page.locator('span:has-text(/\\d+/)').filter({ hasText: '개의 도시' });
    this.resultCountText = page.locator('p:has-text("총"), p:has-text("개의 도시")');

    // Empty State
    this.emptyState = page.locator('div.text-center:has-text("검색 결과가 없습니다")');
    this.emptyStateMessage = page.locator('p:has-text("검색 결과가 없습니다"), p:has-text("다른 검색어")');
    this.emptyStateIcon = page.locator('p:has-text("🔍")');

    // Navigation
    this.backButton = page.locator('button:has-text("뒤로가기"), a:has-text("뒤로가기")');
    this.homeButton = page.locator('button:has-text("홈"), a:has-text("홈")');
  }

  // ===========================
  // Navigation Methods
  // ===========================

  /**
   * Navigate to the cities list page
   */
  async goto(): Promise<void> {
    await super.goto(this.url);
  }

  /**
   * Click the back button
   */
  async clickBack(): Promise<void> {
    await this.click(this.backButton);
  }

  /**
   * Click the home button
   */
  async clickHome(): Promise<void> {
    await this.click(this.homeButton);
  }

  // ===========================
  // Search Methods
  // ===========================

  /**
   * Search for cities by keyword
   * @param keyword - Search keyword (city name, region, or description)
   */
  async search(keyword: string): Promise<void> {
    await this.fill(this.searchInput, keyword);
    // Wait for search to execute
    await this.page.waitForTimeout(500);
  }

  /**
   * Clear the search input
   */
  async clearSearch(): Promise<void> {
    await this.clear(this.searchInput);
  }

  /**
   * Get current search value
   */
  async getSearchValue(): Promise<string> {
    return await this.searchInput.inputValue();
  }

  // ===========================
  // Sort Methods
  // ===========================

  /**
   * Sort cities by popularity
   */
  async sortByPopularity(): Promise<void> {
    await this.selectOption(this.sortDropdown, this.sortOptions.popular);
    await this.page.waitForTimeout(500);
  }

  /**
   * Sort cities by rating
   */
  async sortByRating(): Promise<void> {
    await this.selectOption(this.sortDropdown, this.sortOptions.rating);
    await this.page.waitForTimeout(500);
  }

  /**
   * Sort cities by cost (low to high)
   */
  async sortByCostLow(): Promise<void> {
    await this.selectOption(this.sortDropdown, this.sortOptions.costLow);
    await this.page.waitForTimeout(500);
  }

  /**
   * Sort cities by cost (high to low)
   */
  async sortByCostHigh(): Promise<void> {
    await this.selectOption(this.sortDropdown, this.sortOptions.costHigh);
    await this.page.waitForTimeout(500);
  }

  /**
   * Get current sort value
   */
  async getCurrentSort(): Promise<string> {
    return await this.sortDropdown.inputValue();
  }

  // ===========================
  // Filter Methods
  // ===========================

  /**
   * Filter cities by region
   * @param region - Region name (e.g., "서울특별시", "강원도", "제주특별자치도")
   */
  async filterByRegion(region: string): Promise<void> {
    await this.selectOption(this.regionDropdown, region);
    await this.page.waitForTimeout(500);
  }

  /**
   * Show all regions (reset region filter)
   */
  async showAllRegions(): Promise<void> {
    await this.selectOption(this.regionDropdown, 'all');
    await this.selectOption(this.regionDropdown, '전체 지역');
    await this.page.waitForTimeout(500);
  }

  /**
   * Get current region filter value
   */
  async getCurrentRegion(): Promise<string> {
    return await this.regionDropdown.inputValue();
  }

  /**
   * Reset all filters
   */
  async resetFilters(): Promise<void> {
    const hasResetButton = await this.filterResetButton.count() > 0;
    if (hasResetButton) {
      await this.click(this.filterResetButton);
    } else {
      // Manually reset filters
      await this.clearSearch();
      await this.sortByPopularity();
      await this.showAllRegions();
    }
    await this.page.waitForTimeout(500);
  }

  // ===========================
  // City Grid Methods
  // ===========================

  /**
   * Get the count of displayed city cards
   */
  async getCityCardCount(): Promise<number> {
    await this.page.waitForLoadState('networkidle');
    return await this.cityCards.count();
  }

  /**
   * Click on a city card by name
   * @param cityName - Name of the city to click
   */
  async clickCityCard(cityName: string): Promise<void> {
    const cityCard = this.cityCardByName(cityName);
    await this.click(cityCard);
  }

  /**
   * Check if a city card is visible by name
   * @param cityName - Name of the city
   */
  async isCityCardVisible(cityName: string): Promise<boolean> {
    const cityCard = this.cityCardByName(cityName);
    return await cityCard.isVisible().catch(() => false);
  }

  /**
   * Get all visible city names
   */
  async getVisibleCityNames(): Promise<string[]> {
    const cityCards = await this.cityCards.all();
    const names: string[] = [];

    for (const card of cityCards) {
      const text = await card.textContent();
      if (text) {
        // Extract city name from card text
        const match = text.match(/🏙️\s*([^\s]+)/);
        if (match) {
          names.push(match[1]);
        }
      }
    }

    return names;
  }

  /**
   * Check if a specific city exists in the grid
   * @param cityName - Name of the city
   */
  async hasCity(cityName: string): Promise<boolean> {
    const count = await this.cityCardByName(cityName).count();
    return count > 0;
  }

  // ===========================
  // Result Count Methods
  // ===========================

  /**
   * Get the displayed result count
   */
  async getResultCount(): Promise<number> {
    const text = await this.getText(this.resultCount);
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Verify that the result count matches the actual number of city cards
   */
  async verifyResultCountAccuracy(): Promise<boolean> {
    const displayedCount = await this.getResultCount();
    const actualCount = await this.getCityCardCount();
    return displayedCount === actualCount;
  }

  // ===========================
  // Empty State Methods
  // ===========================

  /**
   * Check if empty state is displayed
   */
  async isEmptyStateVisible(): Promise<boolean> {
    return await this.emptyState.isVisible().catch(() => false);
  }

  /**
   * Get empty state message
   */
  async getEmptyStateMessage(): Promise<string> {
    return await this.getText(this.emptyStateMessage);
  }

  /**
   * Verify empty state is shown when no results match
   */
  async verifyEmptyState(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
    await expect(this.emptyStateMessage).toBeVisible();
  }

  // ===========================
  // Verification Methods
  // ===========================

  /**
   * Verify that the cities list page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.cityGrid).toBeVisible();
    await expect(this.searchInput).toBeVisible();
    await expect(this.sortDropdown).toBeVisible();
    await expect(this.regionDropdown).toBeVisible();
  }

  /**
   * Verify that specific cities are visible
   * @param cityNames - Array of city names to verify
   */
  async verifyCitiesVisible(cityNames: string[]): Promise<void> {
    for (const cityName of cityNames) {
      await expect(this.cityCardByName(cityName)).toBeVisible();
    }
  }

  /**
   * Verify that specific cities are NOT visible
   * @param cityNames - Array of city names to verify
   */
  async verifyCitiesNotVisible(cityNames: string[]): Promise<void> {
    for (const cityName of cityNames) {
      await expect(this.cityCardByName(cityName)).not.toBeVisible();
    }
  }

  /**
   * Verify that the result count is displayed
   */
  async verifyResultCountDisplayed(): Promise<void> {
    await expect(this.resultCount).toBeVisible();
  }

  // ===========================
  // Combined Filter Methods
  // ===========================

  /**
   * Search and filter cities
   * @param options - Filter options
   */
  async searchAndFilter(options: {
    keyword?: string;
    sort?: keyof typeof this.sortOptions;
    region?: string;
  }): Promise<void> {
    if (options.keyword !== undefined) {
      if (options.keyword === '') {
        await this.clearSearch();
      } else {
        await this.search(options.keyword);
      }
    }

    if (options.region !== undefined) {
      if (options.region === 'all') {
        await this.showAllRegions();
      } else {
        await this.filterByRegion(options.region);
      }
    }

    if (options.sort) {
      const sortValue = this.sortOptions[options.sort];
      await this.selectOption(this.sortDropdown, sortValue);
    }

    await this.page.waitForTimeout(500);
  }

  /**
   * Search for cities in a specific region
   * @param region - Region name
   * @param keyword - Optional search keyword
   */
  async searchInRegion(region: string, keyword?: string): Promise<void> {
    await this.filterByRegion(region);
    if (keyword) {
      await this.search(keyword);
    }
  }

  // ===========================
  // Scroll Methods
  // ===========================

  /**
   * Scroll to the city grid
   */
  async scrollToCityGrid(): Promise<void> {
    await this.scrollToElement(this.cityGrid);
  }

  /**
   * Scroll to the filters section
   */
  async scrollToFilters(): Promise<void> {
    await this.scrollToElement(this.filterSection);
  }

  // ===========================
  // Screenshot Methods
  // ===========================

  /**
   * Take a screenshot of the city grid
   */
  async screenshotCityGrid(): Promise<Buffer> {
    return await this.screenshotElement(this.cityGrid, 'cities-grid');
  }

  /**
   * Take a screenshot of the filters section
   */
  async screenshotFilters(): Promise<Buffer> {
    return await this.screenshotElement(this.filterSection, 'cities-filters');
  }

  /**
   * Take a screenshot of empty state
   */
  async screenshotEmptyState(): Promise<Buffer> {
    return await this.screenshotElement(this.emptyState, 'cities-empty-state');
  }

  // ===========================
  // URL Verification
  // ===========================

  /**
   * Verify that current URL is the cities list page
   */
  async verifyUrl(): Promise<void> {
    await this.verifyUrl(this.url);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForLoadState();
    await this.waitForVisible(this.cityGrid);
  }

  // ===========================
  // Accessibility Helpers
  // ===========================

  /**
   * Focus on the search input
   */
  async focusSearch(): Promise<void> {
    await this.searchInput.focus();
  }

  /**
   * Press Enter in the search input
   */
  async pressEnterInSearch(): Promise<void> {
    await this.searchInput.press('Enter');
  }

  /**
   * Tab to the next element after search input
   */
  async tabFromSearch(): Promise<void> {
    await this.searchInput.press('Tab');
  }
}
