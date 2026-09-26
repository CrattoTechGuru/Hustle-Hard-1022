import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Fetches a single listing by id for the detail page, and increments its
 * view count once per mount via the increment_listing_views RPC
 * (see supabase/migrations/003_view_counts.sql).
 */
export function useListing(id) {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchListing = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      setError(fetchError.message)
      setListing(null)
    } else {
      setListing(data)
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchListing()
  }, [fetchListing])

  useEffect(() => {
    if (!id) return
    supabase.rpc('increment_listing_views', { listing_id: Number(id) }).then(
      () => {},
      () => {} // best-effort, don't block the page on this
    )
  }, [id])

  return { listing, loading, error, refetch: fetchListing }
}
