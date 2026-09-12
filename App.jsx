import React, { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Footer from './components/Footer'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen font-sans antialiased">
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onLogoClick={() => setSearchTerm('')}
        />
        <main className="flex-grow">
          <Home searchTerm={searchTerm} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
