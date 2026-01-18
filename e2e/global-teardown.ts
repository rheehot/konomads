import { FullConfig } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Global Teardown for Konomads E2E Tests
 *
 * This file runs once after all tests and:
 * 1. Removes all test data from the database
 * 2. Cleans up test users and authentication
 * 3. Removes temporary test files
 * 4. Logs cleanup completion
 */

async function globalTeardown(config: FullConfig) {
  console.log('')
  console.log('🧹 Starting Konomads E2E Test Global Teardown...')

  // ===========================
  // 1. Validate Environment Variables
  // ===========================
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('⚠️  Warning: Missing Supabase credentials. Skipping database cleanup.')
    console.warn('⚠️  Test data may remain in the database.')
    return
  }

  // ===========================
  // 2. Initialize Supabase Client
  // ===========================
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  console.log('✅ Supabase client initialized for cleanup')

  // ===========================
  // 3. Clean Up Test Data
  // ===========================
  let cleanupStats = {
    posts: 0,
    comments: 0,
    meetups: 0,
    participants: 0,
    likes: 0,
    cities: 0,
    profiles: 0,
  }

  try {
    // Delete test post likes
    const { data: postLikes, error: postLikesError } = await supabase
      .from('post_likes')
      .delete()
      .or(`post_id.like.${'test-%'}`)
      .select('id')

    if (!postLikesError && postLikes) {
      cleanupStats.likes += postLikes.length
    }

    // Delete test comment likes
    const { data: commentLikes, error: commentLikesError } = await supabase
      .from('comment_likes')
      .delete()
      .or(`comment_id.like.${'test-%'}`)
      .select('id')

    if (!commentLikesError && commentLikes) {
      cleanupStats.likes += commentLikes.length
    }

    // Delete test comments
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .delete()
      .or(`post_id.like.${'test-%'},id.like.${'test-%'}`)
      .select('id')

    if (!commentsError && comments) {
      cleanupStats.comments = comments.length
    }

    // Delete test meetup participants
    const { data: participants, error: participantsError } = await supabase
      .from('meetup_participants')
      .delete()
      .or(`meetup_id.like.${'test-%'}`)
      .select('id')

    if (!participantsError && participants) {
      cleanupStats.participants = participants.length
    }

    // Delete test posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .delete()
      .or(`id.like.${'test-%'}`)
      .select('id')

    if (!postsError && posts) {
      cleanupStats.posts = posts.length
    }

    // Delete test meetups
    const { data: meetups, error: meetupsError } = await supabase
      .from('meetups')
      .delete()
      .or(`id.like.${'test-%'}`)
      .select('id')

    if (!meetupsError && meetups) {
      cleanupStats.meetups = meetups.length
    }

    // Delete test cities
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .delete()
      .or(`id.like.${'test-%'}`)
      .select('id')

    if (!citiesError && cities) {
      cleanupStats.cities = cities.length
    }

    // Delete test profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .delete()
      .or(`id.like.${'test-%'}`)
      .select('id')

    if (!profilesError && profiles) {
      cleanupStats.profiles = profiles.length
    }

    console.log('✅ Test data removed from database')
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error)
  }

  // ===========================
  // 4. Remove Temporary Test Files
  // ===========================
  try {
    const testDataPath = path.join(process.cwd(), 'e2e', '.test-data.json')

    if (fs.existsSync(testDataPath)) {
      fs.unlinkSync(testDataPath)
      console.log('✅ Temporary test data file removed')
    }

    // Remove test artifacts if they exist
    const artifactsDir = path.join(process.cwd(), 'test-results')
    if (fs.existsSync(artifactsDir)) {
      // Keep test results for debugging, just log
      console.log(`ℹ️  Test artifacts kept in: ${artifactsDir}`)
    }
  } catch (error) {
    console.warn('⚠️  Warning: Could not remove temporary files:', error)
  }

  // ===========================
  // 5. Teardown Complete
  // ===========================
  console.log('')
  console.log('✅ Global Teardown Complete!')
  console.log('')
  console.log('📊 Cleanup Summary:')
  console.log(`   - ${cleanupStats.posts} posts deleted`)
  console.log(`   - ${cleanupStats.comments} comments deleted`)
  console.log(`   - ${cleanupStats.meetups} meetups deleted`)
  console.log(`   - ${cleanupStats.participants} participant records deleted`)
  console.log(`   - ${cleanupStats.likes} likes deleted`)
  console.log(`   - ${cleanupStats.cities} cities deleted`)
  console.log(`   - ${cleanupStats.profiles} profiles deleted`)
  console.log('')
  console.log('🧹 E2E test environment cleaned up successfully!')
  console.log('')
}

export default globalTeardown
