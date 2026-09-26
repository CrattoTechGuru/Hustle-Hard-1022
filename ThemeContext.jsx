import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

const ThemeContext = createContext()

const ADJECTIVES = ['GHOST', 'SHADOW', 'CIPHER', 'NOMAD', 'STATIC', 'EMBER', 'RELAY', 'ECHO']

function generateCodename() {
  const word = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const digits = Math.floor(1000 + Math.random() * 9000)
  return `${word}-${digits}`
}

export const ThemeProvider = ({ children }) => {
  const [isDarkWeb, setIsDarkWeb] = useState(() => {
    try {
      return window.sessionStorage.getItem('hustlehard-node') === 'dark'
    } catch {
      return false
    }
  })

  // Purely cosmetic session handle shown while in Dark Node -- it does NOT
  // make anyone anonymous. Contact still happens over a real WhatsApp number,
  // and every listing lives in the same public Supabase table either way.
  const [codename] = useState(generateCodename)

  // Drives the terminal "boot sequence" overlay for a couple seconds whenever
  // someone flips into Dark Node -- skipped on the very first toggle away so
  // it doesn't fire twice on mount.
  const [booting, setBooting] = useState(false)
  const firstRender = useRef(true)

  const toggleTheme = () => setIsDarkWeb((prev) => !prev)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (isDarkWeb) {
      setBooting(true)
      const t = setTimeout(() => setBooting(false), 1600)
      return () => clearTimeout(t)
    }
  }, [isDarkWeb])

  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkWeb) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      window.sessionStorage.setItem('hustlehard-node', isDarkWeb ? 'dark' : 'white')
    } catch {
      /* sessionStorage unavailable, ignore */
    }
  }, [isDarkWeb])

  return (
    <ThemeContext.Provider value={{ isDarkWeb, toggleTheme, codename, booting }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
