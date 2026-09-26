import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { MapPin } from 'lucide-react'

export const AREAS = [
  'All',
  'Crossroads',
  'KwaMhlanga Town',
  'Siyabuswa',
  'Vlaklaagte',
  'Kwaggafontein',
  'Libangeni',
]

export default function AreaFilter({ activeArea, onSelect }) {
  const { isDarkWeb } = useTheme()

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      <MapPin className={`w-4 h-4 shrink-0 ${isDarkWeb ? 'text-darkTerminal-neon' : 'text-gray-400'}`} />
      {AREAS.map((area) => {
        const active = activeArea === area || (area === 'All' && !activeArea)
        return (
          <button
            key={area}
            onClick={() => onSelect(area === 'All' ? null : area)}
            className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border whitespace-nowrap transition-all ${
              isDarkWeb
                ? active
                  ? 'bg-darkTerminal-neon border-darkTerminal-neon text-black'
                  : 'border-emerald-900 text-emerald-600'
                : active
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-gray-300 text-gray-500'
            }`}
          >
            {area}
          </button>
        )
      })}
    </div>
  )
}
