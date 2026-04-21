import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  IconButton,
} from '@mui/material'
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { getAlbums } from '../api/albums'
import { useLocation } from 'react-router-dom'
import { getLanguageFromPath } from '../utils/language'
import { cyrlToLatn } from '../utils/transliterate'

function GalleryPage() {
  const location = useLocation()
  const { lang, script, locale } = getLanguageFromPath(location.pathname)
  const srText = (cyr) => (locale === 'sr-latn' ? cyrlToLatn(cyr) : cyr)
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  const { data: albums, isLoading } = useQuery({
    queryKey: ['albums', lang, script],
    queryFn: () => getAlbums(lang, script),
  })
  
  const content = {
    sr: { title: 'Галерија', images: 'слика' },
    'sr-latn': { title: 'Galerija', images: 'slika' },
    en: { title: 'Gallery', images: 'images' },
  }
  
  const pageContent = content[locale] || content.sr
  const visibleAlbums = (albums || []).filter((album) => (album.images?.length || 0) > 0)

  const openAlbum = (album) => {
    setSelectedAlbum(album)
    setSelectedImageIndex(0)
  }

  const closeAlbum = () => {
    setSelectedAlbum(null)
    setSelectedImageIndex(0)
  }

  const goPrev = () => {
    if (!selectedAlbum?.images?.length) return
    setSelectedImageIndex((prev) =>
      (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length,
    )
  }

  const goNext = () => {
    if (!selectedAlbum?.images?.length) return
    setSelectedImageIndex((prev) => (prev + 1) % selectedAlbum.images.length)
  }
  
  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Typography variant="h2" align="center" sx={{ mb: 8 }}>
          {pageContent.title}
        </Typography>
        
        {isLoading ? (
          <Typography align="center">{locale === 'en' ? 'Loading...' : srText('Učitavanje...')}</Typography>
        ) : visibleAlbums.length > 0 ? (
          <Grid container spacing={4}>
            {visibleAlbums.map((album) => (
              <Grid item xs={12} sm={6} md={4} key={album.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => openAlbum(album)}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {album.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                      {(album.images?.length || 0)} {pageContent.images}
                    </Typography>
                    {album.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {album.description}
                      </Typography>
                    )}
                    {album.images && album.images.length > 0 && (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                          gap: 1,
                        }}
                      >
                        {album.images.map((image, index) => (
                          <Box
                            key={`${album.id}-img-${index}`}
                            component="img"
                            src={image}
                            alt={`${album.title} ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: 100,
                              objectFit: 'cover',
                              borderRadius: 1,
                            }}
                          />
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
            {locale === 'en' ? 'No albums available' : srText('Нема доступних албума')}
          </Typography>
        )}

        <Dialog
          open={Boolean(selectedAlbum)}
          onClose={closeAlbum}
          maxWidth="lg"
          fullWidth
        >
          {selectedAlbum && (
            <Box sx={{ p: { xs: 1.5, md: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="h6">{selectedAlbum.title}</Typography>
                <IconButton onClick={closeAlbum} aria-label="close">
                  <Close />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 2,
                }}
              >
                <IconButton onClick={goPrev} aria-label="previous image">
                  <ChevronLeft />
                </IconButton>
                <Box
                  component="img"
                  src={selectedAlbum.images[selectedImageIndex]}
                  alt={`${selectedAlbum.title} ${selectedImageIndex + 1}`}
                  sx={{
                    width: '100%',
                    maxWidth: 980,
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    borderRadius: 1,
                    backgroundColor: 'black',
                  }}
                />
                <IconButton onClick={goNext} aria-label="next image">
                  <ChevronRight />
                </IconButton>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mb: 1.5 }}>
                {selectedImageIndex + 1} / {selectedAlbum.images.length}
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: 1,
                }}
              >
                {selectedAlbum.images.map((image, index) => (
                  <Box
                    key={`${selectedAlbum.id}-thumb-${index}`}
                    component="img"
                    src={image}
                    alt={`${selectedAlbum.title} thumb ${index + 1}`}
                    onClick={() => setSelectedImageIndex(index)}
                    sx={{
                      width: '100%',
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: index === selectedImageIndex ? '2px solid' : '1px solid',
                      borderColor: index === selectedImageIndex ? 'primary.main' : 'divider',
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Dialog>
      </Container>
    </Box>
  )
}

export default GalleryPage
