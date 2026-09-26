import React, { useState } from 'react'
import { X, HandCoins } from 'lucide-react'
import { buildOfferLink } from '../lib/whatsapp'

/**
 * "Make an offer" -- quick counter-offer flow that still resolves over
 * WhatsApp, same as the default contact button. No escrow, no payments
 * handled by the app: it just pre-fills a different message.
 */
export default function OfferModal({ listing, darkMode, onClose }) {
  const [amount, setAmount] = useState('')

  const handleSend = () => {
    if (!amount || Number(amount) <= 0) return
    const link = buildOfferLink(listing.seller_whatsapp, listing.title, amount)
    window.open(link, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div
        className={`w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl border p-5 ${
          darkMode ? 'bg-darkTerminal-surface border-darkTerminal-neon text-darkTerminal-text' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-lg flex items-center gap-2">
            <HandCoins className="w-5 h-5" /> Make an offer
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs opacity-70 mb-3">
          Listed at R{Number(listing.price).toLocaleString()}. Your offer opens WhatsApp with the seller.
        </p>

        <input
          type="number"
          min="0"
          autoFocus
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 1200"
          className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none mb-4 ${
            darkMode ? 'bg-black border-emerald-900 text-darkTerminal-neon focus:border-darkTerminal-neon' : 'bg-gray-50 border-gray-300 focus:border-emerald-500'
          }`}
        />

        <button
          onClick={handleSend}
          disabled={!amount}
          className={`w-full font-bold uppercase tracking-wide text-sm px-6 py-3 rounded-lg transition-all active:scale-95 disabled:opacity-50 ${
            darkMode ? 'bg-darkTerminal-neon text-black' : 'bg-emerald-600 text-white'
          }`}
        >
          Send offer on WhatsApp
        </button>
      </div>
    </div>
  )
}
