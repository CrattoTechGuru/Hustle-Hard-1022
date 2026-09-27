import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

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
      () => {}
    )
  }, [id])

  return { listing, loading, error, refetch: fetchListing }
}
