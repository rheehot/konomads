import { test as base, Page, APIRequestContext, expect } from '@playwright/test';

/**
 * Extended Page interface with custom methods
 */
export interface ExtendedPage {
  /**
   * Wait for an element to be visible and stable
   */
  waitForStable: (selector: string, timeout?: number) => Promise<void>;

  /**
   * Wait for network idle (no network requests for specified duration)
   */
  waitForNetworkIdle: (timeout?: number) => Promise<void>;

  /**
   * Take screenshot with automatic naming and retry
   */
  takeScreenshot: (name: string, fullPage?: boolean) => Promise<void>;

  /**
   * Fill and submit a form
   */
  fillForm: (formSelector: string, data: Record<string, string>) => Promise<void>;

  /**
   * Click element and wait for navigation
   */
  clickAndWait: (selector: string, urlPattern?: RegExp) => Promise<void>;

  /**
   * Wait for toast/notification to appear and return its text
   */
  waitForToast: (timeout?: number) => Promise<string>;

  /**
   * Check if element is in viewport
   */
  isInViewport: (selector: string) => Promise<boolean>;

  /**
   * Scroll element into view smoothly
   */
  scrollIntoView: (selector: string) => Promise<void>;

  /**
   * Get all text content from selector
   */
  getAllText: (selector: string) => Promise<string[]>;

  /**
   * Wait for loader to disappear
   */
  waitForLoader: (loaderSelector?: string) => Promise<void>;

  /**
   * Make API request with auth headers if logged in
   */
  apiRequest: <T>(method: string, path: string, body?: any) => Promise<T>;

  /**
   * Get current authenticated user from browser storage
   */
  getAuthUser: () => Promise<{ email: string; id: string } | null>;
}

/**
 * Page fixture interface
 */
export interface PageFixture {
  page: ExtendedPage;
  api: APIRequestContext;
  baseUrl: string;
}

/**
 * Custom Page class with extended methods
 */
class CustomPage {
  constructor(
    private page: Page,
    private api: APIRequestContext,
    private baseUrl: string
  ) {}

