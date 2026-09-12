import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Loads listings for the current layer (White Market vs Dark Node) and
 * optional category / search filters. Exposes refetch so components can
 * refresh after a new listing is created.
 */
export function useListings({ isDarkWeb, category, searchTerm }) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchListings = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('listings')
      .select('*')
      .eq('is_dark_market', isDarkWeb)
      .order('created_at', { ascending: false })

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    if (searchTerm && searchTerm.trim() !== '') {
      query = query.ilike('title', `%${searchTerm.trim()}%`)
    }

    const { data, error: fetchError } = await query

    if (fetchError) {
      setError(fetchError.message)
      setListings([])
    } else {
      setListings(data || [])
    }
    setLoading(false)
  }, [isDarkWeb, category, searchTerm])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  return { listings, loading, error, refetch: fetchListings }
}
