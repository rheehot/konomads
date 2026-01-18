import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Home Page Object Model
 *
 * Represents the home page (/) of the Konomads application.
 * Contains locators and methods for interacting with home page elements.
 */
export class HomePage extends BasePage {
  // ===========================
  // Page URL
  // ===========================
  readonly url = '/';

  // ===========================
  // Hero Section Locators
  // ===========================
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroCtaButton: Locator;

  // ===========================
  // Stats Section Locators
  // ===========================
  readonly statsSection: Locator;
  readonly statCards: Locator;

  // ===========================
  // Quick Filters Locators
  // ===========================
  readonly quickFiltersSection: Locator;
  readonly filterButtons: Locator;
  readonly filterButtonByLabel: (label: string) => Locator;

  // ===========================
  // City Grid Locators
  // ===========================
  readonly cityGridSection: Locator;
  readonly cityGrid: Locator;
  readonly cityCards: Locator;
  readonly cityCardByName: (name: string) => Locator;
  readonly viewAllCitiesButton: Locator;

  // ===========================
  // AI Recommendation Locators
  // ===========================
  readonly aiRecommendationSection: Locator;
  readonly aiRecommendationButton: Locator;

  // ===========================
  // Meetup Section Locators
  // ===========================
  readonly meetupSection: Locator;
  readonly meetupCards: Locator;
  readonly viewAllMeetupsButton: Locator;

  // ===========================
  // Review Section Locators
  // ===========================
  readonly reviewSection: Locator;
  readonly reviewCards: Locator;

  // ===========================
  // Trending Section Locators
  // ===========================
  readonly trendingSection: Locator;
  readonly trendingCities: Locator;

  // ===========================
  // Live Dashboard Locators
  // ===========================
  readonly liveDashboardSection: Locator;

  // ===========================
  // Pricing Section Locators
  // ===========================
  readonly pricingSection: Locator;
  readonly pricingCards: Locator;

  // ===========================
  // Navigation Locators
  // ===========================
  readonly navigationBar: Locator;
  readonly loginButton: Locator;
  readonly signupButton: Locator;
  readonly citiesLink: Locator;
  readonly meetupsLink: Locator;
  readonly profileLink: Locator;

  constructor(page: Page) {
    super(page);

    // Hero Section
    this.heroSection = page.locator('section:has-text("노마드를 위한")');
    this.heroTitle = page.locator('h1').first();
    this.heroSubtitle = page.locator('p:has-text("완벽한 도시를")').first();
    this.heroCtaButton = page.locator('a:has-text("시작하기"), button:has-text("시작하기")').first();

    // Stats Section
    this.statsSection = page.locator('section:has-text("도시"), section:has-text("노마드")').nth(0);
    this.statCards = page.locator('[class*="stat"], [class*="Stat"], [class*="stats"]').or(
      page.locator('div:has-text("명")').filter({ hasText: /\d+/ })
    );

    // Quick Filters
    this.quickFiltersSection = page.locator('section:has-text("필터"), section:has-text("카테고리")');
    this.filterButtons = page.locator('button[class*="filter"], button[role="button"]');
    this.filterButtonByLabel = (label: string) => page.locator(`button:has-text("${label}")`);

    // City Grid
    this.cityGridSection = page.locator('section:has-text("도시"), section:has-text("Cities")');
    this.cityGrid = page.locator('div[class*="grid"], div:has(> a[href*="/cities/"])');
    this.cityCards = page.locator('a[href*="/cities/"], [class*="city-card"], [class*="CityCard"]');
    this.cityCardByName = (name: string) => page.locator(`a[href*="/cities/"]:has-text("${name}")`);
    this.viewAllCitiesButton = page.locator('a:has-text("모든 도시"), a:has-text("모두 보기"), a:has-text("더보기")').filter({ hasText: '도시' });

    // AI Recommendation
    this.aiRecommendationSection = page.locator('section:has-text("AI"), section:has-text("추천")');
    this.aiRecommendationButton = page.locator('button:has-text("AI"), a:has-text("AI")').filter({ hasText: '추천' });

    // Meetup Section
    this.meetupSection = page.locator('section:has-text("모임"), section:has-text("Meetup")');
    this.meetupCards = page.locator('a[href*="/meetups/"]');
    this.viewAllMeetupsButton = page.locator('a:has-text("모든 모임"), a:has-text("모두 보기")').filter({ hasText: '모임' });

    // Review Section
    this.reviewSection = page.locator('section:has-text("리뷰"), section:has-text("Review")');
    this.reviewCards = page.locator('[class*="review"], [class*="Review"]');

    // Trending Section
    this.trendingSection = page.locator('section:has-text("인기"), section:has-text("Trending")');
    this.trendingCities = page.locator('[class*="trending"], [class*="Trending"]').locator('a[href*="/cities/"]');

    // Live Dashboard
    this.liveDashboardSection = page.locator('section:has-text("실시간"), section:has-text("Dashboard")');

    // Pricing Section
    this.pricingSection = page.locator('section:has-text("가격"), section:has-text("Pricing")');
    this.pricingCards = page.locator('[class*="pricing"], [class*="Pricing"]');

    // Navigation
    this.navigationBar = page.locator('nav, header');
    this.loginButton = page.locator('a:has-text("로그인"), button:has-text("로그인")');
    this.signupButton = page.locator('a:has-text("회원가입"), button:has-text("가입하기"), button:has-text("시작하기")');
    this.citiesLink = page.locator('a:has-text("도시"), a[href="/cities"]');
    this.meetupsLink = page.locator('a:has-text("모임"), a[href="/meetups"]');
    this.profileLink = page.locator('a[href="/profile"], a:has-text("프로필")');
  }

