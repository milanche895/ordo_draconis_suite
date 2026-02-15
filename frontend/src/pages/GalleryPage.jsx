import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getAlbums } from '../api/albums'
import { useLocation } from 'react-router-dom'
import { getLanguageFromPath } from '../utils/language'

function GalleryPage() {
  const location = useLocation()
  const { lang, script, locale } = getLanguageFromPath(location.pathname)
  
  const { data: albums, isLoading } = useQuery({
    queryKey: ['albums', lang, script],
    queryFn: () => getAlbums(lang, script),
  })
  
  const content = {
    sr: { title: 'Галерија', viewAlbum: 'Погледај албум' },
    'sr-latn': { title: 'Galerija', viewAlbum: 'Pogledaj album' },
    en: { title: 'Gallery', viewAlbum: 'View Album' },
  }
  
  const pageContent = content[locale] || content.sr
  
  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Typography variant="h2" align="center" sx={{ mb: 8 }}>
          {pageContent.title}
        </Typography>
        
        {isLoading ? (
          <Typography align="center">Loading...</Typography>
        ) : albums && albums.length > 0 ? (
          <Grid container spacing={4}>
            {albums.map((album) => (
              <Grid item xs={12} sm={6} md={4} key={album.id}>
                <Card sx={{ height: '100%' }}>
                  {album.images && album.images.length > 0 && (
                    <CardMedia
                      component="img"
                      height="250"
                      image={album.images[0]}
                      alt={album.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {album.title}
                    </Typography>
                    {album.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {album.description}
                      </Typography>
                    )}
                    {album.tags && album.tags.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        {album.tags.map((tag, idx) => (
                          <Button
                            key={idx}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1, mb: 1 }}
                          >
                            {tag}
                          </Button>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center" color="text.secondary">
            {locale === 'en' ? 'No albums available' : 'Нема доступних албума'}
          </Typography>
        )}
      </Container>
    </Box>
  )
}

export default GalleryPage
