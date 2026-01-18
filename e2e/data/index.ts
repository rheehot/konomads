/**
 * Test Data Index
 *
 * Centralized exports for all test data used in E2E tests.
 * This provides type-safe access to test fixtures and data.
 */

import * as fs from 'fs'
import * as path from 'path'

// ===========================
// Type Definitions
// ===========================

export interface TestUser {
  id: string
  email: string
  password: string
  username: string
  full_name: string
  bio: string
  location: string
  website: string | null
}

export interface InvalidUser {
  email: string
  password: string
  description: string
}

export interface TestCredentials {
  primary: { email: string; password: string }
  secondary: { email: string; password: string }
  admin: { email: string; password: string }
}

export interface UsersData {
  validUsers: TestUser[]
  invalidUsers: InvalidUser[]
  testCredentials: TestCredentials
}

export interface TestCity {
  id: string
  slug: string
  name: string
  name_en: string | null
  description: string | null
  image_url: string | null
  region: string | null
  population: number | null
  wifi_rating: number | null
  cafe_rating: number | null
  cost_rating: number | null
  safety_rating: number | null
  community_rating: number | null
  overall_rating: number | null
  tags: string[] | null
  is_featured: boolean
}

export interface CitiesData {
  featuredCities: TestCity[]
  regularCities: TestCity[]
  testCities: {
    primary: { id: string; slug: string; name: string }
    secondary: { id: string; slug: string; name: string }
    tertiary: { id: string; slug: string; name: string }
  }
}

export interface TestPost {
  id: string
  user_id: string
  city_id: string | null
  title: string
  content: string
  category: string
  tags: string[] | null
  views: number
  likes_count: number
  comments_count: number
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface PostsData {
  categories: string[]
  samplePosts: TestPost[]
  postTemplates: Record<string, any>
}

export interface TestMeetup {
  id: string
  user_id: string
  city_id: string | null
  title: string
  description: string
  location: string | null
  meetup_date: string
  max_participants: number | null
  current_participants: number
  status: string
  image_url: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

export interface MeetupsData {
  statuses: string[]
  sampleMeetups: TestMeetup[]
  meetupTemplates: Record<string, any>
}

// ===========================
// Data Loader Functions
// ===========================

const dataDir = path.join(__dirname)

export function loadUsersData(): UsersData {
  const filePath = path.join(dataDir, 'users.json')
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

export function loadCitiesData(): CitiesData {
  const filePath = path.join(dataDir, 'cities.json')
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

export function loadPostsData(): PostsData {
  const filePath = path.join(dataDir, 'posts.json')
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

export function loadMeetupsData(): MeetupsData {
  const filePath = path.join(dataDir, 'meetups.json')
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

// ===========================
// Convenience Exports
// ===========================

// Export loaded data for direct import
export const usersData = loadUsersData()
export const citiesData = loadCitiesData()
export const postsData = loadPostsData()
export const meetupsData = loadMeetupsData()

// Export commonly used test entities
export const testUsers = usersData.validUsers
export const primaryUser = testUsers[0]
export const secondaryUser = testUsers[1]
export const adminUser = testUsers.find(u => u.username === 'testadmin')!

export const featuredCities = citiesData.featuredCities
export const regularCities = citiesData.regularCities
export const seoulCity = featuredCities.find(c => c.slug === 'seoul')!
export const bangkokCity = featuredCities.find(c => c.slug === 'bangkok')!
export const lisbonCity = featuredCities.find(c => c.slug === 'lisbon')!

export const samplePosts = postsData.samplePosts
export const pinnedPosts = samplePosts.filter(p => p.is_pinned)
export const generalPosts = samplePosts.filter(p => p.category === 'general')
export const tipsPosts = samplePosts.filter(p => p.category === 'tips')

export const upcomingMeetups = meetupsData.sampleMeetups.filter(m => m.status === 'upcoming')
export const virtualMeetups = meetupsData.sampleMeetups.filter(m => m.location?.includes('Virtual'))

// ===========================
// Helper Functions
// ===========================

export function getUserById(id: string): TestUser | undefined {
  return testUsers.find(u => u.id === id)
}

export function getUserByUsername(username: string): TestUser | undefined {
  return testUsers.find(u => u.username === username)
}

export function getCityBySlug(slug: string): TestCity | undefined {
  return [...featuredCities, ...regularCities].find(c => c.slug === slug)
}

export function getPostById(id: string): TestPost | undefined {
  return samplePosts.find(p => p.id === id)
}

export function getPostsByCategory(category: string): TestPost[] {
  return samplePosts.filter(p => p.category === category)
}

export function getPostsByCity(cityId: string): TestPost[] {
  return samplePosts.filter(p => p.city_id === cityId)
}

export function getPostsByUser(userId: string): TestPost[] {
  return samplePosts.filter(p => p.user_id === userId)
}

export function getMeetupById(id: string): TestMeetup | undefined {
  return meetupsData.sampleMeetups.find(m => m.id === id)
}

export function getMeetupsByCity(cityId: string): TestMeetup[] {
  return meetupsData.sampleMeetups.filter(m => m.city_id === cityId)
}

export function getMeetupsByUser(userId: string): TestMeetup[] {
  return meetupsData.sampleMeetups.filter(m => m.user_id === userId)
}

export function getUpcomingMeetups(): TestMeetup[] {
  const now = new Date()
  return meetupsData.sampleMeetups
    .filter(m => m.status === 'upcoming')
    .filter(m => new Date(m.meetup_date) > now)
    .sort((a, b) => new Date(a.meetup_date).getTime() - new Date(b.meetup_date).getTime())
}
