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
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import api from '../../api/axios'

function WorkshopsAdmin() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    titleSrCyrl: '',
    descriptionSrCyrl: '',
    contentSrCyrl: '',
    coverImage: '',
    galleryImages: [],
    duration: '',
    maxParticipants: '',
    price: '',
    currency: 'RSD',
    active: true,
    generateEn: false,
  })
  const [editingId, setEditingId] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  
  const { data: workshops = [], isLoading } = useQuery({
    queryKey: ['admin-workshops'],
    queryFn: async () => {
      try {
        const response = await api.get('/admin/workshops')
        return response.data || []
      } catch (error) {
        console.error('Error fetching workshops:', error)
        return []
      }
    },
  })
  
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/workshops', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-workshops'])
      resetForm()
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/workshops/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-workshops'])
      resetForm()
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/workshops/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-workshops'])
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
      duration: '',
      maxParticipants: '',
      price: '',
      currency: 'RSD',
      active: true,
      generateEn: false,
    })
    setEditingId(null)
  }
  
  const handleEdit = (workshop) => {
    setEditingId(workshop.id)
    setFormData({
      titleSrCyrl: workshop.title || '',
      descriptionSrCyrl: workshop.description || '',
      contentSrCyrl: workshop.content || '',
      duration: workshop.duration || '',
      maxParticipants: workshop.maxParticipants || '',
      price: workshop.price || '',
      currency: workshop.currency || 'RSD',
      active: workshop.active ?? true,
      generateEn: false,
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) : null,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
      price: formData.price ? parseFloat(formData.price) : null,
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
  
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Управљање радионицама
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {editingId ? 'Измени радионицу' : 'Додај нову радионицу'}
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
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Трајање (минути)"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Макс. учесника"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Цена"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Валута"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      select
                      SelectProps={{ native: true }}
                    >
                      <option value="RSD">RSD</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                    </TextField>
                  </Grid>
                </Grid>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                  }
                  label="Активна"
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
                  <TableCell>Трајање</TableCell>
                  <TableCell>Цена</TableCell>
                  <TableCell>Активна</TableCell>
                  <TableCell>Акције</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Учитавање...</TableCell>
                  </TableRow>
                ) : workshops.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Нема радионица</TableCell>
                  </TableRow>
                ) : (
                  workshops.map((workshop) => (
                    <TableRow key={workshop.id}>
                      <TableCell>{workshop.title || 'Без наслова'}</TableCell>
                      <TableCell>{workshop.duration ? `${workshop.duration} мин` : '-'}</TableCell>
                      <TableCell>
                        {workshop.price ? `${workshop.price} ${workshop.currency || 'RSD'}` : 'Бесплатно'}
                      </TableCell>
                      <TableCell>{workshop.active ? 'Да' : 'Не'}</TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleEdit(workshop)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, id: workshop.id })}
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
        <DialogTitle>Избриши радионицу?</DialogTitle>
        <DialogContent>
          <Typography>Да ли сте сигурни да желите да избришете ову радионицу? Ова акција се не може поништити.</Typography>
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

export default WorkshopsAdmin
