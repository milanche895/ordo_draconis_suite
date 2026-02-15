import { Box, Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { getLanguageFromPath } from '../utils/language'

function WorkshopsPage() {
  const location = useLocation()
  const { locale } = getLanguageFromPath(location.pathname)
  
  const content = {
    sr: {
      title: 'Средњовековне радионице',
      description: 'Учите средњовековне занате кроз интерактивне радионице.',
      workshops: [
        {
          title: 'Ковачница',
          description: 'Научите основе ковања и израде металних предмета.',
        },
        {
          title: 'Грнчарија',
          description: 'Искусство израде керамике и посуда.',
        },
        {
          title: 'Ткање',
          description: 'Традиционално ткање и израда текстила.',
        },
        {
          title: 'Калографија',
          description: 'Учите средњовековно писање и калиграфију.',
        },
      ],
    },
    'sr-latn': {
      title: 'Srednjevekovne radionice',
      description: 'Učite srednjevekovne zanate kroz interaktivne radionice.',
      workshops: [
        {
          title: 'Kovačnica',
          description: 'Naučite osnove kovanja i izrade metalnih predmeta.',
        },
        {
          title: 'Grnčarija',
          description: 'Iskustvo izrade keramike i posuda.',
        },
        {
          title: 'Tkanje',
          description: 'Tradicionalno tkanje i izrada tekstila.',
        },
        {
          title: 'Kaligrafija',
          description: 'Učite srednjevekovno pisanje i kaligrafiju.',
        },
      ],
    },
    en: {
      title: 'Medieval Workshops',
      description: 'Learn medieval crafts through interactive workshops.',
      workshops: [
        {
          title: 'Blacksmithing',
          description: 'Learn the basics of forging and metalworking.',
        },
        {
          title: 'Pottery',
          description: 'The art of making ceramics and vessels.',
        },
        {
          title: 'Weaving',
          description: 'Traditional weaving and textile making.',
        },
        {
          title: 'Calligraphy',
          description: 'Learn medieval writing and calligraphy.',
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
          {pageContent.workshops.map((workshop, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`/placeholder-workshop${idx + 1}.jpg`}
                  alt={workshop.title}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {workshop.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {workshop.description}
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

export default WorkshopsPage
