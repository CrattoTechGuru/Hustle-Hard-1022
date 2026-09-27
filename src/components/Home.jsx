import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import Hero from './Hero'
import Categories from './Categories'
import AreaFilter from './AreaFilter'
import ListingsGrid from './ListingsGrid'
import SellModal from './SellModal'
import DarkNodeFX from './DarkNodeFX'
import { useListings } from '../hooks/useListings'
import { usePresence } from '../hooks/usePresence'
import { Radio } from 'lucide-react'

export default function Home({ searchTerm }) {
  const { isDarkWeb } = useTheme()
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeArea, setActiveArea] = useState(null)
  const [showSellModal, setShowSellModal] = useState(false)

  const { listings, loading, error, refetch } = useListings({
    isDarkWeb,
    category: activeCategory,
    area: activeArea,
    searchTerm,
  })

  const onlineCount = usePresence(isDarkWeb ? 'presence-dark-node' : 'presence-white-market')

  const scrollToCategories = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`relative min-h-screen transition-colors duration-300 ${isDarkWeb ? 'bg-darkTerminal-bg text-darkTerminal-text' : 'bg-gray-50 text-gray-900'}`}>
      <DarkNodeFX />

      <div className="relative z-10">
        <Hero onBrowseClick={scrollToCategories} onSellClick={() => setShowSellModal(true)} />

        <Categories activeCategory={activeCategory} onSelect={setActiveCategory} />

        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="mb-4">
            <AreaFilter activeArea={activeArea} onSelect={setActiveArea} />
          </div>

          <div className="flex items-center justify-between mb-6 gap-3">
            <h2 className={`text-xl font-black tracking-tight ${isDarkWeb ? 'text-darkTerminal-neon' : 'text-gray-800'}`}>
              {isDarkWeb ? 'Off-grid Listings' : activeCategory === 'All' ? 'Latest Listings' : activeCategory}
            </h2>

            <div className="flex items-center gap-3">
              {isDarkWeb && (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono uppercase text-emerald-500">
                  <Radio className="w-3 h-3 animate-pulse" /> {onlineCount} on node
                </span>
              )}
              <button
                onClick={() => setShowSellModal(true)}
                className={`text-xs font-bold uppercase px-4 py-2 rounded-lg ${
                  isDarkWeb ? 'bg-darkTerminal-neon text-black' : 'bg-emerald-600 text-white'
                }`}
              >
                + New Listing
              </button>
            </div>
          </div>

          <ListingsGrid listings={listings} loading={loading} error={error} />
        </div>

        {showSellModal && <SellModal onClose={() => setShowSellModal(false)} onCreated={refetch} />}
      </div>
    </div>
  )
}
