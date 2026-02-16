import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
  Stack,
  CircularProgress,
} from '@mui/material'
import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material'
import api from '../../api/axios'

function ImageUpload({ value, onChange, multiple = false, label = 'Upload Image' }) {
  const [preview, setPreview] = useState(value || (multiple ? [] : null))
  const inputIdRef = useRef(`image-upload-${Math.random().toString(36).substr(2, 9)}`)
  const fileInputRef = useRef(null)
  // Ref holds current URLs so parallel uploads always append to latest list (preview state is stale in closure)
  const urlsRef = useRef(multiple ? (Array.isArray(value) ? value : []) : (value || null))
  
  // Sync preview and ref with value prop when it changes externally
  useEffect(() => {
    if (value !== undefined) {
      const v = value || (multiple ? [] : null)
      setPreview(v)
      urlsRef.current = v
    }
  }, [value, multiple])
  
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: (data) => {
      if (multiple) {
        const current = Array.isArray(urlsRef.current) ? urlsRef.current : []
        const newUrls = [...current, data.path]
        urlsRef.current = newUrls
        setPreview(newUrls)
        onChange(newUrls)
      } else {
        setPreview(data.path)
        onChange(data.path)
      }
    },
  })
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        uploadMutation.mutate(file)
      }
    })
  }
  
  const handleRemove = (index) => {
    if (multiple) {
      const newUrls = preview.filter((_, i) => i !== index)
      urlsRef.current = newUrls
      setPreview(newUrls)
      onChange(newUrls)
    } else {
      setPreview(null)
      onChange(null)
    }
  }
  
  const currentValue = preview || (multiple ? [] : null)
  
  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          border: '2px dashed',
          borderColor: 'divider',
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          id={inputIdRef.current}
          type="file"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={uploadMutation.isLoading}
        />
        <Button
          component="span"
          variant="outlined"
          startIcon={uploadMutation.isLoading ? <CircularProgress size={20} /> : <CloudUpload />}
          disabled={uploadMutation.isLoading}
          sx={{ mb: 2 }}
        >
          {uploadMutation.isLoading ? 'Uploading...' : 'Choose Image'}
        </Button>
        
        {uploadMutation.isError && (
          <Typography color="error" variant="body2">
            Upload failed: {uploadMutation.error?.message}
          </Typography>
        )}
      </Paper>
      
      {multiple ? (
        <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
          {(currentValue || []).map((url, index) => (
            <Box key={index} sx={{ position: 'relative', width: 150, height: 150 }}>
              <Box
                component="img"
                src={url}
                alt={`Preview ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemove(index)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper' },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
      ) : currentValue ? (
        <Box sx={{ position: 'relative', mt: 2, maxWidth: 300 }}>
          <Box
            component="img"
            src={currentValue}
            alt="Preview"
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
            }}
          />
          <IconButton
            size="small"
            color="error"
            onClick={() => handleRemove()}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
          <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="body2">No image selected</Typography>
        </Box>
      )}
    </Box>
  )
}

export default ImageUpload
