import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object Model class
 *
 * Provides common methods and properties for all page objects.
 * All page classes should extend this base class.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ===========================
  // Navigation Methods
  // ===========================

  /**
   * Navigate to a specific path
   * @param path - URL path (e.g., '/cities', '/login')
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Navigate to the home page
   */
  async gotoHome(): Promise<void> {
    await this.goto('/');
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  // ===========================
  // Wait Methods
  // ===========================

  /**
   * Wait for a specific timeout
   * @param ms - Milliseconds to wait
   */
  async waitFor(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Wait for network to be idle
   * @param timeout - Maximum time to wait in milliseconds
   */
  async waitForNetworkIdle(timeout = 5000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForLoadState(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('load');
  }

  // ===========================
  // Click Methods
  // ===========================

  /**
   * Click on an element
   * @param selector - CSS selector or locator
   * @param options - Click options
   */
  async click(selector: string | Locator, options?: { force?: boolean; timeout?: number }): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.click(options);
  }

  /**
   * Double click on an element
   * @param selector - CSS selector or locator
   */
  async doubleClick(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : locator;
    await locator.dblclick();
  }

  /**
   * Right click on an element
   * @param selector - CSS selector or locator
   */
  async rightClick(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : locator;
    await locator.click({ button: 'right' });
  }

  // ===========================
  // Input Methods
  // ===========================

  /**
   * Fill an input field with text
   * @param selector - CSS selector or locator
   * @param text - Text to fill
   */
  async fill(selector: string | Locator, text: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.fill(text);
  }

  /**
   * Type text character by character
   * @param selector - CSS selector or locator
   * @param text - Text to type
   * @param delay - Delay between keystrokes in ms
   */
  async type(selector: string | Locator, text: string, delay?: number): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.type(text, { delay });
  }

  /**
   * Clear an input field
   * @param selector - CSS selector or locator
   */
  async clear(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await locator.clear();
  }

  /**
   * Select an option from a select dropdown
   * @param selector - CSS selector or locator
   * @param value - Option value to select
   */
  async selectOption(selector: string | Locator, value: string): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : locator;
    await locator.selectOption(value);
  }

  // ===========================
  // Checkbox & Radio Methods
  // ===========================

  /**
   * Check a checkbox
   * @param selector - CSS selector or locator
   */
  async check(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : locator;
    await locator.check();
  }

  /**
   * Uncheck a checkbox
   * @param selector - CSS selector or locator
   */
  async uncheck(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : locator;
    await locator.uncheck();
  }

  // ===========================
  // Assertion Helpers
  // ===========================

  /**
   * Verify that an element is visible
   * @param selector - CSS selector or locator
   */
  async isVisible(selector: string | Locator): Promise<boolean> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    return await locator.isVisible();
  }

  /**
   * Verify that an element is hidden
   * @param selector - CSS selector or locator
   */
  async isHidden(selector: string | Locator): Promise<boolean> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    return await locator.isHidden();
  }

  /**
   * Get text content of an element
   * @param selector - CSS selector or locator
   */
  async getText(selector: string | Locator): Promise<string> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    return await locator.textContent() || '';
  }

  /**
   * Get attribute value of an element
   * @param selector - CSS selector or locator
   * @param attribute - Attribute name
   */
  async getAttribute(selector: string | Locator, attribute: string): Promise<string | null> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    return await locator.getAttribute(attribute);
  }

  /**
   * Count number of elements matching selector
   * @param selector - CSS selector
   */
  async count(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  // ===========================
  // Screenshot Methods
  // ===========================

  /**
   * Take a screenshot of the current page
   * @param filename - Screenshot filename (without extension)
   * @param options - Screenshot options
   */
  async screenshot(filename: string, options?: { fullPage?: boolean }): Promise<Buffer> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `test-results/screenshots/${filename}-${timestamp}.png`;
    return await this.page.screenshot({
      path,
      ...options,
    });
  }

  /**
   * Take a screenshot of a specific element
   * @param selector - CSS selector or locator
   * @param filename - Screenshot filename (without extension)
   */
  async screenshotElement(selector: string | Locator, filename: string): Promise<Buffer> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : locator;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `test-results/screenshots/${filename}-${timestamp}.png`;
    return await locator.screenshot({ path });
  }

  // ===========================
  // URL Helpers
  // ===========================

  /**
   * Get current page URL
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Verify that current URL contains the expected path
   * @param expectedPath - Expected URL path fragment
   */
  async verifyUrl(expectedPath: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(expectedPath));
  }

  /**
   * Verify that current URL exactly matches expected path
   * @param expectedPath - Expected URL path
   */
  async verifyExactUrl(expectedPath: string): Promise<void> {
    await expect(this.page).toHaveURL(expectedPath);
  }

  // ===========================
  // Hover Methods
  // ===========================

  /**
   * Hover over an element
   * @param selector - CSS selector or locator
   */
  async hover(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : locator;
    await locator.hover();
  }

  // ===========================
  // Scroll Methods
  // ===========================

  /**
   * Scroll to the bottom of the page
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Scroll to the top of the page
   */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /**
   * Scroll to a specific element
   * @param selector - CSS selector or locator
   */
  async scrollToElement(selector: string | Locator): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : locator;
    await locator.scrollIntoViewIfNeeded();
  }

  // ===========================
  // Alert/Dialog Methods
  // ===========================

  /**
   * Handle an alert/dialog
   * @param accept - Whether to accept (true) or dismiss (false) the dialog
   */
  async handleDialog(accept: boolean = true): Promise<void> {
    this.page.on('dialog', async (dialog) => {
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  // ===========================
  // Cookie/Storage Methods
  // ===========================

  /**
   * Get all cookies
   */
  async getCookies(): Promise<any[]> {
    return await this.page.context().cookies();
  }

  /**
   * Set a cookie
   * @param name - Cookie name
   * @param value - Cookie value
   */
  async setCookie(name: string, value: string): Promise<void> {
    await this.page.context().addCookies([{ name, value, url: this.getUrl() }]);
  }

  /**
   * Clear all cookies
   */
  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }

  // ===========================
  // Utility Methods
  // ===========================

  /**
   * Wait for an element to be visible
   * @param selector - CSS selector or locator
   * @param timeout - Maximum time to wait in milliseconds
   */
  async waitForVisible(selector: string | Locator, timeout = 5000): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : locator;
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   * @param selector - CSS selector or locator
   * @param timeout - Maximum time to wait in milliseconds
   */
  async waitForHidden(selector: string | Locator, timeout = 5000): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : locator;
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for an element to be attached to DOM
   * @param selector - CSS selector or locator
   * @param timeout - Maximum time to wait in milliseconds
   */
  async waitForAttached(selector: string | Locator, timeout = 5000): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : locator;
    await locator.waitFor({ state: 'attached', timeout });
  }

  /**
   * Execute JavaScript in the page context
   * @param script - JavaScript function to execute
   * @param args - Arguments to pass to the function
   */
  async evaluate<R>(script: () => R): Promise<R> {
    return await this.page.evaluate(script);
  }
}
