import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Box, Button, Typography, Paper, CircularProgress, Link } from '@mui/material'
import { CloudUpload, PictureAsPdf } from '@mui/icons-material'
import api from '../../api/axios'

const dbg = (...args) => {
  if (import.meta.env.DEV) console.log('[PdfUpload]', ...args)
}

/** Mora biti u skladu sa spring.servlet.multipart.max-file-size */
const MAX_PDF_BYTES = 50 * 1024 * 1024

function PdfUpload({ value, onChange, label = 'PDF' }) {
  const [preview, setPreview] = useState(value || null)
  const [clientError, setClientError] = useState(null)
  const inputIdRef = useRef(`pdf-upload-${Math.random().toString(36).substr(2, 9)}`)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (value !== undefined) {
      setPreview(value || null)
    }
  }, [value])

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      dbg('upload start', {
        name: file.name,
        size: file.size,
        type: file.type,
        baseURL: api.defaults.baseURL,
      })
      const formData = new FormData()
      formData.append('file', file)
      const token = localStorage.getItem('accessToken')
      try {
        const response = await api.post('/admin/media/upload', formData, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        dbg('upload response', response.status, response.data)
        return response.data
      } catch (err) {
        const ax = err
        const detail = {
          message: ax?.message,
          code: ax?.code,
          name: ax?.name,
          status: ax?.response?.status,
          statusText: ax?.response?.statusText,
          data: ax?.response?.data,
        }
        console.error('[PdfUpload] upload failed', detail, err)
        throw err
      }
    },
    onSuccess: (data) => {
      dbg('onSuccess', data)
      setPreview(data.path)
      onChange(data.path)
    },
  })

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setClientError(null)
    const ok =
      file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '')
    if (!ok) {
      e.target.value = ''
      return
    }
    if (file.size > MAX_PDF_BYTES) {
      const mb = (MAX_PDF_BYTES / (1024 * 1024)).toFixed(0)
      setClientError(`Фајл је превелики (максимум ${mb} MB).`)
      e.target.value = ''
      return
    }
    uploadMutation.mutate(file)
    e.target.value = ''
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
  }

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
          accept="application/pdf,.pdf"
          style={{ display: 'none' }}
          id={inputIdRef.current}
          type="file"
          onChange={handleFileChange}
          disabled={uploadMutation.isLoading}
        />
        <Button
          component="span"
          variant="outlined"
          startIcon={uploadMutation.isLoading ? <CircularProgress size={20} /> : <CloudUpload />}
          disabled={uploadMutation.isLoading}
        >
          {uploadMutation.isLoading ? 'Отпремање...' : 'Изабери PDF'}
        </Button>
        {(clientError || uploadMutation.isError) && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {clientError ||
              (uploadMutation.error?.response?.status != null
                ? `${uploadMutation.error.response.status} ${uploadMutation.error.response.statusText || ''} — ${uploadMutation.error?.message || ''}`
                : uploadMutation.error?.message)}
          </Typography>
        )}
      </Paper>
      {preview && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <PictureAsPdf color="error" />
          <Link href={preview} target="_blank" rel="noopener noreferrer">
            Отвори PDF
          </Link>
          <Button size="small" color="error" variant="outlined" onClick={handleRemove}>
            Уклони
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default PdfUpload
