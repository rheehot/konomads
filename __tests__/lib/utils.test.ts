import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  /**
   * U-001: `cn()` - 단일 클래스
   * Tests that a single class name is returned as-is
   */
  it('U-001: should handle single class name', () => {
    expect(cn('foo')).toBe('foo')
    expect(cn('px-4')).toBe('px-4')
    expect(cn('text-red-500')).toBe('text-red-500')
  })

  /**
   * U-002: `cn()` - 다중 클래스
   * Tests that multiple class names are merged correctly
   */
  it('U-002: should merge multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
    expect(cn('px-4', 'py-2', 'bg-red-500')).toBe('px-4 py-2 bg-red-500')
    expect(cn('text-lg', 'font-bold', 'text-gray-900')).toBe('text-lg font-bold text-gray-900')
  })

  /**
   * U-003: `cn()` - 조건부 클래스
   * Tests that conditional classes are handled correctly
   */
  it('U-003: should handle conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
    expect(cn('base-class', true && 'conditional-class', false && 'removed-class')).toBe('base-class conditional-class')
    expect(cn('px-4', true && 'py-2')).toBe('px-4 py-2')
    expect(cn('text-sm', undefined, 'font-bold')).toBe('text-sm font-bold')
  })

  /**
   * U-004: `cn()` - Tailwind 충돌 해결
   * Tests that Tailwind class conflicts are resolved correctly
   */
  it('U-004: should resolve Tailwind class conflicts', () => {
    // Later classes should override earlier classes for the same property
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('px-4 py-2', 'px-8')).toBe('py-2 px-8') // Order may vary due to tailwind-merge optimization
    expect(cn('text-sm text-red-500', 'text-lg')).toBe('text-red-500 text-lg') // Order may vary
    expect(cn('p-4', 'p-2', 'p-6')).toBe('p-6')
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
  })

  /**
   * U-005: `cn()` - 빈 값 처리
   * Tests that empty values are handled gracefully
   */
  it('U-005: should handle empty values', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
    expect(cn('', 'class')).toBe('class')
    expect(cn(undefined, null, false, 'remaining')).toBe('remaining')
    expect(cn('foo', '')).toBe('foo')
    expect(cn(undefined)).toBe('')
    expect(cn(null)).toBe('')
  })
})
