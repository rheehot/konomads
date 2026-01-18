import { Page, Locator, expect } from '@playwright/test';

/**
 * Custom Assertion Helpers for E2E Testing
 *
 * Provides reusable assertion functions that extend Playwright's
 * built-in expect with domain-specific and custom assertions.
 */

// ===========================
// Page Assertions
// ===========================

/**
 * Assert that the page URL matches the expected path
 */
export async function assertUrl(
  page: Page,
  expectedPath: string,
  options?: { timeout?: number }
): Promise<void> {
  await expect(page, `Page URL should contain ${expectedPath}`)
    .toHaveURL(new RegExp(expectedPath), options);
}

/**
 * Assert that the page URL exactly matches
 */
export async function assertExactUrl(
  page: Page,
  expectedUrl: string,
  options?: { timeout?: number }
): Promise<void> {
  await expect(page, `Page URL should be ${expectedUrl}`)
    .toHaveURL(expectedUrl, options);
}

/**
 * Assert that the page title contains expected text
 */
export async function assertTitle(
  page: Page,
  expectedTitle: string,
  options?: { timeout?: number }
): Promise<void> {
  await expect(page, `Page title should contain ${expectedTitle}`)
    .toHaveTitle(new RegExp(expectedTitle), options);
}

/**
 * Assert that the current path matches
 */
export async function assertPath(
  page: Page,
  expectedPath: string
): Promise<void> {
  const url = new URL(page.url());
  expect(url.pathname, `Path should be ${expectedPath}`).toBe(expectedPath);
}

/**
 * Assert that a query parameter exists and has expected value
 */
export async function assertQueryParam(
  page: Page,
  param: string,
  expectedValue?: string
): Promise<void> {
  const url = new URL(page.url());
  const value = url.searchParams.get(param);

  if (expectedValue) {
    expect(value, `Query param ${param} should be ${expectedValue}`).toBe(expectedValue);
  } else {
    expect(value, `Query param ${param} should exist`).toBeTruthy();
  }
}

// ===========================
// Element Visibility Assertions
// ===========================

/**
 * Assert that an element is visible
 */
export async function assertVisible(
  locator: Locator,
  timeout?: number
): Promise<void> {
  await expect(locator, 'Element should be visible').toBeVisible({ timeout });
}

/**
 * Assert that an element is hidden
 */
export async function assertHidden(
  locator: Locator,
  timeout?: number
): Promise<void> {
  await expect(locator, 'Element should be hidden').toBeHidden({ timeout });
}

/**
 * Assert that an element is attached to the DOM
 */
export async function assertAttached(
  locator: Locator,
  timeout?: number
): Promise<void> {
  await expect(locator, 'Element should be attached').toBeAttached({ timeout });
}

/**
 * Assert that an element is detached from the DOM
 */
export async function assertDetached(
  locator: Locator,
  timeout?: number
): Promise<void> {
  await expect(locator, 'Element should be detached').not.toBeAttached({ timeout });
}

/**
 * Assert that multiple elements are visible
 */
export async function assertAllVisible(
  locators: Locator[],
  timeout?: number
): Promise<void> {
  for (const locator of locators) {
    await assertVisible(locator, timeout);
  }
}

/**
 * Assert that exactly one of the locators is visible
 */
export async function assertOneVisible(
  locators: Locator[],
  timeout?: number
): Promise<void> {
  let visibleCount = 0;

  for (const locator of locators) {
    if (await locator.isVisible({ timeout })) {
      visibleCount++;
    }
  }

  expect(visibleCount, 'Exactly one element should be visible').toBe(1);
}

// ===========================
// Text Content Assertions
// ===========================

/**
 * Assert that an element contains the expected text
 */
export async function assertText(
  locator: Locator,
  expectedText: string | RegExp,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, `Element should contain text: ${expectedText}`)
    .toContainText(expectedText, options);
}

/**
 * Assert that an element has exact text match
 */
export async function assertExactText(
  locator: Locator,
  expectedText: string,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, `Element should have exact text: ${expectedText}`)
    .toHaveText(expectedText, options);
}

/**
 * Assert that an element's text matches a regex pattern
 */
export async function assertTextMatch(
  locator: Locator,
  pattern: RegExp,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, `Element text should match pattern: ${pattern}`)
    .toMatchText(pattern, options);
}

/**
 * Assert that an element does NOT contain text
 */
