import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'hustlehard-favorites'

function readStoredFavorites() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Saved-listings, kept entirely in localStorage -- no account/login needed.
 * Favorites are just an array of listing ids on this device.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(readStoredFavorites)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      /* storage unavailable, ignore */
    }
  }, [favorites])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }, [])

  return { favorites, isFavorite, toggleFavorite }
}
