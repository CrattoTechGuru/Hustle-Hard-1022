import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useListings({ isDarkWeb, category, area, searchTerm }) {
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
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    if (area && area !== 'All') {
      query = query.eq('area', area)
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
  }, [isDarkWeb, category, area, searchTerm])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  return { listings, loading, error, refetch: fetchListings }
}