export async function assertNoText(
  locator: Locator,
  unexpectedText: string,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, `Element should not contain text: ${unexpectedText}`)
    .not.toContainText(unexpectedText, options);
}

/**
 * Get and assert element text content
 */
export async function assertElementText(
  locator: Locator,
  assertion: (text: string) => void
): Promise<void> {
  const text = await locator.textContent() || '';
  assertion(text);
}

// ===========================
// Attribute Assertions
// ===========================

/**
 * Assert that an element has a specific attribute value
 */
export async function assertAttribute(
  locator: Locator,
  attribute: string,
  expectedValue: string,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, `Element should have ${attribute}="${expectedValue}"`)
    .toHaveAttribute(attribute, expectedValue, options);
}

/**
 * Assert that an element has a CSS class
 */
export async function assertClass(
  locator: Locator,
  className: string,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, `Element should have class: ${className}`)
    .toHaveClass(new RegExp(`\\b${className}\\b`), options);
}

/**
 * Assert that an element has specific CSS styles
 */
export async function assertCSS(
  locator: Locator,
  css: Record<string, string>,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, `Element should have CSS: ${JSON.stringify(css)}`)
    .toHaveCSS(css, options);
}

/**
 * Assert that an element has a specific data attribute
 */
export async function assertDataAttr(
  locator: Locator,
  attr: string,
  expectedValue: string
): Promise<void> {
  await assertAttribute(locator, `data-${attr}`, expectedValue);
}

// ===========================
// State Assertions
// ===========================

/**
 * Assert that an element is enabled
 */
export async function assertEnabled(
  locator: Locator,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, 'Element should be enabled').toBeEnabled(options);
}

/**
 * Assert that an element is disabled
 */
export async function assertDisabled(
  locator: Locator,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, 'Element should be disabled').toBeDisabled(options);
}

/**
 * Assert that a checkbox is checked
 */
export async function assertChecked(
  locator: Locator,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, 'Element should be checked').toBeChecked(options);
}

/**
 * Assert that a checkbox is unchecked
 */
export async function assertUnchecked(
  locator: Locator,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, 'Element should be unchecked').not.toBeChecked(options);
}

/**
 * Assert that an element is focused
 */
export async function assertFocused(
  locator: Locator,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, 'Element should be focused').toBeFocused(options);
}

// ===========================
// Count Assertions
// ===========================

/**
 * Assert the number of elements matching a locator
 */
export async function assertCount(
  locator: Locator,
  expectedCount: number,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, `Should have ${expectedCount} elements`)
    .toHaveCount(expectedCount, options);
}

/**
 * Assert that there is at least N elements
 */
export async function assertAtLeast(
  locator: Locator,
  minCount: number,
  options?: { timeout?: number }
): Promise<void> {
  const count = await locator.count();
  expect(count, `Should have at least ${minCount} elements`).toBeGreaterThanOrEqual(minCount);
}

/**
 * Assert that there are at most N elements
 */
export async function assertAtMost(
  locator: Locator,
  maxCount: number,
  options?: { timeout?: number }
): Promise<void> {
  const count = await locator.count();
  expect(count, `Should have at most ${maxCount} elements`).toBeLessThanOrEqual(maxCount);
}

/**
 * Assert element count is in a range
 */
export async function assertCountInRange(
  locator: Locator,
  min: number,
  max: number,
  options?: { timeout?: number }
): Promise<void> {
  const count = await locator.count();
  expect(count, `Count should be between ${min} and ${max}`).toBeGreaterThanOrEqual(min);
  expect(count, `Count should be between ${min} and ${max}`).toBeLessThanOrEqual(max);
}

// ===========================
// Value Assertions
// ===========================

/**
 * Assert that an input has a specific value
 */
export async function assertValue(
  locator: Locator,
  expectedValue: string,
  options?: { timeout?: number }
): Promise<void> {
  await expect(locator, `Element should have value: ${expectedValue}`)
    .toHaveValue(expectedValue, options);
}

/**
 * Assert that an input's value contains a substring
 */
export async function assertValueContains(
  locator: Locator,
  substring: string,
  options?: { timeout?: number }
): Promise<void> {
  const value = await locator.inputValue();
  expect(value, `Value should contain: ${substring}`).toContain(substring);
}

/**
 * Assert that a select has specific option selected
 */
