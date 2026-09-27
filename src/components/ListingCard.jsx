import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { MessageCircle, HandCoins, Tag, Sparkles } from 'lucide-react'
import { buildWhatsAppLink } from '../lib/whatsapp'
import FavoriteButton from './FavoriteButton'
import OfferModal from './OfferModal'

export default function ListingCard({ listing }) {
  const { isDarkWeb } = useTheme()
  const [showOffer, setShowOffer] = useState(false)

  const whatsappLink = buildWhatsAppLink(listing.seller_whatsapp, listing.title, listing.price)

  return (
    <div
      className={`relative rounded-xl border overflow-hidden flex flex-col transition-colors ${
        isDarkWeb ? 'bg-darkTerminal-surface border-emerald-900' : 'bg-white border-gray-200 shadow-sm'
      } ${listing.is_featured ? (isDarkWeb ? 'ring-1 ring-darkTerminal-neon' : 'ring-1 ring-amber-400') : ''}`}
    >
      {listing.is_featured && (
        <span
          className={`absolute top-2 left-2 z-10 inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
            isDarkWeb ? 'bg-darkTerminal-neon text-black' : 'bg-amber-400 text-black'
          }`}
        >
          <Sparkles className="w-3 h-3" /> Featured
        </span>
      )}

      <FavoriteButton listingId={listing.id} darkMode={isDarkWeb} className="absolute top-2 right-2 z-10" />

      <Link to={`/listing/${listing.id}`} className="contents">
        <div className={`relative aspect-video w-full ${isDarkWeb ? 'bg-black' : 'bg-gray-100'} overflow-hidden`}>
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
          {listing.is_sold && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-black text-sm uppercase tracking-widest rotate-[-8deg] border-2 border-white px-3 py-0.5">
                Sold
              </span>
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
            {listing.seller_name} · {listing.area ? `${listing.area} · ` : ''}{listing.category}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4 flex gap-2">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`flex-1 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wide px-4 py-2.5 rounded-lg transition-all active:scale-95 ${
            isDarkWeb
              ? 'bg-darkTerminal-neon text-black hover:bg-emerald-400'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Contact
        </a>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowOffer(true)
          }}
          aria-label="Make an offer"
          className={`flex items-center justify-center px-3 rounded-lg border transition-all active:scale-95 ${
            isDarkWeb ? 'border-darkTerminal-neon text-darkTerminal-neon' : 'border-emerald-600 text-emerald-700'
          }`}
        >
          <HandCoins className="w-4 h-4" />
        </button>
      </div>

      {showOffer && <OfferModal listing={listing} darkMode={isDarkWeb} onClose={() => setShowOffer(false)} />}
    </div>
  )
}
