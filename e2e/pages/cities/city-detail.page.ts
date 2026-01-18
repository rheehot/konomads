import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

/**
 * City Detail Page Object Model
 *
 * Represents a city detail page (/cities/[slug]) of the Konomads application.
 * Contains locators and methods for viewing city information and interactions.
 */
export class CityDetailPage extends BasePage {
  // ===========================
  // Page URL Pattern
  // ===========================
  readonly urlPattern = '/cities/';

  // ===========================
  // Navigation Locators
  // ===========================
  readonly navigationBar: Locator;
  readonly backButton: Locator;
  readonly homeButton: Locator;

  // ===========================
  // Hero Section Locators
  // ===========================
  readonly heroSection: Locator;
  readonly cityName: Locator;
  readonly cityRegion: Locator;
  readonly cityEmoji: Locator;

  // ===========================
  // City Overview Locators
  // ===========================
  readonly overviewCard: Locator;
  readonly overviewTitle: Locator;
  readonly cityDescription: Locator;
  readonly cityRating: Locator;
  readonly cityRatingValue: Locator;
  readonly ratingStars: Locator;

  // ===========================
  // Badge Locators
  // ===========================
  readonly badges: Locator;
  readonly popularBadge: Locator;
  readonly risingBadge: Locator;
  readonly newBadge: Locator;
  readonly reviewCountBadge: Locator;
  readonly likeCountBadge: Locator;

  // ===========================
  // Living Cost Locators
  // ===========================
  readonly livingCostCard: Locator;
  readonly livingCostTitle: Locator;
  readonly monthlyCost: Locator;
  readonly rentStudio: Locator;
  readonly depositCost: Locator;

  // ===========================
  // Infrastructure Locators
  // ===========================
  readonly infrastructureCard: Locator;
  readonly infrastructureTitle: Locator;
  readonly internetSpeed: Locator;
  readonly cafeCount: Locator;
  readonly coworkingCount: Locator;

  // ===========================
  // Weather/Environment Locators
  // ===========================
  readonly weatherCard: Locator;
  readonly weatherTitle: Locator;
  readonly currentTemperature: Locator;
  readonly avgTemperature: Locator;
  readonly airQuality: Locator;
  readonly airQualityLabel: Locator;

  // ===========================
  // Related Cities Locators
  // ===========================
  readonly relatedCitiesCard: Locator;
  readonly relatedCitiesTitle: Locator;
  readonly relatedCitiesGrid: Locator;
  readonly relatedCityLinks: Locator;
  readonly relatedCityByName: (name: string) => Locator;

  // ===========================
  // Action Locators
  // ===========================
  readonly likeButton: Locator;
  readonly bookmarkButton: Locator;
  readonly shareButton: Locator;
  readonly reviewButton: Locator;

  // ===========================
  // Review Section Locators
  // ===========================
  readonly reviewSection: Locator;
  readonly reviewCards: Locator;
  readonly reviewCount: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation
    this.navigationBar = page.locator('nav.sticky');
    this.backButton = page.locator('button:has-text("뒤로가기"), a:has-text("뒤로가기")');
    this.homeButton = page.locator('button:has-text("홈"), a:has-text("홈")');

    // Hero Section
    this.heroSection = page.locator('section.relative:has(h1), section:has-text("🏙️")');
    this.cityName = page.locator('h1:has-text("🏙️")');
    this.cityRegion = page.locator('p:has-text("📍")');
    this.cityEmoji = page.locator('span:has-text("🏙️"), text=🏙️');

    // City Overview
    this.overviewCard = page.locator('.card:has-text("도시 개요")');
    this.overviewTitle = page.locator('.card-header:has-text("도시 개요")');
    this.cityDescription = page.locator('.card-content p.text-lg');
    this.cityRating = page.locator('.card-header:has-text("⭐")');
    this.cityRatingValue = page.locator('.card-header span.text-2xl');
    this.ratingStars = page.locator('.card-header:has-text("⭐")');

    // Badges
    this.badges = page.locator('.badge, [class*="Badge"]');
    this.popularBadge = page.locator('.badge:has-text("인기")');
    this.risingBadge = page.locator('.badge:has-text("상승")');
    this.newBadge = page.locator('.badge:has-text("신규")');
    this.reviewCountBadge = page.locator('.badge:has-text("리뷰")');
    this.likeCountBadge = page.locator('.badge:has-text("좋아요")');

