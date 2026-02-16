import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { getLanguageFromPath, getPathPrefix } from '../utils/language'
import { getFestivals } from '../api/festivals'

const content = {
  sr: {
    title: 'Штит фестивал',
    subtitle: 'Погледајте све фестивале које смо организовали током година.',
    noFestivals: 'Нема додатих фестивала.',
    loading: 'Учитавање...',
    year: 'година',
    readMore: 'Сазнај више',
  },
  'sr-latn': {
    title: 'Štit festival',
    subtitle: 'Pogledajte sve festivale koje smo organizovali tokom godina.',
    noFestivals: 'Nema dodatih festivala.',
    loading: 'Učitavanje...',
    year: 'godina',
    readMore: 'Saznaj više',
  },
  en: {
    title: 'Shield Festival',
    subtitle: 'Browse all festivals we have organized over the years.',
    noFestivals: 'No festivals added yet.',
    loading: 'Loading...',
    year: 'year',
    readMore: 'Learn More',
  },
}

function FestivalsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { locale, lang, script } = getLanguageFromPath(location.pathname)
  const prefix = getPathPrefix(locale)

  const { data: festivals = [], isLoading } = useQuery({
    queryKey: ['festivals', lang, script],
    queryFn: () => getFestivals(lang, script),
  })

  const t = content[locale] || content.sr

  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Typography variant="h2" align="center" sx={{ mb: 2 }}>
          {t.title}
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 8, maxWidth: '700px', mx: 'auto', color: 'text.secondary' }}>
          {t.subtitle}
        </Typography>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!isLoading && festivals.length === 0 && (
          <Typography align="center" color="text.secondary" sx={{ py: 8 }}>
            {t.noFestivals}
          </Typography>
        )}

        {!isLoading && festivals.length > 0 && (
          <Grid container spacing={4}>
            {festivals.map((festival) => (
              <Grid item xs={12} sm={6} md={4} key={festival.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      borderColor: 'secondary.main',
                    },
                    border: '2px solid',
                    borderColor: 'divider',
                  }}
                  onClick={() => navigate(`${prefix}/stit-festival/${festival.year}`)}
                >
                  <CardMedia
                    component="img"
                    height="220"
                    image={festival.coverImage || '/placeholder-workshop-4.jpg'}
                    alt={festival.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="overline" color="secondary.main" fontWeight={600}>
                      {festival.year}. {t.year}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {festival.title || `Štit festival ${festival.year}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {festival.description?.slice(0, 120)}
                      {festival.description?.length > 120 ? '...' : ''}
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

export default FestivalsPage
