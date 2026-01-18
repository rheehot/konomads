import { FullConfig } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Global Setup for Konomads E2E Tests
 *
 * This file runs once before all tests and:
 * 1. Validates environment variables
 * 2. Initializes Supabase connection
 * 3. Sets up test database with seed data
 * 4. Creates test users and authentication tokens
 * 5. Logs setup completion
 */

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting Konomads E2E Test Global Setup...')

  // ===========================
  // 1. Validate Environment Variables
  // ===========================
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missingVars.join(', ')}\n` +
      'Please set these in your .env file or CI/CD configuration.'
    )
  }

  console.log('✅ Environment variables validated')

  // ===========================
  // 2. Initialize Supabase Client
  // ===========================
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  console.log('✅ Supabase client initialized')

  // ===========================
  // 3. Load Test Data
  // ===========================
  const dataDir = path.join(process.cwd(), 'e2e', 'data')

  const usersData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'users.json'), 'utf-8')
  )
  const citiesData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'cities.json'), 'utf-8')
  )
  const postsData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'posts.json'), 'utf-8')
  )
  const meetupsData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'meetups.json'), 'utf-8')
  )

  console.log('✅ Test data loaded')

  // ===========================
  // 4. Clean Up Existing Test Data
  // ===========================
  try {
    // Delete test posts
    const { error: postsDeleteError } = await supabase
      .from('posts')
      .delete()
      .or(`id.like.${'test-%'}`)

    if (postsDeleteError) {
      console.warn('⚠️  Warning: Could not delete test posts:', postsDeleteError.message)
    }

    // Delete test meetups
    const { error: meetupsDeleteError } = await supabase
      .from('meetups')
      .delete()
      .or(`id.like.${'test-%'}`)

    if (meetupsDeleteError) {
      console.warn('⚠️  Warning: Could not delete test meetups:', meetupsDeleteError.message)
    }

    // Delete test meetup participants
    const { error: participantsDeleteError } = await supabase
      .from('meetup_participants')
      .delete()
      .or(`meetup_id.like.${'test-%'}`)

    if (participantsDeleteError) {
      console.warn('⚠️  Warning: Could not delete test participants:', participantsDeleteError.message)
    }

    // Delete test comments
    const { error: commentsDeleteError } = await supabase
      .from('comments')
      .delete()
      .or(`post_id.like.${'test-%'}`)

    if (commentsDeleteError) {
      console.warn('⚠️  Warning: Could not delete test comments:', commentsDeleteError.message)
    }

    // Delete test cities
    const { error: citiesDeleteError } = await supabase
      .from('cities')
      .delete()
      .or(`id.like.${'test-%'}`)

    if (citiesDeleteError) {
      console.warn('⚠️  Warning: Could not delete test cities:', citiesDeleteError.message)
    }

    // Delete test profiles
    const { error: profilesDeleteError } = await supabase
      .from('profiles')
      .delete()
      .or(`id.like.${'test-%'}`)

    if (profilesDeleteError) {
      console.warn('⚠️  Warning: Could not delete test profiles:', profilesDeleteError.message)
    }

    console.log('✅ Existing test data cleaned up')
  } catch (error) {
    console.warn('⚠️  Warning: Error during cleanup:', error)
  }

  // ===========================
  // 5. Create Test Cities
  // ===========================
  try {
    const allCities = [...citiesData.featuredCities, ...citiesData.regularCities]

    for (const city of allCities) {
      const { error } = await supabase.from('cities').insert({
        id: city.id,
        slug: city.slug,
        name: city.name,
        name_en: city.name_en,
        description: city.description,
        image_url: city.image_url,
        region: city.region,
        population: city.population,
        wifi_rating: city.wifi_rating,
        cafe_rating: city.cafe_rating,
        cost_rating: city.cost_rating,
        safety_rating: city.safety_rating,
        community_rating: city.community_rating,
        overall_rating: city.overall_rating,
        tags: city.tags,
        is_featured: city.is_featured,
      })

      if (error) {
        console.error(`❌ Error creating city ${city.name}:`, error.message)
        throw error
      }
    }

    console.log(`✅ Created ${allCities.length} test cities`)
  } catch (error) {
    console.error('❌ Error creating test cities:', error)
    throw error
  }

  // ===========================
  // 6. Create Test Users (Profiles)
  // ===========================
  try {
    for (const user of usersData.validUsers) {
      const { error } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        bio: user.bio,
        location: user.location,
        website: user.website,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error(`❌ Error creating user ${user.username}:`, error.message)
        throw error
      }
    }

    console.log(`✅ Created ${usersData.validUsers.length} test user profiles`)
  } catch (error) {
    console.error('❌ Error creating test users:', error)
    throw error
  }

  // ===========================
  // 7. Create Test Posts
  // ===========================
  try {
    for (const post of postsData.samplePosts) {
      const { error } = await supabase.from('posts').insert({
        id: post.id,
        user_id: post.user_id,
        city_id: post.city_id,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags,
        views: post.views,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        is_pinned: post.is_pinned,
        created_at: post.created_at,
        updated_at: post.updated_at,
      })

      if (error) {
        console.error(`❌ Error creating post ${post.id}:`, error.message)
        throw error
      }
    }

    console.log(`✅ Created ${postsData.samplePosts.length} test posts`)
  } catch (error) {
    console.error('❌ Error creating test posts:', error)
    throw error
  }

  // ===========================
  // 8. Create Test Meetups
  // ===========================
  try {
    for (const meetup of meetupsData.sampleMeetups) {
      const { error } = await supabase.from('meetups').insert({
        id: meetup.id,
        user_id: meetup.user_id,
        city_id: meetup.city_id,
        title: meetup.title,
        description: meetup.description,
        location: meetup.location,
        meetup_date: meetup.meetup_date,
        max_participants: meetup.max_participants,
        current_participants: meetup.current_participants,
        status: meetup.status,
        image_url: meetup.image_url,
        tags: meetup.tags,
        created_at: meetup.created_at,
        updated_at: meetup.updated_at,
      })

      if (error) {
        console.error(`❌ Error creating meetup ${meetup.id}:`, error.message)
        throw error
      }
    }

    console.log(`✅ Created ${meetupsData.sampleMeetups.length} test meetups`)
  } catch (error) {
    console.error('❌ Error creating test meetups:', error)
    throw error
  }

  // ===========================
  // 9. Create Test Comments
  // ===========================
  try {
    const testComments = [
      {
        id: 'test-comment-1',
        user_id: 'test-user-2',
        post_id: 'test-post-1',
        parent_id: null,
        content: 'Great list! I would also add Coex in Gangnam. They have excellent facilities and the Starbucks there is huge with plenty of seating.',
        likes_count: 12,
        created_at: '2024-01-15T11:30:00.000Z',
        updated_at: '2024-01-15T11:30:00.000Z',
      },
      {
        id: 'test-comment-2',
        user_id: 'test-user-3',
        post_id: 'test-post-1',
        parent_id: null,
        content: 'Maro29 is definitely my favorite too! The coffee quality is exceptional and the atmosphere is perfect for focused work.',
        likes_count: 8,
        created_at: '2024-01-15T12:00:00.000Z',
        updated_at: '2024-01-15T12:00:00.000Z',
      },
      {
        id: 'test-comment-3',
        user_id: 'test-user-1',
        post_id: 'test-post-2',
        parent_id: null,
        content: 'Hey! I\'d be interested in language exchange. I\'ve been learning Thai for a few months and would love to practice. Let me know if you want to meet up!',
        likes_count: 5,
        created_at: '2024-01-14T15:00:00.000Z',
        updated_at: '2024-01-14T15:00:00.000Z',
      },
      {
        id: 'test-comment-4',
        user_id: 'test-user-3',
        post_id: 'test-post-3',
        parent_id: null,
        content: 'I lived in Lisbon for 6 months last year! My top recommendations:\n\n1. **Príncipe Real** - Great for nomads, trendy, excellent cafes\n2. **Arroios** - More authentic, affordable, multicultural\n3. **Alcântara** - Up and coming, LX Factory area\n\nAll have good internet and nomad communities. Príncipe Real is probably the most convenient if you\'re new.',
        likes_count: 24,
        created_at: '2024-01-13T10:30:00.000Z',
        updated_at: '2024-01-13T10:30:00.000Z',
      },
    ]

    for (const comment of testComments) {
      const { error } = await supabase.from('comments').insert(comment)

      if (error) {
        console.error(`❌ Error creating comment ${comment.id}:`, error.message)
        throw error
      }
    }

    console.log(`✅ Created ${testComments.length} test comments`)
  } catch (error) {
    console.error('❌ Error creating test comments:', error)
    throw error
  }

  // ===========================
  // 10. Save Test Credentials for Tests
  // ===========================
  const testDataPath = path.join(process.cwd(), 'e2e', '.test-data.json')
  const testData = {
    users: usersData.testCredentials,
    cities: citiesData.testCities,
    createdAt: new Date().toISOString(),
  }

  fs.writeFileSync(testDataPath, JSON.stringify(testData, null, 2))
  console.log(`✅ Test credentials saved to ${testDataPath}`)

  // ===========================
  // 11. Setup Complete
  // ===========================
  console.log('')
  console.log('✅ Global Setup Complete!')
  console.log('')
  console.log('📊 Summary:')
  console.log(`   - ${usersData.validUsers.length} test users created`)
  console.log(`   - ${citiesData.featuredCities.length + citiesData.regularCities.length} test cities created`)
  console.log(`   - ${postsData.samplePosts.length} test posts created`)
  console.log(`   - ${meetupsData.sampleMeetups.length} test meetups created`)
  console.log('')
  console.log('🧪 Ready to run E2E tests!')
  console.log('')
}

export default globalSetup
