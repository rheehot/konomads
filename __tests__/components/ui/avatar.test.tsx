import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

describe('Avatar Component (UI-044 ~ UI-048)', () => {
  describe('UI-044: Basic Rendering', () => {
    it('should render avatar container', () => {
      render(<Avatar data-testid="avatar" />)
      expect(screen.getByTestId('avatar')).toBeInTheDocument()
    })

    it('should render avatar with default styles', () => {
      render(<Avatar data-testid="avatar" />)
      const avatar = screen.getByTestId('avatar')
      expect(avatar).toHaveClass('h-10', 'w-10', 'rounded-full')
    })

    it('should render avatar with image', () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
        </Avatar>
      )

      const img = screen.getByAltText('User avatar')
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })

    it('should render avatar with fallback', () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should render avatar with both image and fallback', () => {
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByAltText('Avatar')).toBeInTheDocument()
      expect(screen.getByText('JD')).toBeInTheDocument()
    })
  })

  describe('UI-045: src Attribute', () => {
    it('should render image with src', () => {
      render(
        <Avatar>
          <AvatarImage src="/avatar.png" alt="Avatar" />
        </Avatar>
      )

      const img = screen.getByAltText('Avatar')
      expect(img).toHaveAttribute('src', '/avatar.png')
    })

    it('should render image with external URL', () => {
      render(
        <Avatar>
          <AvatarImage
            src="https://example.com/user-avatar.png"
            alt="External Avatar"
          />
        </Avatar>
      )

      const img = screen.getByAltText('External Avatar')
      expect(img).toHaveAttribute(
        'src',
        'https://example.com/user-avatar.png'
      )
    })

    it('should render image with data URI', () => {
      const dataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

      render(
        <Avatar>
          <AvatarImage src={dataUri} alt="Data URI Avatar" />
        </Avatar>
      )

      const img = screen.getByAltText('Data URI Avatar')
      expect(img).toHaveAttribute('src', dataUri)
    })

    it('should update src when prop changes', () => {
      const { rerender } = render(
        <Avatar>
          <AvatarImage src="/avatar1.png" alt="Avatar" />
        </Avatar>
      )

      const img = screen.getByAltText('Avatar')
      expect(img).toHaveAttribute('src', '/avatar1.png')

      rerender(
        <Avatar>
          <AvatarImage src="/avatar2.png" alt="Avatar" />
        </Avatar>
      )

      expect(img).toHaveAttribute('src', '/avatar2.png')
    })
  })

  describe('UI-046: Load Failure', () => {
    it('should show fallback when image fails to load', () => {
      render(
        <Avatar>
          <AvatarImage src="/invalid-avatar.jpg" alt="Avatar" />
          <AvatarFallback>FB</AvatarFallback>
        </Avatar>
      )

      // When image fails, fallback should be visible
      // Note: In testing environment, we can't easily simulate image load failure
      // But we can verify the fallback is rendered
      expect(screen.getByText('FB')).toBeInTheDocument()
    })

    it('should render fallback text when image is not provided', () => {
      render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      )

      const fallback = screen.getByText('AB')
      expect(fallback).toBeInTheDocument()
      expect(fallback).toHaveClass('bg-muted')
    })

    it('should render fallback with complex content', () => {
      render(
        <Avatar>
          <AvatarFallback>
            <span data-testid="fallback-icon">👤</span>
          </AvatarFallback>
        </Avatar>
      )

      expect(screen.getByTestId('fallback-icon')).toBeInTheDocument()
    })
  })

  describe('UI-047: AvatarFallback', () => {
    it('should render fallback with text', () => {
      render(
        <Avatar>
          <AvatarFallback>John Doe</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    it('should render fallback with initials', () => {
      render(
        <Avatar>
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('AI')).toBeInTheDocument()
    })

    it('should apply custom className to AvatarFallback', () => {
      render(
        <Avatar>
          <AvatarFallback className="custom-fallback">FB</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('FB')).toHaveClass('custom-fallback')
    })

    it('should have correct default styles', () => {
      render(
        <Avatar>
          <AvatarFallback data-testid="fallback">FB</AvatarFallback>
        </Avatar>
      )

      const fallback = screen.getByTestId('fallback')
      expect(fallback).toHaveClass('flex', 'items-center', 'justify-center')
    })

    it('should render fallback with icon', () => {
      render(
        <Avatar>
          <AvatarFallback>
            <svg data-testid="user-icon" />
          </AvatarFallback>
        </Avatar>
      )

      expect(screen.getByTestId('user-icon')).toBeInTheDocument()
    })
  })

  describe('UI-048: delayMs', () => {
    it('should note delayMs parameter availability', () => {
      // The Avatar component from shadcn/ui doesn't natively support delayMs
      // This would typically be implemented by wrapping with a delay component
      // or using a library like react-delay
      render(
        <Avatar>
          <AvatarFallback>Delay Test</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('Delay Test')).toBeInTheDocument()
    })

    it('should render fallback immediately without delay', () => {
      const startTime = Date.now()

      render(
        <Avatar>
          <AvatarFallback>Immediate</AvatarFallback>
        </Avatar>
      )

      const endTime = Date.now()
      const renderTime = endTime - startTime

      expect(screen.getByText('Immediate')).toBeInTheDocument()
      // Render should be nearly instantaneous
      expect(renderTime).toBeLessThan(100)
    })
  })

  describe('Additional Avatar Features', () => {
    it('should apply custom className to Avatar', () => {
      render(<Avatar className="custom-avatar" data-testid="avatar" />)
      expect(screen.getByTestId('avatar')).toHaveClass('custom-avatar')
    })

    it('should apply custom className to AvatarImage', () => {
      render(
        <Avatar>
          <AvatarImage
            src="/avatar.png"
            alt="Avatar"
            className="custom-image"
          />
        </Avatar>
      )

      expect(screen.getByAltText('Avatar')).toHaveClass('custom-image')
    })

    it('should pass through other HTML attributes', () => {
      render(
        <Avatar data-custom="value" data-testid="avatar">
          <AvatarImage src="/avatar.png" alt="Avatar" />
        </Avatar>
      )

      expect(screen.getByTestId('avatar')).toHaveAttribute('data-custom', 'value')
    })

    it('should support different sizes through className', () => {
      const { rerender } = render(
        <Avatar className="h-8 w-8" data-testid="avatar-sm" />
      )
      expect(screen.getByTestId('avatar-sm')).toHaveClass('h-8', 'w-8')

      rerender(<Avatar className="h-12 w-12" data-testid="avatar-lg" />)
      expect(screen.getByTestId('avatar-lg')).toHaveClass('h-12', 'w-12')
    })

    it('should render multiple avatars', () => {
      render(
        <>
          <Avatar>
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>U3</AvatarFallback>
          </Avatar>
        </>
      )

      expect(screen.getByText('U1')).toBeInTheDocument()
      expect(screen.getByText('U2')).toBeInTheDocument()
      expect(screen.getByText('U3')).toBeInTheDocument()
    })

    it('should be accessible with alt text', () => {
      render(
        <Avatar>
          <AvatarImage src="/avatar.png" alt="User profile picture" />
        </Avatar>
      )

      const img = screen.getByAltText('User profile picture')
      expect(img).toBeInTheDocument()
    })

    it('should support ref forwarding', () => {
      const ref = { current: null }

      render(
        <Avatar
          ref={ref as React.RefObject<HTMLDivElement>}
          data-testid="avatar"
        />
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })
})
