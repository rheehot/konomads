import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CitiesPage from '@/app/cities/page'

// Mock CityCard component
vi.mock('@/components/homepage/city-card', () => ({
  CityCard: ({ city }: { city: any }) => (
    <div data-testid={`city-card-${city.id}`} data-city-id={city.id}>
      <h3>{city.name}</h3>
      <p>{city.region}</p>
    </div>
  ),
}))

describe('Cities Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * PG-006: 기본 렌더링 테스트
   * Cities 페이지가 기본 상태로 올바르게 렌더링되는지 확인
   */
  describe('PG-006: Basic Rendering', () => {
    it('should render without crashing', () => {
      expect(() => render(<CitiesPage />)).not.toThrow()
    })

    it('should render page header', () => {
      render(<CitiesPage />)
      expect(screen.getByText('🌏 모든 도시 보기')).toBeInTheDocument()
    })

    it('should render page description', () => {
      render(<CitiesPage />)
      expect(
        screen.getByText('노마드를 위한 완벽한 도시를 찾아보세요')
      ).toBeInTheDocument()
    })

    it('should render search input', () => {
      render(<CitiesPage />)
      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )
      expect(searchInput).toBeInTheDocument()
      expect(searchInput).toHaveValue('')
    })

    it('should render sort dropdown', () => {
      render(<CitiesPage />)
      const sortSelect = screen.getByDisplayValue('인기순')
      expect(sortSelect).toBeInTheDocument()
    })

    it('should render region filter dropdown', () => {
      render(<CitiesPage />)
      const regionSelect = screen.getByDisplayValue('전체 지역')
      expect(regionSelect).toBeInTheDocument()
    })

    it('should display correct number of cities initially', () => {
      render(<CitiesPage />)
      // The default mock data has 15 cities
      const resultCount = screen.getByText(/총 \d+개의 도시/)
      expect(resultCount).toBeInTheDocument()
      expect(resultCount.textContent).toContain('15')
    })

    it('should render all city cards initially', () => {
      render(<CitiesPage />)
      // Should have 15 city cards from the mock data
      const cityCards = screen.getAllByTestId(/city-card-\d+/)
      expect(cityCards.length).toBe(15)
    })
  })

  /**
   * PG-007: 필터링 기능 테스트
   * 지역 필터가 올바르게 작동하는지 확인
   */
  describe('PG-007: Filtering', () => {
    it('should filter cities by region', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const regionSelect = screen.getByDisplayValue('전체 지역')

      // Select 강원도 region
      await user.selectOptions(regionSelect, '강원도')

      await waitFor(() => {
        // 강원도 has 4 cities: 강릉, 속초, 춘천
        const resultCount = screen.getByText(/총 \d+개의 도시/)
        expect(resultCount.textContent).toContain('4')
      })
    })

    it('should filter cities by search term', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      // Search for "강릉"
      await user.type(searchInput, '강릉')

      await waitFor(() => {
        const resultCount = screen.getByText(/총 \d+개의 도시/)
        expect(resultCount.textContent).toContain('1')
      })
    })

    it('should filter cities by region description', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      // Search by region name
      await user.type(searchInput, '강원도')

      await waitFor(() => {
        const resultCount = screen.getByText(/총 \d+개의 도시/)
        expect(resultCount.textContent).toContain('4')
      })
    })

    it('should filter cities by description', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      // Search by description keyword
      await user.type(searchInput, '바다')

      await waitFor(() => {
        // Multiple cities have "바다" in their description
        const resultCount = screen.getByText(/총 \d+개의 도시/)
        expect(parseInt(resultCount.textContent!.match(/\d+/)![0])).toBeGreaterThan(0)
      })
    })

    it('should combine region and search filters', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const regionSelect = screen.getByDisplayValue('전체 지역')
      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      // Select 강원도 and search for "강릉"
      await user.selectOptions(regionSelect, '강원도')
      await user.type(searchInput, '강릉')

      await waitFor(() => {
        const resultCount = screen.getByText(/총 \d+개의 도시/)
        expect(resultCount.textContent).toContain('1')
      })
    })

    it('should show no results when filter matches nothing', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      // Search for non-existent city
      await user.type(searchInput, '존재하지않는도시')

      await waitFor(() => {
        expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument()
        expect(
          screen.getByText('다른 검색어나 필터를 시도해보세요')
        ).toBeInTheDocument()
      })
    })
  })

  /**
   * PG-008: 정렬 기능 테스트
   * 정렬 옵션이 올바르게 작동하는지 확인
   */
  describe('PG-008: Sorting', () => {
    it('should sort by popularity (default)', () => {
      render(<CitiesPage />)
      // Default sort is by popularity (nomadsNow)
      // The most popular city should be 서울 with 120 nomads
      const firstCard = screen.getAllByTestId(/city-card-\d+/)[0]
      expect(firstCard).toHaveAttribute('data-city-id', '4') // 서울's id
    })

    it('should sort by rating', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const sortSelect = screen.getByDisplayValue('인기순')

      // Sort by rating
      await user.selectOptions(sortSelect, '평점순')

      await waitFor(() => {
        const cityCards = screen.getAllByTestId(/city-card-\d+/)
        // First card should be 제주 (rating: 4.7)
        expect(cityCards[0]).toHaveAttribute('data-city-id', '2')
      })
    })

    it('should sort by cost low to high', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const sortSelect = screen.getByDisplayValue('인기순')

      // Sort by cost low
      await user.selectOptions(sortSelect, '저렴한순')

      await waitFor(() => {
        const cityCards = screen.getAllByTestId(/city-card-\d+/)
        // First card should be 진주 (monthlyCost: 1450000)
        expect(cityCards[0]).toHaveAttribute('data-city-id', '13')
      })
    })

    it('should sort by cost high to low', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const sortSelect = screen.getByDisplayValue('인기순')

      // Sort by cost high
      await user.selectOptions(sortSelect, '비싼순')

      await waitFor(() => {
        const cityCards = screen.getAllByTestId(/city-card-\d+/)
        // First card should be 서울 (monthlyCost: 2800000)
        expect(cityCards[0]).toHaveAttribute('data-city-id', '4')
      })
    })
  })

  /**
   * PG-009: 검색 기능 테스트
   * 검색이 올바르게 작동하는지 확인
   */
  describe('PG-009: Search', () => {
    it('should search by city name', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      await user.type(searchInput, '서울')

      await waitFor(() => {
        const resultCount = screen.getByText(/총 \d+개의 도시/)
        expect(resultCount.textContent).toContain('1')
        expect(screen.getByText('서울')).toBeInTheDocument()
      })
    })

    it('should be case insensitive', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      await user.type(searchInput, 'SEOUL')

      await waitFor(() => {
        const resultCount = screen.getByText(/총 \d+개의 도시/)
        expect(resultCount.textContent).toContain('1')
      })
    })

    it('should handle partial matches', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      // Search for "강" - should match 강릉
      await user.type(searchInput, '강')

      await waitFor(() => {
        const resultCount = screen.getByText(/총 \d+개의 도시/)
        expect(parseInt(resultCount.textContent!.match(/\d+/)![0])).toBeGreaterThan(0)
      })
    })

    it('should clear search and show all results', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      // Search for something
      await user.type(searchInput, '강릉')

      await waitFor(() => {
        const resultCount = screen.getByText(/총 \d+개의 도시/)
        expect(resultCount.textContent).toContain('1')
      })

      // Clear search
      await user.clear(searchInput)

      await waitFor(() => {
        const resultCount = screen.getByText(/총 \d+개의 도시/)
        expect(resultCount.textContent).toContain('15')
      })
    })
  })

  /**
   * PG-010: 빈 결과 상태 테스트
   * 검색 결과가 없을 때 올바른 메시지가 표시되는지 확인
   */
  describe('PG-010: Empty Results State', () => {
    it('should show empty state when no cities match', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      await user.type(searchInput, 'nonexistentcity')

      await waitFor(() => {
        expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument()
      })
    })

    it('should show helpful message when no results', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      await user.type(searchInput, 'xyz')

      await waitFor(() => {
        expect(
          screen.getByText('다른 검색어나 필터를 시도해보세요')
        ).toBeInTheDocument()
      })
    })

    it('should show reset button when no results', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      await user.type(searchInput, 'xyz')

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '필터 초기화' })).toBeInTheDocument()
      })
    })

    it('should reset filters when reset button is clicked', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      await user.type(searchInput, 'xyz')

      await waitFor(() => {
        expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument()
      })

      const resetButton = screen.getByRole('button', { name: '필터 초기화' })
      await user.click(resetButton)

      await waitFor(() => {
        const resultCount = screen.getByText(/총 \d+개의 도시/)
        expect(resultCount.textContent).toContain('15')
        expect(searchInput).toHaveValue('')
      })
    })

    it('should not show city cards when no results', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      await user.type(searchInput, 'xyz')

      await waitFor(() => {
        expect(screen.queryAllByTestId(/city-card-\d+/).length).toBe(0)
      })
    })

    it('should display emoji in empty state', async () => {
      const user = userEvent.setup()
      render(<CitiesPage />)

      const searchInput = screen.getByPlaceholderText(
        '도시, 지역, 설명으로 검색...'
      )

      await user.type(searchInput, 'xyz')

      await waitFor(() => {
        expect(screen.getByText('🔍')).toBeInTheDocument()
      })
    })
  })
})
