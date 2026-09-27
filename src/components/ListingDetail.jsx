import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useListing } from '../hooks/useListing'
import { buildWhatsAppLink } from '../lib/whatsapp'
import FavoriteButton from './FavoriteButton'
import OfferModal from './OfferModal'
import ReportModal from './ReportModal'
import {
  ArrowLeft, MessageCircle, HandCoins, Flag, Share2, Eye, Clock, Tag, MapPin,
} from 'lucide-react'

function daysLeft(expiresAt) {
  if (!expiresAt) return null
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function ListingDetail() {
  const { id } = useParams()
  const { isDarkWeb } = useTheme()
  const { listing, loading, error } = useListing(id)
  const [showOffer, setShowOffer] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const bg = isDarkWeb ? 'bg-darkTerminal-bg text-darkTerminal-text' : 'bg-gray-50 text-gray-900'

  if (loading) {
    return <div className={`min-h-screen ${bg} flex items-center justify-center text-sm opacity-60`}>Loading...</div>
  }

  if (error || !listing) {
    return (
      <div className={`min-h-screen ${bg} flex flex-col items-center justify-center gap-3 px-4 text-center`}>
        <p className="font-semibold">Couldn't find that listing.</p>
        <Link to="/" className="text-emerald-600 underline text-sm">Back to marketplace</Link>
      </div>
    )
  }

  const remaining = daysLeft(listing.expires_at)
  const whatsappLink = buildWhatsAppLink(listing.seller_whatsapp, listing.title, listing.price)

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: listing.title, url })
        return
      } catch {
        /* cancelled */
      }
    }
    await navigator.clipboard.writeText(url)
  }

  return (
    <div className={`min-h-screen ${bg}`}>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link
          to="/"
          className={`inline-flex items-center gap-1 text-sm font-semibold mb-4 ${isDarkWeb ? 'text-emerald-500' : 'text-gray-600'}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className={`rounded-2xl overflow-hidden border ${isDarkWeb ? 'border-emerald-900' : 'border-gray-200'}`}>
          <div className={`relative aspect-video w-full ${isDarkWeb ? 'bg-black' : 'bg-gray-100'}`}>
            {listing.image_url ? (
              <img
                src={listing.image_url}
                alt={listing.title}
                className={`w-full h-full object-cover ${isDarkWeb ? 'grayscale' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs opacity-50">No image</div>
            )}
            {listing.is_sold && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-black text-2xl uppercase tracking-widest rotate-[-8deg] border-4 border-white px-4 py-1">
                  Sold
                </span>
              </div>
            )}
            <FavoriteButton listingId={listing.id} darkMode={isDarkWeb} className="absolute top-3 right-3" />
          </div>

          <div className={`p-5 ${isDarkWeb ? 'bg-darkTerminal-surface' : 'bg-white'}`}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="font-black text-xl leading-snug">{listing.title}</h1>
              <span
                className={`shrink-0 inline-flex items-center gap-1 text-sm font-mono px-2.5 py-1 rounded-full ${
                  isDarkWeb ? 'bg-black border border-darkTerminal-neon text-darkTerminal-neon' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                <Tag className="w-3.5 h-3.5" /> R{Number(listing.price).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] opacity-60 mb-4">
              {listing.area && (
                <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" /> {listing.area}</span>
              )}
              <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" /> {listing.views || 0} views</span>
              {remaining !== null && (
                <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {remaining === 0 ? 'Expiring today' : `${remaining}d left`}</span>
              )}
            </div>

            <p className="text-sm leading-relaxed mb-4 opacity-90">{listing.description}</p>

            <p className="text-xs opacity-60 mb-5">
              Posted by {listing.seller_name} · {listing.category}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wide px-4 py-3 rounded-lg transition-all active:scale-95 ${
                  isDarkWeb ? 'bg-darkTerminal-neon text-black' : 'bg-emerald-600 text-white'
                }`}
              >
                <MessageCircle className="w-4 h-4" /> Contact Hustler
              </a>
              <button
                onClick={() => setShowOffer(true)}
                className={`flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wide px-4 py-3 rounded-lg border transition-all active:scale-95 ${
                  isDarkWeb ? 'border-darkTerminal-neon text-darkTerminal-neon' : 'border-emerald-600 text-emerald-700'
                }`}
              >
                <HandCoins className="w-4 h-4" /> Offer
              </button>
              <button
                onClick={handleShare}
                aria-label="Share listing"
                className={`flex items-center justify-center gap-2 font-bold text-sm px-4 py-3 rounded-lg border transition-all active:scale-95 ${
                  isDarkWeb ? 'border-emerald-900 text-emerald-600' : 'border-gray-200 text-gray-500'
                }`}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowReport(true)}
              className="mt-4 inline-flex items-center gap-1 text-[11px] opacity-50 hover:opacity-80"
            >
              <Flag className="w-3 h-3" /> Report this listing
            </button>
          </div>
        </div>
      </div>

      {showOffer && <OfferModal listing={listing} darkMode={isDarkWeb} onClose={() => setShowOffer(false)} />}
      {showReport && <ReportModal listing={listing} darkMode={isDarkWeb} onClose={() => setShowReport(false)} />}
    </div>
  )
}
