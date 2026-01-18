import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from '@/components/homepage/hero-section'

describe('HeroSection Component', () => {
  /**
   * HC-001: HeroSection - 기본 렌더링
   * Tests that the HeroSection component renders correctly with all main elements
   */
  it('HC-001: should render hero section with main heading', () => {
    render(<HeroSection />)
    expect(screen.getByText('🌏 한국에서 노마드로 살기 좋은 곳은?')).toBeInTheDocument()
  })

  /**
   * HC-002: HeroSection - 서브헤딩 렌더링
   * Tests that the subheading/description text is rendered
   */
  it('HC-002: should render description text', () => {
    render(<HeroSection />)
    expect(screen.getByText(/지금 바로 당신에게 딱 맞는 도시를 찾아보세요/)).toBeInTheDocument()
  })

  /**
   * HC-003: HeroSection - 이메일 입력 필드 렌더링
   * Tests that the email input field is rendered with correct placeholder
   */
  it('HC-003: should render email input field', () => {
    render(<HeroSection />)
    const emailInput = screen.getByPlaceholderText('이메일을 입력하세요...')
    expect(emailInput).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  /**
   * HC-004: HeroSection - CTA 버튼 렌더링
   * Tests that the call-to-action button is rendered with correct text
   */
  it('HC-004: should render CTA button', () => {
    render(<HeroSection />)
    const ctaButton = screen.getByRole('button', { name: /시작하기/ })
    expect(ctaButton).toBeInTheDocument()
  })

  /**
   * HC-005: HeroSection - 기능 특성 렌더링
   * Tests that the feature highlights are rendered correctly
   */
  it('HC-005: should render feature highlights', () => {
    render(<HeroSection />)
    expect(screen.getByText('✓ 15개 주요 도시')).toBeInTheDocument()
    expect(screen.getByText('✓ 실시간 리뷰')).toBeInTheDocument()
    expect(screen.getByText('✓ 밋업 참여')).toBeInTheDocument()
  })

  /**
   * HC-006: HeroSection - 배경 스타일 확인
   * Tests that the hero section has proper styling structure
   */
  it('HC-006: should have proper background structure', () => {
    const { container } = render(<HeroSection />)
    const heroSection = container.querySelector('section')
    expect(heroSection).toHaveClass('h-[600px]')
    expect(heroSection).toHaveClass('overflow-hidden')
  })

  /**
   * HC-007: HeroSection - 컨테이너 레이아웃
   * Tests that content is properly wrapped in container
   */
  it('HC-007: should render content in centered container', () => {
    const { container } = render(<HeroSection />)
    const heroSection = container.querySelector('section')
    const contentDiv = heroSection?.querySelector('.container')
    expect(contentDiv).toBeInTheDocument()
  })

  /**
   * HC-008: HeroSection - 버튼 스타일링
   * Tests that the CTA button has correct styling classes
   */
  it('HC-008: should have correct button styling', () => {
    render(<HeroSection />)
    const ctaButton = screen.getByRole('button', { name: /시작하기/ })
    expect(ctaButton).toHaveClass('bg-blue-600')
  })

  /**
   * HC-009: HeroSection - 입력 필드 스타일링
   * Tests that the email input has correct styling classes
   */
  it('HC-009: should have correct input field styling', () => {
    render(<HeroSection />)
    const emailInput = screen.getByPlaceholderText('이메일을 입력하세요...')
    expect(emailInput).toHaveClass('bg-white/90')
  })

  /**
   * HC-010: HeroSection - 텍스트 정렬
   * Tests that text content is properly centered
   */
  it('HC-010: should have centered text alignment', () => {
    const { container } = render(<HeroSection />)
    const heroSection = container.querySelector('section')
    const textContainer = heroSection?.querySelector('.text-center')
    expect(textContainer).toBeInTheDocument()
  })

  /**
   * HC-011: HeroSection - 반응형 레이아웃
   * Tests that responsive classes are applied
   */
  it('HC-011: should have responsive layout classes', () => {
    const { container } = render(<HeroSection />)
    const heading = screen.getByText('🌏 한국에서 노마드로 살기 좋은 곳은?')
    expect(heading).toHaveClass('text-4xl', 'md:text-5xl', 'lg:text-6xl')
  })

  /**
   * HC-012: HeroSection - 오버레이 효과
   * Tests that gradient overlay is applied for text readability
   */
  it('HC-012: should have gradient overlay for readability', () => {
    const { container } = render(<HeroSection />)
    const heroSection = container.querySelector('section')
    const overlayDiv = heroSection?.querySelector('.bg-gradient-to-b')
    expect(overlayDiv).toBeInTheDocument()
  })
})
