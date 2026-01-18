# E2E Test Data

This directory contains all test data fixtures and templates for Konomads E2E tests.

## Files

### `users.json`
Test user accounts including:
- **validUsers**: 4 test user accounts with complete profiles
  - `test-user-1`: Primary test user (testnomad1)
  - `test-user-2`: Secondary test user (testnomad2)
  - `test-user-3`: Tertiary test user (testnomad3)
  - `test-admin-1`: Admin test user (testadmin)
- **invalidUsers**: 6 invalid credential scenarios for testing authentication
- **testCredentials**: Quick reference to login credentials for primary, secondary, and admin users

### `cities.json`
Sample city data including:
- **featuredCities**: 4 featured cities (Seoul, Bangkok, Lisbon, Medellin)
- **regularCities**: 2 non-featured cities (Tokyo, Ubud)
- **testCities**: Quick reference to primary, secondary, and tertiary test cities

Each city includes:
- Basic info (name, slug, description)
- Ratings (wifi, cafe, cost, safety, community)
- Population, region, tags
- Featured status

### `posts.json`
Sample post data including:
- **categories**: Available post categories
- **samplePosts**: 7 pre-configured posts with various categories:
  - Tips and guides
  - Questions
  - Introductions
  - Marketplace items
  - Announcements (pinned)
- **postTemplates**: Templates for creating different types of posts

### `meetups.json`
Sample meetup data including:
- **statuses**: Available meetup statuses
- **sampleMeetups**: 7 pre-configured meetups:
  - Networking events
  - Coworking tours
  - Coffee meetups
  - Language exchanges
  - Hiking groups
  - Virtual town halls
- **meetupTemplates**: Templates for creating different types of meetups

## Usage

### Importing Test Data

```typescript
// Import specific data files
import { usersData } from '@/e2e/data'
import { citiesData } from '@/e2e/data'
import { postsData } from '@/e2e/data'
import { meetupsData } from '@/e2e/data'

// Or use the convenience exports
import {
  testUsers,
  primaryUser,
  featuredCities,
  seoulCity,
  samplePosts,
  upcomingMeetups
} from '@/e2e/data'
```

### Helper Functions

```typescript
import {
  getUserById,
  getCityBySlug,
  getPostsByCategory,
  getUpcomingMeetups
} from '@/e2e/data'

// Get specific entities
const user = getUserById('test-user-1')
const city = getCityBySlug('seoul')
const tips = getPostsByCategory('tips')
const upcoming = getUpcomingMeetups()
```

### In Tests

```typescript
import { test, expect } from '@playwright/test'
import { primaryUser, seoulCity } from '@/e2e/data'

test('user can view city details', async ({ page }) => {
  await page.goto(`/cities/${seoulCity.slug}`)
  await expect(page.locator('h1')).toContainText(seoulCity.name_en)
})

test('user can login', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=email]', primaryUser.email)
  await page.fill('[name=password]', primaryUser.password)
  await page.click('button[type=submit]')
  await expect(page).toHaveURL('/dashboard')
})
```

## Data Creation

All test data is created in `global-setup.ts` before tests run:

1. Cities are created first (as they have no dependencies)
2. User profiles are created (for posts and meetups)
3. Posts are created (with user and city references)
4. Meetups are created (with user and city references)
5. Comments are created (with user and post references)

## Data Cleanup

All test data is removed in `global-teardown.ts` after tests complete:

- Deletes all entities with IDs starting with `test-`
- Cleans up in dependency order (likes, comments, posts, meetups, cities, profiles)
- Removes temporary test files

## Adding New Test Data

### Add New Test Users

Edit `users.json` and add to the `validUsers` array:

```json
{
  "id": "test-user-5",
  "email": "newuser@konomads.com",
  "password": "Password123!",
  "username": "newuser",
  "full_name": "New User",
  "bio": "Test user bio",
  "location": "Test Location",
  "website": null
}
```

### Add New Test Cities

Edit `cities.json` and add to the appropriate array:

```json
{
  "id": "test-city-10",
  "slug": "new-city",
  "name": "New City",
  "name_en": "New City",
  "description": "Test city description",
  "image_url": "https://example.com/image.jpg",
  "region": "Test Region",
  "population": 1000000,
  "wifi_rating": 4,
  "cafe_rating": 4,
  "cost_rating": 3,
  "safety_rating": 4,
  "community_rating": 4,
  "overall_rating": 3.8,
  "tags": ["tag1", "tag2"],
  "is_featured": false
}
```

### Add New Test Posts

Edit `posts.json` and add to the `samplePosts` array:

```json
{
  "id": "test-post-10",
  "user_id": "test-user-1",
  "city_id": "test-city-1",
  "title": "New Test Post",
  "content": "Post content here...",
  "category": "general",
  "tags": ["tag1", "tag2"],
  "views": 0,
  "likes_count": 0,
  "comments_count": 0,
  "is_pinned": false,
  "created_at": "2024-01-17T10:00:00.000Z",
  "updated_at": "2024-01-17T10:00:00.000Z"
}
```

### Add New Test Meetups

Edit `meetups.json` and add to the `sampleMeetups` array:

```json
{
  "id": "test-meetup-10",
  "user_id": "test-user-1",
  "city_id": "test-city-1",
  "title": "New Test Meetup",
  "description": "Meetup description...",
  "location": "Test Location",
  "meetup_date": "2024-02-20T18:00:00.000Z",
  "max_participants": 20,
  "current_participants": 0,
  "status": "upcoming",
  "image_url": "https://example.com/image.jpg",
  "tags": ["tag1", "tag2"],
  "created_at": "2024-01-17T10:00:00.000Z",
  "updated_at": "2024-01-17T10:00:00.000Z"
}
```

## Conventions

### IDs
- All test entity IDs start with `test-`
- Format: `test-{entity}-{number}`
  - Users: `test-user-1`, `test-user-2`
  - Cities: `test-city-1`, `test-city-2`
  - Posts: `test-post-1`, `test-post-2`
  - Meetups: `test-meetup-1`, `test-meetup-2`
  - Comments: `test-comment-1`, `test-comment-2`

### Dates
- Use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`
- Set dates in the past for existing data
- Set dates in the future for upcoming meetups

### Images
- Use Unsplash placeholder URLs
- Format: `https://images.unsplash.com/photo-xxx?w=800`

### Content
- Use realistic, meaningful content
- Include markdown formatting in posts/meetups
- Make content testable (searchable, filterable)
