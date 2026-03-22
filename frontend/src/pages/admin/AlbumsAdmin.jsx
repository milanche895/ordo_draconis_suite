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
import api from '../../api/axios'
import ImageUpload from '../../components/admin/ImageUpload'

function AlbumsAdmin() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    titleSrCyrl: '',
    descriptionSrCyrl: '',
    images: [],
  })
  const [editingId, setEditingId] = useState(null)
  
  const { data: albums } = useQuery({
    queryKey: ['admin-albums'],
    queryFn: async () => {
      const response = await api.get('/admin/albums')
      return response.data
    },
  })
  
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/albums', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-albums'])
      setFormData({
        titleSrCyrl: '',
        descriptionSrCyrl: '',
      })
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/albums/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-albums'])
      setEditingId(null)
      setFormData({
        titleSrCyrl: '',
        descriptionSrCyrl: '',
      })
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/albums/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-albums'])
    },
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }
  
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Manage Albums
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {editingId ? 'Edit Album' : 'Create Album'}
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
                  label="Description (Cyrillic)"
                  value={formData.descriptionSrCyrl}
                  onChange={(e) => setFormData({ ...formData, descriptionSrCyrl: e.target.value })}
                  multiline
                  rows={4}
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
                        descriptionSrCyrl: '',
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
            Existing Albums
          </Typography>
          {albums && albums.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {albums.map((item) => (
                <Card key={item.id}>
                  <CardContent>
                    <Typography variant="h6">{item.title}</Typography>
                    {item.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.description}
                      </Typography>
                    )}
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditingId(item.id)
                          setFormData({
                            titleSrCyrl: item.title || '',
                            descriptionSrCyrl: item.description || '',
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
            <Typography color="text.secondary">No albums</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default AlbumsAdmin
