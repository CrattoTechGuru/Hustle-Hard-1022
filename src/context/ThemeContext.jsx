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

  const [codename] = useState(generateCodename)
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
      /* ignore */
    }
  }, [isDarkWeb])

  return (
    <ThemeContext.Provider value={{ isDarkWeb, toggleTheme, codename, booting }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
