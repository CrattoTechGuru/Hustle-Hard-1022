import React from 'react'
import { useTheme } from '../context/ThemeContext'
import { MessageCircle, Tag } from 'lucide-react'
import { buildWhatsAppLink } from '../lib/whatsapp'

export default function ListingCard({ listing }) {
  const { isDarkWeb } = useTheme()

  const whatsappLink = buildWhatsAppLink(listing.seller_whatsapp, listing.title, listing.price)

  return (
    <div
      className={`rounded-xl border overflow-hidden flex flex-col transition-colors ${
        isDarkWeb ? 'bg-darkTerminal-surface border-emerald-900' : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      <div className={`aspect-video w-full ${isDarkWeb ? 'bg-black' : 'bg-gray-100'} overflow-hidden`}>
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className={`w-full h-full object-cover ${isDarkWeb ? 'grayscale' : ''}`}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-xs ${isDarkWeb ? 'text-emerald-800' : 'text-gray-400'}`}>
            No image
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-bold text-sm leading-snug ${isDarkWeb ? 'text-darkTerminal-text' : 'text-gray-900'}`}>
            {listing.title}
          </h3>
          <span
            className={`shrink-0 inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-full ${
              isDarkWeb ? 'bg-black border border-darkTerminal-neon text-darkTerminal-neon' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            <Tag className="w-3 h-3" />
            R{Number(listing.price).toLocaleString()}
          </span>
        </div>

        <p className={`text-xs line-clamp-2 ${isDarkWeb ? 'text-emerald-600' : 'text-gray-500'}`}>
          {listing.description}
        </p>

        <p className={`text-[11px] mt-auto ${isDarkWeb ? 'text-emerald-800' : 'text-gray-400'}`}>
          {listing.seller_name} · {listing.category}
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-2 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wide px-4 py-2.5 rounded-lg transition-all active:scale-95 ${
            isDarkWeb
              ? 'bg-darkTerminal-neon text-black hover:bg-emerald-400'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Contact Hustler
        </a>
      </div>
    </div>
  )
}