export async function assertSelectedOption(
  locator: Locator,
  expectedValue: string | RegExp,
  options?: { timeout?: number }
): Promise<void> {
  const input = typeof expectedValue === 'string'
    ? locator.locator(`option[value="${expectedValue}"]`)
    : locator;

  await expect(input, 'Option should be selected').toHaveValue(expectedValue, options);
}

// ===========================
// Navigation Assertions
// ===========================

/**
 * Assert that navigation occurred
 */
export async function assertNavigated(
  page: Page,
  expectedUrl: string | RegExp,
  options?: { timeout?: number }
): Promise<void> {
  await page.waitForURL(expectedUrl, { timeout: options?.timeout || 5000 });
}

/**
 * Assert that a link navigates to expected URL
 */
export async function assertLinkNavigation(
  page: Page,
  linkLocator: Locator,
  expectedUrl: string | RegExp
): Promise<void> {
  const [newPage] = await Promise.all([
    page.waitForEvent('popup'),
    linkLocator.click(),
  ]);
  await newPage.waitForURL(expectedUrl);
  await newPage.close();
}

// ===========================
// Network Assertions
// ===========================

/**
 * Assert that a specific API request was made
 */
export async function assertApiCalled(
  page: Page,
  urlPattern: RegExp,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET'
): Promise<void> {
  const requests: any[] = [];

  page.on('request', request => {
    if (urlPattern.test(request.url()) && request.method() === method) {
      requests.push(request);
    }
  });

  await page.waitForTimeout(100); // Small delay to catch requests

  expect(requests.length, `Expected ${method} request to ${urlPattern}`).toBeGreaterThan(0);
}

/**
 * Assert that a network response was successful
 */
export async function assertResponseSuccess(
  response: any
): Promise<void> {
  expect(response.ok(), `Request to ${response.url()} should succeed`).toBe(true);
  expect(response.status(), 'Status should be 2xx').toBeLessThan(300);
}

// ===========================
// Image Assertions
// ===========================

/**
 * Assert that an image is loaded
 */
export async function assertImageLoaded(
  locator: Locator,
  options?: { timeout?: number }
): Promise<void> {
  await assertVisible(locator, options);

  const isLoaded = await locator.evaluate(img => {
    const image = img as HTMLImageElement;
    return image.complete && typeof image.naturalWidth !== 'undefined' && image.naturalWidth > 0;
  });

  expect(isLoaded, 'Image should be loaded').toBe(true);
}

/**
 * Assert that an image has specific dimensions
 */
export async function assertImageDimensions(
  locator: Locator,
  expectedWidth: number,
  expectedHeight: number,
  tolerance: number = 10
): Promise<void> {
  const dimensions = await locator.boundingBox();

  expect(dimensions?.width, `Image width should be ~${expectedWidth}`).toBeCloseTo(expectedWidth, tolerance);
  expect(dimensions?.height, `Image height should be ~${expectedHeight}`).toBeCloseTo(expectedHeight, tolerance);
}

// ===========================
// Form Assertions
// ===========================

/**
 * Assert that a form has validation errors
 */
export async function assertHasErrors(
  errorLocator: Locator,
  expectedErrorCount?: number
): Promise<void> {
  await assertVisible(errorLocator);

  if (expectedErrorCount !== undefined) {
    await assertCount(errorLocator, expectedErrorCount);
  }
}

/**
 * Assert that a specific field has an error
 */
export async function assertFieldError(
  fieldLocator: Locator,
  errorLocator?: Locator
): Promise<void> {
  // Check if field has error styling
  await assertClass(fieldLocator, 'error');

  // Check if error message is visible
  if (errorLocator) {
    await assertVisible(errorLocator);
  }
}

/**
 * Assert that form data matches expected values
 */
export async function assertFormData(
  page: Page,
  expectedData: Record<string, string>
): Promise<void> {
  for (const [name, expectedValue] of Object.entries(expectedData)) {
    const field = page.locator(`[name="${name}"]`);
    await assertValue(field, expectedValue);
  }
}

// ===========================
// Accessibility Assertions
// ===========================

/**
 * Assert that an element has an aria-label
 */
export async function assertAriaLabel(
  locator: Locator,
  expectedLabel: string
): Promise<void> {
  await assertAttribute(locator, 'aria-label', expectedLabel);
}

/**
 * Assert that an element is visible to screen readers
 */
