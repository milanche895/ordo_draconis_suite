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
  Switch,
  FormControlLabel,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import api from '../../api/axios'
import ImageUpload from '../../components/admin/ImageUpload'
import { cyrlToLatn, latnToCyrl } from '../../utils/transliterate'

function MuseumItemsAdmin() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    titleSrCyrl: '',
    titleSrLatn: '',
    titleEn: '',
    descriptionSrCyrl: '',
    descriptionSrLatn: '',
    descriptionEn: '',
    contentSrCyrl: '',
    contentSrLatn: '',
    contentEn: '',
    coverImage: '',
    category: '',
    period: '',
    origin: '',
    featured: false,
    active: true,
  })
  const [editingId, setEditingId] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })

  const updateCyrlAndLatn = (field, cyrlValue, latnValue) => {
    const updates = {}
    if (field === 'title') {
      updates.titleSrCyrl = cyrlValue
      updates.titleSrLatn = latnValue
    } else if (field === 'description') {
      updates.descriptionSrCyrl = cyrlValue
      updates.descriptionSrLatn = latnValue
    } else if (field === 'content') {
      updates.contentSrCyrl = cyrlValue
      updates.contentSrLatn = latnValue
    }
    setFormData((prev) => ({ ...prev, ...updates }))
  }
  
  const { data: museumItems = [], isLoading } = useQuery({
    queryKey: ['admin-museum'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/museum')
        return response.data || []
      } catch (error) {
        console.error('Error fetching museum items:', error)
        return []
      }
    },
  })
  
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/museum', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-museum'])
      resetForm()
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/museum/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-museum'])
      resetForm()
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/museum/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-museum'])
      setDeleteDialog({ open: false, id: null })
    },
  })
  
  const resetForm = () => {
    setFormData({
      titleSrCyrl: '',
      titleSrLatn: '',
      titleEn: '',
      descriptionSrCyrl: '',
      descriptionSrLatn: '',
      descriptionEn: '',
      contentSrCyrl: '',
      contentSrLatn: '',
      contentEn: '',
      coverImage: '',
      category: '',
      period: '',
      origin: '',
      featured: false,
      active: true,
    })
    setEditingId(null)
  }

  const resolve = (obj, fallback = '') => {
    if (typeof obj === 'string') return obj || fallback
    return obj?.srCyrl ?? obj?.srLatn ?? obj?.en ?? fallback
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      titleSrCyrl: item.title?.srCyrl ?? resolve(item.title) ?? '',
      titleSrLatn: item.title?.srLatn ?? '',
      titleEn: item.title?.en ?? '',
      descriptionSrCyrl: item.description?.srCyrl ?? resolve(item.description) ?? '',
      descriptionSrLatn: item.description?.srLatn ?? '',
      descriptionEn: item.description?.en ?? '',
      contentSrCyrl: item.content?.srCyrl ?? resolve(item.content) ?? '',
      contentSrLatn: item.content?.srLatn ?? '',
      contentEn: item.content?.en ?? '',
      coverImage: item.coverImage || '',
      category: item.category || '',
      period: item.period || '',
      origin: item.origin || '',
      featured: item.featured ?? false,
      active: item.active ?? true,
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...formData }
    if (!data.titleSrCyrl?.trim() && data.titleSrLatn?.trim()) {
      data.titleSrCyrl = latnToCyrl(data.titleSrLatn)
    }
    if (!data.descriptionSrCyrl?.trim() && data.descriptionSrLatn?.trim()) {
      data.descriptionSrCyrl = latnToCyrl(data.descriptionSrLatn)
    }
    if (!data.contentSrCyrl?.trim() && data.contentSrLatn?.trim()) {
      data.contentSrCyrl = latnToCyrl(data.contentSrLatn)
    }
    if (!data.titleSrLatn?.trim() && data.titleSrCyrl?.trim()) {
      data.titleSrLatn = cyrlToLatn(data.titleSrCyrl)
    }
    if (!data.descriptionSrLatn?.trim() && data.descriptionSrCyrl?.trim()) {
      data.descriptionSrLatn = cyrlToLatn(data.descriptionSrCyrl)
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
  
  const handleDelete = (id) => {
    deleteMutation.mutate(id)
  }
  
  const categories = ['Оружје', 'Оклоп', 'Артефакти', 'Документи', 'Уметност', 'Остало']
  
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Управљање музејским експонатима
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {editingId ? 'Измени експонат' : 'Додај нови експонат'}
              </Typography>
              <form onSubmit={handleSubmit}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Ћирилица (унос се аутоматски пресликава и на латиницу)
                </Typography>
                <TextField
                  fullWidth
                  label="Наслов (ћирилица)"
                  value={formData.titleSrCyrl}
                  onChange={(e) => updateCyrlAndLatn('title', e.target.value, cyrlToLatn(e.target.value))}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Опис (ћирилица)"
                  value={formData.descriptionSrCyrl}
                  onChange={(e) => updateCyrlAndLatn('description', e.target.value, cyrlToLatn(e.target.value))}
                  required
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Садржај (ћирилица)"
                  value={formData.contentSrCyrl}
                  onChange={(e) => updateCyrlAndLatn('content', e.target.value, cyrlToLatn(e.target.value))}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                  Латиница (унос се аутоматски пресликава и на ћирилицу)
                </Typography>
                <TextField
                  fullWidth
                  label="Наслов (латиница)"
                  value={formData.titleSrLatn}
                  onChange={(e) => updateCyrlAndLatn('title', latnToCyrl(e.target.value), e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Опис (латиница)"
                  value={formData.descriptionSrLatn}
                  onChange={(e) => updateCyrlAndLatn('description', latnToCyrl(e.target.value), e.target.value)}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Садржај (латиница)"
                  value={formData.contentSrLatn}
                  onChange={(e) => updateCyrlAndLatn('content', latnToCyrl(e.target.value), e.target.value)}
                  multiline
                  rows={2}
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
                  label="Description (English)"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Content (English)"
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  multiline
                  rows={2}
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                  Слике
                </Typography>
                <ImageUpload
                  label="Насловна слика"
                  value={formData.coverImage || null}
                  onChange={(path) => setFormData({ ...formData, coverImage: path || '' })}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Категорија</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="Категорија"
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Период (нпр. 12. век)"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Порекло (нпр. Србија, Византија)"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                  }
                  label="Истакнуто"
                  sx={{ mb: 2, display: 'block' }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                  }
                  label="Активно"
                  sx={{ mb: 2, display: 'block' }}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button type="submit" variant="contained" color="primary">
                    {editingId ? 'Сачувај измене' : 'Креирај'}
                  </Button>
                  {editingId && (
                    <Button variant="outlined" onClick={resetForm}>
                      Откажи
                    </Button>
                  )}
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Наслов</TableCell>
                  <TableCell>Категорија</TableCell>
                  <TableCell>Период</TableCell>
                  <TableCell>Истакнуто</TableCell>
                  <TableCell>Акције</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Учитавање...</TableCell>
                  </TableRow>
                ) : museumItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Нема експоната</TableCell>
                  </TableRow>
                ) : (
                  museumItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.title || 'Без наслова'}</TableCell>
                      <TableCell>{item.category || '-'}</TableCell>
                      <TableCell>{item.period || '-'}</TableCell>
                      <TableCell>{item.featured ? 'Да' : 'Не'}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleEdit(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, id: item.id })}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Избриши експонат?</DialogTitle>
        <DialogContent>
          <Typography>Да ли сте сигурни да желите да избришете овај експонат? Ова акција се не може поништити.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Откажи</Button>
          <Button onClick={() => handleDelete(deleteDialog.id)} color="error" variant="contained">
            Избриши
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MuseumItemsAdmin
