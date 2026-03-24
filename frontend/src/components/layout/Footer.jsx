import { Box, Container, Typography, Grid, Link } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { getPathPrefix, getLanguageFromPath } from '../../utils/language'
import { cyrlToLatn } from '../../utils/transliterate'

function Footer() {
  const { t } = useTranslation()
  const location = useLocation()
  const { locale } = getLanguageFromPath(location.pathname)
  const prefix = getPathPrefix(locale)
  const localizeText = (cyr, en) => {
    if (locale === 'en') return en
    if (locale === 'sr-latn') return cyrlToLatn(cyr)
    return cyr
  }
  
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#2C2C2C',
        color: '#fff',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, color: '#D4AF37' }}>
              OrdoDraconis
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {localizeText('Средњовековни тематски парк', 'Medieval themed park')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {localizeText('Грачаница', 'Gracanica')}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('nav.contact')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: ordodraconisgracanica@gmail.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {localizeText('Телефон: +383 49 440 976', 'Phone: +383 49 440 976')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {localizeText('Телефон: +381 66 800 5522', 'Phone: +381 66 800 5522')}
            </Typography>
            <Typography variant="body2">
              {localizeText('Радно време: 08:00 - 00:00', 'Working hours: 08:00 - 00:00')}
            </Typography>
            <Typography variant="body2">
              {localizeText('Радно време музеја: 10:00 - 18:00', 'Museum hours: 10:00 - 18:00')}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {localizeText('Пратите нас', 'Follow us')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="https://www.facebook.com/ordodraconisgracanica" color="inherit" sx={{ textDecoration: 'none' }}>
                Facebook
              </Link>
              <Link href="https://www.instagram.com/ordo_draconis_gr/?hl=en" color="inherit" sx={{ textDecoration: 'none' }}>
                Instagram
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} OrdoDraconis. {localizeText('Сва права задржана.', 'All rights reserved.')}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
