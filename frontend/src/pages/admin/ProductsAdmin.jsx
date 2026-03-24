import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, Button, Card, CardContent, TextField, Typography, Grid } from '@mui/material'
import api from '../../api/axios'
import { cyrlToLatn, latnToCyrl } from '../../utils/transliterate'

function ProductsAdmin() {
  const queryClient = useQueryClient()
  const emptyForm = () => ({
    nameSrCyrl: '',
    nameSrLatn: '',
    nameEn: '',
    descriptionSrCyrl: '',
    descriptionSrLatn: '',
    descriptionEn: '',
    price: '',
    currency: 'EUR',
    images: [],
    active: true,
  })
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const updateCyrlAndLatn = (field, cyrlValue, latnValue) => {
    const updates = {}
    if (field === 'name') {
      updates.nameSrCyrl = cyrlValue
      updates.nameSrLatn = latnValue
    } else if (field === 'description') {
      updates.descriptionSrCyrl = cyrlValue
      updates.descriptionSrLatn = latnValue
    }
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const resolve = (obj, fallback = '') => {
    if (typeof obj === 'string') return obj || fallback
    return obj?.srCyrl ?? obj?.srLatn ?? obj?.en ?? fallback
  }

  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const response = await api.get('/admin/products')
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/admin/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products'])
      setFormData(emptyForm())
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products'])
      setEditingId(null)
      setFormData(emptyForm())
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products'])
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...formData, price: parseFloat(formData.price) }
    if (!data.nameSrCyrl?.trim() && data.nameSrLatn?.trim()) {
      data.nameSrCyrl = latnToCyrl(data.nameSrLatn)
    }
    if (!data.descriptionSrCyrl?.trim() && data.descriptionSrLatn?.trim()) {
      data.descriptionSrCyrl = latnToCyrl(data.descriptionSrLatn)
    }
    if (!data.nameSrLatn?.trim() && data.nameSrCyrl?.trim()) {
      data.nameSrLatn = cyrlToLatn(data.nameSrCyrl)
    }
    if (!data.descriptionSrLatn?.trim() && data.descriptionSrCyrl?.trim()) {
      data.descriptionSrLatn = cyrlToLatn(data.descriptionSrCyrl)
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
        Manage Products
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {editingId ? 'Edit Product' : 'Create Product'}
              </Typography>
              <form onSubmit={handleSubmit}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Ћирилица (унос се аутоматски пресликава и на латиницу)
                </Typography>
                <TextField
                  fullWidth
                  label="Name (Cyrillic)"
                  value={formData.nameSrCyrl}
                  onChange={(e) =>
                    updateCyrlAndLatn('name', e.target.value, cyrlToLatn(e.target.value))
                  }
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description (Cyrillic)"
                  value={formData.descriptionSrCyrl}
                  onChange={(e) =>
                    updateCyrlAndLatn('description', e.target.value, cyrlToLatn(e.target.value))
                  }
                  required
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                  Латиница (унос се аутоматски пресликава и на ћирилицу)
                </Typography>
                <TextField
                  fullWidth
                  label="Name (Latin)"
                  value={formData.nameSrLatn}
                  onChange={(e) =>
                    updateCyrlAndLatn('name', latnToCyrl(e.target.value), e.target.value)
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description (Latin)"
                  value={formData.descriptionSrLatn}
                  onChange={(e) =>
                    updateCyrlAndLatn('description', latnToCyrl(e.target.value), e.target.value)
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
                  label="Name (English)"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description (English)"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  required
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
            Existing Products
          </Typography>
          {products && products.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {products.map((item) => (
                <Card key={item.id}>
                  <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="body2">
                      {item.price} {item.currency}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setEditingId(item.id)
                          setFormData({
                            nameSrCyrl: item.nameLocales?.srCyrl ?? resolve(item.name) ?? '',
                            nameSrLatn: item.nameLocales?.srLatn ?? '',
                            nameEn: item.nameLocales?.en ?? '',
                            descriptionSrCyrl:
                              item.descriptionLocales?.srCyrl ?? resolve(item.description) ?? '',
                            descriptionSrLatn: item.descriptionLocales?.srLatn ?? '',
                            descriptionEn: item.descriptionLocales?.en ?? '',
                            price: item.price?.toString() || '',
                            currency: item.currency || 'EUR',
                            images: item.images || [],
                            active: item.active !== undefined ? item.active : true,
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
                          if (window.confirm('Delete this product?')) {
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
            <Typography color="text.secondary">No products</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProductsAdmin
