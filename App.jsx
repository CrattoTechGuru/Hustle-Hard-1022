import React, { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { FavoritesProvider } from './context/FavoritesContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppRoutes from './routes/router'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <ThemeProvider>
      <FavoritesProvider>
        <div className="flex flex-col min-h-screen font-sans antialiased">
          <Navbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onLogoClick={() => setSearchTerm('')}
          />
          <main className="flex-grow">
            <AppRoutes searchTerm={searchTerm} />
          </main>
          <Footer />
        </div>
      </FavoritesProvider>
    </ThemeProvider>
  )
}