export async function assertVisibleToScreenReaders(
  locator: Locator
): Promise<void> {
  const ariaHidden = await locator.getAttribute('aria-hidden');
  expect(ariaHidden, 'Element should not be aria-hidden').not.toBe('true');
}

/**
 * Assert that an element is hidden from screen readers
 */
export async function assertHiddenFromScreenReaders(
  locator: Locator
): Promise<void> {
  await assertAttribute(locator, 'aria-hidden', 'true');
}

/**
 * Assert that an image has alt text
 */
export async function assertAltText(
  locator: Locator
): Promise<void> {
  const alt = await locator.getAttribute('alt');
  expect(alt, 'Image should have alt text').toBeTruthy();
  expect(alt, 'Alt text should not be empty').not.toBe('');
}

// ===========================
// Async/Wait Assertions
// ===========================

/**
 * Assert that an element becomes visible within timeout
 */
export async function assertBecomesVisible(
  locator: Locator,
  timeout: number = 5000
): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
}

/**
 * Assert that an element becomes hidden within timeout
 */
export async function assertBecomesHidden(
  locator: Locator,
  timeout: number = 5000
): Promise<void> {
  await locator.waitFor({ state: 'hidden', timeout });
}

/**
 * Assert that an element is attached within timeout
 */
export async function assertBecomesAttached(
  locator: Locator,
  timeout: number = 5000
): Promise<void> {
  await locator.waitFor({ state: 'attached', timeout });
}

/**
 * Assert that an element is detached within timeout
 */
export async function assertBecomesDetached(
  locator: Locator,
  timeout: number = 5000
): Promise<void> {
  await locator.waitFor({ state: 'detached', timeout });
}

// ===========================
// Custom Conditional Assertions
// ===========================

/**
 * Assert condition is true
 */
export function assertCondition(
  condition: boolean,
  message: string
): void {
  expect(condition, message).toBe(true);
}

/**
 * Assert condition is false
 */
export function assertNotCondition(
  condition: boolean,
  message: string
): void {
  expect(condition, message).toBe(false);
}

/**
 * Assert value is in array
 */
export function assertInArray<T>(
  array: T[],
  value: T,
  message?: string
): void {
  expect(array, message || `Value should be in array`).toContain(value);
}

/**
 * Assert value is not in array
 */
export function assertNotInArray<T>(
  array: T[],
  value: T,
  message?: string
): void {
  expect(array, message || `Value should not be in array`).not.toContain(value);
}

/**
 * Assert number is in range
 */
export function assertInRange(
  value: number,
  min: number,
  max: number,
  message?: string
): void {
  expect(value, message || `Value should be between ${min} and ${max}`).toBeGreaterThanOrEqual(min);
  expect(value, message || `Value should be between ${min} and ${max}`).toBeLessThanOrEqual(max);
}

/**
 * Assert object has property
 */
export function assertHasProperty(
  obj: any,
  property: string,
  message?: string
): void {
  expect(obj, message || `Object should have property: ${property}`).toHaveProperty(property);
}

/**
 * Assert objects are equal (deep comparison)
 */
export function assertObjectsEqual(
  obj1: any,
  obj2: any,
  message?: string
): void {
  expect(obj1, message || 'Objects should be equal').toEqual(obj2);
}

// ===========================
// Soft Assertions (don't fail immediately)
// ===========================

export interface SoftAssertionError {
  message: string;
  actual: any;
  expected: any;
}

const softAssertionErrors: SoftAssertionError[] = [];

/**
 * Add a soft assertion (collects errors but doesn't fail)
 */
export function softAssert(
  condition: boolean,
  message: string,
  actual?: any,
  expected?: any
): void {
  if (!condition) {
    softAssertionErrors.push({ message, actual, expected });
  }
}

/**
 * Execute all soft assertions and fail if any failed
 */
export function assertSoftAssertions(): void {
  if (softAssertionErrors.length > 0) {
    const messages = softAssertionErrors.map(e =>
      `${e.message}\n  Expected: ${e.expected}\n  Actual: ${e.actual}`
    ).join('\n\n');
    expect.fail(`\n${softAssertionErrors.length} soft assertion(s) failed:\n\n${messages}`);
  }
}

/**
 * Clear soft assertion errors
 */
export function clearSoftAssertions(): void {
  softAssertionErrors.length = 0;
}

/**
 * Get soft assertion errors count
 */
export function getSoftAssertionCount(): number {
  return softAssertionErrors.length;
}
