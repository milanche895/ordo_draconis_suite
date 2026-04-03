import { Routes, Route, Navigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AppShell from './components/layout/AppShell'
import HomePage from './pages/HomePage'
import MuseumPage from './pages/MuseumPage'
import FestivalsPage from './pages/FestivalsPage'
import FestivalDetailPage from './pages/FestivalDetailPage'
import WorkshopsPage from './pages/WorkshopsPage'
import GalleryPage from './pages/GalleryPage'
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import ShopPage from './pages/ShopPage'
import ShopDetailPage from './pages/ShopDetailPage'
import ContactPage from './pages/ContactPage'
import KrcmaPage from './pages/KrcmaPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import { useEffect } from 'react'

function App() {
  const { i18n } = useTranslation()
  const location = useLocation()
  
  useEffect(() => {
    const path = location.pathname
    if (path.startsWith('/admin')) {
      return
    }
    if (path.startsWith('/sr-latn')) {
      i18n.changeLanguage('sr-Latn')
    } else if (path.startsWith('/en')) {
      i18n.changeLanguage('en')
    } else {
      i18n.changeLanguage('sr')
    }
  }, [i18n, location.pathname])
  
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/sr" replace />} />
        <Route path="/sr" element={<HomePage />} />
        <Route path="/sr-latn" element={<HomePage />} />
        <Route path="/en" element={<HomePage />} />
        
        <Route path="/sr/stit-festival" element={<FestivalsPage />} />
        <Route path="/sr/stit-festival/:year" element={<FestivalDetailPage />} />
        <Route path="/sr-latn/stit-festival" element={<FestivalsPage />} />
        <Route path="/sr-latn/stit-festival/:year" element={<FestivalDetailPage />} />
        <Route path="/en/stit-festival" element={<FestivalsPage />} />
        <Route path="/en/stit-festival/:year" element={<FestivalDetailPage />} />
        
        <Route path="/sr/muzej" element={<MuseumPage />} />
        <Route path="/sr-latn/muzej" element={<MuseumPage />} />
        <Route path="/en/museum" element={<MuseumPage />} />
        
        <Route path="/sr/radionice" element={<WorkshopsPage />} />
        <Route path="/sr-latn/radionice" element={<WorkshopsPage />} />
        <Route path="/en/workshops" element={<WorkshopsPage />} />
        
        <Route path="/sr/galerija" element={<GalleryPage />} />
        <Route path="/sr-latn/galerija" element={<GalleryPage />} />
        <Route path="/en/gallery" element={<GalleryPage />} />
        
        <Route path="/sr/vesti" element={<NewsPage />} />
        <Route path="/sr-latn/vesti" element={<NewsPage />} />
        <Route path="/en/news" element={<NewsPage />} />
        <Route path="/sr/vesti/:slug" element={<NewsDetailPage />} />
        <Route path="/sr-latn/vesti/:slug" element={<NewsDetailPage />} />
        <Route path="/en/news/:slug" element={<NewsDetailPage />} />
        
        <Route path="/sr/prodavnica" element={<ShopPage />} />
        <Route path="/sr-latn/prodavnica" element={<ShopPage />} />
        <Route path="/en/shop" element={<ShopPage />} />
        <Route path="/sr/prodavnica/:slug" element={<ShopDetailPage />} />
        <Route path="/sr-latn/prodavnica/:slug" element={<ShopDetailPage />} />
        <Route path="/en/shop/:slug" element={<ShopDetailPage />} />
        
        <Route path="/sr/kontakt" element={<ContactPage />} />
        <Route path="/sr-latn/kontakt" element={<ContactPage />} />
        <Route path="/en/contact" element={<ContactPage />} />

        <Route path="/sr/krcma" element={<KrcmaPage />} />
        <Route path="/sr-latn/krcma" element={<KrcmaPage />} />
        <Route path="/en/tavern" element={<KrcmaPage />} />
        
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={<AdminDashboardPage />} />
      </Routes>
    </AppShell>
  )
}

export default App
