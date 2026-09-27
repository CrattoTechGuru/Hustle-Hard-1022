import { supabase } from './supabase'

export async function draftListingWithAI(roughNotes) {
  const { data, error } = await supabase.functions.invoke('generate-listing', {
    body: { notes: roughNotes },
  })

  if (error) throw error
  return data
}
