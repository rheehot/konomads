import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton Component (UI-049 ~ UI-051)', () => {
  describe('UI-049: Basic Rendering', () => {
    it('should render skeleton element', () => {
      render(<Skeleton data-testid="skeleton" />)
      expect(screen.getByTestId('skeleton')).toBeInTheDocument()
    })

    it('should render skeleton div', () => {
      render(<Skeleton data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton.tagName).toBe('DIV')
    })

    it('should render skeleton with default classes', () => {
      render(<Skeleton data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted')
    })

    it('should be visible in the document', () => {
      render(<Skeleton data-testid="skeleton" />)
      expect(screen.getByTestId('skeleton')).toBeVisible()
    })
  })

  describe('UI-050: className', () => {
    it('should apply custom className', () => {
      render(<Skeleton className="custom-class" data-testid="skeleton" />)
      expect(screen.getByTestId('skeleton')).toHaveClass('custom-class')
    })

    it('should merge custom className with default classes', () => {
      render(<Skeleton className="w-full h-20" data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton).toHaveClass('w-full', 'h-20')
      expect(skeleton).toHaveClass('animate-pulse', 'rounded-md', 'bg-muted')
    })

    it('should support width customization via className', () => {
      render(<Skeleton className="w-64" data-testid="skeleton" />)
      expect(screen.getByTestId('skeleton')).toHaveClass('w-64')
    })

    it('should support height customization via className', () => {
      render(<Skeleton className="h-16" data-testid="skeleton" />)
      expect(screen.getByTestId('skeleton')).toHaveClass('h-16')
    })

    it('should support multiple custom classes', () => {
      render(<Skeleton className="w-full h-8 rounded-full" data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton).toHaveClass('w-full', 'h-8', 'rounded-full')
    })

    it('should override default rounded-md with custom rounded class', () => {
      render(<Skeleton className="rounded-lg" data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton).toHaveClass('rounded-lg')
    })
  })

  describe('UI-051: Animation', () => {
    it('should have animate-pulse class by default', () => {
      render(<Skeleton data-testid="skeleton" />)
      expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse')
    })

    it('should apply animation for loading effect', () => {
      render(<Skeleton data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')

      // Check if the element has animation-related classes
      expect(skeleton).toHaveClass('animate-pulse')
    })

    it('should allow removing animation via className override', () => {
      render(<Skeleton className="animate-none" data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')

      // The cn utility should merge classes, but animate-none would override animate-pulse
      expect(skeleton).toHaveClass('animate-none')
    })

    it('should support custom animation classes', () => {
      render(<Skeleton className="animate-bounce" data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton).toHaveClass('animate-bounce')
    })
  })

  describe('Additional Skeleton Features', () => {
    it('should pass through other HTML attributes', () => {
      render(<Skeleton data-custom="value" data-testid="skeleton" />)
      expect(screen.getByTestId('skeleton')).toHaveAttribute('data-custom', 'value')
    })

    it('should support different sizes', () => {
      const { rerender } = render(
        <Skeleton className="w-32 h-4" data-testid="skeleton-sm" />
      )
      expect(screen.getByTestId('skeleton-sm')).toHaveClass('w-32', 'h-4')

      rerender(<Skeleton className="w-full h-32" data-testid="skeleton-lg" />)
      expect(screen.getByTestId('skeleton-lg')).toHaveClass('w-full', 'h-32')
    })

    it('should render multiple skeletons', () => {
      render(
        <>
          <Skeleton data-testid="skeleton-1" />
          <Skeleton data-testid="skeleton-2" />
          <Skeleton data-testid="skeleton-3" />
        </>
      )

      expect(screen.getByTestId('skeleton-1')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-2')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-3')).toBeInTheDocument()
    })

    it('should be used as a card placeholder', () => {
      render(
        <div className="p-4 border rounded-lg">
          <Skeleton className="w-12 h-12 rounded-full mb-4" data-testid="avatar-skeleton" />
          <Skeleton className="w-3/4 h-4 mb-2" data-testid="title-skeleton" />
          <Skeleton className="w-1/2 h-4" data-testid="text-skeleton" />
        </div>
      )

      expect(screen.getByTestId('avatar-skeleton')).toHaveClass('w-12', 'h-12', 'rounded-full')
      expect(screen.getByTestId('title-skeleton')).toHaveClass('w-3/4', 'h-4')
      expect(screen.getByTestId('text-skeleton')).toHaveClass('w-1/2', 'h-4')
    })

    it('should be used as a list placeholder', () => {
      render(
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 mb-4">
              <Skeleton className="w-12 h-12 rounded-full" data-testid={`skeleton-avatar-${i}`} />
              <div className="space-y-2">
                <Skeleton className="w-48 h-4" data-testid={`skeleton-title-${i}`} />
                <Skeleton className="w-32 h-3" data-testid={`skeleton-desc-${i}`} />
              </div>
            </div>
          ))}
        </div>
      )

      expect(screen.getByTestId('skeleton-avatar-1')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-title-1')).toBeInTheDocument()
      expect(screen.getByTestId('skeleton-desc-1')).toBeInTheDocument()
    })

    it('should be used as an image placeholder', () => {
      render(<Skeleton className="w-full h-48 rounded-lg" data-testid="image-skeleton" />)
      const skeleton = screen.getByTestId('image-skeleton')
      expect(skeleton).toHaveClass('w-full', 'h-48', 'rounded-lg')
    })

    it('should be used as a text placeholder', () => {
      render(
        <div className="space-y-2">
          <Skeleton className="w-full h-4" data-testid="line-1" />
          <Skeleton className="w-5/6 h-4" data-testid="line-2" />
          <Skeleton className="w-4/6 h-4" data-testid="line-3" />
        </div>
      )

      expect(screen.getByTestId('line-1')).toHaveClass('w-full')
      expect(screen.getByTestId('line-2')).toHaveClass('w-5/6')
      expect(screen.getByTestId('line-3')).toHaveClass('w-4/6')
    })

    it('should have proper ARIA attributes for accessibility', () => {
      render(<Skeleton role="status" aria-label="Loading..." data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton).toHaveAttribute('role', 'status')
      expect(skeleton).toHaveAttribute('aria-label', 'Loading...')
    })

    it('should be keyboard accessible when interactive', () => {
      render(
        <Skeleton
          tabIndex={0}
          role="button"
          aria-label="Loading button"
          data-testid="skeleton"
        />
      )
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton).toHaveAttribute('tabIndex', '0')
      expect(skeleton).toHaveAttribute('role', 'button')
    })
  })
})
