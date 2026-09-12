import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDarkWeb, setIsDarkWeb] = useState(() => {
    try {
      return window.sessionStorage.getItem('hustlehard-node') === 'dark'
    } catch {
      return false
    }
  })

  const toggleTheme = () => setIsDarkWeb((prev) => !prev)

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
    <ThemeContext.Provider value={{ isDarkWeb, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
