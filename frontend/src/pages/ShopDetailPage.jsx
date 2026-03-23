import { Box, Container, Typography, Button, CardMedia, TextField } from '@mui/material'
import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProductBySlug } from '../api/products'
import { getLanguageFromPath, getPathPrefix } from '../utils/language'
import { useTranslation } from 'react-i18next'
import { cyrlToLatn } from '../utils/transliterate'

function ShopDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { lang, script, locale } = getLanguageFromPath(location.pathname)
  const prefix = getPathPrefix(locale)
  const srText = (cyr) => (locale === 'sr-latn' ? cyrlToLatn(cyr) : cyr)
  const [quantity, setQuantity] = useState(1)
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug, lang, script],
    queryFn: () => getProductBySlug(slug, lang, script),
  })
  
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item) => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }
    
    localStorage.setItem('cart', JSON.stringify(cart))
    alert(locale === 'en' ? 'Added to cart' : srText('Додато у корпу'))
  }
  
  if (isLoading) {
    return (
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography>{locale === 'en' ? 'Loading...' : srText('Učitavanje...')}</Typography>
        </Container>
      </Box>
    )
  }
  
  if (!product) {
    return (
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography>{locale === 'en' ? 'Product not found' : srText('Производ није пронађен')}</Typography>
        </Container>
      </Box>
    )
  }
  
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Button onClick={() => navigate(`${prefix}/${locale === 'en' ? 'shop' : 'prodavnica'}`)} sx={{ mb: 4 }}>
          {t('common.back')}
        </Button>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            {product.images && product.images.length > 0 && (
              <CardMedia
                component="img"
                image={product.images[0]}
                alt={product.name}
                sx={{ borderRadius: 2, width: '100%' }}
              />
            )}
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ mb: 2 }}>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
              {product.price} {product.currency || 'EUR'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, whiteSpace: 'pre-line' }}>
              {product.description}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
              <TextField
                type="number"
                label={locale === 'en' ? 'Quantity' : srText('Количина')}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1 }}
                sx={{ width: 120 }}
              />
              <Button variant="contained" size="large" onClick={addToCart}>
                {locale === 'en' ? 'Add to Cart' : srText('Додај у корпу')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default ShopDetailPage
