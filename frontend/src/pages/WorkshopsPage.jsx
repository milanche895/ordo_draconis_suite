import { useQuery } from '@tanstack/react-query'
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, CircularProgress, Alert } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { getLanguageFromPath } from '../utils/language'
import { getWorkshops, getWorkshopsPageIntro } from '../api/workshops'

function WorkshopsPage() {
  const location = useLocation()
  const { locale, lang, script } = getLanguageFromPath(location.pathname)

  const { data: workshops = [], isLoading, error } = useQuery({
    queryKey: ['workshops', lang, script],
    queryFn: () => getWorkshops(lang, script),
  })

  const { data: pageIntro } = useQuery({
    queryKey: ['workshops-page-intro', lang, script],
    queryFn: () => getWorkshopsPageIntro(lang, script),
  })

  const content = {
    sr: {
      title: 'Средњовековне радионице',
      description: 'Учите средњовековне занате кроз интерактивне радионице.',
      noWorkshops: 'Нема радионица.',
      loading: 'Учитавање...',
      duration: 'мин',
      free: 'Бесплатно',
    },
    'sr-latn': {
      title: 'Srednjevekovne radionice',
      description: 'Učite srednjevekovne zanate kroz interaktivne radionice.',
      noWorkshops: 'Nema radionica.',
      loading: 'Učitavanje...',
      duration: 'min',
      free: 'Besplatno',
    },
    en: {
      title: 'Medieval Workshops',
      description: 'Learn medieval crafts through interactive workshops.',
      noWorkshops: 'No workshops.',
      loading: 'Loading...',
      duration: 'min',
      free: 'Free',
    },
  }

  const t = content[locale] || content.sr

  const introText =
    pageIntro?.description != null && String(pageIntro.description).trim() !== ''
      ? pageIntro.description
      : t.description

  const formatPrice = (workshop) => {
    if (workshop.price == null || workshop.price === 0) return t.free
    return `${workshop.price} ${workshop.currency || 'EUR'}`
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Typography variant="h2" align="center" sx={{ mb: 4 }}>
          {t.title}
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 8, maxWidth: '800px', mx: 'auto' }}>
          {introText}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error.message}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : workshops.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ py: 8 }}>
            {t.noWorkshops}
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {workshops.map((workshop) => (
              <Grid item xs={12} sm={6} md={4} key={workshop.id}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={workshop.coverImage || '/placeholder-workshop1.jpg'}
                    alt={workshop.title || ''}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {workshop.title || '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {workshop.description || ''}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                      {workshop.duration != null && (
                        <Typography variant="caption" color="text.secondary">
                          {workshop.duration} {t.duration}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        {formatPrice(workshop)}
                      </Typography>
                    </Box>
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

export default WorkshopsPage
