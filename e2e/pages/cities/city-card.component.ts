import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * City Card Component Object Model
 *
 * Represents a reusable city card component used throughout the application.
 * City cards appear on the home page, cities list page, and related cities sections.
 * This component provides methods to interact with individual city cards.
 */
export class CityCardComponent {
  readonly page: Page;
  readonly basePage: BasePage;
  readonly locator: Locator;

  constructor(page: Page, locator: Locator | string) {
    this.page = page;
    this.basePage = new BasePage(page);
    this.locator = typeof locator === 'string' ? page.locator(locator) : locator;
  }

  // ===========================
  // Card Element Locators
  // ===========================

  /**
   * Get the card container
   */
  get card(): Locator {
    return this.locator;
  }

  /**
   * Get the card link that navigates to city detail
   */
  get link(): Locator {
    return this.locator.locator('a[href*="/cities/"]').first();
  }

  /**
   * Get the city name element
   */
  get cityName(): Locator {
    return this.locator.locator('h1, h2, h3, [class*="city-name"]').filter({ hasText: '🏙️' });
  }

  /**
   * Get the city region element
   */
  get cityRegion(): Locator {
    return this.locator.locator('p:has-text("📍"), [class*="region"], [class*="Region"]');
  }

  /**
   * Get the city image/emoji container
   */
  get cityImage(): Locator {
    return this.locator.locator('img, div:has-text("🏙️"), [class*="image"], [class*="avatar"]');
  }

  /**
   * Get the rating display
   */
  get rating(): Locator {
    return this.locator.locator('[class*="rating"], span:has-text("⭐")');
  }

  /**
   * Get the like button
   */
  get likeButton(): Locator {
    return this.locator.locator('button:has(svg[class*="heart"]), button[aria-label*="like"], button:has-text("♡")');
  }

  /**
   * Get the "view details" button
   */
  get viewDetailsButton(): Locator {
    return this.locator.locator('button:has-text("자세히"), a:has-text("자세히"), button:has-text("상세보기")');
  }

  /**
   * Get badges container
   */
  get badges(): Locator {
    return this.locator.locator('[class*="badge"], [class*="Badge"]');
  }

  /**
   * Get the popular badge
   */
  get popularBadge(): Locator {
    return this.locator.locator('.badge:has-text("인기"), .badge:has-text("Popular")');
  }

  /**
   * Get the rising badge
   */
  get risingBadge(): Locator {
    return this.locator.locator('.badge:has-text("상승"), .badge:has-text("Rising")');
  }

  /**
   * Get the new badge
   */
  get newBadge(): Locator {
    return this.locator.locator('.badge:has-text("신규"), .badge:has-text("New")');
  }

  // ===========================
  // City Metrics Locators
  // ===========================

  /**
   * Get monthly cost display
   */
  get monthlyCost(): Locator {
    return this.locator.locator('[class*="cost"], :has-text("₩"), :has-text("만")').filter({ hasText: '₩' });
  }

  /**
   * Get internet speed display
   */
  get internetSpeed(): Locator {
    return this.locator.locator(':has-text("Mbps"), :has-text("📡")');
  }

  /**
   * Get cafe count display
   */
  get cafeCount(): Locator {
    return this.locator.locator(':has-text("☕"), :has-text("카페")');
  }

  /**
   * Get current temperature display
   */
  get temperature(): Locator {
    return this.locator.locator(':has-text("°C"), :has-text("🌤️")');
  }

  /**
   * Get nomad count (people currently in city)
   */
  get nomadsNow(): Locator {
    return this.locator.locator(':has-text("명"), :has-text("🧑‍💼"), :has-text("노마드")');
  }

  /**
   * Get like count percentage
   */
  get likeCount(): Locator {
    return this.locator.locator(':has-text("%"), :has-text("좋아요")');
  }

  /**
   * Get review count
   */
  get reviewCount(): Locator {
    return this.locator.locator(':has-text("리뷰"), :has-text("개")');
  }

  // ===========================
  // Data Extraction Methods
  // ===========================

  /**
   * Get the city name text (without emoji)
   */
  async getCityName(): Promise<string> {
    const text = await this.cityName.textContent();
    return text ? text.replace('🏙️', '').trim() : '';
  }

  /**
   * Get the city region text
   */
  async getCityRegion(): Promise<string> {
    const text = await this.cityRegion.textContent();
    return text ? text.replace('📍', '').trim() : '';
  }

