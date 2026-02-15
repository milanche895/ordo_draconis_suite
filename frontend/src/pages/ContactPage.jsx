import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getLanguageFromPath } from '../utils/language'
import api from '../api/axios'

function ContactPage() {
  const location = useLocation()
  const { locale } = getLanguageFromPath(location.pathname)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/public/contact', formData)
      alert(locale === 'en' ? 'Message sent successfully' : 'Порука је успешно послата')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      alert(locale === 'en' ? 'Error sending message' : 'Грешка при слању поруке')
    } finally {
      setSubmitting(false)
    }
  }
  
  const content = {
    sr: {
      title: 'Контакт',
      name: 'Име',
      email: 'Емаил',
      phone: 'Телефон',
      message: 'Порука',
      send: 'Пошаљи',
    },
    'sr-latn': {
      title: 'Kontakt',
      name: 'Ime',
      email: 'Email',
      phone: 'Telefon',
      message: 'Poruka',
      send: 'Pošalji',
    },
    en: {
      title: 'Contact',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      send: 'Send',
    },
  }
  
  const pageContent = content[locale] || content.sr
  
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h2" align="center" sx={{ mb: 6 }}>
          {pageContent.title}
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {locale === 'en' ? 'Contact Information' : 'Контакт информације'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>{locale === 'en' ? 'Email:' : 'Емаил:'}</strong> info@ordodraconis.com
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>{locale === 'en' ? 'Phone:' : 'Телефон:'}</strong> +387 XX XXX XXX
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>{locale === 'en' ? 'Address:' : 'Адреса:'}</strong> Грачаница, Босна и Херцеговина
            </Typography>
            <Typography variant="body1">
              <strong>{locale === 'en' ? 'Working Hours:' : 'Радно време:'}</strong> 09:00 - 18:00
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label={pageContent.name}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="email"
                label={pageContent.email}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={pageContent.phone}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label={pageContent.message}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" size="large" disabled={submitting}>
                {pageContent.send}
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ContactPage
