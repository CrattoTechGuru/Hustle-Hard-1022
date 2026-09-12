import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import Hero from './Hero'
import Categories from './Categories'
import ListingsGrid from './ListingsGrid'
import SellModal from './SellModal'
import { useListings } from '../hooks/useListings'

export default function Home({ searchTerm }) {
  const { isDarkWeb } = useTheme()
  const [activeCategory, setActiveCategory] = useState('All')
  const [showSellModal, setShowSellModal] = useState(false)

  const { listings, loading, error, refetch } = useListings({
    isDarkWeb,
    category: activeCategory,
    searchTerm,
  })

  const scrollToCategories = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkWeb ? 'bg-darkTerminal-bg text-darkTerminal-text' : 'bg-gray-50 text-gray-900'}`}>
      <Hero onBrowseClick={scrollToCategories} onSellClick={() => setShowSellModal(true)} />

      <Categories activeCategory={activeCategory} onSelect={setActiveCategory} />

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-black tracking-tight ${isDarkWeb ? 'text-darkTerminal-neon' : 'text-gray-800'}`}>
            {isDarkWeb ? 'Off-grid Listings' : activeCategory === 'All' ? 'Latest Listings' : activeCategory}
          </h2>
          <button
            onClick={() => setShowSellModal(true)}
            className={`text-xs font-bold uppercase px-4 py-2 rounded-lg ${
              isDarkWeb ? 'bg-darkTerminal-neon text-black' : 'bg-emerald-600 text-white'
            }`}
          >
            + New Listing
          </button>
        </div>

        <ListingsGrid listings={listings} loading={loading} error={error} />
      </div>

      {showSellModal && <SellModal onClose={() => setShowSellModal(false)} onCreated={refetch} />}
    </div>
  )
}
