import { useState, useEffect } from 'react'
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
import ImageUpload from '../../components/admin/ImageUpload'
import { cyrlToLatn, latnToCyrl } from '../../utils/transliterate'

function WorkshopsAdmin() {
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
    duration: '',
    maxParticipants: '',
    price: '',
    currency: 'EUR',
    active: true,
  })
  const [editingId, setEditingId] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  const [pageIntroForm, setPageIntroForm] = useState({
    srCyrl: '',
    srLatn: '',
    en: '',
  })

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

  const { data: workshopsPageIntroLocales } = useQuery({
    queryKey: ['admin-workshops-page-intro'],
    queryFn: async () => {
      const response = await api.get('/admin/page-intros/workshops')
      return response.data || {}
    },
  })

  useEffect(() => {
    if (!workshopsPageIntroLocales) return
    setPageIntroForm({
      srCyrl: workshopsPageIntroLocales.srCyrl ?? '',
      srLatn: workshopsPageIntroLocales.srLatn ?? '',
      en: workshopsPageIntroLocales.en ?? '',
    })
  }, [workshopsPageIntroLocales])

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

  const pageIntroMutation = useMutation({
    mutationFn: (body) => api.put('/admin/page-intros/workshops', body),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-workshops-page-intro'])
      queryClient.invalidateQueries(['workshops-page-intro'])
    },
  })

  const handlePageIntroSubmit = (e) => {
    e.preventDefault()
    let { srCyrl, srLatn, en } = pageIntroForm
    if (!srCyrl?.trim() && srLatn?.trim()) {
      srCyrl = latnToCyrl(srLatn)
    }
    if (!srLatn?.trim() && srCyrl?.trim()) {
      srLatn = cyrlToLatn(srCyrl)
    }
    pageIntroMutation.mutate({ srCyrl, srLatn, en })
  }

  const updatePageIntroCyrlLatn = (cyrlValue, latnValue) => {
    setPageIntroForm((prev) => ({ ...prev, srCyrl: cyrlValue, srLatn: latnValue }))
  }

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
      duration: '',
      maxParticipants: '',
      price: '',
      currency: 'EUR',
      active: true,
    })
    setEditingId(null)
  }

  const resolve = (obj, fallback = '') => {
    if (typeof obj === 'string') return obj || fallback
    return obj?.srCyrl ?? obj?.srLatn ?? obj?.en ?? fallback
  }

  const handleEdit = (workshop) => {
    setEditingId(workshop.id)
    setFormData({
      titleSrCyrl: workshop.titleLocales?.srCyrl ?? resolve(workshop.title) ?? '',
      titleSrLatn: workshop.titleLocales?.srLatn ?? '',
      titleEn: workshop.titleLocales?.en ?? '',
      descriptionSrCyrl:
        workshop.descriptionLocales?.srCyrl ?? resolve(workshop.description) ?? '',
      descriptionSrLatn: workshop.descriptionLocales?.srLatn ?? '',
      descriptionEn: workshop.descriptionLocales?.en ?? '',
      contentSrCyrl: workshop.contentLocales?.srCyrl ?? resolve(workshop.content) ?? '',
      contentSrLatn: workshop.contentLocales?.srLatn ?? '',
      contentEn: workshop.contentLocales?.en ?? '',
      coverImage: workshop.coverImage || '',
      duration: workshop.duration ?? '',
      maxParticipants: workshop.maxParticipants ?? '',
      price: workshop.price ?? '',
      currency: workshop.currency || 'EUR',
      active: workshop.active ?? true,
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
    data.duration = formData.duration ? parseInt(formData.duration, 10) : null
    data.maxParticipants = formData.maxParticipants ? parseInt(formData.maxParticipants, 10) : null
    data.price = formData.price ? parseFloat(formData.price) : null

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

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Текст испод наслова на страници радионица
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Приказује се изнад листе радионица. Ако је празно, користи се подразумевани текст са сајта.
          </Typography>
          <form onSubmit={handlePageIntroSubmit}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Ћирилица
            </Typography>
            <TextField
              fullWidth
              label="Опис (ћирилица)"
              value={pageIntroForm.srCyrl}
              onChange={(e) =>
                updatePageIntroCyrlLatn(e.target.value, cyrlToLatn(e.target.value))
              }
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Латиница
            </Typography>
            <TextField
              fullWidth
              label="Опис (латиница)"
              value={pageIntroForm.srLatn}
              onChange={(e) =>
                updatePageIntroCyrlLatn(latnToCyrl(e.target.value), e.target.value)
              }
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Енглески
            </Typography>
            <TextField
              fullWidth
              label="Description (English)"
              value={pageIntroForm.en}
              onChange={(e) => setPageIntroForm((prev) => ({ ...prev, en: e.target.value }))}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="outlined"
              disabled={pageIntroMutation.isPending}
            >
              {pageIntroMutation.isPending ? 'Чување...' : 'Сачувај текст странице'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {editingId ? 'Измени радионицу' : 'Додај нову радионицу'}
              </Typography>
              <form onSubmit={handleSubmit}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Ћирилица (унос се аутоматски пресликава и на латиницу)
                </Typography>
                <TextField
                  fullWidth
                  label="Наслов (ћирилица)"
                  value={formData.titleSrCyrl}
                  onChange={(e) =>
                    updateCyrlAndLatn('title', e.target.value, cyrlToLatn(e.target.value))
                  }
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Опис (ћирилица)"
                  value={formData.descriptionSrCyrl}
                  onChange={(e) =>
                    updateCyrlAndLatn('description', e.target.value, cyrlToLatn(e.target.value))
                  }
                  required
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Садржај (ћирилица)"
                  value={formData.contentSrCyrl}
                  onChange={(e) =>
                    updateCyrlAndLatn('content', e.target.value, cyrlToLatn(e.target.value))
                  }
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                  Латиница (унос се аутоматски пресликава и на ћирилицу)
                </Typography>
                <TextField
                  fullWidth
                  label="Наслов (латиница)"
                  value={formData.titleSrLatn}
                  onChange={(e) =>
                    updateCyrlAndLatn('title', latnToCyrl(e.target.value), e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Опис (латиница)"
                  value={formData.descriptionSrLatn}
                  onChange={(e) =>
                    updateCyrlAndLatn('description', latnToCyrl(e.target.value), e.target.value)
                  }
                  multiline
                  rows={3}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Садржај (латиница)"
                  value={formData.contentSrLatn}
                  onChange={(e) =>
                    updateCyrlAndLatn('content', latnToCyrl(e.target.value), e.target.value)
                  }
                  multiline
                  rows={4}
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
                  rows={3}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Content (English)"
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                  Слике
                </Typography>
                <ImageUpload
                  label="Cover Image"
                  value={formData.coverImage}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
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
                      onChange={(e) =>
                        setFormData({ ...formData, maxParticipants: e.target.value })
                      }
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Цена (EUR)"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Валута"
                      value="EUR"
                      disabled
                      sx={{ '& .MuiInputBase-input': { color: 'text.secondary' } }}
                    />
                  </Grid>
                </Grid>
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
                  <TableCell>Акције</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Учитавање...
                    </TableCell>
                  </TableRow>
                ) : workshops.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Нема радионица
                    </TableCell>
                  </TableRow>
                ) : (
                  workshops.map((workshop) => (
                    <TableRow key={workshop.id}>
                      <TableCell>{workshop.title || 'Без наслова'}</TableCell>
                      <TableCell>{workshop.duration ? `${workshop.duration} мин` : '-'}</TableCell>
                      <TableCell>
                        {workshop.price
                          ? `${workshop.price} ${workshop.currency || 'EUR'}`
                          : 'Бесплатно'}
                      </TableCell>
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
          <Typography>
            Да ли сте сигурни да желите да избришете ову радионицу? Ова акција се не може поништити.
          </Typography>
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
