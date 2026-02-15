import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, Pagination } from '@mui/material'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getNews } from '../api/news'
import { useNavigate, useLocation } from 'react-router-dom'
import { getLanguageFromPath, getPathPrefix } from '../utils/language'
import { useTranslation } from 'react-i18next'

function NewsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { lang, script, locale } = getLanguageFromPath(location.pathname)
  const prefix = getPathPrefix(locale)
  const [page, setPage] = useState(0)
  
  const { data: newsData, isLoading } = useQuery({
    queryKey: ['news', lang, script, page],
    queryFn: () => getNews(lang, script, page, 9),
  })
  
  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Typography variant="h2" align="center" sx={{ mb: 8 }}>
          {locale === 'en' ? 'News' : 'Вести'}
        </Typography>
        
        {isLoading ? (
          <Typography align="center">Loading...</Typography>
        ) : newsData && newsData.content && newsData.content.length > 0 ? (
          <>
            <Grid container spacing={4}>
              {newsData.content.map((news) => (
                <Grid item xs={12} md={4} key={news.id}>
                  <Card
                    sx={{ height: '100%', cursor: 'pointer' }}
                    onClick={() => navigate(`${prefix}/${locale === 'en' ? 'news' : 'vesti'}/${news.slug}`)}
                  >
                    {news.coverImage && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={news.coverImage}
                        alt={news.title}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {news.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {news.summary}
                      </Typography>
                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`${prefix}/${locale === 'en' ? 'news' : 'vesti'}/${news.slug}`)
                        }}
                      >
                        {t('common.readMore')}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {newsData.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={newsData.totalPages}
                  page={page + 1}
                  onChange={(e, value) => setPage(value - 1)}
                  color="primary"
                />
              </Box>
            )}
          </>
        ) : (
          <Typography align="center" color="text.secondary">
            {locale === 'en' ? 'No news available' : 'Нема доступних вести'}
          </Typography>
        )}
      </Container>
    </Box>
  )
}

export default NewsPage