    // Living Cost
    this.livingCostCard = page.locator('.card:has-text("💰 생활 비용")');
    this.livingCostTitle = page.locator('.card-header:has-text("💰")');
    this.monthlyCost = page.locator('.card:has-text("💰") p:has-text("월 생활비") + p');
    this.rentStudio = page.locator('.card:has-text("💰") p:has-text("원룸 월세") + p');
    this.depositCost = page.locator('.card:has-text("💰") p:has-text("보증금") + p');

    // Infrastructure
    this.infrastructureCard = page.locator('.card:has-text("📡 인프라")');
    this.infrastructureTitle = page.locator('.card-header:has-text("📡")');
    this.internetSpeed = page.locator('.card:has-text("📡") p:has-text("인터넷 속도") + p');
    this.cafeCount = page.locator('.card:has-text("📡") p:has-text("카페 수") + p');
    this.coworkingCount = page.locator('.card:has-text("📡") p:has-text("코워킹") + p');

    // Weather
    this.weatherCard = page.locator('.card:has-text("🌤️ 날씨")');
    this.weatherTitle = page.locator('.card-header:has-text("🌤️")');
    this.currentTemperature = page.locator('.card:has-text("🌤️") p:has-text("현재 온도") + p');
    this.avgTemperature = page.locator('.card:has-text("🌤️") p:has-text("평균 온도") + p');
    this.airQuality = page.locator('.card:has-text("🌤️") p:has-text("공기 질") + p.text-2xl');
    this.airQualityLabel = page.locator('.card:has-text("🌤️") p.text-xs:has-text("좋음"), p.text-xs:has-text("보통"), p.text-xs:has-text("나쁨")');

    // Related Cities
    this.relatedCitiesCard = page.locator('.card:has-text("같은 지역 다른 도시")');
    this.relatedCitiesTitle = page.locator('.card-header:has-text("📍")');
    this.relatedCitiesGrid = page.locator('.grid:has(a[href*="/cities/"])');
    this.relatedCityLinks = page.locator('.card:has-text("같은 지역") a[href*="/cities/"]');
    this.relatedCityByName = (name: string) => page.locator(`.card:has-text("같은 지역") a:has-text("${name}")`);

    // Action Buttons (if present)
    this.likeButton = page.locator('button:has-text("좋아요"), button[aria-label*="like"], button:has(svg[class*="heart"])');
    this.bookmarkButton = page.locator('button:has-text("북마크"), button[aria-label*="bookmark"]');
    this.shareButton = page.locator('button:has-text("공유"), button[aria-label*="share"]');
    this.reviewButton = page.locator('button:has-text("리뷰 작성"), a:has-text("리뷰")');

