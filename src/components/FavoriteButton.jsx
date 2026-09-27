import React from 'react'
import { Heart } from 'lucide-react'
import { useFavoritesContext } from '../context/FavoritesContext'

export default function FavoriteButton({ listingId, darkMode, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavoritesContext()
  const active = isFavorite(listingId)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(listingId)
      }}
      aria-label={active ? 'Remove from saved' : 'Save listing'}
      aria-pressed={active}
      className={`inline-flex items-center justify-center rounded-full p-2 transition-all active:scale-90 ${
        darkMode ? 'bg-black/70 border border-emerald-900' : 'bg-white/90 shadow-sm'
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          active ? 'fill-red-500 text-red-500' : darkMode ? 'text-emerald-600' : 'text-gray-400'
        }`}
      />
    </button>
  )
}
