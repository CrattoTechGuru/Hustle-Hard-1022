import { supabase } from './supabase'

const BUCKET = 'listing-images'

/**
 * Uploads an image file to the public `listing-images` Supabase Storage bucket
 * and returns its public URL. Run migration 005_storage_bucket.sql first.
 */
export async function uploadListingImage(file) {
  if (!file) return null

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
