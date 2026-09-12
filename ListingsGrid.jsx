import React from 'react'
import { useTheme } from '../context/ThemeContext'
import ListingCard from './ListingCard'
import { PackageSearch } from 'lucide-react'

export default function ListingsGrid({ listings, loading, error }) {
  const { isDarkWeb } = useTheme()

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`animate-pulse rounded-xl aspect-[3/4] ${isDarkWeb ? 'bg-darkTerminal-surface' : 'bg-gray-100'}`}
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-16 rounded-xl border ${isDarkWeb ? 'border-emerald-900 text-red-400' : 'border-gray-200 text-red-600'}`}>
        <p className="font-semibold text-sm">Couldn't load listings.</p>
        <p className="text-xs mt-1 opacity-70">{error}</p>
        <p className="text-xs mt-2 opacity-70">
          Check that your Supabase URL and anon key are set correctly in <code>.env</code>.
        </p>
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div
        className={`text-center py-16 rounded-xl border flex flex-col items-center gap-3 ${
          isDarkWeb ? 'border-emerald-900 text-emerald-600' : 'border-gray-200 text-gray-400'
        }`}
      >
        <PackageSearch className="w-10 h-10" />
        <p className="font-semibold text-sm">No listings yet in this category.</p>
        <p className="text-xs">Be the first to post a hustle here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
