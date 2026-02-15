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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material'
import api from '../../api/axios'
import ImageUpload from '../../components/admin/ImageUpload'

function NewsAdmin() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    titleSrCyrl: '',
    summarySrCyrl: '',
    contentSrCyrl: '',
    coverImage: '',
    galleryImages: [],
    status: 'DRAFT',
    generateEn: false,
  })
  const [editingId, setEditingId] = useState(null)
  
  const { data: news } = useQuery({
    queryKey: ['admin-news'],
    queryFn: async () => {
      const response = await api.get('/admin/news')
      return response.data
    },
  })
  
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/news', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-news'])
      setFormData({
        titleSrCyrl: '',
        summarySrCyrl: '',
        contentSrCyrl: '',
        coverImage: '',
        galleryImages: [],
        status: 'DRAFT',
        generateEn: false,
      })
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/news/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-news'])
      setEditingId(null)
      setFormData({
        titleSrCyrl: '',
        summarySrCyrl: '',
        contentSrCyrl: '',
        coverImage: '',
        galleryImages: [],
        status: 'DRAFT',
        generateEn: false,
      })
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-news'])
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
        Manage News
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {editingId ? 'Edit News' : 'Create News'}
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
                  label="Summary (Cyrillic)"
                  value={formData.summarySrCyrl}
                  onChange={(e) => setFormData({ ...formData, summarySrCyrl: e.target.value })}
                  required
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Content (Cyrillic - Markdown)"
                  value={formData.contentSrCyrl}
                  onChange={(e) => setFormData({ ...formData, contentSrCyrl: e.target.value })}
                  required
                  multiline
                  rows={6}
                  sx={{ mb: 2 }}
                />
                <ImageUpload
                  label="Cover Image"
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  sx={{ mb: 2 }}
                />
                <ImageUpload
                  label="Gallery Images"
                  multiple
                  value={formData.galleryImages}
                  onChange={(urls) => setFormData({ ...formData, galleryImages: urls })}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="DRAFT">Draft</MenuItem>
                    <MenuItem value="PUBLISHED">Published</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.generateEn}
                      onChange={(e) => setFormData({ ...formData, generateEn: e.target.checked })}
                    />
                  }
                  label="Generate English Translation"
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
                        summarySrCyrl: '',
                        contentSrCyrl: '',
                        status: 'DRAFT',
                        generateEn: false,
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
            Existing News
          </Typography>
          {news && news.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {news.map((item) => (
                <Card key={item.id}>
                  <CardContent>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.summary}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Status: {item.status}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditingId(item.id)
                          setFormData({
                            titleSrCyrl: item.title || '',
                            summarySrCyrl: item.summary || '',
                            contentSrCyrl: item.content || '',
                            status: item.status || 'DRAFT',
                            generateEn: false,
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
                          if (window.confirm('Delete this news?')) {
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
            <Typography color="text.secondary">No news items</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default NewsAdmin