  /**
   * Get the rating value
   */
  async getRating(): Promise<number> {
    const text = await this.rating.textContent();
    if (!text) return 0;
    const match = text.match(/([\d.]+)\/?/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get monthly cost in won
   */
  async getMonthlyCost(): Promise<number> {
    const text = await this.monthlyCost.textContent();
    if (!text) return 0;
    const match = text.match(/₩?([\d,]+)만/);
    return match ? parseInt(match[1].replace(',', ''), 10) * 10000 : 0;
  }

  /**
   * Get internet speed in Mbps
   */
  async getInternetSpeed(): Promise<number> {
    const text = await this.internetSpeed.textContent();
    if (!text) return 0;
    const match = text.match(/([\d,]+)Mbps/);
    return match ? parseInt(match[1].replace(',', ''), 10) : 0;
  }

  /**
   * Get cafe count
   */
  async getCafeCount(): Promise<number> {
    const text = await this.cafeCount.textContent();
    if (!text) return 0;
    const match = text.match(/([\d,]+)/);
    return match ? parseInt(match[1].replace(',', ''), 10) : 0;
  }

  /**
   * Get current temperature
   */
  async getTemperature(): Promise<number> {
    const text = await this.temperature.textContent();
    if (!text) return 0;
    const match = text.match(/(-?[\d.]+)°C/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get number of nomads currently in city
   */
  async getNomadsNow(): Promise<number> {
    const text = await this.nomadsNow.textContent();
    if (!text) return 0;
    const match = text.match(/([\d,]+)명/);
    return match ? parseInt(match[1].replace(',', ''), 10) : 0;
  }

  /**
   * Get like percentage
   */
  async getLikePercentage(): Promise<number> {
    const text = await this.likeCount.textContent();
    if (!text) return 0;
    const match = text.match(/([\d,]+)%/);
    return match ? parseInt(match[1].replace(',', ''), 10) : 0;
  }

  /**
   * Get review count
   */
  async getReviewCount(): Promise<number> {
    const text = await this.reviewCount.textContent();
    if (!text) return 0;
    const match = text.match(/([\d,]+)개/);
    return match ? parseInt(match[1].replace(',', ''), 10) : 0;
  }

  /**
   * Get all badge texts
   */
  async getBadges(): Promise<string[]> {
    const badges = await this.badges.all();
    const texts: string[] = [];

    for (const badge of badges) {
      const text = await badge.textContent();
      if (text) {
        texts.push(text.trim());
      }
    }

    return texts;
  }

  /**
   * Get city slug from the href attribute
   */
  async getCitySlug(): Promise<string> {
    const href = await this.link.getAttribute('href');
    if (!href) return '';

    const match = href.match(/\/cities\/([^\/\?]+)/);
    return match ? match[1] : '';
  }

  // ===========================
  // Interaction Methods
  // ===========================

  /**
   * Click on the city card to navigate to detail page
   */
  async click(): Promise<void> {
    await this.link.click();
  }

  /**
   * Click on the like button
   */
  async clickLike(): Promise<void> {
    const hasLikeButton = await this.likeButton.count() > 0;
    if (hasLikeButton) {
      await this.likeButton.click();
    }
  }

  /**
   * Click the "view details" button
   */
  async clickViewDetails(): Promise<void> {
    const hasViewButton = await this.viewDetailsButton.count() > 0;
    if (hasViewButton) {
      await this.viewDetailsButton.click();
    } else {
      await this.click();
    }
  }

  /**
   * Hover over the card
   */
  async hover(): Promise<void> {
    await this.locator.hover();
  }

  // ===========================
  // Verification Methods
  // ===========================

  /**
   * Check if the card is visible
   */
  async isVisible(): Promise<boolean> {
    return await this.locator.isVisible().catch(() => false);
  }

  /**
   * Check if the card has a popular badge
   */
  async hasPopularBadge(): Promise<boolean> {
    return await this.popularBadge.isVisible().catch(() => false);
  }

  /**
   * Check if the card has a rising badge
   */
  async hasRisingBadge(): Promise<boolean> {
    return await this.risingBadge.isVisible().catch(() => false);
  }

  /**
   * Check if the card has a new badge
   */
  async hasNewBadge(): Promise<boolean> {
    return await this.newBadge.isVisible().catch(() => false);
  }

  /**
   * Check if the like button exists
   */
  async hasLikeButton(): Promise<boolean> {
    return await this.likeButton.count() > 0;
  }

  /**
   * Check if the card is liked (heart filled)
   */
  async isLiked(): Promise<boolean> {
    const hasLikeButton = await this.likeButton.count() > 0;
    if (!hasLikeButton) return false;

    // Check if the heart icon has fill class
    const classList = await this.likeButton.getAttribute('class') || '';
    return classList.includes('fill-red-500') || classList.includes('text-red-500');
  }

  /**
   * Verify that all expected elements are visible
   */
  async verifyCardStructure(): Promise<void> {
    await expect(this.cityName).toBeVisible();
    await expect(this.cityRegion).toBeVisible();
    await expect(this.rating).toBeVisible();
  }

  // ===========================
  // Screenshot Methods
  // ===========================

  /**
   * Take a screenshot of the card
   * @param filename - Screenshot filename
   */
  async screenshot(filename?: string): Promise<Buffer> {
    const name = filename || `city-card-${await this.getCitySlug()}`;
    return await this.locator.screenshot({
      path: `test-results/screenshots/${name}.png`
    });
  }

  // ===========================
  // Static Factory Methods
  // ===========================

  /**
   * Create a CityCardComponent from a city name
   * @param page - Playwright page object
   * @param cityName - Name of the city
   */
  static fromCityName(page: Page, cityName: string): CityCardComponent {
    const locator = page.locator(`a[href*="/cities/"]:has-text("${cityName}")`);
    return new CityCardComponent(page, locator);
  }

  /**
   * Create a CityCardComponent from a city slug
   * @param page - Playwright page object
   * @param slug - City slug
   */
  static fromCitySlug(page: Page, slug: string): CityCardComponent {
    const locator = page.locator(`a[href="/cities/${slug}"]`);
    return new CityCardComponent(page, locator);
  }

  /**
   * Get all city cards on the page
   * @param page - Playwright page object
   */
  static getAllCards(page: Page): CityCardComponent[] {
    const locators = page.locator('a[href*="/cities/"]');
    const count = locators.count();
    const cards: CityCardComponent[] = [];

    for (let i = 0; i < count; i++) {
      cards.push(new CityCardComponent(page, locators.nth(i)));
    }

    return cards;
  }

  /**
   * Get city card at a specific index
   * @param page - Playwright page object
   * @param index - Card index (0-based)
   */
  static getCardAt(page: Page, index: number): CityCardComponent {
    const locator = page.locator('a[href*="/cities/"]').nth(index);
    return new CityCardComponent(page, locator);
  }

  // ===========================
  // Comparison Methods
  // ===========================

  /**
   * Compare this card with another city card
   * @param other - Another CityCardComponent instance
   */
  async compareWith(other: CityCardComponent): Promise<{
    sameName: boolean;
    sameRegion: boolean;
    ratingDiff: number;
    costDiff: number;
  }> {
    const thisName = await this.getCityName();
    const otherName = await other.getCityName();
    const thisRegion = await this.getCityRegion();
    const otherRegion = await other.getCityRegion();
    const thisRating = await this.getRating();
    const otherRating = await other.getRating();
    const thisCost = await this.getMonthlyCost();
    const otherCost = await other.getMonthlyCost();

    return {
      sameName: thisName === otherName,
      sameRegion: thisRegion === otherRegion,
      ratingDiff: thisRating - otherRating,
      costDiff: thisCost - otherCost,
    };
  }

  // ===========================
  // Filter/Validation Helpers
  // ===========================

  /**
   * Check if card matches search criteria
   * @param criteria - Search criteria object
   */
  async matchesCriteria(criteria: {
    name?: string;
    region?: string;
    minRating?: number;
    maxCost?: number;
  }): Promise<boolean> {
    if (criteria.name) {
      const name = await this.getCityName();
      if (!name.includes(criteria.name)) return false;
    }

    if (criteria.region) {
      const region = await this.getCityRegion();
      if (!region.includes(criteria.region)) return false;
    }

    if (criteria.minRating) {
      const rating = await this.getRating();
      if (rating < criteria.minRating) return false;
    }

    if (criteria.maxCost) {
      const cost = await this.getMonthlyCost();
      if (cost > criteria.maxCost) return false;
    }

    return true;
  }

  /**
   * Get all card data as an object
   */
  async getData(): Promise<{
    name: string;
    region: string;
    rating: number;
    monthlyCost: number;
    internetSpeed: number;
    cafeCount: number;
    temperature: number;
    nomadsNow: number;
    likePercentage: number;
    reviewCount: number;
    badges: string[];
    slug: string;
  }> {
    return {
      name: await this.getCityName(),
      region: await this.getCityRegion(),
      rating: await this.getRating(),
      monthlyCost: await this.getMonthlyCost(),
      internetSpeed: await this.getInternetSpeed(),
      cafeCount: await this.getCafeCount(),
      temperature: await this.getTemperature(),
      nomadsNow: await this.getNomadsNow(),
      likePercentage: await this.getLikePercentage(),
      reviewCount: await this.getReviewCount(),
      badges: await this.getBadges(),
      slug: await this.getCitySlug(),
    };
  }
}
