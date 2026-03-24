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
import { cyrlToLatn, latnToCyrl } from '../../utils/transliterate'

const emptyForm = () => ({
  titleSrCyrl: '',
  titleSrLatn: '',
  titleEn: '',
  summarySrCyrl: '',
  summarySrLatn: '',
  summaryEn: '',
  contentSrCyrl: '',
  contentSrLatn: '',
  contentEn: '',
  coverImage: '',
  galleryImages: [],
})

function NewsAdmin() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const updateCyrlAndLatn = (field, cyrlValue, latnValue) => {
    const updates = {}
    if (field === 'title') {
      updates.titleSrCyrl = cyrlValue
      updates.titleSrLatn = latnValue
    } else if (field === 'summary') {
      updates.summarySrCyrl = cyrlValue
      updates.summarySrLatn = latnValue
    } else if (field === 'content') {
      updates.contentSrCyrl = cyrlValue
      updates.contentSrLatn = latnValue
    }
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const resolve = (obj, fallback = '') => {
    if (typeof obj === 'string') return obj || fallback
    return obj?.srCyrl ?? obj?.srLatn ?? obj?.en ?? fallback
  }

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
      setFormData(emptyForm())
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/news/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-news'])
      setEditingId(null)
      setFormData(emptyForm())
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
    const data = { ...formData }
    if (!data.titleSrCyrl?.trim() && data.titleSrLatn?.trim()) {
      data.titleSrCyrl = latnToCyrl(data.titleSrLatn)
    }
    if (!data.summarySrCyrl?.trim() && data.summarySrLatn?.trim()) {
      data.summarySrCyrl = latnToCyrl(data.summarySrLatn)
    }
    if (!data.contentSrCyrl?.trim() && data.contentSrLatn?.trim()) {
      data.contentSrCyrl = latnToCyrl(data.contentSrLatn)
    }
    if (!data.titleSrLatn?.trim() && data.titleSrCyrl?.trim()) {
      data.titleSrLatn = cyrlToLatn(data.titleSrCyrl)
    }
    if (!data.summarySrLatn?.trim() && data.summarySrCyrl?.trim()) {
      data.summarySrLatn = cyrlToLatn(data.summarySrCyrl)
    }
    if (!data.contentSrLatn?.trim() && data.contentSrCyrl?.trim()) {
      data.contentSrLatn = cyrlToLatn(data.contentSrCyrl)
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, data })
    } else {
      createMutation.mutate(data)
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
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Ћирилица (унос се аутоматски пресликава и на латиницу)
                </Typography>
                <TextField
                  fullWidth
                  label="Title (Cyrillic)"
                  value={formData.titleSrCyrl}
                  onChange={(e) =>
                    updateCyrlAndLatn('title', e.target.value, cyrlToLatn(e.target.value))
                  }
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Summary (Cyrillic)"
                  value={formData.summarySrCyrl}
                  onChange={(e) =>
                    updateCyrlAndLatn('summary', e.target.value, cyrlToLatn(e.target.value))
                  }
                  required
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Content (Cyrillic - Markdown)"
                  value={formData.contentSrCyrl}
                  onChange={(e) =>
                    updateCyrlAndLatn('content', e.target.value, cyrlToLatn(e.target.value))
                  }
                  required
                  multiline
                  rows={6}
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                  Латиница (унос се аутоматски пресликава и на ћирилицу)
                </Typography>
                <TextField
                  fullWidth
                  label="Title (Latin)"
                  value={formData.titleSrLatn}
                  onChange={(e) =>
                    updateCyrlAndLatn('title', latnToCyrl(e.target.value), e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Summary (Latin)"
                  value={formData.summarySrLatn}
                  onChange={(e) =>
                    updateCyrlAndLatn('summary', latnToCyrl(e.target.value), e.target.value)
                  }
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Content (Latin - Markdown)"
                  value={formData.contentSrLatn}
                  onChange={(e) =>
                    updateCyrlAndLatn('content', latnToCyrl(e.target.value), e.target.value)
                  }
                  multiline
                  rows={6}
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                  Енглески
                </Typography>
                <TextField
                  fullWidth
                  label="Title (English)"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Summary (English)"
                  value={formData.summaryEn}
                  onChange={(e) => setFormData({ ...formData, summaryEn: e.target.value })}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Content (English - Markdown)"
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
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
                      setFormData(emptyForm())
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
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditingId(item.id)
                          setFormData({
                            titleSrCyrl: item.titleLocales?.srCyrl ?? resolve(item.title) ?? '',
                            titleSrLatn: item.titleLocales?.srLatn ?? '',
                            titleEn: item.titleLocales?.en ?? '',
                            summarySrCyrl: item.summaryLocales?.srCyrl ?? resolve(item.summary) ?? '',
                            summarySrLatn: item.summaryLocales?.srLatn ?? '',
                            summaryEn: item.summaryLocales?.en ?? '',
                            contentSrCyrl: item.contentLocales?.srCyrl ?? resolve(item.content) ?? '',
                            contentSrLatn: item.contentLocales?.srLatn ?? '',
                            contentEn: item.contentLocales?.en ?? '',
                            coverImage: item.coverImage || '',
                            galleryImages: item.galleryImages || [],
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
