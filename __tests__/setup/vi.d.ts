import { testingLibraryMatchers } from '@testing-library/jest-dom/matchers'
import type { Assertion, Expect } from 'vitest'

// Extend Vitest's interface with custom matchers
declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T> {
    toBeDisabled(): Assertion<T>
    toBeEmpty(): Assertion<T>
    toBeInTheDocument(): Assertion<T>
    toBeInvalid(): Assertion<T>
    toBeRequired(): Assertion<T>
    toBeValid(): Assertion<T>
    toBeVisible(): Assertion<T>
    toContainElement(element: HTMLElement | null): Assertion<T>
    toContainHTML(html: string): Assertion<T>
    toHaveAccessibleDescription(): Assertion<T>
    toHaveAccessibleName(): Assertion<T>
    toHaveAttribute(name: string, value?: any): Assertion<T>
    toHaveClass(...classNames: string[]): Assertion<T>
    toHaveFocus(): Assertion<T>
    toHaveFormValues(expectedValues: Record<string, any>): Assertion<T>
    toHaveStyle(css: Record<string, any>): Assertion<T>
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): Assertion<T>
    toHaveValue(value?: any): Assertion<T>
    toHaveDisplayValue(value: any): Assertion<T>
  }

  interface AsymmetricMatchersContaining {
    toBeDisabled(): any
    toBeEmpty(): any
    toBeInTheDocument(): any
    toBeInvalid(): any
    toBeRequired(): any
    toBeValid(): any
    toBeVisible(): any
    toContainElement(element: HTMLElement | null): any
    toContainHTML(html: string): any
    toHaveAccessibleDescription(): any
    toHaveAccessibleName(): any
    toHaveAttribute(name: string, value?: any): any
    toHaveClass(...classNames: string[]): any
    toHaveFocus(): any
    toHaveFormValues(expectedValues: Record<string, any>): any
    toHaveStyle(css: Record<string, any>): any
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): any
    toHaveValue(value?: any): any
    toHaveDisplayValue(value: any): any
  }
}

// Global mocks for browser APIs that don't exist in Node.js/test environment
declare global {
  interface Window {
    matchMedia: (query: string) => {
      matches: boolean
      media: string
      onchange: null
      addListener: (event: MediaQueryListListener) => void
      removeListener: (event: MediaQueryListListener) => void
      addEventListener: (type: string, listener: MediaQueryListListener) => void
      removeEventListener: (type: string, listener: MediaQueryListListener) => void
      dispatchEvent: (event: Event) => boolean
    }
  }

  interface IntersectionObserverEntry {
    boundingClientRect: DOMRectReadOnly
    intersectionRatio: number
    intersectionRect: DOMRectReadOnly
    isIntersecting: boolean
    rootBounds: DOMRectReadOnly | null
    target: Element
    time: number
  }

  interface IntersectionObserver {
    readonly root: Element | null
    readonly rootMargin: string
    readonly thresholds: ReadonlyArray<number>
    disconnect(): void
    observe(target: Element): void
    takeRecords(): IntersectionObserverEntry[]
    unobserve(target: Element): void
  }

  interface IntersectionObserverOptions {
    root?: Element | null
    rootMargin?: string
    threshold?: number | number[]
  }

  var IntersectionObserver: {
    prototype: IntersectionObserver
    new(callback: IntersectionObserverCallback, options?: IntersectionObserverOptions): IntersectionObserver
  }

  type ResizeObserverCallback = (entries: ReadonlyArray<ResizeObserverEntry>, observer: ResizeObserver) => void

  interface ResizeObserverEntry {
    readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>
    readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>
    readonly contentRect: DOMRectReadOnly
    readonly devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>
    readonly target: Element
  }

  interface ResizeObserverSize {
    readonly blockSize: number
    readonly inlineSize: number
  }

  interface ResizeObserver {
    disconnect(): void
    observe(target: Element, options?: ResizeObserverOptions): void
    unobserve(target: Element): void
  }

  interface ResizeObserverOptions {
    box?: 'content-box' | 'border-box' | 'device-pixel-content-box'
  }

  var ResizeObserver: {
    prototype: ResizeObserver
    new(callback: ResizeObserverCallback): ResizeObserver
  }
}

export {}