  // ===========================
  // Navigation Methods
  // ===========================

  /**
   * Navigate to the home page
   */
  async goto(): Promise<void> {
    await this.gotoHome();
  }

  /**
   * Click on the login button in navigation
   */
  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  /**
   * Click on the signup button in navigation
   */
  async clickSignup(): Promise<void> {
    await this.click(this.signupButton);
  }

  /**
   * Navigate to cities page via navigation link
   */
  async navigateToCities(): Promise<void> {
    await this.click(this.citiesLink);
  }

  /**
   * Navigate to meetups page via navigation link
   */
  async navigateToMeetups(): Promise<void> {
    await this.click(this.meetupsLink);
  }

  /**
   * Navigate to profile page via navigation link
   */
  async navigateToProfile(): Promise<void> {
    await this.click(this.profileLink);
  }

  // ===========================
  // Hero Section Methods
  // ===========================

  /**
   * Get the hero title text
   */
  async getHeroTitle(): Promise<string> {
    return await this.getText(this.heroTitle);
  }

  /**
   * Get the hero subtitle text
   */
  async getHeroSubtitle(): Promise<string> {
    return await this.getText(this.heroSubtitle);
  }

  /**
   * Click the hero CTA button
   */
  async clickHeroCta(): Promise<void> {
    await this.click(this.heroCtaButton);
  }

  // ===========================
  // City Grid Methods
  // ===========================

  /**
   * Get the count of city cards displayed
   */
  async getCityCardCount(): Promise<number> {
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
    return await cityCard.isVisible();
  }

  /**
   * Click the "View All Cities" button
   */
  async clickViewAllCities(): Promise<void> {
    await this.click(this.viewAllCitiesButton);
  }

  // ===========================
  // Filter Methods
  // ===========================

  /**
   * Click on a filter button by label
   * @param filterLabel - Label of the filter to click
   */
  async clickFilter(filterLabel: string): Promise<void> {
    const filter = this.filterButtonByLabel(filterLabel);
    await this.click(filter);
  }

  /**
   * Get the count of filter buttons
   */
  async getFilterCount(): Promise<number> {
    return await this.filterButtons.count();
  }

  // ===========================
  // Section Verification Methods
  // ===========================

  /**
   * Verify that the hero section is visible
   */
  async verifyHeroSectionVisible(): Promise<void> {
    await expect(this.heroSection).toBeVisible();
  }

  /**
   * Verify that the stats section is visible
   */
  async verifyStatsSectionVisible(): Promise<void> {
    await expect(this.statsSection).toBeVisible();
  }

  /**
   * Verify that the city grid section is visible
   */
  async verifyCityGridVisible(): Promise<void> {
    await expect(this.cityGridSection).toBeVisible();
  }

  /**
   * Verify that the meetup section is visible
   */
  async verifyMeetupSectionVisible(): Promise<void> {
    await expect(this.meetupSection).toBeVisible();
  }

  /**
   * Verify that the review section is visible
   */
  async verifyReviewSectionVisible(): Promise<void> {
    await expect(this.reviewSection).toBeVisible();
  }

  // ===========================
  // AI Recommendation Methods
  // ===========================

  /**
   * Click the AI recommendation button
   */
  async clickAIRecommendation(): Promise<void> {
    await this.click(this.aiRecommendationButton);
  }

  // ===========================
  // Meetup Methods
  // ===========================

  /**
   * Get the count of meetup cards displayed
   */
  async getMeetupCardCount(): Promise<number> {
    return await this.meetupCards.count();
  }

  /**
   * Click the "View All Meetups" button
   */
  async clickViewAllMeetups(): Promise<void> {
    await this.click(this.viewAllMeetupsButton);
  }

  // ===========================
  // Pricing Methods
  // ===========================

  /**
   * Get the count of pricing cards displayed
   */
  async getPricingCardCount(): Promise<number> {
    return await this.pricingCards.count();
  }

  // ===========================
  // Scroll Methods
  // ===========================

  /**
   * Scroll to the city grid section
   */
  async scrollToCityGrid(): Promise<void> {
    await this.scrollToElement(this.cityGridSection);
  }

  /**
   * Scroll to the stats section
   */
  async scrollToStats(): Promise<void> {
    await this.scrollToElement(this.statsSection);
  }

  /**
   * Scroll to the meetup section
   */
  async scrollToMeetups(): Promise<void> {
    await this.scrollToElement(this.meetupSection);
  }

  // ===========================
  // Auth State Methods
  // ===========================

  /**
   * Check if user is logged in
   * Returns true if profile link is visible and login button is not
   */
  async isLoggedIn(): Promise<boolean> {
    const profileVisible = await this.profileLink.isVisible().catch(() => false);
    const loginVisible = await this.loginButton.isVisible().catch(() => false);
    return profileVisible && !loginVisible;
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForLoadState();
    await this.waitForVisible(this.heroSection);
  }
}
