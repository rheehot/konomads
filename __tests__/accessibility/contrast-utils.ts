/**
 * Color Contrast Tests
 *
 * Helper functions for calculating and testing color contrast ratios
 * according to WCAG 2.1 guidelines.
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

/**
 * Convert RGB to relative luminance
 * Based on WCAG 2.0 specification
 */
function rgbToLuminance(r: number, g: number, b: number): number {
  const sRGB = [r, g, b].map((val) => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function calculateContrastRatio(
  foreground: string,
  background: string
): number {
  // Parse colors
  const fg = hexToRgb(foreground)
  const bg = hexToRgb(background)

  if (!fg || !bg) {
    return 0
  }

  // Calculate relative luminance
  const fgLuminance = rgbToLuminance(fg.r, fg.g, fg.b)
  const bgLuminance = rgbToLuminance(bg.r, bg.g, bg.b)

  // Calculate contrast ratio
  const lighter = Math.max(fgLuminance, bgLuminance)
  const darker = Math.min(fgLuminance, bgLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if contrast meets WCAG AA standard for normal text
 * Minimum contrast ratio: 4.5:1
 */
export function meetsWCAAANormal(contrastRatio: number): boolean {
  return contrastRatio >= 4.5
}

/**
 * Check if contrast meets WCAG AA standard for large text
 * Minimum contrast ratio: 3:1
 */
export function meetsWCAALarge(contrastRatio: number): boolean {
  return contrastRatio >= 3.0
}

/**
 * Check if contrast meets WCAG AAA standard for normal text
 * Minimum contrast ratio: 7:1
 */
export function meetsWCAAAANormal(contrastRatio: number): boolean {
  return contrastRatio >= 7.0
}

/**
 * Check if contrast meets WCAG AAA standard for large text
 * Minimum contrast ratio: 4.5:1
 */
export function meetsWCAAAALarge(contrastRatio: number): boolean {
  return contrastRatio >= 4.5
}

/**
 * Common color palette for testing
 */
export const testColors = {
  // Tailwind default colors (approximate hex values)
  primary: '#000000',
  'primary-foreground': '#ffffff',
  secondary: '#f3f4f6',
  'secondary-foreground': '#1f2937',
  muted: '#f3f4f6',
  'muted-foreground': '#6b7280',
  accent: '#f3f4f6',
  'accent-foreground': '#1f2937',
  destructive: '#ef4444',
  'destructive-foreground': '#ffffff',
  border: '#e5e7eb',
  input: '#e5e7eb',
  ring: '#000000',
  background: '#ffffff',
  foreground: '#000000',

  // Additional test colors
  'blue-500': '#3b82f6',
  'blue-600': '#2563eb',
  'red-500': '#ef4444',
  'green-500': '#10b981',
  'gray-500': '#6b7280',
  'gray-900': '#111827',
}

/**
 * Contrast test expectations
 */
export const contrastExpectations = {
  // Button contrast expectations
  'button-default': {
    foreground: testColors['primary-foreground'],
    background: testColors.primary,
    minimumRatio: 4.5,
    description: 'Default button text',
  },
  'button-destructive': {
    foreground: testColors['destructive-foreground'],
    background: testColors.destructive,
    minimumRatio: 4.5,
    description: 'Destructive button text',
  },
  'button-outline': {
    foreground: testColors.foreground,
    background: testColors.background,
    minimumRatio: 4.5,
    description: 'Outline button text',
  },

  // Input contrast expectations
  'input-text': {
    foreground: testColors.foreground,
    background: testColors.background,
    minimumRatio: 4.5,
    description: 'Input field text',
  },
  'input-placeholder': {
    foreground: testColors['muted-foreground'],
    background: testColors.background,
    minimumRatio: 4.5,
    description: 'Input placeholder text',
  },

  // Link contrast expectations
  'link-default': {
    foreground: testColors['blue-600'],
    background: testColors.background,
    minimumRatio: 4.5,
    description: 'Default link',
  },

  // Text contrast expectations
  'text-primary': {
    foreground: testColors.foreground,
    background: testColors.background,
    minimumRatio: 4.5,
    description: 'Primary text',
  },
  'text-muted': {
    foreground: testColors['muted-foreground'],
    background: testColors.background,
    minimumRatio: 4.5,
    description: 'Muted text',
  },
}
