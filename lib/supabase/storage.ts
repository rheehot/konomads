import { createClient } from './server'

/**
 * Upload a file to a storage bucket
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ path: string; url: string } | null> {
  const supabase = await createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${path}/${Math.random()}.${fileExt}`
  const filePath = fileName

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) {
    console.error('Error uploading file:', error)
    return null
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return {
    path: data.path,
    url: publicUrl
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    console.error('Error deleting file:', error)
    return false
  }

  return true
}

/**
 * Get public URL for a file
 */
export async function getPublicUrl(bucket: string, path: string): Promise<string> {
  const supabase = await createClient()
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  const result = await uploadFile('avatars', userId, file)
  if (!result) return null

  // Update profile with new avatar URL
  const { updateProfile } = await import('./queries')
  await updateProfile(userId, { avatar_url: result.url })

  return result.url
}

/**
 * Upload post image
 */
export async function uploadPostImage(postId: string, file: File): Promise<string | null> {
  const result = await uploadFile('post-images', postId, file)
  return result?.url || null
}

/**
 * Upload city image
 */
export async function uploadCityImage(cityId: string, file: File): Promise<string | null> {
  const result = await uploadFile('city-images', cityId, file)
  return result?.url || null
}
