import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  useScrollTrigger,
} from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { getLanguageFromPath, getPathPrefix } from '../../utils/language'

function ElevationScroll({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
    sx: {
      ...children.props.sx,
      transition: 'all 0.3s ease-in-out',
      backgroundColor: trigger ? 'rgba(43, 43, 43, 0.95)' : 'rgba(43, 43, 43, 0.9)',
    },
  })
}

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const { locale } = getLanguageFromPath(location.pathname)
  const prefix = getPathPrefix(locale)
  const isAdmin = Boolean(localStorage.getItem('accessToken'))
  
  const handleLanguageChange = (newLocale) => {
    const currentPath = location.pathname
    // Ukloni postojeći jezički prefix iz URL-a (npr. /sr/..., /sr-latn/...),
    // i ne dozvoli da se dodatno "lepi" -latn na postojeći segment.
    const segments = currentPath.split('/').filter(Boolean)
    const firstSegment = segments[0]

    const hasValidLocalePrefix =
      firstSegment === 'sr' ||
      firstSegment === 'en' ||
      (typeof firstSegment === 'string' && firstSegment.startsWith('sr-latn'))

    const restSegments = hasValidLocalePrefix ? segments.slice(1) : segments
    const newPath = getPathPrefix(newLocale) + (restSegments.length ? `/${restSegments.join('/')}` : '')
    i18n.changeLanguage(newLocale)
    navigate(newPath)
    setAnchorEl(null)
  }
  
  const festivalPath = `${prefix}/${locale === 'en' ? 'stit-festival' : 'stit-festival'}`
  
  const navItems = [
    { key: 'home', path: prefix },
    { key: 'festival', path: festivalPath },
    { key: 'museum', path: `${prefix}/${locale === 'en' ? 'museum' : 'muzej'}` },
    { key: 'workshops', path: `${prefix}/${locale === 'en' ? 'workshops' : 'radionice'}` },
    { key: 'gallery', path: `${prefix}/${locale === 'en' ? 'gallery' : 'galerija'}` },
    { key: 'news', path: `${prefix}/${locale === 'en' ? 'news' : 'vesti'}` },
    { key: 'shop', path: `${prefix}/${locale === 'en' ? 'shop' : 'prodavnica'}` },
    { key: 'contact', path: `${prefix}/${locale === 'en' ? 'contact' : 'kontakt'}` },
  ]
  
  return (
    <ElevationScroll>
      <AppBar position="sticky" sx={{ backgroundColor: 'rgba(43, 43, 43, 0.9)', backdropFilter: 'blur(10px)' }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              cursor: 'pointer',
              color: '#D4AF37',
            }}
            onClick={() => navigate(prefix)}
          >
            OrdoDraconis
          </Typography>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.key}
                color="inherit"
                onClick={() => navigate(item.path)}
                variant={item.highlight ? 'outlined' : 'text'}
                sx={{
                  color: item.highlight ? '#D4AF37' : (location.pathname === item.path ? '#D4AF37' : 'inherit'),
                  fontWeight: item.highlight ? 700 : (location.pathname === item.path ? 600 : 400),
                  borderColor: item.highlight ? '#D4AF37' : 'transparent',
                  '&:hover': item.highlight ? {
                    borderColor: '#D4AF37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  } : {},
                }}
              >
                {t(`nav.${item.key}`)}
              </Button>
            ))}
            
            {isAdmin ? (
              <Button
                color="inherit"
                onClick={() => navigate('/admin')}
                sx={{ minWidth: 'auto', px: 1, fontWeight: 600, color: '#D4AF37' }}
              >
                {t('nav.adminPanel')}
              </Button>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  {locale === 'sr' ? 'SR (Ћир)' : locale === 'sr-latn' ? 'SR (Lat)' : 'EN'}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => handleLanguageChange('sr')}>SR (Ћир)</MenuItem>
                  <MenuItem onClick={() => handleLanguageChange('sr-latn')}>SR (Lat)</MenuItem>
                  <MenuItem onClick={() => handleLanguageChange('en')}>EN</MenuItem>
                </Menu>
              </>
            )}
          </Box>
          
          <IconButton
            color="inherit"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
        
        {mobileMenuOpen && (
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', pb: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.key}
                color="inherit"
                variant={item.highlight ? 'outlined' : 'text'}
                onClick={() => {
                  navigate(item.path)
                  setMobileMenuOpen(false)
                }}
                sx={{
                  justifyContent: 'flex-start',
                  px: 3,
                  my: item.highlight ? 1 : 0,
                  borderColor: item.highlight ? '#D4AF37' : 'transparent',
                  color: item.highlight ? '#D4AF37' : 'inherit',
                  fontWeight: item.highlight ? 700 : 400,
                }}
              >
                {t(`nav.${item.key}`)}
              </Button>
            ))}
            <Box sx={{ px: 3, pt: 1 }}>
              {isAdmin ? (
                <Button
                  color="inherit"
                  fullWidth
                  sx={{ justifyContent: 'flex-start', fontWeight: 600, color: '#D4AF37' }}
                  onClick={() => {
                    navigate('/admin')
                    setMobileMenuOpen(false)
                  }}
                >
                  {t('nav.adminPanel')}
                </Button>
              ) : (
                <Button
                  color="inherit"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {locale === 'sr' ? 'SR (Ћир)' : locale === 'sr-latn' ? 'SR (Lat)' : 'EN'}
                </Button>
              )}
            </Box>
          </Box>
        )}
      </AppBar>
    </ElevationScroll>
  )
}

export default Navbar
