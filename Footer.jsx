import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { Phone, Mail } from 'lucide-react'

export default function Footer() {
  const { isDarkWeb } = useTheme()

  return (
    <footer
      className={`border-t px-4 py-10 text-center transition-colors duration-300 ${
        isDarkWeb ? 'bg-darkTerminal-surface border-darkTerminal-neon text-darkTerminal-text' : 'bg-white border-gray-200 text-gray-600'
      }`}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 font-mono text-sm">
          <a href="tel:0720708648" className="flex items-center gap-2 hover:underline">
            <Phone className="w-4 h-4" /> Call: 072 070 8648
          </a>
          <a href="mailto:hustlehard1022@gmail.com" className="flex items-center gap-2 hover:underline">
            <Mail className="w-4 h-4" /> hustlehard1022@gmail.com
          </a>
        </div>

        <div
          className={`mt-4 border-t pt-6 w-full flex flex-col sm:flex-row justify-between items-center text-xs gap-4 ${
            isDarkWeb ? 'border-emerald-950' : 'border-gray-100'
          }`}
        >
          <p>© {new Date().getFullYear()} Hustle Hard Marketplace. All Rights Reserved.</p>
          <p
            className={`font-mono font-bold tracking-widest uppercase px-3 py-1 rounded border ${
              isDarkWeb ? 'border-darkTerminal-neon text-darkTerminal-neon' : 'border-black text-black'
            }`}
          >
            Cratto Ctrl
          </p>
        </div>
      </div>
    </footer>
  )
}
