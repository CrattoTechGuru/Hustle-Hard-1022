import React, { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'

const GLYPHS = '01アイウエオカキクケコサシスセソ0123456789'

/**
 * Purely visual flourish for Dark Node mode: a dimmed canvas "code rain"
 * backdrop, a subtle CRT scanline overlay, and a terminal-style boot
 * sequence that plays for ~1.6s when you flip the toggle. None of this
 * changes what data exists or who can see it -- it's set dressing for the
 * "off-grid" theme, same as the README always said. Respects
 * prefers-reduced-motion by skipping the animation loop entirely.
 */
export default function DarkNodeFX() {
  const { isDarkWeb, codename, booting } = useTheme()
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!isDarkWeb) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width, height, columns, drops
    let frame

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      columns = Math.floor(width / 18)
      drops = Array.from({ length: columns }, () => Math.random() * -50)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#00ff4180'
      ctx.font = '14px monospace'

      drops.forEach((y, i) => {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        ctx.fillText(glyph, i * 18, y * 18)
        if (y * 18 > height && Math.random() > 0.975) {
          drops[i] = 0
        } else {
          drops[i] += 1
        }
      })

      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [isDarkWeb])

  if (!isDarkWeb) return null

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.12] mix-blend-screen"
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[1] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #00ff41 0px, transparent 1px, transparent 3px)',
        }}
      />

      <div
        className="fixed bottom-4 right-4 z-40 font-mono text-[10px] text-emerald-500/70 bg-black/60 border border-emerald-900 rounded px-2 py-1 pointer-events-none select-none"
        aria-hidden="true"
      >
        NODE::{codename}
      </div>

      {booting && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center font-mono text-emerald-400 text-sm px-6">
          <div className="max-w-md w-full">
            <TypeLine text="&gt; establishing off-grid session..." delay={0} />
            <TypeLine text={`&gt; handle assigned: ${codename}`} delay={500} />
            <TypeLine text="&gt; loading off-grid listings [OK]" delay={1000} />
          </div>
        </div>
      )}
    </>
  )
}

function TypeLine({ text, delay }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    const t = setTimeout(() => {
      el.style.transition = 'opacity 200ms ease'
      el.style.opacity = '1'
    }, delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <p ref={ref} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />
  )
}
