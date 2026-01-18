import { createClient } from '../server'
import type { Cities, CitiesInsert, CitiesUpdate } from '@/types/database'

/**
 * Get all cities
 */
export async function getCities() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('overall_rating', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get featured cities
 */
export async function getFeaturedCities() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('is_featured', true)
    .order('overall_rating', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get city by slug
 */
export async function getCityBySlug(slug: string): Promise<Cities | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

/**
 * Get cities by region
 */
export async function getCitiesByRegion(region: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('region', region)
    .order('overall_rating', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Create a new city
 */
export async function createCity(city: CitiesInsert): Promise<Cities> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cities')
    .insert(city)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update a city
 */
export async function updateCity(id: string, updates: CitiesUpdate): Promise<Cities> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cities')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete a city
 */
export async function deleteCity(id: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('cities')
    .delete()
    .eq('id', id)

  if (error) throw error
}
