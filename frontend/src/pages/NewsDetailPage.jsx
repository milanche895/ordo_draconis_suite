import { Box, Container, Typography, Button, Grid, CardMedia } from '@mui/material'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getNewsBySlug } from '../api/news'
import { getLanguageFromPath, getPathPrefix } from '../utils/language'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

function NewsDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { lang, script, locale } = getLanguageFromPath(location.pathname)
  const prefix = getPathPrefix(locale)
  
  const { data: news, isLoading } = useQuery({
    queryKey: ['news', slug, lang, script],
    queryFn: () => getNewsBySlug(slug, lang, script),
  })
  
  if (isLoading) {
    return (
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography>Loading...</Typography>
        </Container>
      </Box>
    )
  }
  
  if (!news) {
    return (
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography>{locale === 'en' ? 'News not found' : 'Вест није пронађена'}</Typography>
        </Container>
      </Box>
    )
  }
  
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Button onClick={() => navigate(`${prefix}/${locale === 'en' ? 'news' : 'vesti'}`)} sx={{ mb: 4 }}>
          {t('common.back')}
        </Button>
        
        {news.coverImage && (
          <CardMedia
            component="img"
            height="400"
            image={news.coverImage}
            alt={news.title}
            sx={{ mb: 4, borderRadius: 2 }}
          />
        )}
        
        <Typography variant="h2" sx={{ mb: 3 }}>
          {news.title}
        </Typography>
        
        {news.summary && (
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            {news.summary}
          </Typography>
        )}
        
        <Box sx={{ mb: 4 }}>
          <ReactMarkdown>{news.content}</ReactMarkdown>
        </Box>
        
        {news.galleryImages && news.galleryImages.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {locale === 'en' ? 'Gallery' : 'Галерија'}
            </Typography>
            <Grid container spacing={2}>
              {news.galleryImages.map((image, idx) => (
                <Grid item xs={12} sm={6} key={idx}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={image}
                    alt={`${news.title} - ${idx + 1}`}
                    sx={{ borderRadius: 2 }}
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

export default NewsDetailPage
