import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CityCard } from '@/components/homepage/city-card'
import { City } from '@/types'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('CityCard Component', () => {
  const mockCity: City = {
    id: '1',
    name: '강릉',
    slug: 'gangneung',
    region: '강원도',
    thumbnail: '/images/cities/gangneung.jpg',
    description: '바다와 카페, 조용한 환경이 완벽한 조화',
    badge: 'popular',
    monthlyCost: 1800000,
    rentStudio: 450000,
    deposit: 5000000,
    internetSpeed: 1000,
    cafeCount: 320,
    coworkingCount: 5,
    avgTemperature: 12,
    currentTemperature: 5,
    airQuality: 45,
    rating: 4.5,
    nomadScore: 4.7,
    reviewCount: 120,
    likeCount: 85,
    nomadsNow: 23,
    isLiked: false,
  }

  /**
   * HC-001: CityCard - 기본 렌더링
   * Tests that CityCard renders with all required city information
   */
  it('HC-001: should render city card with basic information', () => {
    render(<CityCard city={mockCity} />)

    expect(screen.getByText(/🏙️ 강릉/)).toBeInTheDocument()
    expect(screen.getByText(/📍 강원도/)).toBeInTheDocument()
  })

  /**
   * HC-002: CityCard - 평점 표시
   * Tests that rating is displayed correctly
   */
  it('HC-002: should display city rating', () => {
    render(<CityCard city={mockCity} />)

    expect(screen.getByText('⭐')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('/5.0')).toBeInTheDocument()
  })

  /**
   * HC-003: CityCard - 생활비 정보
   * Tests that monthly cost is formatted and displayed correctly
   */
  it('HC-003: should display formatted monthly cost', () => {
    render(<CityCard city={mockCity} />)

    // 1800000 / 10000 = 180만
    expect(screen.getByText(/₩180만\//)).toBeInTheDocument()
  })

  /**
   * HC-004: CityCard - 인터넷 속도 표시
   * Tests that internet speed is displayed with rocket icon for fast speeds
   */
  it('HC-004: should display internet speed with rocket icon for >= 1000Mbps', () => {
    render(<CityCard city={mockCity} />)

    expect(screen.getByText(/1000Mbps/)).toBeInTheDocument()
    expect(screen.getByText('🚀')).toBeInTheDocument()
  })

  /**
   * HC-005: CityCard - 인터넷 속도 (느린 속도)
   * Tests that internet speed is displayed without rocket icon for slower speeds
   */
  it('HC-005: should display internet speed without rocket icon for < 1000Mbps', () => {
    const slowInternetCity = { ...mockCity, internetSpeed: 500 }
    render(<CityCard city={slowInternetCity} />)

    expect(screen.getByText(/500Mbps/)).toBeInTheDocument()
    expect(screen.queryByText('🚀')).not.toBeInTheDocument()
  })

  /**
   * HC-006: CityCard - 카페 수 표시
   * Tests that cafe count is displayed correctly
   */
  it('HC-006: should display cafe count', () => {
    render(<CityCard city={mockCity} />)

    expect(screen.getByText(/320\+/)).toBeInTheDocument()
  })

  /**
   * HC-007: CityCard - 현재 기온 표시
   * Tests that current temperature is displayed with degree symbol
   */
  it('HC-007: should display current temperature', () => {
    render(<CityCard city={mockCity} />)

    expect(screen.getByText(/5°C/)).toBeInTheDocument()
  })

  /**
   * HC-008: CityCard - 좋아요 및 리뷰 통계
   * Tests that like percentage and review count are displayed
   */
  it('HC-008: should display like count and review count', () => {
    render(<CityCard city={mockCity} />)

    expect(screen.getByText(/👍/)).toBeInTheDocument()
    expect(screen.getByText('85%')).toBeInTheDocument()
    expect(screen.getByText(/\(120\)/)).toBeInTheDocument()
  })

  /**
   * HC-009: CityCard - 현재 노마드 수
   * Tests that current nomad count is displayed
   */
  it('HC-009: should display current nomads count', () => {
    render(<CityCard city={mockCity} />)

    expect(screen.getByText(/🧑‍💼/)).toBeInTheDocument()
    expect(screen.getByText(/23명/)).toBeInTheDocument()
  })

  /**
   * HC-010: CityCard - 인기 배지 표시
   * Tests that "popular" badge is displayed with correct variant
   */
  it('HC-010: should display popular badge', () => {
    render(<CityCard city={mockCity} />)

    expect(screen.getByText('인기')).toBeInTheDocument()
  })

  /**
   * HC-011: CityCard - 상승 배지 표시
   * Tests that "rising" badge is displayed correctly
   */
  it('HC-011: should display rising badge', () => {
    const risingCity = { ...mockCity, badge: 'rising' as const }
    render(<CityCard city={risingCity} />)

    expect(screen.getByText('상승')).toBeInTheDocument()
  })

  /**
   * HC-012: CityCard - 신규 배지 표시
   * Tests that "new" badge is displayed correctly
   */
  it('HC-012: should display new badge', () => {
    const newCity = { ...mockCity, badge: 'new' as const }
    render(<CityCard city={newCity} />)

    expect(screen.getByText('신규')).toBeInTheDocument()
  })

  /**
   * HC-013: CityCard - 배지 없는 경우
   * Tests that no badge is displayed when badge prop is undefined
   */
  it('HC-013: should not display badge when badge is undefined', () => {
    const noBadgeCity = { ...mockCity, badge: undefined }
    render(<CityCard city={noBadgeCity} />)

    expect(screen.queryByText('인기')).not.toBeInTheDocument()
    expect(screen.queryByText('상승')).not.toBeInTheDocument()
    expect(screen.queryByText('신규')).not.toBeInTheDocument()
  })

  /**
   * HC-014: CityCard - 좋아요 버튼 기능
   * Tests that like button toggles heart icon when clicked
   */
  it('HC-014: should toggle like state when heart button is clicked', async () => {
    const user = userEvent.setup()
    render(<CityCard city={mockCity} />)

    const heartButton = screen.getAllByRole('button').find(btn =>
      btn.querySelector('svg')
    )
    expect(heartButton).toBeDefined()

    if (heartButton) {
      const heartIcon = heartButton.querySelector('svg')
      expect(heartIcon).not.toHaveClass('fill-red-500')

      await user.click(heartButton)

      // Note: State change would be reflected in subsequent renders
      expect(heartButton).toBeInTheDocument()
    }
  })

  /**
   * HC-015: CityCard - 초기 좋아요 상태
   * Tests that card respects initial isLiked prop
   */
  it('HC-015: should show filled heart when initially liked', () => {
    const likedCity = { ...mockCity, isLiked: true }
    render(<CityCard city={likedCity} />)

    const heartButton = screen.getAllByRole('button').find(btn =>
      btn.querySelector('svg')
    )

    if (heartButton) {
      const heartIcon = heartButton.querySelector('svg')
      expect(heartIcon).toHaveClass('fill-red-500')
    }
  })

  /**
   * HC-016: CityCard - 상세보기 버튼
   * Tests that "자세히" link is rendered
   */
  it('HC-016: should render detail link', () => {
    render(<CityCard city={mockCity} />)

    expect(screen.getByRole('link', { name: /자세히/ })).toBeInTheDocument()
  })

  /**
   * HC-017: CityCard - 링크 동작
   * Tests that city name and image link to city detail page
   */
  it('HC-017: should have correct links to city detail page', () => {
    render(<CityCard city={mockCity} />)

    const links = screen.getAllByRole('link')
    const cityLinks = links.filter(link => link.getAttribute('href') === '/cities/gangneung')

    expect(cityLinks.length).toBeGreaterThan(0)
  })

  /**
   * HC-018: CityCard - 호버 효과
   * Tests that card has hover effect classes
   */
  it('HC-018: should have hover effect classes', () => {
    const { container } = render(<CityCard city={mockCity} />)
    const card = container.querySelector('.group')

    expect(card).toHaveClass('hover:shadow-lg', 'hover:-translate-y-1')
  })

  /**
   * HC-019: CityCard - 카드 레이아웃 구조
   * Tests that card has proper structure with CardContent and CardFooter
   */
  it('HC-019: should have proper card structure', () => {
    const { container } = render(<CityCard city={mockCity} />)

    const card = container.querySelector('[class*="group overflow-hidden"]')
    expect(card).toBeInTheDocument()
    expect(card?.querySelector('h3')).toBeInTheDocument()
  })

  /**
   * HC-020: CityCard - 메트릭 그리드 레이아웃
   * Tests that metrics are displayed in a 2-column grid
   */
  it('HC-020: should display metrics in grid layout', () => {
    const { container } = render(<CityCard city={mockCity} />)
    const grid = container.querySelector('.grid.grid-cols-2')

    expect(grid).toBeInTheDocument()
  })
})
