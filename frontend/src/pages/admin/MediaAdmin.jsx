import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, Button, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material'
import api from '../../api/axios'

function MediaAdmin() {
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState(null)
  
  const { data: media } = useQuery({
    queryKey: ['admin-media'],
    queryFn: async () => {
      const response = await api.get('/admin/media')
      return response.data
    },
  })
  
  const uploadMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData()
      formData.append('file', file)
      return api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-media'])
      setSelectedFile(null)
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-media'])
    },
  })
  
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }
  
  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile)
    }
  }
  
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Media Library
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || uploadMutation.isLoading}
          sx={{ ml: 2 }}
        >
          {uploadMutation.isLoading ? 'Uploading...' : 'Upload'}
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {media && media.length > 0 ? (
          media.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.path}
                  alt={item.originalFilename}
                />
                <CardContent>
                  <Typography variant="body2" noWrap>
                    {item.originalFilename}
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      if (window.confirm('Delete this media?')) {
                        deleteMutation.mutate(item.id)
                      }
                    }}
                    sx={{ mt: 1 }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography color="text.secondary">No media files</Typography>
        )}
      </Grid>
    </Box>
  )
}

export default MediaAdmin
