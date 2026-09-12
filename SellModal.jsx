import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { X, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { normalizeToInternational } from '../lib/whatsapp'
import { CATEGORIES } from './Categories'

const initialForm = {
  title: '',
  description: '',
  price: '',
  category: CATEGORIES[0].name,
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

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.title || !form.description || !form.price || !form.seller_name || !form.seller_whatsapp) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)

    const { error: insertError } = await supabase.from('listings').insert([
      {
        title: form.title.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        seller_name: form.seller_name.trim(),
        seller_whatsapp: normalizeToInternational(form.seller_whatsapp),
        image_url: form.image_url.trim() || null,
        is_dark_market: darkMode,
      },
    ])

    setSubmitting(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setForm(initialForm)
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

          <Field label="Image URL (optional)">
            <input
              value={form.image_url}
              onChange={update('image_url')}
              className={inputClass(darkMode)}
              placeholder="https://..."
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
