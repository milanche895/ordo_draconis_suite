import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import api from '../../api/axios'
import ImageUpload from '../../components/admin/ImageUpload'
import PdfUpload from '../../components/admin/PdfUpload'
import { cyrlToLatn, latnToCyrl } from '../../utils/transliterate'

function KrcmaAdmin() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    srCyrl: '',
    srLatn: '',
    en: '',
    galleryImages: [],
    menuPdfUrl: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-krcma-page'],
    queryFn: async () => {
      const response = await api.get('/admin/page-intros/krcma')
      return response.data || {}
    },
  })

  useEffect(() => {
    if (!data) return
    const desc = data.description || {}
    setForm({
      srCyrl: desc.srCyrl ?? '',
      srLatn: desc.srLatn ?? '',
      en: desc.en ?? '',
      galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : [],
      menuPdfUrl: data.menuPdfUrl ?? '',
    })
  }, [data])

  const mutation = useMutation({
    mutationFn: (body) => api.put('/admin/page-intros/krcma', body),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-krcma-page'])
      queryClient.invalidateQueries(['krcma-page'])
    },
  })

  const updateCyrlLatn = (cyrlValue, latnValue) => {
    setForm((prev) => ({ ...prev, srCyrl: cyrlValue, srLatn: latnValue }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let { srCyrl, srLatn, en, galleryImages, menuPdfUrl } = form
    if (!srCyrl?.trim() && srLatn?.trim()) {
      srCyrl = latnToCyrl(srLatn)
    }
    if (!srLatn?.trim() && srCyrl?.trim()) {
      srLatn = cyrlToLatn(srCyrl)
    }
    mutation.mutate({
      description: { srCyrl, srLatn, en },
      galleryImages: galleryImages || [],
      menuPdfUrl: menuPdfUrl || null,
    })
  }

  if (isLoading && !data) {
    return <Typography>Учитавање...</Typography>
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Крчма — садржај странице
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Кратак опис, галерија и PDF менија приказују се на јавној страници /krcma (или /en/tavern).
          </Typography>
          <form onSubmit={handleSubmit}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Ћирилица
            </Typography>
            <TextField
              fullWidth
              label="Кратак опис (ћирилица)"
              value={form.srCyrl}
              onChange={(e) => updateCyrlLatn(e.target.value, cyrlToLatn(e.target.value))}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Латиница
            </Typography>
            <TextField
              fullWidth
              label="Kratak opis (latinica)"
              value={form.srLatn}
              onChange={(e) => updateCyrlLatn(latnToCyrl(e.target.value), e.target.value)}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Енглески
            </Typography>
            <TextField
              fullWidth
              label="Short description (English)"
              value={form.en}
              onChange={(e) => setForm((prev) => ({ ...prev, en: e.target.value }))}
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />

            <Box sx={{ mb: 3 }}>
              <ImageUpload
                label="Слике крчме (карусел)"
                multiple
                value={form.galleryImages}
                onChange={(urls) => setForm((prev) => ({ ...prev, galleryImages: urls || [] }))}
              />
            </Box>

            <PdfUpload
              label="Мени (PDF)"
              value={form.menuPdfUrl || null}
              onChange={(url) => setForm((prev) => ({ ...prev, menuPdfUrl: url || '' }))}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Чување...' : 'Сачувај'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default KrcmaAdmin