    // Review Section (if present)
    this.reviewSection = page.locator('section:has-text("리뷰"), section:has-text("Review")');
    this.reviewCards = page.locator('[class*="review-card"], [class*="review"]');
    this.reviewCount = page.locator('.badge:has-text("리뷰")');
  }

  // ===========================
  // Navigation Methods
  // ===========================

  /**
   * Navigate to a city detail page by slug
   * @param slug - City slug (e.g., 'seoul', 'busan')
   */
  async goto(slug: string): Promise<void> {
    await super.goto(`${this.urlPattern}${slug}`);
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
  // City Information Methods
  // ===========================

  /**
   * Get the city name
   */
  async getCityName(): Promise<string> {
    const text = await this.getText(this.cityName);
    // Remove emoji if present
    return text.replace('🏙️', '').trim();
  }

  /**
   * Get the city region
   */
  async getCityRegion(): Promise<string> {
    const text = await this.getText(this.cityRegion);
    // Remove emoji if present
    return text.replace('📍', '').trim();
  }

  /**
   * Get the city description
   */
  async getCityDescription(): Promise<string> {
    return await this.getText(this.cityDescription);
  }

  /**
   * Get the city rating value
   */
  async getCityRating(): Promise<number> {
    const text = await this.getText(this.cityRatingValue);
    const match = text.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  // ===========================
  // Living Cost Methods
  // ===========================

  /**
   * Get monthly living cost (returns value in won)
   */
  async getMonthlyCost(): Promise<number> {
    const text = await this.getText(this.monthlyCost);
    const match = text.match(/₩?([\d,]+)만/);
    return match ? parseInt(match[1].replace(',', ''), 10) * 10000 : 0;
  }

  /**
   * Get studio rent cost (returns value in won)
   */
  async getRentStudio(): Promise<number> {
    const text = await this.getText(this.rentStudio);
    const match = text.match(/₩?([\d,]+)만/);
    return match ? parseInt(match[1].replace(',', ''), 10) * 10000 : 0;
  }

  /**
   * Get deposit cost (returns value in won)
   */
  async getDepositCost(): Promise<number> {
    const text = await this.getText(this.depositCost);
    const match = text.match(/₩?([\d,]+)만/);
    return match ? parseInt(match[1].replace(',', ''), 10) * 10000 : 0;
  }

  // ===========================
  // Infrastructure Methods
  // ===========================

  /**
   * Get internet speed
   */
  async getInternetSpeed(): Promise<number> {
    const text = await this.getText(this.internetSpeed);
    const match = text.match(/([\d]+)Mbps/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Get cafe count
   */
  async getCafeCount(): Promise<number> {
    const text = await this.getText(this.cafeCount);
    const match = text.match(/([\d]+)개/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Get coworking space count
   */
  async getCoworkingCount(): Promise<number> {
    const text = await this.getText(this.coworkingCount);
    const match = text.match(/([\d]+)개/);
    return match ? parseInt(match[1], 10) : 0;
  }

  // ===========================
  // Weather Methods
  // ===========================

  /**
   * Get current temperature
   */
  async getCurrentTemperature(): Promise<number> {
    const text = await this.getText(this.currentTemperature);
    const match = text.match(/([\d.-]+)°C/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get average temperature
   */
  async getAvgTemperature(): Promise<number> {
    const text = await this.getText(this.avgTemperature);
    const match = text.match(/([\d.-]+)°C/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * Get air quality index
   */
  async getAirQuality(): Promise<number> {
    const text = await this.getText(this.airQuality);
    const match = text.match(/([\d]+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Get air quality label (good, moderate, bad)
   */
  async getAirQualityLabel(): Promise<string> {
    return await this.getText(this.airQualityLabel);
  }

  // ===========================
  // Related Cities Methods
  // ===========================

  /**
   * Get count of related cities
   */
  async getRelatedCitiesCount(): Promise<number> {
    return await this.relatedCityLinks.count();
  }

  /**
   * Get names of all related cities
   */
  async getRelatedCityNames(): Promise<string[]> {
    const links = await this.relatedCityLinks.all();
    const names: string[] = [];

    for (const link of links) {
      const text = await link.textContent();
      if (text) {
        const match = text.match(/🏙️\s*([^\s]+)/);
        if (match) {
          names.push(match[1]);
        }
      }
    }

    return names;
  }

  /**
   * Click on a related city by name
   * @param cityName - Name of the related city
   */
  async clickRelatedCity(cityName: string): Promise<void> {
    const cityLink = this.relatedCityByName(cityName);
    await this.click(cityLink);
  }

  /**
   * Check if a specific related city is visible
   * @param cityName - Name of the city
   */
  async isRelatedCityVisible(cityName: string): Promise<boolean> {
    const cityLink = this.relatedCityByName(cityName);
    return await cityLink.isVisible().catch(() => false);
  }

  // ===========================
  // Badge Methods
  // ===========================

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
   * Check if city has popular badge
   */
  async hasPopularBadge(): Promise<boolean> {
    return await this.popularBadge.isVisible().catch(() => false);
  }

  /**
   * Check if city has rising badge
   */
  async hasRisingBadge(): Promise<boolean> {
    return await this.risingBadge.isVisible().catch(() => false);
  }

  /**
   * Check if city has new badge
   */
  async hasNewBadge(): Promise<boolean> {
    return await this.newBadge.isVisible().catch(() => false);
  }

  /**
   * Get review count from badge
   */
  async getReviewCount(): Promise<number> {
    const text = await this.getText(this.reviewCountBadge);
    const match = text.match(/리뷰\s*([\d]+)개/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Get like count percentage from badge
   */
  async getLikeCount(): Promise<number> {
    const text = await this.getText(this.likeCountBadge);
    const match = text.match(/좋아요\s*([\d]+)%/);
    return match ? parseInt(match[1], 10) : 0;
  }

  // ===========================
  // Action Methods
  // ===========================

  /**
   * Click the like button (if present)
   */
  async clickLike(): Promise<void> {
    const hasLikeButton = await this.likeButton.count() > 0;
    if (hasLikeButton) {
      await this.click(this.likeButton);
    }
  }

  /**
   * Click the bookmark button (if present)
   */
  async clickBookmark(): Promise<void> {
    const hasBookmarkButton = await this.bookmarkButton.count() > 0;
    if (hasBookmarkButton) {
      await this.click(this.bookmarkButton);
    }
  }

  /**
   * Click the share button (if present)
   */
  async clickShare(): Promise<void> {
    const hasShareButton = await this.shareButton.count() > 0;
    if (hasShareButton) {
      await this.click(this.shareButton);
    }
  }

  // ===========================
  // Verification Methods
  // ===========================

  /**
   * Verify that the city detail page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await expect(this.heroSection).toBeVisible();
    await expect(this.overviewCard).toBeVisible();
    await expect(this.livingCostCard).toBeVisible();
    await expect(this.infrastructureCard).toBeVisible();
    await expect(this.weatherCard).toBeVisible();
  }

  /**
   * Verify that specific information is displayed
   */
  async verifyInformationDisplayed(): Promise<void> {
    await expect(this.cityName).toBeVisible();
    await expect(this.cityDescription).toBeVisible();
    await expect(this.cityRating).toBeVisible();
  }

  /**
   * Verify that navigation is working
   */
  async verifyNavigationWorking(): Promise<void> {
    await expect(this.backButton).toBeVisible();
    await expect(this.homeButton).toBeVisible();
  }

  // ===========================
  // Scroll Methods
  // ===========================

  /**
   * Scroll to the overview section
   */
  async scrollToOverview(): Promise<void> {
    await this.scrollToElement(this.overviewCard);
  }

  /**
   * Scroll to the living cost section
   */
  async scrollToLivingCost(): Promise<void> {
    await this.scrollToElement(this.livingCostCard);
  }

  /**
   * Scroll to the infrastructure section
   */
  async scrollToInfrastructure(): Promise<void> {
    await this.scrollToElement(this.infrastructureCard);
  }

  /**
   * Scroll to the weather section
   */
  async scrollToWeather(): Promise<void> {
    await this.scrollToElement(this.weatherCard);
  }

  /**
   * Scroll to related cities section
   */
  async scrollToRelatedCities(): Promise<void> {
    await this.scrollToElement(this.relatedCitiesCard);
  }

  // ===========================
  // Screenshot Methods
  // ===========================

  /**
   * Take a screenshot of the hero section
   */
  async screenshotHero(): Promise<Buffer> {
    return await this.screenshotElement(this.heroSection, 'city-hero');
  }

  /**
   * Take a screenshot of the full page
   */
  async screenshotFullPage(): Promise<Buffer> {
    return await this.screenshot('city-detail-full', { fullPage: true });
  }

  // ===========================
  // URL Verification
  // ===========================

  /**
   * Verify that current URL matches the city slug
   * @param slug - Expected city slug
   */
  async verifyUrl(slug: string): Promise<void> {
    await super.verifyUrl(`${this.urlPattern}${slug}`);
  }

  /**
   * Get the current city slug from URL
   */
  async getCitySlugFromUrl(): Promise<string> {
    const url = this.getUrl();
    const match = url.match(/\/cities\/([^\/]+)/);
    return match ? match[1] : '';
  }

  // ===========================
  // Utility Methods
  // ===========================

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForLoadState();
    await this.waitForVisible(this.heroSection);
    await this.waitForVisible(this.overviewCard);
  }

  /**
   * Check if the page has related cities section
   */
  async hasRelatedCities(): Promise<boolean> {
    return await this.relatedCitiesCard.isVisible().catch(() => false);
  }
}
