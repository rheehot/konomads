import { createClient } from '../server'
import type { Posts, PostsInsert, PostsUpdate, PostWithProfile } from '@/types/database'

/**
 * Get all posts with profiles
 */
export async function getPosts(options?: {
  cityId?: string
  category?: string
  limit?: number
  offset?: number
}): Promise<PostWithProfile[]> {
  const supabase = await createClient()
  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles (*),
      cities (*)
    `)

  if (options?.cityId) {
    query = query.eq('city_id', options.cityId)
  }

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  query = query
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(options?.limit || 20)
    .range(options?.offset || 0, (options?.offset || 0) + (options?.limit || 20) - 1)

  const { data, error } = await query

  if (error) throw error
  return (data as PostWithProfile[]) || []
}

/**
 * Get post by ID with profile
 */
export async function getPostById(postId: string): Promise<PostWithProfile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (*),
      cities (*)
    `)
    .eq('id', postId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  // Increment view count
  await incrementPostViews(postId)

  return data as PostWithProfile
}

/**
 * Get posts by user ID
 */
export async function getPostsByUserId(userId: string): Promise<PostWithProfile[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (*),
      cities (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as PostWithProfile[]) || []
}

/**
 * Create a new post
 */
export async function createPost(post: PostsInsert): Promise<Posts> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update a post
 */
export async function updatePost(postId: string, updates: PostsUpdate): Promise<Posts> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) throw error
}

/**
 * Increment post view count
 */
async function incrementPostViews(postId: string): Promise<void> {
  const supabase = await createClient()
  await supabase.rpc('increment_post_views', { post_id: postId })
}

/**
 * Toggle post like
 */
export async function togglePostLike(postId: string, userId: string): Promise<boolean> {
  const supabase = await createClient()

  // Check if already liked
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    // Unlike
    await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)
    return false
  } else {
    // Like
    await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: userId })
    return true
  }
}

/**
 * Check if user liked post
 */
export async function hasUserLikedPost(postId: string, userId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single()

  return !!data
}
