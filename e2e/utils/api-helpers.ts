import { request, APIRequestContext } from '@playwright/test';

/**
 * Supabase API Helpers for E2E Testing
 *
 * Provides helper methods for interacting with Supabase API directly
 * to set up test data, clean up after tests, and verify backend state.
 */

interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

interface AuthResponse {
  user: any;
  session: any;
  error: any;
}

// ===========================
// Configuration
// ===========================

const getConfig = (): SupabaseConfig => ({
  url: process.env.E2E_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.E2E_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.E2E_SUPABASE_SERVICE_ROLE_KEY || '',
});

// ===========================
// Auth Helpers
// ===========================

/**
 * Create a new user account via Supabase Auth API
 */
export async function signUpUser(email: string, password: string): Promise<AuthResponse> {
  const context = await request.newContext();
  const config = getConfig();

  try {
    const response = await context.post(`${config.url}/auth/v1/signup`, {
      headers: {
        'apikey': config.anonKey,
        'Content-Type': 'application/json',
      },
      data: {
        email,
        password,
        emailRedirectTo: `${process.env.BASE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });

    const data = await response.json();
    return {
      user: data.user,
      session: data.session,
      error: data.error,
    };
  } finally {
    await context.dispose();
  }
}

/**
 * Sign in a user via Supabase Auth API
 */
export async function signInUser(email: string, password: string): Promise<AuthResponse> {
  const context = await request.newContext();
  const config = getConfig();

  try {
    const response = await context.post(`${config.url}/auth/v1/token?grant_type=password`, {
      headers: {
        'apikey': config.anonKey,
        'Content-Type': 'application/json',
      },
      data: {
        email,
        password,
      },
    });

    const data = await response.json();
    return {
      user: data.user,
      session: data,
      error: data.error,
    };
  } finally {
    await context.dispose();
  }
}

/**
 * Sign out a user
 */
export async function signOutUser(accessToken: string): Promise<void> {
  const context = await request.newContext();
  const config = getConfig();

  try {
    await context.post(`${config.url}/auth/v1/logout`, {
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await context.dispose();
  }
}

/**
 * Delete a user account (requires service role key)
 */
export async function deleteUser(userId: string): Promise<void> {
  const context = await request.newContext();
  const config = getConfig();

  if (!config.serviceRoleKey) {
    throw new Error('E2E_SUPABASE_SERVICE_ROLE_KEY is required for deleting users');
  }

  try {
    await context.delete(`${config.url}/auth/v1/admin/users/${userId}`, {
      headers: {
        'apikey': config.serviceRoleKey,
        'Authorization': `Bearer ${config.serviceRoleKey}`,
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await context.dispose();
  }
}

// ===========================
// Database Helpers (REST API)
// ===========================

/**
 * Create a request context with Supabase authentication
 */
async function createAuthenticatedContext(accessToken?: string): Promise<APIRequestContext> {
  const context = await request.newContext();
  const config = getConfig();

  // Set default headers
  await context.storageState({
    origins: [{
      origin: config.url,
      localStorage: [{
        name: 'supabase.auth.token',
        value: JSON.stringify({ accessToken }),
      }],
    }],
  });

  return context;
}

/**
 * Generic function to query Supabase tables via REST API
 */
export async function queryTable<T>(
  tableName: string,
  accessToken?: string,
  options?: {
    select?: string;
    eq?: { column: string; value: any };
    order?: { column: string; ascending?: boolean };
    limit?: number;
  }
): Promise<T[]> {
  const context = await createAuthenticatedContext(accessToken);
  const config = getConfig();

  try {
    const url = new URL(`${config.url}/rest/v1/${tableName}`);

    if (options?.select) {
      url.searchParams.set('select', options.select);
    }

    if (options?.eq) {
      url.searchParams.set(`${options.eq.column}`, `eq.${options.eq.value}`);
    }

    if (options?.order) {
      url.searchParams.set('order', `${options.order.column}.${options.order.ascending ? 'asc' : 'desc'}`);
    }

    if (options?.limit) {
      url.searchParams.set('limit', options.limit.toString());
    }

    const response = await context.get(url.toString(), {
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${accessToken || config.anonKey}`,
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } finally {
    await context.dispose();
  }
}

/**
 * Insert a record into a Supabase table
 */
export async function insertRecord<T>(
  tableName: string,
  data: Partial<T>,
  accessToken?: string
): Promise<T> {
  const context = await createAuthenticatedContext(accessToken);
  const config = getConfig();

  try {
    const response = await context.post(`${config.url}/rest/v1/${tableName}`, {
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${accessToken || config.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      data,
    });

    const result = await response.json();
    return Array.isArray(result) ? result[0] : result;
  } finally {
    await context.dispose();
  }
}

/**
 * Update a record in a Supabase table
 */
export async function updateRecord<T>(
  tableName: string,
  id: string,
  data: Partial<T>,
  accessToken?: string
): Promise<T> {
  const context = await createAuthenticatedContext(accessToken);
  const config = getConfig();

  try {
    const response = await context.patch(`${config.url}/rest/v1/${tableName}?id=eq.${id}`, {
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${accessToken || config.anonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      data,
    });

    const result = await response.json();
    return Array.isArray(result) ? result[0] : result;
  } finally {
    await context.dispose();
  }
}

/**
 * Delete a record from a Supabase table
 */
export async function deleteRecord(
  tableName: string,
  id: string,
  accessToken?: string
): Promise<void> {
  const context = await createAuthenticatedContext(accessToken);
  const config = getConfig();

  try {
    await context.delete(`${config.url}/rest/v1/${tableName}?id=eq.${id}`, {
      headers: {
        'apikey': config.anonKey,
        'Authorization': `Bearer ${accessToken || config.anonKey}`,
        'Content-Type': 'application/json',
      },
    });
  } finally {
    await context.dispose();
  }
}

// ===========================
// Specific Table Helpers
// ===========================

/**
 * Profile helpers
 */
export const profileHelpers = {
  async getProfile(userId: string, accessToken?: string) {
    const profiles = await queryTable<any>('profiles', accessToken, {
      eq: { column: 'id', value: userId },
      limit: 1,
    });
    return profiles[0];
  },

  async updateProfile(userId: string, data: Partial<any>, accessToken?: string) {
    return updateRecord<any>('profiles', userId, data, accessToken);
  },

  async deleteProfile(userId: string, accessToken?: string) {
    return deleteRecord('profiles', userId, accessToken);
  },
};

/**
 * Post helpers
 */
export const postHelpers = {
  async getPosts(filters?: { userId?: string; cityId?: string }, accessToken?: string) {
    let eq;
    if (filters?.userId) {
      eq = { column: 'user_id', value: filters.userId };
    } else if (filters?.cityId) {
      eq = { column: 'city_id', value: filters.cityId };
    }

    return queryTable<any>('posts', accessToken, {
      eq,
      order: { column: 'created_at', ascending: false },
    });
  },

  async createPost(data: Partial<any>, accessToken?: string) {
    return insertRecord<any>('posts', data, accessToken);
  },

  async updatePost(postId: string, data: Partial<any>, accessToken?: string) {
    return updateRecord<any>('posts', postId, data, accessToken);
  },

  async deletePost(postId: string, accessToken?: string) {
    return deleteRecord('posts', postId, accessToken);
  },
};

/**
 * Comment helpers
 */
export const commentHelpers = {
  async getComments(postId: string, accessToken?: string) {
    return queryTable<any>('comments', accessToken, {
      eq: { column: 'post_id', value: postId },
      order: { column: 'created_at', ascending: true },
    });
  },

  async createComment(data: Partial<any>, accessToken?: string) {
    return insertRecord<any>('comments', data, accessToken);
  },

  async deleteComment(commentId: string, accessToken?: string) {
    return deleteRecord('comments', commentId, accessToken);
  },
};

/**
 * Meetup helpers
 */
export const meetupHelpers = {
  async getMeetups(filters?: { userId?: string; cityId?: string }, accessToken?: string) {
    let eq;
    if (filters?.userId) {
      eq = { column: 'user_id', value: filters.userId };
    } else if (filters?.cityId) {
      eq = { column: 'city_id', value: filters.cityId };
    }

    return queryTable<any>('meetups', accessToken, {
      eq,
      order: { column: 'created_at', ascending: false },
    });
  },

  async createMeetup(data: Partial<any>, accessToken?: string) {
    return insertRecord<any>('meetups', data, accessToken);
  },

  async updateMeetup(meetupId: string, data: Partial<any>, accessToken?: string) {
    return updateRecord<any>('meetups', meetupId, data, accessToken);
  },

  async deleteMeetup(meetupId: string, accessToken?: string) {
    return deleteRecord('meetups', meetupId, accessToken);
  },

  async joinMeetup(meetupId: string, userId: string, accessToken?: string) {
    return insertRecord<any>('meetup_participants', {
      meetup_id: meetupId,
      user_id: userId,
      status: 'confirmed',
    }, accessToken);
  },

  async leaveMeetup(meetupId: string, userId: string, accessToken?: string) {
    const context = await createAuthenticatedContext(accessToken);
    const config = getConfig();

    try {
      await context.delete(
        `${config.url}/rest/v1/meetup_participants?meetup_id=eq.${meetupId}&user_id=eq.${userId}`,
        {
          headers: {
            'apikey': config.anonKey,
            'Authorization': `Bearer ${accessToken || config.anonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } finally {
      await context.dispose();
    }
  },
};

/**
 * City helpers
 */
export const cityHelpers = {
  async getAllCities(accessToken?: string) {
    return queryTable<any>('cities', accessToken, {
      order: { column: 'name', ascending: true },
    });
  },

  async getCityBySlug(slug: string, accessToken?: string) {
    const cities = await queryTable<any>('cities', accessToken, {
      eq: { column: 'slug', value: slug },
      limit: 1,
    });
    return cities[0];
  },
};

// ===========================
// Cleanup Helpers
// ===========================

/**
 * Clean up test data created during a test run
 */
export async function cleanupTestData(options: {
  userIds?: string[];
  postIds?: string[];
  commentIds?: string[];
  meetupIds?: string[];
  accessToken?: string;
}): Promise<void> {
  const { userIds, postIds, commentIds, meetupIds, accessToken } = options;

  // Delete in correct order due to foreign key constraints
  if (commentIds?.length) {
    for (const id of commentIds) {
      await deleteRecord('comments', id, accessToken);
    }
  }

  if (meetupIds?.length) {
    for (const id of meetupIds) {
      // Delete participants first
      await cleanupMeetupParticipants(id, accessToken);
      await deleteRecord('meetups', id, accessToken);
    }
  }

  if (postIds?.length) {
    for (const id of postIds) {
      await deleteRecord('posts', id, accessToken);
    }
  }

  if (userIds?.length) {
    for (const id of userIds) {
      await deleteUser(id);
    }
  }
}

/**
 * Clean up meetup participants
 */
async function cleanupMeetupParticipants(meetupId: string, accessToken?: string): Promise<void> {
  const context = await createAuthenticatedContext(accessToken);
  const config = getConfig();

  try {
    await context.delete(
      `${config.url}/rest/v1/meetup_participants?meetup_id=eq.${meetupId}`,
      {
        headers: {
          'apikey': config.anonKey,
          'Authorization': `Bearer ${accessToken || config.anonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } finally {
    await context.dispose();
  }
}

/**
 * Clean up all data for a specific user
 */
export async function cleanupUserData(userId: string, accessToken?: string): Promise<void> {
  // Get all user's posts
  const posts = await postHelpers.getPosts({ userId }, accessToken);
  const postIds = posts.map(p => p.id);

  // Get all user's meetups
  const meetups = await meetupHelpers.getMeetups({ userId }, accessToken);
  const meetupIds = meetups.map(m => m.id);

  // Clean up
  await cleanupTestData({
    postIds,
    meetupIds,
    userIds: [userId],
    accessToken,
  });
}

// ===========================
// Verification Helpers
// ===========================

/**
 * Verify that a record exists in the database
 */
export async function verifyRecordExists(
  tableName: string,
  id: string,
  accessToken?: string
): Promise<boolean> {
  const records = await queryTable<any>(tableName, accessToken, {
    eq: { column: 'id', value: id },
    limit: 1,
  });
  return records.length > 0;
}

/**
 * Get record count for a table
 */
export async function getRecordCount(
  tableName: string,
  filters?: { column: string; value: any },
  accessToken?: string
): Promise<number> {
  const records = await queryTable<any>(
    tableName,
    accessToken,
    filters ? { eq: filters } : undefined
  );
  return records.length;
}
