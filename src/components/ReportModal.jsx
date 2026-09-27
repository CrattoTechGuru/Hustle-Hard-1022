import React, { useState } from 'react'
import { X, Flag } from 'lucide-react'
import { supabase } from '../lib/supabase'

const REASONS = ['Scam / not genuine', 'Fake or misleading photos', 'Prohibited item', 'Spam / duplicate', 'Other']

export default function ReportModal({ listing, darkMode, onClose }) {
  const [reason, setReason] = useState(REASONS[0])
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    await supabase.from('reports').insert([
      { listing_id: listing.id, reason, details: details.trim() || null },
    ])
    setSubmitting(false)
    setDone(true)
    setTimeout(onClose, 1200)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div
        className={`w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl border p-5 ${
          darkMode ? 'bg-darkTerminal-surface border-darkTerminal-neon text-darkTerminal-text' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-lg flex items-center gap-2 text-red-500">
            <Flag className="w-5 h-5" /> Report listing
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <p className="text-sm">Thanks -- we'll take a look.</p>
        ) : (
          <>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none mb-3 ${
                darkMode ? 'bg-black border-emerald-900 text-darkTerminal-neon' : 'bg-gray-50 border-gray-300'
              }`}
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Anything else we should know (optional)"
              className={`w-full px-3 py-2.5 rounded-lg border text-sm outline-none mb-4 ${
                darkMode ? 'bg-black border-emerald-900 text-darkTerminal-neon' : 'bg-gray-50 border-gray-300'
              }`}
            />

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full font-bold uppercase tracking-wide text-sm px-6 py-3 rounded-lg bg-red-600 text-white transition-all active:scale-95 disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Submit report'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
