import { Box, Container, Typography, Grid, Link } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { getPathPrefix, getLanguageFromPath } from '../../utils/language'

function Footer() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { locale } = getLanguageFromPath(location.pathname)
  const prefix = getPathPrefix(locale)
  
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
              Средњовековни тематски парк
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Грачаница, Босна и Херцеговина
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('nav.contact')}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: info@ordodraconis.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Телефон: +387 XX XXX XXX
            </Typography>
            <Typography variant="body2">
              Радно време: 09:00 - 18:00
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Пратите нас
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                Facebook
              </Link>
              <Link href="#" color="inherit" sx={{ textDecoration: 'none' }}>
                Instagram
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} OrdoDraconis. Сва права задржана.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
