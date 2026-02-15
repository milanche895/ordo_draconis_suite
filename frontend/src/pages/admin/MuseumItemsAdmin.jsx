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

function MuseumItemsAdmin() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    titleSrCyrl: '',
    descriptionSrCyrl: '',
    contentSrCyrl: '',
    coverImage: '',
    galleryImages: [],
    category: '',
    period: '',
    origin: '',
    featured: false,
    active: true,
    generateEn: false,
  })
  const [editingId, setEditingId] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  
  const { data: museumItems = [], isLoading } = useQuery({
    queryKey: ['admin-museum-items'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/museum-items')
        return response.data || []
      } catch (error) {
        console.error('Error fetching museum items:', error)
        return []
      }
    },
  })
  
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/museum-items', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-museum-items'])
      resetForm()
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/museum-items/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-museum-items'])
      resetForm()
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/museum-items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-museum-items'])
      setDeleteDialog({ open: false, id: null })
    },
  })
  
  const resetForm = () => {
    setFormData({
      titleSrCyrl: '',
      descriptionSrCyrl: '',
      contentSrCyrl: '',
      coverImage: '',
      galleryImages: [],
      category: '',
      period: '',
      origin: '',
      featured: false,
      active: true,
      generateEn: false,
    })
    setEditingId(null)
  }
  
  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      titleSrCyrl: item.title || '',
      descriptionSrCyrl: item.description || '',
      contentSrCyrl: item.content || '',
      category: item.category || '',
      period: item.period || '',
      origin: item.origin || '',
      featured: item.featured ?? false,
      active: item.active ?? true,
      generateEn: false,
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData })
    } else {
      createMutation.mutate(formData)
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
                <TextField
                  fullWidth
                  label="Наслов (ћирилица)"
                  value={formData.titleSrCyrl}
                  onChange={(e) => setFormData({ ...formData, titleSrCyrl: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Опис (ћирилица)"
                  value={formData.descriptionSrCyrl}
                  onChange={(e) => setFormData({ ...formData, descriptionSrCyrl: e.target.value })}
                  required
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Садржај (ћирилица)"
                  value={formData.contentSrCyrl}
                  onChange={(e) => setFormData({ ...formData, contentSrCyrl: e.target.value })}
                  multiline
                  rows={4}
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.generateEn}
                      onChange={(e) => setFormData({ ...formData, generateEn: e.target.checked })}
                    />
                  }
                  label="Генериши енглески превод"
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