  /**
   * Wait for an element to be visible and stable (not moving/changing)
   */
  async waitForStable(selector: string, timeout = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });

    // Additional check for stability - ensure element hasn't moved
    const startTime = Date.now();
    let previousPosition = await this.page.locator(selector).boundingBox();

    while (Date.now() - startTime < 1000) {
      await this.page.waitForTimeout(100);
      const currentPosition = await this.page.locator(selector).boundingBox();

      if (
        previousPosition &&
        currentPosition &&
        previousPosition.x === currentPosition.x &&
        previousPosition.y === currentPosition.y
      ) {
        return; // Element is stable
      }

      previousPosition = currentPosition;
    }
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(timeout = 10000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Take screenshot with automatic naming
   */
  async takeScreenshot(name: string, fullPage = false): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;

    await this.page.screenshot({
      path: `test-results/screenshots/${filename}`,
      fullPage
    });
  }

  /**
   * Fill form with data object
   */
  async fillForm(formSelector: string, data: Record<string, string>): Promise<void> {
    for (const [fieldName, value] of Object.entries(data)) {
      const inputSelector = `${formSelector} [name="${fieldName}"], ${formSelector} #${fieldName}`;
      await this.page.fill(inputSelector, value);
    }
  }

  /**
   * Click element and wait for navigation
   */
  async clickAndWait(selector: string, urlPattern?: RegExp): Promise<void> {
    if (urlPattern) {
      await Promise.all([
        this.page.waitForURL(urlPattern, { timeout: 5000 }),
        this.page.click(selector)
      ]);
    } else {
      await Promise.all([
        this.page.waitForLoadState('networkidle'),
        this.page.click(selector)
      ]);
    }
  }

  /**
   * Wait for toast/notification to appear
   */
  async waitForToast(timeout = 5000): Promise<string> {
    const toastSelector = '[role="alert"], [role="status"], .toast, .notification, .message';

    await this.page.waitForSelector(toastSelector, { state: 'visible', timeout });

    const text = await this.page.locator(toastSelector).textContent();

    // Auto-dismiss toast after reading
    await this.page.waitForTimeout(1000);

    return text || '';
  }

  /**
   * Check if element is in viewport
   */
  async isInViewport(selector: string): Promise<boolean> {
    const element = await this.page.locator(selector).boundingBox();

    if (!element) return false;

    const viewportSize = this.page.viewportSize();

    if (!viewportSize) return false;

    return (
      element.y >= 0 &&
      element.x >= 0 &&
      element.y + element.height <= viewportSize.height &&
      element.x + element.width <= viewportSize.width
    );
  }

  /**
   * Scroll element into view smoothly
   */
  async scrollIntoView(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
    await this.waitForStable(selector);
  }

  /**
   * Get all text content from multiple elements
   */
  async getAllText(selector: string): Promise<string[]> {
    const elements = await this.page.locator(selector).all();

    const texts: string[] = [];
    for (const element of elements) {
      const text = await element.textContent();
      if (text) texts.push(text.trim());
    }

    return texts;
  }

  /**
   * Wait for loader/spinner to disappear
   */
  async waitForLoader(loaderSelector = '.loader, .spinner, [role="status"][aria-busy="true"]'): Promise<void> {
    try {
      const loader = this.page.locator(loaderSelector).first();

      // Wait for loader to appear
      await loader.waitFor({ state: 'visible', timeout: 2000 });

      // Wait for loader to disappear
      await loader.waitFor({ state: 'hidden', timeout: 10000 });
    } catch {
      // Loader may not have appeared, which is fine
    }
  }

  /**
   * Make authenticated API request
   */
  async apiRequest<T>(method: string, path: string, body?: any): Promise<T> {
    // Get auth token from browser storage
    const token = await this.page.evaluate(() => {
      const authData = localStorage.getItem('supabase.auth.token');
      if (authData) {
        const parsed = JSON.parse(authData);
        return parsed?.currentSession?.access_token || null;
      }
      return null;
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${path}`;

    const response = await this.api.fetch(url, {
      method,
      headers,
      data: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok()) {
      const error = await response.text();
      throw new Error(`API request failed: ${response.status()} ${error}`);
    }

    return await response.json() as T;
  }

  /**
   * Get current authenticated user from browser storage
   */
  async getAuthUser(): Promise<{ email: string; id: string } | null> {
    return await this.page.evaluate(() => {
      const authData = localStorage.getItem('supabase.auth.token');
      if (authData) {
        const parsed = JSON.parse(authData);
        const user = parsed?.currentSession?.user;
        return user ? { email: user.email, id: user.id } : null;
      }
      return null;
    });
  }
}

/**
 * Page fixture factory function
 */
function createExtendedPage(
  page: Page,
  api: APIRequestContext,
  baseUrl: string
): ExtendedPage {
  const customPage = new CustomPage(page, api, baseUrl);

  return new Proxy(page as ExtendedPage, {
    get(target, prop) {
      if (prop in customPage) {
        return customPage[prop as keyof CustomPage].bind(customPage);
      }
      return (target as any)[prop];
    }
  });
}

/**
 * Page fixture for Playwright tests
 * Provides extended Page with custom helper methods
 */
export const pageTest = base.extend<PageFixture>({
  baseUrl: async ({}, use) => {
    const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    await use(url);
  },

  api: async ({}, use) => {
    // Create API context for making backend requests
    const apiContext = await request.newContext({
      baseURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      extraHTTPHeaders: {
        'Content-Type': 'application/json'
      }
    });

    await use(apiContext);

    // Cleanup
    await apiContext.dispose();
  },

  page: async ({ page, api, baseUrl }, use) => {
    // Set default timeout and viewport
    page.setDefaultTimeout(10000);
    await page.setViewportSize({ width: 1280, height: 720 });

    // Create extended page
    const extendedPage = createExtendedPage(page, api, baseUrl);

    // Add console logging for debugging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });

    // Add error handling
    page.on('pageerror', error => {
      console.error('Page error:', error.message);
    });

    await use(extendedPage);
  }
});

/**
 * Helper function to setup page for authentication
 */
export async function setupAuthPage(page: ExtendedPage, email: string, password: string): Promise<void> {
  await page.goto('/login');

  await page.waitForStable('input[name="email"]');
  await page.waitForStable('input[name="password"]');

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  await Promise.all([
    page.waitForURL(/\/(profile|home|$)/, { timeout: 5000 }),
    page.click('button[type="submit"]')
  ]);
}

/**
 * Helper function to verify page accessibility
 */
export async function verifyAccessibility(page: ExtendedPage): Promise<void> {
  // Check for proper heading hierarchy
  const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements => {
    return elements.map(el => ({
      tag: el.tagName,
      text: el.textContent?.trim()
    }));
  });

  // Ensure page has at least one h1
  const hasH1 = headings.some(h => h.tag === 'H1');
  if (!hasH1) {
    console.warn('Page missing h1 heading');
  }

  // Check for images with alt text
  const imagesWithoutAlt = await page.$$eval('img', elements => {
    return elements.filter(img => !img.alt || img.alt.trim() === '').length;
  });

  if (imagesWithoutAlt > 0) {
    console.warn(`Found ${imagesWithoutAlt} images without alt text`);
  }
}

/**
 * Helper function to measure page performance
 */
export async function measurePagePerformance(page: ExtendedPage): Promise<{
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
}> {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    return {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0
    };
  });

  return metrics;
}

// Import required types
import { request } from '@playwright/test';

export { test } from '@playwright/test';
export { expect } from '@playwright/test';
