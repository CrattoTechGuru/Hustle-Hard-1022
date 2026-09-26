import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { X, Loader2, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { normalizeToInternational } from '../lib/whatsapp'
import { draftListingWithAI } from '../lib/ai'
import { CATEGORIES } from './Categories'
import { AREAS } from './AreaFilter'
import ImageUploader from './ImageUploader'

const initialForm = {
  title: '',
  description: '',
  price: '',
  category: CATEGORIES[0].name,
  area: AREAS[1],
  seller_name: '',
  seller_whatsapp: '',
  image_url: '',
}

export default function SellModal({ isDarkWeb: isDarkOverride, onClose, onCreated }) {
  const { isDarkWeb } = useTheme()
  const darkMode = isDarkOverride ?? isDarkWeb

  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [roughNotes, setRoughNotes] = useState('')
  const [drafting, setDrafting] = useState(false)
  const [draftError, setDraftError] = useState(null)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleAIDraft = async () => {
    if (!roughNotes.trim()) return
    setDrafting(true)
    setDraftError(null)
    try {
      const draft = await draftListingWithAI(roughNotes)
      setForm((f) => ({
        ...f,
        title: draft.title || f.title,
        description: draft.description || f.description,
        category: draft.category || f.category,
      }))
    } catch (err) {
      setDraftError('AI drafting is unavailable right now -- fill in the fields below manually.')
    } finally {
      setDrafting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.title || !form.description || !form.price || !form.seller_name || !form.seller_whatsapp) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)

    const ownerToken = crypto.randomUUID()
    const { error: insertError } = await supabase.from('listings').insert([
      {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        area: form.area,
        seller_name: form.seller_name.trim(),
        seller_whatsapp: normalizeToInternational(form.seller_whatsapp),
        image_url: form.image_url.trim() || null,
        is_dark_market: darkMode,
        owner_token: ownerToken,
      },
    ])

    setSubmitting(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    try {
      const mine = JSON.parse(window.localStorage.getItem('hustlehard-my-listings') || '[]')
      window.localStorage.setItem('hustlehard-my-listings', JSON.stringify([...mine, ownerToken]))
    } catch {
      /* ignore */
    }

    setForm(initialForm)
    setRoughNotes('')
    onCreated?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div
        className={`w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl border max-h-[90vh] overflow-y-auto ${
          darkMode ? 'bg-darkTerminal-surface border-darkTerminal-neon text-darkTerminal-text' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <div className={`flex items-center justify-between px-5 py-4 border-b ${darkMode ? 'border-emerald-900' : 'border-gray-100'}`}>
          <h2 className="font-black text-lg">{darkMode ? 'Post to Dark Node' : 'Start Selling'}</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <Field label="Let AI draft it for you (optional)">
            <div className="flex gap-2">
              <input
                value={roughNotes}
                onChange={(e) => setRoughNotes(e.target.value)}
                className={inputClass(darkMode)}
                placeholder="e.g. selling my samsung a14 barely used asking 1500"
              />
              <button
                type="button"
                onClick={handleAIDraft}
                disabled={drafting || !roughNotes.trim()}
                className={`shrink-0 flex items-center gap-1.5 px-3 rounded-lg text-xs font-bold uppercase disabled:opacity-50 ${
                  darkMode ? 'bg-darkTerminal-neon text-black' : 'bg-emerald-600 text-white'
                }`}
              >
                {drafting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </button>
            </div>
            {draftError && <p className="text-[11px] text-red-500 mt-1">{draftError}</p>}
          </Field>

          <Field label="Item title *">
            <input
              value={form.title}
              onChange={update('title')}
              className={inputClass(darkMode)}
              placeholder="e.g. Samsung A14, 128GB"
            />
          </Field>

          <Field label="Description *">
            <textarea
              value={form.description}
              onChange={update('description')}
              className={inputClass(darkMode)}
              rows={3}
              placeholder="Condition, extras, why you're selling..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (R) *">
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={update('price')}
                className={inputClass(darkMode)}
                placeholder="1500"
              />
            </Field>

            <Field label="Category *">
              <select value={form.category} onChange={update('category')} className={inputClass(darkMode)}>
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Area *">
            <select value={form.area} onChange={update('area')} className={inputClass(darkMode)}>
              {AREAS.filter((a) => a !== 'All').map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>

          <Field label="Photo">
            <ImageUploader
              darkMode={darkMode}
              value={form.image_url}
              onUploaded={(url) => setForm((f) => ({ ...f, image_url: url }))}
            />
          </Field>

          <Field label="Your name *">
            <input
              value={form.seller_name}
              onChange={update('seller_name')}
              className={inputClass(darkMode)}
              placeholder="First name is fine"
            />
          </Field>

          <Field label="Your WhatsApp number *">
            <input
              value={form.seller_whatsapp}
              onChange={update('seller_whatsapp')}
              className={inputClass(darkMode)}
              placeholder="0720708648"
            />
          </Field>

          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className={`mt-2 flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm px-6 py-3 rounded-lg transition-all active:scale-95 disabled:opacity-60 ${
              darkMode ? 'bg-darkTerminal-neon text-black' : 'bg-emerald-600 text-white'
            }`}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? 'Posting...' : 'Post Listing'}
          </button>

          <p className="text-[10px] opacity-50 text-center">
            Listings auto-expire after 14 days to keep the marketplace fresh.
          </p>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</span>
      {children}
    </label>
  )
}

function inputClass(darkMode) {
  return `w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-all ${
    darkMode
      ? 'bg-black border-emerald-900 text-darkTerminal-neon focus:border-darkTerminal-neon'
      : 'bg-gray-50 border-gray-300 focus:border-emerald-500'
  }`
}
