/**
 * Meetup Queries Tests
 * Test IDs: DB-040 ~ DB-051
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getMeetups,
  getMeetupById,
  createMeetup,
  updateMeetup,
  deleteMeetup,
  joinMeetup,
  leaveMeetup,
  getMeetupParticipants,
} from '@/lib/supabase/queries/meetups'
import { setupSupabaseMocks, mockUser } from '@/tests/mocks'
import type { Meetups, MeetupWithDetails } from '@/types/database'

describe('Meetup Queries', () => {
  let mockClient: any

  beforeEach(() => {
    vi.clearAllMocks()
    const setup = setupSupabaseMocks()
    mockClient = setup.mockClient
  })

  /**
   * DB-040: getMeetups - 전체 목록 조회
   * Tests retrieving all meetups without filters
   */
  it('DB-040: should get all meetups', async () => {
    const mockMeetups: MeetupWithDetails[] = [
      {
        id: 'meetup-1',
        user_id: 'user-1',
        city_id: 'city-1',
        title: 'Tech Meetup',
        description: 'A tech meetup',
        location: 'Seoul',
        meetup_date: new Date(Date.now() + 86400000).toISOString(),
        max_participants: 10,
        current_participants: 0,
        status: 'scheduled',
        image_url: null,
        tags: ['tech', 'networking'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          id: 'user-1',
          email: 'user1@example.com',
          username: 'user1',
          full_name: 'User One',
          avatar_url: null,
          bio: null,
          location: null,
          website: null,
          updated_at: new Date().toISOString(),
        },
        cities: {
          id: 'city-1',
          slug: 'seoul',
          name: '서울',
          name_en: 'Seoul',
          description: 'Capital of Korea',
          image_url: null,
          region: 'Seoul Capital Area',
          population: 9720000,
          wifi_rating: 5,
          cafe_rating: 5,
          cost_rating: 3,
          safety_rating: 5,
          community_rating: 4,
          overall_rating: 4.4,
          tags: ['digital-nomad'],
          is_featured: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      {
        id: 'meetup-2',
        user_id: 'user-2',
        city_id: 'city-1',
        title: 'Coffee Meetup',
        description: 'Coffee lovers meetup',
        location: 'Gangnam',
        meetup_date: new Date(Date.now() + 172800000).toISOString(),
        max_participants: 5,
        current_participants: 2,
        status: 'scheduled',
        image_url: null,
        tags: ['coffee', 'social'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          id: 'user-2',
          email: 'user2@example.com',
          username: 'user2',
          full_name: 'User Two',
          avatar_url: null,
          bio: null,
          location: null,
          website: null,
          updated_at: new Date().toISOString(),
        },
        cities: {
          id: 'city-1',
          slug: 'seoul',
          name: '서울',
          name_en: 'Seoul',
          description: 'Capital of Korea',
          image_url: null,
          region: 'Seoul Capital Area',
          population: 9720000,
          wifi_rating: 5,
          cafe_rating: 5,
          cost_rating: 3,
          safety_rating: 5,
          community_rating: 4,
          overall_rating: 4.4,
          tags: ['digital-nomad'],
          is_featured: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    ]

    mockClient.from('meetups').select.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        gte: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: mockMeetups,
              error: null,
            }),
          }),
        }),
      }),
    } as any)

    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const meetups = await getMeetups()

    expect(meetups).toHaveLength(2)
    expect(meetups[0].title).toBe('Tech Meetup')
    expect(meetups[1].title).toBe('Coffee Meetup')
  })

  /**
   * DB-041: getMeetups - 도시 필터
   * Tests filtering meetups by city
   */
  it('DB-041: should get meetups filtered by city', async () => {
    const mockMeetups: MeetupWithDetails[] = [
      {
        id: 'meetup-1',
        user_id: 'user-1',
        city_id: 'city-1',
        title: 'Seoul Meetup',
        description: 'Meetup in Seoul',
        location: 'Seoul',
        meetup_date: new Date(Date.now() + 86400000).toISOString(),
        max_participants: 10,
        current_participants: 0,
        status: 'scheduled',
        image_url: null,
        tags: ['tech'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          id: 'user-1',
          email: 'user1@example.com',
          username: 'user1',
          full_name: 'User One',
          avatar_url: null,
          bio: null,
          location: null,
          website: null,
          updated_at: new Date().toISOString(),
        },
        cities: {
          id: 'city-1',
          slug: 'seoul',
          name: '서울',
          name_en: 'Seoul',
          description: 'Capital of Korea',
          image_url: null,
          region: 'Seoul Capital Area',
          population: 9720000,
          wifi_rating: 5,
          cafe_rating: 5,
          cost_rating: 3,
          safety_rating: 5,
          community_rating: 4,
          overall_rating: 4.4,
          tags: ['digital-nomad'],
          is_featured: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    ]

    mockClient.from('meetups').select.mockReturnValue({
      eq: vi.fn().mockReturnValue((column: string, value: string) => {
        if (column === 'city_id' && value === 'city-1') {
          return {
            gte: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: mockMeetups,
                  error: null,
                }),
              }),
            }),
          } as any
        }
        return {
          gte: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          }),
        } as any
      }),
    } as any)

    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const meetups = await getMeetups({ cityId: 'city-1' })

    expect(meetups).toHaveLength(1)
    expect(meetups[0].city_id).toBe('city-1')
    expect(meetups[0].title).toBe('Seoul Meetup')
  })

  /**
   * DB-042: getMeetups - 날짜 필터 (upcoming)
   * Tests filtering meetups by upcoming date
   */
  it('DB-042: should get upcoming meetups', async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString()

    const mockMeetups: MeetupWithDetails[] = [
      {
        id: 'meetup-1',
        user_id: 'user-1',
        city_id: 'city-1',
        title: 'Upcoming Meetup',
        description: 'Future meetup',
        location: 'Seoul',
        meetup_date: tomorrow,
        max_participants: 10,
        current_participants: 0,
        status: 'scheduled',
        image_url: null,
        tags: ['tech'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: {
          id: 'user-1',
          email: 'user1@example.com',
          username: 'user1',
          full_name: 'User One',
          avatar_url: null,
          bio: null,
          location: null,
          website: null,
          updated_at: new Date().toISOString(),
        },
        cities: {
          id: 'city-1',
          slug: 'seoul',
          name: '서울',
          name_en: 'Seoul',
          description: 'Capital of Korea',
          image_url: null,
          region: 'Seoul Capital Area',
          population: 9720000,
          wifi_rating: 5,
          cafe_rating: 5,
          cost_rating: 3,
          safety_rating: 5,
          community_rating: 4,
          overall_rating: 4.4,
          tags: ['digital-nomad'],
          is_featured: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    ]

    mockClient.from('meetups').select.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        gte: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: mockMeetups,
              error: null,
            }),
          }),
        }),
      }),
    } as any)

    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const meetups = await getMeetups({ upcoming: true })

    expect(meetups).toHaveLength(1)
    expect(new Date(meetups[0].meetup_date)).greaterThanOrEqual(new Date())
  })

  /**
   * DB-043: getMeetupById - 성공
   * Tests retrieving a meetup by ID successfully
   */
  it('DB-043: should get meetup by ID successfully', async () => {
    const mockMeetup: MeetupWithDetails = {
      id: 'meetup-1',
      user_id: 'user-1',
      city_id: 'city-1',
      title: 'Specific Meetup',
      description: 'A specific meetup',
      location: 'Seoul',
      meetup_date: new Date(Date.now() + 86400000).toISOString(),
      max_participants: 10,
      current_participants: 0,
      status: 'scheduled',
      image_url: null,
      tags: ['tech'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        id: 'user-1',
        email: 'user1@example.com',
        username: 'user1',
        full_name: 'User One',
        avatar_url: null,
        bio: null,
        location: null,
        website: null,
        updated_at: new Date().toISOString(),
      },
      cities: {
        id: 'city-1',
        slug: 'seoul',
        name: '서울',
        name_en: 'Seoul',
        description: 'Capital of Korea',
        image_url: null,
        region: 'Seoul Capital Area',
        population: 9720000,
        wifi_rating: 5,
        cafe_rating: 5,
        cost_rating: 3,
        safety_rating: 5,
        community_rating: 4,
        overall_rating: 4.4,
        tags: ['digital-nomad'],
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }

    mockClient.from('meetups').select.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: mockMeetup,
          error: null,
        }),
      }),
    } as any)

    mockClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    mockClient.from('meetup_participants').select.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116' },
          }),
        }),
      }),
    } as any)

    const meetup = await getMeetupById('meetup-1')

    expect(meetup).toBeDefined()
    expect(meetup?.id).toBe('meetup-1')
    expect(meetup?.title).toBe('Specific Meetup')
  })

  /**
   * DB-044: getMeetupById - 없음
   * Tests retrieving a non-existent meetup returns null
   */
  it('DB-044: should return null when meetup not found', async () => {
    mockClient.from('meetups').select.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'No rows found' },
        }),
      }),
    } as any)

    const meetup = await getMeetupById('non-existent-id')

    expect(meetup).toBeNull()
  })

  /**
   * DB-045: createMeetup - 성공
   * Tests creating a new meetup successfully
   */
  it('DB-045: should create a new meetup', async () => {
    const newMeetup: Meetups = {
      id: 'meetup-new',
      user_id: 'user-1',
      city_id: 'city-1',
      title: 'New Meetup',
      description: 'A brand new meetup',
      location: 'Seoul',
      meetup_date: new Date(Date.now() + 86400000).toISOString(),
      max_participants: 10,
      current_participants: 0,
      status: 'scheduled',
      image_url: null,
      tags: ['tech', 'networking'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockClient.from('meetups').select.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: newMeetup,
            error: null,
          }),
        }),
      }),
    } as any)

    mockClient.from('meetup_participants').insert.mockResolvedValue({
      data: null,
      error: null,
    })

    const createdMeetup = await createMeetup(newMeetup)

    expect(createdMeetup).toBeDefined()
    expect(createdMeetup.id).toBe('meetup-new')
    expect(createdMeetup.title).toBe('New Meetup')
    expect(mockClient.from('meetup_participants').insert).toHaveBeenCalled()
  })

  /**
   * DB-046: updateMeetup - 성공
   * Tests updating a meetup successfully
   */
  it('DB-046: should update a meetup', async () => {
    const updatedMeetup: Meetups = {
      id: 'meetup-1',
      user_id: 'user-1',
      city_id: 'city-1',
      title: 'Updated Meetup Title',
      description: 'Updated description',
      location: 'Busan',
      meetup_date: new Date(Date.now() + 86400000).toISOString(),
      max_participants: 15,
      current_participants: 0,
      status: 'scheduled',
      image_url: null,
      tags: ['tech'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockClient.from('meetups').select.mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: updatedMeetup,
              error: null,
            }),
          }),
        }),
      }),
    } as any)

    const result = await updateMeetup('meetup-1', {
      title: 'Updated Meetup Title',
      description: 'Updated description',
      location: 'Busan',
      max_participants: 15,
    })

    expect(result).toBeDefined()
    expect(result.title).toBe('Updated Meetup Title')
    expect(result.description).toBe('Updated description')
    expect(result.location).toBe('Busan')
    expect(result.max_participants).toBe(15)
  })

  /**
   * DB-047: deleteMeetup - 성공
   * Tests deleting a meetup successfully
   */
  it('DB-047: should delete a meetup', async () => {
    mockClient.from('meetups').select.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }),
    } as any)

    await expect(deleteMeetup('meetup-1')).resolves.not.toThrow()
    expect(mockClient.from('meetups').delete).toHaveBeenCalled()
  })

  /**
   * DB-048: joinMeetup - 성공
   * Tests joining a meetup successfully
   */
  it('DB-048: should join a meetup', async () => {
    mockClient.from('meetup_participants').insert.mockResolvedValue({
      data: null,
      error: null,
    })

    await expect(joinMeetup('meetup-1', 'user-1')).resolves.not.toThrow()
    expect(mockClient.from('meetup_participants').insert).toHaveBeenCalledWith({
      meetup_id: 'meetup-1',
      user_id: 'user-1',
      status: 'going',
    })
  })

  /**
   * DB-049: leaveMeetup - 성공
   * Tests leaving a meetup successfully
   */
  it('DB-049: should leave a meetup', async () => {
    mockClient.from('meetup_participants').delete.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      }),
    } as any)

    await expect(leaveMeetup('meetup-1', 'user-1')).resolves.not.toThrow()
    expect(mockClient.from('meetup_participants').delete).toHaveBeenCalled()
  })

  /**
   * DB-050: getMeetupParticipants - 성공
   * Tests getting meetup participants successfully
   */
  it('DB-050: should get meetup participants', async () => {
    const mockParticipants = [
      {
        id: 'participant-1',
        meetup_id: 'meetup-1',
        user_id: 'user-1',
        status: 'going',
        joined_at: new Date().toISOString(),
        profiles: {
          id: 'user-1',
          email: 'user1@example.com',
          username: 'user1',
          full_name: 'User One',
          avatar_url: null,
          bio: null,
          location: null,
          website: null,
          updated_at: new Date().toISOString(),
        },
      },
      {
        id: 'participant-2',
        meetup_id: 'meetup-1',
        user_id: 'user-2',
        status: 'going',
        joined_at: new Date().toISOString(),
        profiles: {
          id: 'user-2',
          email: 'user2@example.com',
          username: 'user2',
          full_name: 'User Two',
          avatar_url: null,
          bio: null,
          location: null,
          website: null,
          updated_at: new Date().toISOString(),
        },
      },
    ]

    mockClient.from('meetup_participants').select.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({
            data: mockParticipants,
            error: null,
          }),
        }),
      }),
    } as any)

    const participants = await getMeetupParticipants('meetup-1')

    expect(participants).toHaveLength(2)
    expect(participants[0].user_id).toBe('user-1')
    expect(participants[1].user_id).toBe('user-2')
    expect(participants[0].status).toBe('going')
  })

  /**
   * DB-051: isParticipant - 참여자 확인 (getMeetupById와 함께 테스트)
   * Tests checking if user is a participant of a meetup
   */
  it('DB-051: should check if user is a participant', async () => {
    const mockMeetup: MeetupWithDetails = {
      id: 'meetup-1',
      user_id: 'user-1',
      city_id: 'city-1',
      title: 'Test Meetup',
      description: 'Test',
      location: 'Seoul',
      meetup_date: new Date(Date.now() + 86400000).toISOString(),
      max_participants: 10,
      current_participants: 0,
      status: 'scheduled',
      image_url: null,
      tags: ['tech'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        id: 'user-1',
        email: 'user1@example.com',
        username: 'user1',
        full_name: 'User One',
        avatar_url: null,
        bio: null,
        location: null,
        website: null,
        updated_at: new Date().toISOString(),
      },
      cities: {
        id: 'city-1',
        slug: 'seoul',
        name: '서울',
        name_en: 'Seoul',
        description: 'Capital of Korea',
        image_url: null,
        region: 'Seoul Capital Area',
        population: 9720000,
        wifi_rating: 5,
        cafe_rating: 5,
        cost_rating: 3,
        safety_rating: 5,
        community_rating: 4,
        overall_rating: 4.4,
        tags: ['digital-nomad'],
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }

    mockClient.from('meetups').select.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: mockMeetup,
          error: null,
        }),
      }),
    } as any)

    // Mock authenticated user
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    // Mock participant check - user IS a participant
    mockClient.from('meetup_participants').select.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: { id: 'participant-1', meetup_id: 'meetup-1', user_id: 'mock-user-1', status: 'going' },
            error: null,
          }),
        }),
      }),
    } as any)

    const meetup = await getMeetupById('meetup-1')

    expect(meetup).toBeDefined()
    expect(meetup?.is_participant).toBe(true)
  })

  /**
   * DB-051 (추가): isParticipant - 비참여자 확인
   * Tests checking if user is NOT a participant of a meetup
   */
  it('DB-051: should check if user is NOT a participant', async () => {
    const mockMeetup: MeetupWithDetails = {
      id: 'meetup-1',
      user_id: 'user-1',
      city_id: 'city-1',
      title: 'Test Meetup',
      description: 'Test',
      location: 'Seoul',
      meetup_date: new Date(Date.now() + 86400000).toISOString(),
      max_participants: 10,
      current_participants: 0,
      status: 'scheduled',
      image_url: null,
      tags: ['tech'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profiles: {
        id: 'user-1',
        email: 'user1@example.com',
        username: 'user1',
        full_name: 'User One',
        avatar_url: null,
        bio: null,
        location: null,
        website: null,
        updated_at: new Date().toISOString(),
      },
      cities: {
        id: 'city-1',
        slug: 'seoul',
        name: '서울',
        name_en: 'Seoul',
        description: 'Capital of Korea',
        image_url: null,
        region: 'Seoul Capital Area',
        population: 9720000,
        wifi_rating: 5,
        cafe_rating: 5,
        cost_rating: 3,
        safety_rating: 5,
        community_rating: 4,
        overall_rating: 4.4,
        tags: ['digital-nomad'],
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }

    mockClient.from('meetups').select.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: mockMeetup,
          error: null,
        }),
      }),
    } as any)

    // Mock authenticated user
    mockClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    // Mock participant check - user is NOT a participant
    mockClient.from('meetup_participants').select.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116' },
          }),
        }),
      }),
    } as any)

    const meetup = await getMeetupById('meetup-1')

    expect(meetup).toBeDefined()
    expect(meetup?.is_participant).toBe(false)
  })

  /**
   * Error handling: createMeetup throws error on failure
   */
  it('should throw error when createMeetup fails', async () => {
    mockClient.from('meetups').select.mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error', code: 'PGRST301' },
          }),
        }),
      }),
    } as any)

    await expect(createMeetup({
      user_id: 'user-1',
      city_id: 'city-1',
      title: 'Test',
      description: 'Test',
      meetup_date: new Date().toISOString(),
    } as any)).rejects.toThrow()
  })

  /**
   * Error handling: updateMeetup throws error on failure
   */
  it('should throw error when updateMeetup fails', async () => {
    mockClient.from('meetups').select.mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error', code: 'PGRST301' },
            }),
          }),
        }),
      }),
    } as any)

    await expect(updateMeetup('meetup-1', { title: 'Updated' })).rejects.toThrow()
  })

  /**
   * Error handling: deleteMeetup throws error on failure
   */
  it('should throw error when deleteMeetup fails', async () => {
    mockClient.from('meetups').select.mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error', code: 'PGRST301' },
        }),
      }),
    } as any)

    await expect(deleteMeetup('meetup-1')).rejects.toThrow()
  })
})
