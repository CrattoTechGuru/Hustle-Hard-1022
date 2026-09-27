import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../components/Home'
import ListingDetail from '../components/ListingDetail'

export default function AppRoutes({ searchTerm }) {
  return (
    <Routes>
      <Route path="/" element={<Home searchTerm={searchTerm} />} />
      <Route path="/listing/:id" element={<ListingDetail />} />
    </Routes>
  )
}
