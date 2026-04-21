import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
} from '@mui/material'
import ImageUpload from '../../components/admin/ImageUpload'
import {
  getGalleryAdminAlbums,
  createCustomGalleryAlbum,
  updateCustomGalleryAlbum,
  deleteCustomGalleryAlbum,
  updateDefaultGalleryAlbumImages,
} from '../../api/galleryAdmin'

function AlbumsAdmin() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    titleSrCyrl: '',
    titleSrLatn: '',
    titleEn: '',
    images: [],
  })
  const [editingId, setEditingId] = useState(null)
  const [defaultEdits, setDefaultEdits] = useState({})
  
  const { data: albums = [] } = useQuery({
    queryKey: ['admin-gallery-albums'],
    queryFn: getGalleryAdminAlbums,
  })

  const defaultAlbums = albums.filter((a) => a.type === 'DEFAULT')
  const customAlbums = albums.filter((a) => a.type === 'CUSTOM')
  
  const createMutation = useMutation({
    mutationFn: (data) => createCustomGalleryAlbum(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-gallery-albums'])
      setFormData({
        titleSrCyrl: '',
        titleSrLatn: '',
        titleEn: '',
        images: [],
      })
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCustomGalleryAlbum(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-gallery-albums'])
      setEditingId(null)
      setFormData({
        titleSrCyrl: '',
        titleSrLatn: '',
        titleEn: '',
        images: [],
      })
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCustomGalleryAlbum(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-gallery-albums'])
    },
  })

  const updateDefaultMutation = useMutation({
    mutationFn: ({ key, images }) => updateDefaultGalleryAlbumImages(key, images),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-gallery-albums'])
    },
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      titleSrCyrl: formData.titleSrCyrl,
      titleSrLatn: formData.titleSrLatn,
      titleEn: formData.titleEn,
      images: formData.images,
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const getDefaultImages = (album) => {
    return defaultEdits[album.key] ?? album.images ?? []
  }

  const saveDefaultImages = (album) => {
    updateDefaultMutation.mutate({ key: album.key, images: getDefaultImages(album) })
  }
  
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Manage Gallery Albums
      </Typography>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Default Albums (add/remove images)
      </Typography>
      <Grid container spacing={2} alignItems="flex-start" sx={{ mb: 4 }}>
        {defaultAlbums.map((album) => (
          <Grid item xs={12} md={6} key={album.key}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>{album.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {getDefaultImages(album).length} images
                </Typography>
                <ImageUpload
                  label="Album Images"
                  multiple
                  value={getDefaultImages(album)}
                  onChange={(urls) => {
                    setDefaultEdits((prev) => ({ ...prev, [album.key]: urls }))
                  }}
                />
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => saveDefaultImages(album)}
                  disabled={updateDefaultMutation.isLoading}
                >
                  Save Default Album Images
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Custom Albums
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {editingId ? 'Edit Custom Album' : 'Create Custom Album'}
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Title (Cyrillic)"
                  value={formData.titleSrCyrl}
                  onChange={(e) => setFormData({ ...formData, titleSrCyrl: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Title (Latin, optional)"
                  value={formData.titleSrLatn}
                  onChange={(e) => setFormData({ ...formData, titleSrLatn: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Title (English, optional)"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <ImageUpload
                  label="Album Images"
                  multiple
                  value={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls })}
                  sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth>
                  {editingId ? 'Update' : 'Create'}
                </Button>
                {editingId && (
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => {
                      setEditingId(null)
                      setFormData({
                        titleSrCyrl: '',
                        titleSrLatn: '',
                        titleEn: '',
                        images: [],
                      })
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Existing Custom Albums
          </Typography>
          {customAlbums.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {customAlbums.map((item) => (
                <Card key={item.id}>
                  <CardContent>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.images?.length || 0} images
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditingId(item.id)
                          setFormData({
                            titleSrCyrl: item.titleLocales?.srCyrl || '',
                            titleSrLatn: item.titleLocales?.srLatn || '',
                            titleEn: item.titleLocales?.en || '',
                            images: item.images || [],
                          })
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          if (window.confirm('Delete this album?')) {
                            deleteMutation.mutate(item.id)
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">No custom albums</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default AlbumsAdmin
