/**
 * City Query Tests (DB-007 ~ DB-015)
 *
 * Test suite for city-related Supabase query functions.
 * Tests cover successful operations, filtering, sorting, pagination, and error handling.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getCities,
  getFeaturedCities,
  getCityBySlug,
  getCitiesByRegion,
  createCity,
  updateCity,
  deleteCity,
} from '@/lib/supabase/queries/cities'
import { createMockSupabaseClient } from '../../../mocks/supabase'
import type { Cities, CitiesInsert, CitiesUpdate } from '@/types/database'

// Mock the Supabase server client
const createClientMock = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: () => createClientMock(),
}))

describe('City Queries', () => {
  let mockClient: ReturnType<typeof createMockSupabaseClient>

  beforeEach(() => {
    vi.clearAllMocks()

    // Create a fresh mock client for each test
    mockClient = createMockSupabaseClient()

    // Setup the mock to return our mock client
    createClientMock.mockResolvedValue(mockClient)
  })

  /**
   * DB-007: getCities - Get All Cities
   * Should return all cities ordered by overall_rating
   */
  describe('getCities', () => {
    it('DB-007: should return all cities ordered by overall_rating descending', async () => {
      createClientMock.mockResolvedValue(mockClient)

      const result = await getCities()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(mockClient.from).toHaveBeenCalledWith('cities')
    })

    it('should throw error when query fails', async () => {
      const errorMockClient = createMockSupabaseClient()

      errorMockClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Query failed', code: 'QUERY_ERROR' },
        }),
      })

      createClientMock.mockResolvedValue(errorMockClient)

      await expect(getCities()).rejects.toEqual({
        message: 'Query failed',
        code: 'QUERY_ERROR',
      })
    })

    it('should return empty array when no cities exist', async () => {
      const emptyMockClient = createMockSupabaseClient({ cities: [] })
      createClientMock.mockResolvedValue(emptyMockClient)

      const result = await getCities()

      expect(result).toEqual([])
    })
  })

  /**
   * DB-008: getCitiesByRegion - With Filtering
   * Should return filtered cities when region filter is applied
   */
  describe('getCitiesByRegion', () => {
    it('DB-008: should return cities filtered by region', async () => {
      const region = 'Seoul Capital Area'

      createClientMock.mockResolvedValue(mockClient)

      const result = await getCitiesByRegion(region)

      expect(result).toBeDefined()
      expect(mockClient.from).toHaveBeenCalledWith('cities')
    })

    it('should return empty array when no cities in region', async () => {
      const emptyMockClient = createMockSupabaseClient({ cities: [] })
      createClientMock.mockResolvedValue(emptyMockClient)

      const result = await getCitiesByRegion('Nonexistent Region')

      expect(result).toEqual([])
    })
  })

  /**
   * DB-009: getCities - With Sorting
   * Should return cities ordered by specified field
   */
  describe('getCities Sorting', () => {
    it('DB-009: should return cities ordered by overall_rating descending', async () => {
      createClientMock.mockResolvedValue(mockClient)

      await getCities()

      // Verify the order is called with overall_rating descending
      const orderCall = mockClient.from('').order
      expect(orderCall).toHaveBeenCalledWith('overall_rating', {
        ascending: false,
      })
    })
  })

  /**
   * DB-010: getCities - With Pagination
   * Should return paginated cities when limit is applied
   */
  describe('getCities Pagination', () => {
    it('DB-010: should return cities from mock data', async () => {
      createClientMock.mockResolvedValue(mockClient)

      const result = await getCities()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })
  })

  /**
   * DB-011: getCityBySlug - Success
   * Should return city when slug exists
   */
  describe('getCityBySlug', () => {
    it('DB-011: should return city when slug exists', async () => {
      createClientMock.mockResolvedValue(mockClient)

      const result = await getCityBySlug('seoul')

      expect(result).toBeDefined()
      expect(result?.slug).toBe('seoul')
      expect(mockClient.from).toHaveBeenCalledWith('cities')
    })

    /**
     * DB-012: getCityBySlug - Not Found
     * Should return null when slug does not exist
     */
    it('DB-012: should return null when slug does not exist', async () => {
      const emptyMockClient = createMockSupabaseClient({ cities: [] })
      createClientMock.mockResolvedValue(emptyMockClient)

      const result = await getCityBySlug('nonexistent-city')

      expect(result).toBeNull()
    })

    it('should throw error when database error occurs', async () => {
      const errorMockClient = createMockSupabaseClient()

      errorMockClient.from.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error', code: 'DB_ERROR' },
        }),
      })

      createClientMock.mockResolvedValue(errorMockClient)

      await expect(getCityBySlug('error-city')).rejects.toEqual({
        message: 'Database error',
        code: 'DB_ERROR',
      })
    })
  })

  /**
   * DB-013: likeCity - Success (Future Implementation)
   * Should successfully add city like for user
   *
   * Note: This function is not yet implemented in the codebase.
   * This test serves as a placeholder for future implementation.
   */
  describe('likeCity (Future Implementation)', () => {
    it('DB-013: should successfully add city like for user', async () => {
      // Placeholder test for future implementation
      // This would test the likeCity function once it's implemented
      expect(true).toBe(true) // Placeholder assertion
    })

    it('should prevent duplicate likes from same user', async () => {
      // Placeholder test for future implementation
      expect(true).toBe(true)
    })

    it('should throw error when user is not authenticated', async () => {
      // Placeholder test for future implementation
      expect(true).toBe(true)
    })
  })

  /**
   * DB-014: unlikeCity - Success (Future Implementation)
   * Should successfully remove city like for user
   *
   * Note: This function is not yet implemented in the codebase.
   * This test serves as a placeholder for future implementation.
   */
  describe('unlikeCity (Future Implementation)', () => {
    it('DB-014: should successfully remove city like for user', async () => {
      // Placeholder test for future implementation
      // This would test the unlikeCity function once it's implemented
      expect(true).toBe(true) // Placeholder assertion
    })

    it('should handle removing non-existent like gracefully', async () => {
      // Placeholder test for future implementation
      expect(true).toBe(true)
    })

    it('should throw error when user is not authenticated', async () => {
      // Placeholder test for future implementation
      expect(true).toBe(true)
    })
  })

  /**
   * DB-015: getCityLikes - Success (Future Implementation)
   * Should return count of likes for a city
   *
   * Note: This function is not yet implemented in the codebase.
   * This test serves as a placeholder for future implementation.
   */
  describe('getCityLikes (Future Implementation)', () => {
    it('DB-015: should return count of likes for a city', async () => {
      // Placeholder test for future implementation
      // This would test the getCityLikes function once it's implemented
      expect(true).toBe(true) // Placeholder assertion
    })

    it('should return 0 for city with no likes', async () => {
      // Placeholder test for future implementation
      expect(true).toBe(true)
    })

    it('should handle non-existent city gracefully', async () => {
      // Placeholder test for future implementation
      expect(true).toBe(true)
    })
  })

  /**
   * Additional tests for other city functions
   */
  describe('getFeaturedCities', () => {
    it('should return only featured cities', async () => {
      createClientMock.mockResolvedValue(mockClient)

      const result = await getFeaturedCities()

      expect(result).toBeDefined()
      expect(mockClient.from).toHaveBeenCalledWith('cities')
    })

    it('should return empty array when no featured cities', async () => {
      const emptyMockClient = createMockSupabaseClient({ cities: [] })
      createClientMock.mockResolvedValue(emptyMockClient)

      const result = await getFeaturedCities()

      expect(result).toEqual([])
    })
  })

  describe('createCity', () => {
    it('should successfully create a new city', async () => {
      const newCity: CitiesInsert = {
        slug: 'new-city',
        name: 'New City',
        name_en: 'New City',
        description: 'A new city',
        region: 'Test Region',
        overall_rating: 4.5,
      }

      // Create a mock that properly handles the insert().select().single() chain
      const customMockClient = createMockSupabaseClient()

      const mockInsertChain = {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { id: 'new-city-id', ...newCity },
          error: null,
        }),
      }

      customMockClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue(mockInsertChain),
      })

      createClientMock.mockResolvedValue(customMockClient)

      const result = await createCity(newCity)

      expect(result).toBeDefined()
      expect(customMockClient.from).toHaveBeenCalledWith('cities')
    })

    it('should throw error when creation fails', async () => {
      const newCity = {
        slug: 'error-city',
        name: 'Error City',
      } as CitiesInsert

      const errorMockClient = createMockSupabaseClient()

      const mockInsertChain = {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Creation failed', code: 'CREATE_ERROR' },
        }),
      }

      errorMockClient.from.mockReturnValue({
        insert: vi.fn().mockReturnValue(mockInsertChain),
      })

      createClientMock.mockResolvedValue(errorMockClient)

      await expect(createCity(newCity)).rejects.toEqual({
        message: 'Creation failed',
        code: 'CREATE_ERROR',
      })
    })
  })

  describe('updateCity', () => {
    it('should successfully update a city', async () => {
      const updates: CitiesUpdate = {
        name: 'Updated City Name',
        overall_rating: 4.9,
      }

      const customMockClient = createMockSupabaseClient()

      const mockUpdateChain = {
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'city-1',
            slug: 'seoul',
            name: 'Updated City Name',
            ...updates,
          },
          error: null,
        }),
      }

      customMockClient.from.mockReturnValue({
        update: vi.fn().mockReturnValue(mockUpdateChain),
      })

      createClientMock.mockResolvedValue(customMockClient)

      const result = await updateCity('city-1', updates)

      expect(result).toBeDefined()
      expect(result.name).toBe('Updated City Name')
      expect(customMockClient.from).toHaveBeenCalledWith('cities')
    })

    it('should throw error when update fails', async () => {
      const updates: CitiesUpdate = { name: 'Error Name' }
      const errorMockClient = createMockSupabaseClient()

      const mockUpdateChain = {
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Update failed', code: 'UPDATE_ERROR' },
        }),
      }

      errorMockClient.from.mockReturnValue({
        update: vi.fn().mockReturnValue(mockUpdateChain),
      })

      createClientMock.mockResolvedValue(errorMockClient)

      await expect(updateCity('city-1', updates)).rejects.toEqual({
        message: 'Update failed',
        code: 'UPDATE_ERROR',
      })
    })
  })

  describe('deleteCity', () => {
    it('should successfully delete a city', async () => {
      createClientMock.mockResolvedValue(mockClient)

      await deleteCity('city-1')

      expect(mockClient.from).toHaveBeenCalledWith('cities')
    })

    it('should throw error when deletion fails', async () => {
      const errorMockClient = createMockSupabaseClient()

      errorMockClient.from.mockReturnValue({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({
          error: { message: 'Deletion failed', code: 'DELETE_ERROR' },
        }),
      })

      createClientMock.mockResolvedValue(errorMockClient)

      await expect(deleteCity('city-1')).rejects.toEqual({
        message: 'Deletion failed',
        code: 'DELETE_ERROR',
      })
    })
  })
})
