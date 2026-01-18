import { test as base } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';
import { Tables, Profiles, Cities, Posts, Meetups, Comments } from '../../types/database';

/**
 * Seed data interfaces
 */
export interface SeedCity {
  slug: string;
  name: string;
  name_en?: string;
  description?: string;
  region?: string;
  population?: number;
  wifi_rating?: number;
  cafe_rating?: number;
  cost_rating?: number;
  safety_rating?: number;
  community_rating?: number;
  overall_rating?: number;
  tags?: string[];
  is_featured?: boolean;
}

export interface SeedPost {
  user_id: string;
  city_id?: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  is_pinned?: boolean;
}

export interface SeedMeetup {
  user_id: string;
  city_id: string;
  title: string;
  description: string;
  location?: string;
  meetup_date: string;
  max_participants?: number;
  status?: string;
  tags?: string[];
}

export interface SeedComment {
  user_id: string;
  post_id: string;
  parent_id?: string;
  content: string;
}

/**
 * Database fixture interface
 */
export interface DatabaseFixture {
  supabase: ReturnType<typeof createClient<Database>>;
  cleanup: () => Promise<void>;
  createTestUser: (userData?: Partial<Profiles>) => Promise<Profiles>;
  deleteTestUser: (userId: string) => Promise<void>;
  createTestCity: (cityData?: Partial<SeedCity>) => Promise<Cities>;
  deleteTestCity: (cityId: string) => Promise<void>;
  createTestPost: (postData: SeedPost) => Promise<Posts>;
  deleteTestPost: (postId: string) => Promise<void>;
  createTestMeetup: (meetupData: SeedMeetup) => Promise<Meetups>;
  deleteTestMeetup: (meetupId: string) => Promise<void>;
  createTestComment: (commentData: SeedComment) => Promise<Comments>;
  deleteTestComment: (commentId: string) => Promise<void>;
  seedDatabase: () => Promise<void>;
  truncateTables: () => Promise<void>;
}

/**
 * Test data cleanup tracking
 */
const testEntities = {
  users: new Set<string>(),
  cities: new Set<string>(),
  posts: new Set<string>(),
  meetups: new Set<string>(),
  comments: new Set<string>(),
};

/**
 * Helper function to create Supabase admin client
 */
function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  }

  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Database fixture for Playwright tests
 * Provides database initialization, cleanup, and seed data helpers
 */
