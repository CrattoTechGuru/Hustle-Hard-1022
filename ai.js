import { supabase } from './supabase'

/**
 * Auto-drafts a clean title/description/category from a seller's rough notes,
 * via the `generate-listing` Supabase Edge Function (see
 * supabase/functions/generate-listing). The Anthropic API key lives only in
 * that function's server-side environment -- it is never shipped to the
 * browser, unlike a naive `fetch('https://api.anthropic.com/...')` call from
 * client code would do.
 *
 * @param {string} roughNotes - whatever the seller typed, however messy
 * @returns {Promise<{title: string, description: string, category: string}>}
 */
export async function draftListingWithAI(roughNotes) {
  const { data, error } = await supabase.functions.invoke('generate-listing', {
    body: { notes: roughNotes },
  })

  if (error) throw error
  return data
}
