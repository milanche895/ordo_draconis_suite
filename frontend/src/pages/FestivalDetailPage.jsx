import { Box, Container, Typography, Button, Grid, CardMedia } from '@mui/material'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getFestivalByYear } from '../api/festivals'
import { getLanguageFromPath, getPathPrefix } from '../utils/language'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

const content = {
  sr: {
    notFound: 'Фестивал није пронађен.',
    loading: 'Учитавање...',
    gallery: 'Галерија',
  },
  'sr-latn': {
    notFound: 'Festival nije pronađen.',
    loading: 'Učitavanje...',
    gallery: 'Galerija',
  },
  en: {
    notFound: 'Festival not found.',
    loading: 'Loading...',
    gallery: 'Gallery',
  },
}

function FestivalDetailPage() {
  const { year } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { lang, script, locale } = getLanguageFromPath(location.pathname)
  const prefix = getPathPrefix(locale)
  const tContent = content[locale] || content.sr

  const { data: festival, isLoading } = useQuery({
    queryKey: ['festival', year, lang, script],
    queryFn: () => getFestivalByYear(parseInt(year, 10), lang, script),
    enabled: !!year && !isNaN(parseInt(year, 10)),
  })

  if (isLoading) {
    return (
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography>{tContent.loading}</Typography>
        </Container>
      </Box>
    )
  }

  if (!festival) {
    return (
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography>{tContent.notFound}</Typography>
          <Button onClick={() => navigate(`${prefix}/stit-festival`)} sx={{ mt: 2 }}>
            {t('common.back')}
          </Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Button
          onClick={() => navigate(`${prefix}/stit-festival`)}
          sx={{ mb: 4 }}
        >
          {t('common.back')}
        </Button>

        {festival.coverImage && (
          <CardMedia
            component="img"
            height="400"
            image={festival.coverImage}
            alt={festival.title}
            sx={{ mb: 4, borderRadius: 2 }}
          />
        )}

        <Typography variant="overline" color="secondary.main" fontWeight={600} sx={{ mb: 1, display: 'block' }}>
          {festival.year}
        </Typography>

        <Typography variant="h2" sx={{ mb: 3 }}>
          {festival.title}
        </Typography>

        {festival.description && (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            {festival.description}
          </Typography>
        )}

        {festival.content && (
          <Box sx={{ mb: 6 }}>
            <ReactMarkdown>{festival.content}</ReactMarkdown>
          </Box>
        )}

        {festival.galleryImages && festival.galleryImages.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {tContent.gallery}
            </Typography>
            <Grid container spacing={2}>
              {festival.galleryImages.map((image, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={image}
                    alt={`${festival.title} - ${idx + 1}`}
                    sx={{
                      borderRadius: 2,
                      objectFit: 'cover',
                      width: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.02)' },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default FestivalDetailPage
