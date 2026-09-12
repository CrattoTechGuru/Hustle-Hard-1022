import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { Smartphone, Shirt, Utensils, Hammer, Briefcase, Home, Car, Sparkles } from 'lucide-react'

export const CATEGORIES = [
  { name: 'Electronics', icon: Smartphone },
  { name: 'Fashion', icon: Shirt },
  { name: 'Food', icon: Utensils },
  { name: 'Services', icon: Hammer },
  { name: 'Jobs', icon: Briefcase },
  { name: 'Property', icon: Home },
  { name: 'Vehicles', icon: Car },
  { name: 'Beauty', icon: Sparkles },
]

export default function Categories({ activeCategory, onSelect }) {
  const { isDarkWeb } = useTheme()

  return (
    <div id="categories" className="max-w-6xl mx-auto px-4 py-10 scroll-mt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-black tracking-tight ${isDarkWeb ? 'text-darkTerminal-neon' : 'text-gray-800'}`}>
          Browse Categories
        </h2>
        {activeCategory !== 'All' && (
          <button
            onClick={() => onSelect('All')}
            className={`text-xs font-semibold underline ${isDarkWeb ? 'text-darkTerminal-neon' : 'text-emerald-700'}`}
          >
            Clear filter
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => {
          const IconComponent = cat.icon
          const active = activeCategory === cat.name
          return (
            <button
              key={cat.name}
              onClick={() => onSelect(active ? 'All' : cat.name)}
              className={`p-6 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-200 transform hover:-translate-y-1 ${
                isDarkWeb
                  ? active
                    ? 'bg-darkTerminal-neon border-darkTerminal-neon text-black'
                    : 'bg-darkTerminal-surface border-emerald-900 text-darkTerminal-neon hover:border-darkTerminal-neon'
                  : active
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:shadow-md'
              }`}
            >
              <IconComponent className="w-8 h-8 stroke-[1.5]" />
              <span className="font-bold text-sm">{cat.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