export const databaseTest = base.extend<DatabaseFixture>({
  supabase: async ({}, use) => {
    const client = createSupabaseAdminClient();
    await use(client);
  },

  cleanup: async ({ supabase }, use) => {
    const cleanupMethod = async () => {
      // Delete all test entities in reverse order of dependencies
      for (const commentId of testEntities.comments) {
        await supabase.from('comments').delete().eq('id', commentId);
      }
      testEntities.comments.clear();

      for (const meetupId of testEntities.meetups) {
        await supabase.from('meetup_participants').delete().eq('meetup_id', meetupId);
        await supabase.from('meetups').delete().eq('id', meetupId);
      }
      testEntities.meetups.clear();

      for (const postId of testEntities.posts) {
        await supabase.from('post_likes').delete().eq('post_id', postId);
        await supabase.from('comments').delete().eq('post_id', postId);
        await supabase.from('posts').delete().eq('id', postId);
      }
      testEntities.posts.clear();

      for (const cityId of testEntities.cities) {
        await supabase.from('cities').delete().eq('id', cityId);
      }
      testEntities.cities.clear();

      for (const userId of testEntities.users) {
        // Delete profile first
        await supabase.from('profiles').delete().eq('id', userId);
        // Then delete auth user
        await supabase.auth.admin.deleteUser(userId);
      }
      testEntities.users.clear();
    };
    await use(cleanupMethod);
  },

  createTestUser: async ({ supabase }, use) => {
    const createMethod = async (userData: Partial<Profiles> = {}) => {
      const email = `test-${Date.now()}@konomads.com`;
      const password = 'TestPassword123!';

      // Create auth user
      const { data: { user }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username || `testuser_${Date.now()}`,
            full_name: userData.full_name || 'Test User',
          }
        }
      });

      if (authError || !user) {
        throw new Error(`Failed to create test user: ${authError?.message || 'Unknown error'}`);
      }

      // Wait for profile to be created by trigger or create manually
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update profile if additional data provided
      if (Object.keys(userData).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            ...userData,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }
      }

      // Fetch and return complete profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      testEntities.users.add(user.id);
      return profile!;
    };
    await use(createMethod);
  },

  deleteTestUser: async ({ supabase }, use) => {
    const deleteMethod = async (userId: string) => {
      await supabase.from('profiles').delete().eq('id', userId);
      await supabase.auth.admin.deleteUser(userId);
      testEntities.users.delete(userId);
    };
    await use(deleteMethod);
  },

  createTestCity: async ({ supabase }, use) => {
    const createMethod = async (cityData: Partial<SeedCity> = {}) => {
      const defaultCity: SeedCity = {
        slug: `test-city-${Date.now()}`,
        name: `Test City ${Date.now()}`,
        name_en: `Test City ${Date.now()}`,
        description: 'A test city for E2E testing',
        region: 'Test Region',
        population: 1000000,
        wifi_rating: 4,
        cafe_rating: 4,
        cost_rating: 3,
        safety_rating: 5,
        community_rating: 4,
        overall_rating: 4,
        tags: ['digital-nomad', 'test'],
        is_featured: false,
        ...cityData
      };

      const { data, error } = await supabase
        .from('cities')
        .insert(defaultCity)
        .select()
        .single();

      if (error || !data) {
        throw new Error(`Failed to create test city: ${error?.message || 'Unknown error'}`);
      }

      testEntities.cities.add(data.id);
      return data;
    };
    await use(createMethod);
  },

  deleteTestCity: async ({ supabase }, use) => {
    const deleteMethod = async (cityId: string) => {
      await supabase.from('cities').delete().eq('id', cityId);
      testEntities.cities.delete(cityId);
    };
    await use(deleteMethod);
  },

  createTestPost: async ({ supabase }, use) => {
    const createMethod = async (postData: SeedPost) => {
      const defaultPost: SeedPost = {
        ...postData,
        category: postData.category || 'general',
        is_pinned: postData.is_pinned ?? false,
      };

      const { data, error } = await supabase
        .from('posts')
        .insert(defaultPost)
        .select()
        .single();

      if (error || !data) {
        throw new Error(`Failed to create test post: ${error?.message || 'Unknown error'}`);
      }

      testEntities.posts.add(data.id);
      return data;
    };
    await use(createMethod);
  },

  deleteTestPost: async ({ supabase }, use) => {
    const deleteMethod = async (postId: string) => {
      await supabase.from('post_likes').delete().eq('post_id', postId);
      await supabase.from('comments').delete().eq('post_id', postId);
      await supabase.from('posts').delete().eq('id', postId);
      testEntities.posts.delete(postId);
    };
    await use(deleteMethod);
  },

  createTestMeetup: async ({ supabase }, use) => {
    const createMethod = async (meetupData: SeedMeetup) => {
      const defaultMeetup: SeedMeetup = {
        ...meetupData,
        status: meetupData.status || 'upcoming',
      };

      const { data, error } = await supabase
        .from('meetups')
        .insert(defaultMeetup)
        .select()
        .single();

      if (error || !data) {
        throw new Error(`Failed to create test meetup: ${error?.message || 'Unknown error'}`);
      }

      testEntities.meetups.add(data.id);
      return data;
    };
    await use(createMethod);
  },

  deleteTestMeetup: async ({ supabase }, use) => {
    const deleteMethod = async (meetupId: string) => {
      await supabase.from('meetup_participants').delete().eq('meetup_id', meetupId);
      await supabase.from('meetups').delete().eq('id', meetupId);
      testEntities.meetups.delete(meetupId);
    };
    await use(deleteMethod);
  },

  createTestComment: async ({ supabase }, use) => {
    const createMethod = async (commentData: SeedComment) => {
      const { data, error } = await supabase
        .from('comments')
        .insert(commentData)
        .select()
        .single();

      if (error || !data) {
        throw new Error(`Failed to create test comment: ${error?.message || 'Unknown error'}`);
      }

      testEntities.comments.add(data.id);
      return data;
    };
    await use(createMethod);
  },

  deleteTestComment: async ({ supabase }, use) => {
    const deleteMethod = async (commentId: string) => {
      await supabase.from('comments').delete().eq('id', commentId);
      testEntities.comments.delete(commentId);
    };
    await use(deleteMethod);
  },

  seedDatabase: async ({ supabase, createTestUser, createTestCity }, use) => {
    const seedMethod = async () => {
      // Create test users
      const user1 = await createTestUser({
        username: 'nomad1',
        full_name: 'Digital Nomad 1',
        bio: 'Full-time traveler',
        location: 'Remote'
      });

      const user2 = await createTestUser({
        username: 'nomad2',
        full_name: 'Digital Nomad 2',
        bio: 'Part-time traveler',
        location: 'Hybrid'
      });

      // Create test cities
      const city1 = await createTestCity({
        slug: 'seoul',
        name: 'Seoul',
        name_en: 'Seoul',
        description: 'Capital of South Korea',
        region: 'Asia',
        wifi_rating: 5,
        cafe_rating: 5,
        cost_rating: 3,
        safety_rating: 5,
        community_rating: 4,
        overall_rating: 4.5,
        tags: ['digital-nomad', 'tech', 'food'],
        is_featured: true
      });

      const city2 = await createTestCity({
        slug: 'bangkok',
        name: 'Bangkok',
        name_en: 'Bangkok',
        description: 'Capital of Thailand',
        region: 'Asia',
        wifi_rating: 4,
        cafe_rating: 4,
        cost_rating: 5,
        safety_rating: 4,
        community_rating: 5,
        overall_rating: 4.5,
        tags: ['digital-nomad', 'affordable', 'food'],
        is_featured: true
      });

      return { users: [user1, user2], cities: [city1, city2] };
    };
    await use(seedMethod);
  },

  truncateTables: async ({ supabase }, use) => {
    const truncateMethod = async () => {
      // Truncate in order of dependencies
      await supabase.from('comment_likes').delete().neq('id', '0');
      await supabase.from('post_likes').delete().neq('id', '0');
      await supabase.from('comments').delete().neq('id', '0');
      await supabase.from('posts').delete().neq('id', '0');
      await supabase.from('meetup_participants').delete().neq('id', '0');
      await supabase.from('meetups').delete().neq('id', '0');
      await supabase.from('cities').delete().neq('id', '0');
      await supabase.from('profiles').delete().neq('id', '0');
    };
    await use(truncateMethod);
  }
});

/**
 * Helper function to check if database is ready
 */
export async function isDatabaseReady(): Promise<boolean> {
  try {
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from('cities').select('id').limit(1);
    return !error;
  } catch (error) {
    return false;
  }
}

/**
 * Helper function to wait for database to be ready
 */
export async function waitForDatabase(timeout = 30000): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await isDatabaseReady()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error('Database not ready within timeout period');
}

export { test } from '@playwright/test';
export { expect } from '@playwright/test';
