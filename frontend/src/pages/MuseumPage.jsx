import { Box, Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { getLanguageFromPath } from '../utils/language'

function MuseumPage() {
  const location = useLocation()
  const { locale } = getLanguageFromPath(location.pathname)
  
  const content = {
    sr: {
      title: 'Музеј',
      description: 'Наш музеј садржи богату колекцију средњовековних артефаката који приказују живот и културу тог доба.',
      sections: [
        {
          title: 'Колекција оружја',
          description: 'Преглед мачева, штитова и оклопа из различитих периода средњег века.',
        },
        {
          title: 'Керамика и уметнички предмети',
          description: 'Керамички предмети и уметнички радови који показују вештину средњовековних занатлија.',
        },
        {
          title: 'Историјски документи',
          description: 'Реплике средњовековних докумената и рукописа.',
        },
      ],
    },
    'sr-latn': {
      title: 'Muzej',
      description: 'Naš muzej sadrži bogatu kolekciju srednjevekovnih artefakata koji prikazuju život i kulturu tog doba.',
      sections: [
        {
          title: 'Kolekcija oružja',
          description: 'Pregled mačeva, štitova i oklopa iz različitih perioda srednjeg veka.',
        },
        {
          title: 'Keramika i umetnički predmeti',
          description: 'Keramički predmeti i umetnički radovi koji pokazuju veštinu srednjevekovnih zanatlija.',
        },
        {
          title: 'Istorijski dokumenti',
          description: 'Replike srednjevekovnih dokumenata i rukopisa.',
        },
      ],
    },
    en: {
      title: 'Museum',
      description: 'Our museum contains a rich collection of medieval artifacts showcasing the life and culture of that era.',
      sections: [
        {
          title: 'Weapons Collection',
          description: 'Overview of swords, shields, and armor from different periods of the Middle Ages.',
        },
        {
          title: 'Ceramics and Artifacts',
          description: 'Ceramic items and artworks demonstrating the skill of medieval craftsmen.',
        },
        {
          title: 'Historical Documents',
          description: 'Replicas of medieval documents and manuscripts.',
        },
      ],
    },
  }
  
  const pageContent = content[locale] || content.sr
  
  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Typography variant="h2" align="center" sx={{ mb: 4 }}>
          {pageContent.title}
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 8, maxWidth: '800px', mx: 'auto' }}>
          {pageContent.description}
        </Typography>
        
        <Grid container spacing={4}>
          {pageContent.sections.map((section, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`/placeholder-museum-${idx + 1}.jpg`}
                  alt={section.title}
                />
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default MuseumPage
