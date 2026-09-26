import React, { useState } from 'react'
import { Upload, Loader2, Check, X } from 'lucide-react'
import { uploadListingImage } from '../lib/storage'

/**
 * Drop-in replacement for the old "paste an image URL" field: lets a seller
 * pick a photo from their phone, uploads it to Supabase Storage, and reports
 * the public URL back via onUploaded. Requires migration
 * 005_storage_bucket.sql to have been run.
 */
export default function ImageUploader({ darkMode, value, onUploaded }) {
  const [status, setStatus] = useState('idle') // idle | uploading | done | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus('uploading')
    setErrorMsg('')
    try {
      const url = await uploadListingImage(file)
      onUploaded(url)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Upload failed.')
    }
  }

  const clear = () => {
    onUploaded('')
    setStatus('idle')
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative w-full h-36 rounded-lg overflow-hidden border border-current/20">
          <img src={value} alt="Listing preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"
            aria-label="Remove photo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center gap-2 w-full h-36 rounded-lg border-2 border-dashed cursor-pointer text-xs font-semibold transition-all ${
            darkMode
              ? 'border-emerald-900 text-emerald-600 hover:border-darkTerminal-neon'
              : 'border-gray-300 text-gray-400 hover:border-emerald-500'
          }`}
        >
          {status === 'uploading' ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-6 h-6" />
              Tap to add a photo
            </>
          )}
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        </label>
      )}

      {status === 'done' && (
        <p className="text-[11px] text-emerald-500 flex items-center gap-1">
          <Check className="w-3 h-3" /> Photo uploaded
        </p>
      )}
      {status === 'error' && <p className="text-[11px] text-red-500">{errorMsg}</p>}
    </div>
  )
}
