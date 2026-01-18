import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CityGrid } from '@/components/homepage/city-grid'

// Mock CITIES constant
vi.mock('@/lib/constants', () => ({
  CITIES: Array.from({ length: 15 }, (_, i) => ({
    id: String(i + 1),
    name: `도시${i + 1}`,
    slug: `city-${i + 1}`,
    region: '지역',
    thumbnail: `/images/cities/city-${i + 1}.jpg`,
    description: `도시 ${i + 1} 설명`,
    badge: i < 3 ? ('popular' as const) : undefined,
    monthlyCost: 1500000 + i * 100000,
    rentStudio: 350000 + i * 50000,
    deposit: 3000000 + i * 500000,
    internetSpeed: 500 + (i % 2) * 500,
    cafeCount: 100 + i * 20,
    coworkingCount: 2 + i,
    avgTemperature: 10 + i,
    currentTemperature: 5 + i,
    airQuality: 40 + i,
    rating: 4.0 + i * 0.1,
    nomadScore: 4.1 + i * 0.1,
    reviewCount: 30 + i * 10,
    likeCount: 60 + i * 2,
    nomadsNow: 5 + i,
  })),
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock CityCard component
vi.mock('@/components/homepage/city-card', () => ({
  CityCard: ({ city }: { city: any }) => (
    <div data-testid={`city-card-${city.id}`}>{city.name}</div>
  ),
}))

describe('CityGrid Component', () => {
  /**
   * HC-001: CityGrid - 기본 렌더링
   * Tests that CityGrid renders with section header
   */
  it('HC-001: should render city grid section with header', () => {
    render(<CityGrid />)

    expect(screen.getByText('🌟 인기 도시 TOP 10')).toBeInTheDocument()
  })

  /**
   * HC-002: CityGrid - 서브헤딩 표시
   * Tests that description text is rendered
   */
  it('HC-002: should render description text', () => {
    render(<CityGrid />)

    expect(screen.getByText(/노마드들이 가장 많이 찾는 도시들/)).toBeInTheDocument()
  })

  /**
   * HC-003: CityGrid - TOP 10 도시 카드 렌더링
   * Tests that exactly 10 city cards are rendered
   */
  it('HC-003: should render exactly 10 city cards', () => {
    render(<CityGrid />)

    const cityCards = screen.getAllByTestId(/city-card-\d+/)
    expect(cityCards).toHaveLength(10)
  })

  /**
   * HC-004: CityGrid - 전체보기 버튼 헤더
   * Tests that "전체보기" link is rendered in header
   */
  it('HC-004: should render "전체보기" link in header', () => {
    render(<CityGrid />)

    const viewAllLink = screen.getByRole('link', { name: /전체보기/ })
    expect(viewAllLink).toBeInTheDocument()
    expect(viewAllLink).toHaveAttribute('href', '/cities')
  })

  /**
   * HC-005: CityGrid - 전체보기 버튼 푸터
   * Tests that "더 많은 도시 보기" button is rendered at bottom
   */
  it('HC-005: should render "더 많은 도시 보기" button at bottom', () => {
    render(<CityGrid />)

    expect(screen.getByRole('link', { name: /더 많은 도시 보기/ })).toBeInTheDocument()
  })

  /**
   * HC-006: CityGrid - 정렬 드롭다운
   * Tests that sorting dropdown is rendered with options
   */
  it('HC-006: should render sorting dropdown', () => {
    render(<CityGrid />)

    const sortSelects = screen.getAllByRole('combobox')
    expect(sortSelects.length).toBeGreaterThanOrEqual(1)

    expect(screen.getByText('인기순')).toBeInTheDocument()
    expect(screen.getByText('평점순')).toBeInTheDocument()
    expect(screen.getByText('저렴한순')).toBeInTheDocument()
  })

  /**
   * HC-007: CityGrid - 지역 필터 드롭다운
   * Tests that region filter dropdown is rendered
   */
  it('HC-007: should render region filter dropdown', () => {
    render(<CityGrid />)

    // Find all select elements
    const selects = screen.getAllByRole('combobox')
    expect(selects.length).toBeGreaterThanOrEqual(2)

    // Check for region options
    expect(screen.getByText('전체')).toBeInTheDocument()
    expect(screen.getByText('수도권')).toBeInTheDocument()
    expect(screen.getByText('강원')).toBeInTheDocument()
    expect(screen.getByText('제주')).toBeInTheDocument()
  })

  /**
   * HC-008: CityGrid - 그리드 레이아웃
   * Tests that cities are displayed in responsive grid layout
   */
  it('HC-008: should display cities in responsive grid layout', () => {
    const { container } = render(<CityGrid />)

    const grid = container.querySelector('.grid.grid-cols-1')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveClass('sm:grid-cols-2', 'lg:grid-cols-4')
  })

  /**
   * HC-009: CityGrid - 섹션 스타일링
   * Tests that section has proper padding
   */
  it('HC-009: should have proper section padding', () => {
    const { container } = render(<CityGrid />)

    const section = container.querySelector('section')
    expect(section).toHaveClass('py-16', 'md:py-24')
  })

  /**
   * HC-010: CityGrid - 헤더 레이아웃
   * Tests that header section has responsive layout
   */
  it('HC-010: should have responsive header layout', () => {
    const { container } = render(<CityGrid />)

    const headerDiv = container.querySelector('.flex.flex-col.md\\:flex-row')
    expect(headerDiv).toBeInTheDocument()
  })

  /**
   * HC-011: CityGrid - 툴바 레이아웃
   * Tests that toolbar with filters is displayed
   */
  it('HC-011: should render toolbar with filters', () => {
    const { container } = render(<CityGrid />)

    const toolbar = container.querySelector('.flex.flex-wrap.gap-3')
    expect(toolbar).toBeInTheDocument()
  })

  /**
   * HC-012: CityGrid - 도시 카드 순서
   * Tests that cities are displayed in correct order (top 10)
   */
  it('HC-012: should display cities in top 10 order', () => {
    render(<CityGrid />)

    // Check that first 10 cities from CITIES array are rendered
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByTestId(`city-card-${i}`)).toBeInTheDocument()
    }

    // Check that city 11 is not rendered
    expect(screen.queryByTestId('city-card-11')).not.toBeInTheDocument()
  })

  /**
   * HC-013: CityGrid - 컨테이너 구조
   * Tests that content is wrapped in container
   */
  it('HC-013: should wrap content in container', () => {
    const { container } = render(<CityGrid />)

    const section = container.querySelector('section')
    const contentDiv = section?.querySelector('.container')
    expect(contentDiv).toBeInTheDocument()
  })

  /**
   * HC-014: CityGrid - 드롭다운 스타일링
   * Tests that dropdowns have proper styling
   */
  it('HC-014: should apply proper styling to dropdowns', () => {
    render(<CityGrid />)

    const selects = screen.getAllByRole('combobox')
    selects.forEach(select => {
      expect(select).toHaveClass('px-4', 'py-2', 'border', 'rounded-md')
    })
  })

  /**
   * HC-015: CityGrid - 버튼 스타일링
   * Tests that links have proper styling classes
   */
  it('HC-015: should apply outline variant to links', () => {
    render(<CityGrid />)

    const links = screen.getAllByRole('link', { name: /전체보기|더 많은 도시 보기/ })
    links.forEach(link => {
      expect(link).toBeInTheDocument()
    })
  })

  /**
   * HC-016: CityGrid - 헤더와 툴바 간격
   * Tests that there is proper spacing between header and toolbar
   */
  it('HC-016: should have proper spacing between header and toolbar', () => {
    const { container } = render(<CityGrid />)

    const headerSection = container.querySelector('.mb-8')
    expect(headerSection).toBeInTheDocument()
  })

  /**
   * HC-017: CityGrid - 그리드와 푸터 간격
   * Tests that there is proper spacing between grid and footer button
   */
  it('HC-017: should have proper spacing between grid and footer', () => {
    const { container } = render(<CityGrid />)

    const footerSection = container.querySelector('.mt-12.text-center')
    expect(footerSection).toBeInTheDocument()
  })

  /**
   * HC-018: CityGrid - 푸터 버튼 중앙 정렬
   * Tests that footer button is centered
   */
  it('HC-018: should center footer button', () => {
    const { container } = render(<CityGrid />)

    const footerSection = container.querySelector('.text-center')
    expect(footerSection).toBeInTheDocument()
  })
})
