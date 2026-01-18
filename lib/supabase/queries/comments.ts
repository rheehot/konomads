import { createClient } from '../server'
import type { Comments, CommentsInsert, CommentsUpdate, CommentWithProfile } from '@/types/database'

/**
 * Get comments for a post
 */
export async function getCommentsByPostId(postId: string): Promise<CommentWithProfile[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles (*)
    `)
    .eq('post_id', postId)
    .is('parent_id', null) // Only top-level comments
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data as CommentWithProfile[]) || []
}

/**
 * Get replies for a comment
 */
export async function getRepliesByCommentId(commentId: string): Promise<CommentWithProfile[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles (*)
    `)
    .eq('parent_id', commentId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data as CommentWithProfile[]) || []
}

/**
 * Get comment thread with replies
 */
export async function getCommentThread(postId: string): Promise<CommentWithProfile[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles (*)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data as CommentWithProfile[]) || []
}

/**
 * Create a new comment
 */
export async function createComment(comment: CommentsInsert): Promise<Comments> {
  const supabase = await createClient()

  // First create the comment
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single()

  if (error) throw error

  // Update post comments count
  if (!comment.parent_id) {
    await supabase.rpc('increment_post_comments', { post_id: comment.post_id })
  }

  return data
}

/**
 * Update a comment
 */
export async function updateComment(commentId: string, updates: CommentsUpdate): Promise<Comments> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .update(updates)
    .eq('id', commentId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) throw error
}

/**
 * Toggle comment like
 */
export async function toggleCommentLike(commentId: string, userId: string): Promise<boolean> {
  const supabase = await createClient()

  // Check if already liked
  const { data: existing } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    // Unlike
    await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId)
    return false
  } else {
    // Like
    await supabase
      .from('comment_likes')
      .insert({ comment_id: commentId, user_id: userId })
    return true
  }
}
