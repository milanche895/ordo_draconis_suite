import { useQuery } from '@tanstack/react-query'
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, CircularProgress, Alert } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { getLanguageFromPath } from '../utils/language'
import { getMuseumItems } from '../api/museum'

function MuseumPage() {
  const location = useLocation()
  const { locale, lang, script } = getLanguageFromPath(location.pathname)

  const { data: exhibits = [], isLoading, error } = useQuery({
    queryKey: ['museum', lang, script],
    queryFn: () => getMuseumItems(lang, script),
  })

  const content = {
    sr: {
      title: 'Музеј',
      description: 'Наш музеј садржи богату колекцију средњовековних артефаката који приказују живот и културу тог доба.',
      noItems: 'Нема експоната.',
      loading: 'Учитавање...',
      category: 'Категорија',
      period: 'Период',
      century: 'Век',
      origin: 'Порекло',
    },
    'sr-latn': {
      title: 'Muzej',
      description: 'Naš muzej sadrži bogatu kolekciju srednjevekovnih artefakata koji prikazuju život i kulturu tog doba.',
      noItems: 'Nema eksponata.',
      loading: 'Učitavanje...',
      category: 'Kategorija',
      period: 'Period',
      century: 'Vek',
      origin: 'Poreklo',
    },
    en: {
      title: 'Museum',
      description: 'Our museum contains a rich collection of medieval artifacts showcasing the life and culture of that era.',
      noItems: 'No exhibits.',
      loading: 'Loading...',
      category: 'Category',
      period: 'Period',
      century : 'Century',
      origin: 'Origin',
    },
  }

  const t = content[locale] || content.sr

  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Typography variant="h2" align="center" sx={{ mb: 4 }}>
          {t.title}
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 8, maxWidth: '800px', mx: 'auto' }}>
          {t.description}
        </Typography>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error.message || 'Greška pri učitavanju eksponata.'}
          </Alert>
        )}

        {!isLoading && !error && exhibits.length === 0 && (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            {t.noItems}
          </Typography>
        )}

        {!isLoading && !error && exhibits.length > 0 && (
          <Grid container spacing={4}>
            {exhibits.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={item.coverImage || '/placeholder-museum1.jpg'}
                    alt={item.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {item.title || '—'}
                    </Typography>
                    {(item.category || item.period || item.origin) && (
                      <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 1 }}>
                        {item.category && <span>{t.category}: {item.category}</span>}
                        {item.period && <span> · {t.period}: {item.period} {t.century}</span>}
                        {item.origin && <span> · {t.origin}: {item.origin}</span>}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {item.description || ''}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default MuseumPage
