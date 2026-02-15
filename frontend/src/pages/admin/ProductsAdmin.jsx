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
} from '@mui/material'
import api from '../../api/axios'
import ImageUpload from '../../components/admin/ImageUpload'

function ProductsAdmin() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    nameSrCyrl: '',
    descriptionSrCyrl: '',
    price: '',
    currency: 'RSD',
    images: [],
    active: true,
    generateEn: false,
  })
  const [editingId, setEditingId] = useState(null)
  
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
      setFormData({
        nameSrCyrl: '',
        descriptionSrCyrl: '',
        price: '',
        currency: 'RSD',
        images: [],
        active: true,
        generateEn: false,
      })
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products'])
      setEditingId(null)
      setFormData({
        nameSrCyrl: '',
        descriptionSrCyrl: '',
        price: '',
        currency: 'RSD',
        images: [],
        active: true,
        generateEn: false,
      })
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
                <TextField
                  fullWidth
                  label="Name (Cyrillic)"
                  value={formData.nameSrCyrl}
                  onChange={(e) => setFormData({ ...formData, nameSrCyrl: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Description (Cyrillic)"
                  value={formData.descriptionSrCyrl}
                  onChange={(e) => setFormData({ ...formData, descriptionSrCyrl: e.target.value })}
                  required
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                  }
                  label="Active"
                  sx={{ mb: 2 }}
                />
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
                        nameSrCyrl: '',
                        descriptionSrCyrl: '',
                        price: '',
                        currency: 'RSD',
                        active: true,
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
                            nameSrCyrl: item.name || '',
                            descriptionSrCyrl: item.description || '',
                            price: item.price?.toString() || '',
                            currency: item.currency || 'RSD',
                            active: item.active !== undefined ? item.active : true,
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
