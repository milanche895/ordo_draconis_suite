import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia, Chip, Rating } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { getLanguageFromPath, getPathPrefix } from '../utils/language'
import { useQuery } from '@tanstack/react-query'
import { getNews } from '../api/news'

function HomePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const location = useLocation()
  const { lang, script, locale } = getLanguageFromPath(location.pathname)
  const prefix = getPathPrefix(locale)
  
  const { data: newsData } = useQuery({
    queryKey: ['news', lang, script],
    queryFn: () => getNews(lang, script, 0, 3),
  })
  
  const testimonials = [
    { text: 'Незаборавно искуство!', author: 'Марко П.' },
    { text: 'Деца су била одушевљена!', author: 'Ана М.' },
    { text: 'Препоручујем свима!', author: 'Петар К.' },
  ]
  
  const features = [
    {
      title: locale === 'en' ? 'Museum' : 'Музеј',
      description: locale === 'en' ? 'Explore medieval artifacts' : 'Истражите средњовековне артефакте',
      icon: '🏛️',
      path: `${prefix}/${locale === 'en' ? 'museum' : 'muzej'}`,
    },
    {
      title: locale === 'en' ? 'Workshops' : 'Раднице',
      description: locale === 'en' ? 'Learn medieval crafts' : 'Научите средњовековне занате',
      icon: '⚒️',
      path: `${prefix}/${locale === 'en' ? 'workshops' : 'radionice'}`,
    },
    {
      title: locale === 'en' ? 'Adventures' : 'Авантуре',
      description: locale === 'en' ? 'Interactive quests and games' : 'Интерактивни квестови и игре',
      icon: '⚔️',
      path: prefix,
    },
    {
      title: locale === 'en' ? 'Shop' : 'Продавница',
      description: locale === 'en' ? 'Medieval souvenirs' : 'Средњовековни сувенири',
      icon: '🛒',
      path: `${prefix}/${locale === 'en' ? 'shop' : 'prodavnica'}`,
    },
  ]
  
  const stats = [
    { number: '20+', label: locale === 'en' ? 'Activities' : 'Активности' },
    { number: '5', label: locale === 'en' ? 'Guides in Costumes' : 'Водичи у костимима' },
    { number: '1', label: locale === 'en' ? 'Museum Exhibition' : 'Музејска поставка' },
  ]
  
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '70vh', md: '90vh' },
          backgroundImage: 'url(/placeholder-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <Chip
            label={t('home.open')}
            color="success"
            sx={{ mb: 2 }}
          />
          <Typography variant="h1" sx={{ mb: 2, fontWeight: 700 }}>
            {t('home.heroTitle')}
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            {t('home.heroSubtitle')}
          </Typography>
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Rating value={4.9} precision={0.1} readOnly size="large" />
            <Typography variant="h6">4.9</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{ px: 4, py: 1.5 }}
              onClick={() => navigate(`${prefix}/${locale === 'en' ? 'contact' : 'kontakt'}`)}
            >
              {t('home.planVisit')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5, borderColor: 'white', color: 'white' }}
              onClick={() => navigate(`${prefix}/${locale === 'en' ? 'workshops' : 'radionice'}`)}
            >
              {t('home.viewActivities')}
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Testimonials Carousel */}
      <Box sx={{ py: 6, backgroundColor: '#F5F5DC' }}>
        <Container>
          <Typography variant="h4" align="center" sx={{ mb: 4 }}>
            {locale === 'en' ? 'What Visitors Say' : 'Шта кажу посетиоци'}
          </Typography>
          <Grid container spacing={3}>
            {testimonials.map((testimonial, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card sx={{ height: '100%', textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      - {testimonial.author}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Feature Cards */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography variant="h3" align="center" sx={{ mb: 6 }}>
            {locale === 'en' ? 'Explore Our Offerings' : 'Истражите нашу понуду'}
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'translateY(-8px)' },
                  }}
                  onClick={() => navigate(feature.path)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>
                      {feature.icon}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Stats Section */}
      <Box sx={{ py: 8, backgroundColor: '#2C2C2C', color: 'white' }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ mb: 3 }}>
                {locale === 'en' ? 'About OrdoDraconis' : 'О Ордо Драконис'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
                {locale === 'en'
                  ? 'OrdoDraconis is a medieval theme park dedicated to preserving and showcasing the rich history and culture of the Middle Ages. Located in Gračanica, we offer immersive experiences through our museum, workshops, and interactive activities.'
                  : 'Ордо Драконис је средњовековни тематски парк посвећен очувању и представљању богате историје и културе средњег века. Налази се у Грачаници и нуди уживања кроз музеј, радионице и интерактивне активности.'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={4}>
                {stats.map((stat, idx) => (
                  <Grid item xs={4} key={idx}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h2" sx={{ color: '#D4AF37', fontWeight: 700 }}>
                        {stat.number}
                      </Typography>
                      <Typography variant="body1">{stat.label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Latest News */}
      {newsData && newsData.content && newsData.content.length > 0 && (
        <Box sx={{ py: 8 }}>
          <Container>
            <Typography variant="h3" align="center" sx={{ mb: 6 }}>
              {locale === 'en' ? 'Latest News' : 'Најновије вести'}
            </Typography>
            <Grid container spacing={4}>
              {newsData.content.slice(0, 3).map((news) => (
                <Grid item xs={12} md={4} key={news.id}>
                  <Card
                    sx={{ cursor: 'pointer', height: '100%' }}
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
                      <Button size="small" onClick={(e) => {
                        e.stopPropagation()
                        navigate(`${prefix}/${locale === 'en' ? 'news' : 'vesti'}/${news.slug}`)
                      }}>
                        {t('common.readMore')}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
    </Box>
  )
}

export default HomePage
