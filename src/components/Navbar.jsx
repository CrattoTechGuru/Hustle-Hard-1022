import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { Search, ShieldAlert, Eye, Flame } from 'lucide-react'

export default function Navbar({ searchTerm, onSearchChange, onLogoClick }) {
  const { isDarkWeb, toggleTheme } = useTheme()

  return (
    <nav
      className={`sticky top-0 z-50 px-4 py-3 border-b transition-colors duration-300 ${
        isDarkWeb
          ? 'bg-darkTerminal-surface border-darkTerminal-neon text-darkTerminal-neon'
          : 'bg-white border-gray-200 text-gray-800'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 shrink-0"
        >
          <span
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDarkWeb ? 'bg-darkTerminal-neon text-black' : 'bg-emerald-600 text-white'
            }`}
          >
            <Flame className="w-5 h-5" />
          </span>
          <span className="font-extrabold text-xl tracking-tight">Hustle Hard</span>
        </button>

        <div className="flex-1 max-w-md relative hidden md:block">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search phones, cars, services..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm outline-none transition-all ${
              isDarkWeb
                ? 'bg-black border-darkTerminal-neon text-darkTerminal-neon placeholder-emerald-800'
                : 'bg-gray-50 border-gray-300 focus:border-emerald-500'
            }`}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        <button
          onClick={toggleTheme}
          className={`flex items-center gap-1.5 text-xs font-mono uppercase px-3 py-1.5 rounded-full border transition-all duration-300 shrink-0 ${
            isDarkWeb
              ? 'border-darkTerminal-neon bg-black text-darkTerminal-neon'
              : 'border-gray-800 bg-gray-900 text-white'
          }`}
          title="Toggle Hidden Layer Node"
        >
          {isDarkWeb ? <Eye className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
          <span className="hidden sm:inline">{isDarkWeb ? 'Exit Dark Node' : 'Access Dark Node'}</span>
        </button>
      </div>

      {/* Mobile search bar, shown under the top row on small screens */}
      <div className="max-w-6xl mx-auto mt-2 relative md:hidden">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search phones, cars, services..."
          className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm outline-none transition-all ${
            isDarkWeb
              ? 'bg-black border-darkTerminal-neon text-darkTerminal-neon placeholder-emerald-800'
              : 'bg-gray-50 border-gray-300 focus:border-emerald-500'
          }`}
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      </div>
    </nav>
  )
}
