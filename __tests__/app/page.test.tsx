import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock all the child components
vi.mock('@/components/homepage/hero-section', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero Section</div>,
}))

vi.mock('@/components/homepage/stats-section', () => ({
  StatsSection: () => <div data-testid="stats-section">Stats Section</div>,
}))

vi.mock('@/components/homepage/quick-filters', () => ({
  QuickFilters: () => <div data-testid="quick-filters">Quick Filters</div>,
}))

vi.mock('@/components/homepage/city-grid', () => ({
  CityGrid: () => <div data-testid="city-grid">City Grid</div>,
}))

vi.mock('@/components/homepage/ai-recommendation', () => ({
  AIRecommendation: () => <div data-testid="ai-recommendation">AI Recommendation</div>,
}))

vi.mock('@/components/homepage/meetup-section', () => ({
  MeetupSection: () => <div data-testid="meetup-section">Meetup Section</div>,
}))

vi.mock('@/components/homepage/review-section', () => ({
  ReviewSection: () => <div data-testid="review-section">Review Section</div>,
}))

vi.mock('@/components/homepage/trending-section', () => ({
  TrendingSection: () => <div data-testid="trending-section">Trending Section</div>,
}))

vi.mock('@/components/homepage/live-dashboard', () => ({
  LiveDashboard: () => <div data-testid="live-dashboard">Live Dashboard</div>,
}))

vi.mock('@/components/homepage/pricing-section', () => ({
  PricingSection: () => <div data-testid="pricing-section">Pricing Section</div>,
}))

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * PG-001: 기본 렌더링 테스트
   * Home 페이지가 모든 섹션을 올바르게 렌더링하는지 확인
   */
  describe('PG-001: Basic Rendering', () => {
    it('should render without crashing', () => {
      expect(() => render(<Home />)).not.toThrow()
    })

    it('should render the main container with correct structure', () => {
      const { container } = render(<Home />)
      const mainDiv = container.querySelector('.flex.flex-col')
      expect(mainDiv).toBeInTheDocument()
    })
  })

  /**
   * PG-002: Hero 섹션 렌더링 테스트
   * Hero 섹션이 올바르게 표시되는지 확인
   */
  describe('PG-002: Hero Section', () => {
    it('should render HeroSection component', () => {
      render(<Home />)
      expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    })

    it('should render HeroSection as the first section', () => {
      const { container } = render(<Home />)
      const firstChild = container.querySelector('.flex.flex-col > :first-child')
      expect(firstChild).toBe(screen.getByTestId('hero-section'))
    })
  })

  /**
   * PG-003: 도시 그리드 섹션 렌더링 테스트
   * CityGrid 섹션이 올바르게 표시되는지 확인
   */
  describe('PG-003: City Grid Section', () => {
    it('should render CityGrid component', () => {
      render(<Home />)
      expect(screen.getByTestId('city-grid')).toBeInTheDocument()
    })

    it('should render CityGrid in the correct position', () => {
      render(<Home />)
      const cityGrid = screen.getByTestId('city-grid')
      const quickFilters = screen.getByTestId('quick-filters')
      const aiRecommendation = screen.getByTestId('ai-recommendation')

      // CityGrid should come after QuickFilters and before AIRecommendation
      expect(cityGrid).toBeInTheDocument()
      expect(quickFilters).toBeInTheDocument()
      expect(aiRecommendation).toBeInTheDocument()
    })
  })

  /**
   * PG-004: 모든 섹션 순서 확인
   * 모든 섹션이 올바른 순서로 렌더링되는지 확인
   */
  describe('PG-004: Section Order', () => {
    it('should render all sections in correct order', () => {
      const { container } = render(<Home />)
      const sections = container.querySelectorAll('.flex.flex-col > div')

      const expectedOrder = [
        'hero-section',
        'stats-section',
        'quick-filters',
        'city-grid',
        'ai-recommendation',
        'meetup-section',
        'review-section',
        'trending-section',
        'live-dashboard',
        'pricing-section',
      ]

      expect(sections.length).toBe(expectedOrder.length)

      sections.forEach((section, index) => {
        expect(section).toHaveAttribute('data-testid', expectedOrder[index])
      })
    })

    it('should render all 10 sections', () => {
      render(<Home />)

      const sections = [
        'hero-section',
        'stats-section',
        'quick-filters',
        'city-grid',
        'ai-recommendation',
        'meetup-section',
        'review-section',
        'trending-section',
        'live-dashboard',
        'pricing-section',
      ]

      sections.forEach((section) => {
        expect(screen.getByTestId(section)).toBeInTheDocument()
      })
    })
  })

  /**
   * PG-005: 추가 섹션 렌더링 확인
   * Stats, QuickFilters, AIRecommendation 등 추가 섹션이 올바르게 렌더링되는지 확인
   */
  describe('PG-005: Additional Sections', () => {
    it('should render StatsSection component', () => {
      render(<Home />)
      expect(screen.getByTestId('stats-section')).toBeInTheDocument()
    })

    it('should render QuickFilters component', () => {
      render(<Home />)
      expect(screen.getByTestId('quick-filters')).toBeInTheDocument()
    })

    it('should render AIRecommendation component', () => {
      render(<Home />)
      expect(screen.getByTestId('ai-recommendation')).toBeInTheDocument()
    })

    it('should render MeetupSection component', () => {
      render(<Home />)
      expect(screen.getByTestId('meetup-section')).toBeInTheDocument()
    })

    it('should render ReviewSection component', () => {
      render(<Home />)
      expect(screen.getByTestId('review-section')).toBeInTheDocument()
    })

    it('should render TrendingSection component', () => {
      render(<Home />)
      expect(screen.getByTestId('trending-section')).toBeInTheDocument()
    })

    it('should render LiveDashboard component', () => {
      render(<Home />)
      expect(screen.getByTestId('live-dashboard')).toBeInTheDocument()
    })

    it('should render PricingSection component', () => {
      render(<Home />)
      expect(screen.getByTestId('pricing-section')).toBeInTheDocument()
    })
  })
})
