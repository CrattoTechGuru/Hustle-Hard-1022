import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { MapPin } from 'lucide-react'

export default function Hero({ onBrowseClick, onSellClick }) {
  const { isDarkWeb } = useTheme()

  return (
    <div className="relative h-[420px] md:h-[480px] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
      <img
        src="/assets/kwamhlanga-crossroads.jpg"
        alt="KwaMhlanga Crossroads Hub, R573/R568 interchange"
        className={`absolute inset-0 w-full h-full object-cover opacity-40 transition-all duration-500 ${
          isDarkWeb ? 'blur-[3px] grayscale brightness-50' : ''
        }`}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="relative z-10 text-center px-4 max-w-3xl">
        <div className="inline-flex items-center gap-1 text-xs bg-emerald-600/90 text-white font-semibold px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
          <MapPin className="w-3 h-3" /> KwaMhlanga, Mpumalanga
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-4">
          {isDarkWeb ? 'Buy. Sell. Barter. Off-grid.' : 'Buy. Sell. Work. Connect.'}
        </h1>

        <p className="text-gray-200 text-base md:text-xl font-normal leading-relaxed max-w-xl mx-auto mb-8">
          {isDarkWeb
            ? 'Direct cash deals between locals, no listing fees, no middlemen.'
            : 'Your local community marketplace. Find great deals on products, hire trusted local services, and grow your hustle — all in one place.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={onBrowseClick}
            className={`w-full sm:w-auto font-bold px-8 py-3.5 rounded-lg text-sm uppercase tracking-wider transition-all transform active:scale-95 ${
              isDarkWeb
                ? 'bg-darkTerminal-neon text-black hover:bg-emerald-400'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            Browse Marketplace
          </button>
          <button
            onClick={onSellClick}
            className="w-full sm:w-auto font-bold px-8 py-3.5 rounded-lg text-sm uppercase tracking-wider border border-white text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
          >
            Start Selling
          </button>
        </div>
      </div>
    </div>
  )
}
