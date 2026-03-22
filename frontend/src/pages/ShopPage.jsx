import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/products'
import { useNavigate, useLocation } from 'react-router-dom'
import { getLanguageFromPath, getPathPrefix } from '../utils/language'
import { useTranslation } from 'react-i18next'

function ShopPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { lang, script, locale } = getLanguageFromPath(location.pathname)
  const prefix = getPathPrefix(locale)
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', lang, script],
    queryFn: () => getProducts(lang, script),
  })
  
  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Typography variant="h2" align="center" sx={{ mb: 8 }}>
          {locale === 'en' ? 'Souvenir Shop' : 'Продавница сувенира'}
        </Typography>
        
        {isLoading ? (
          <Typography align="center">Loading...</Typography>
        ) : products && products.length > 0 ? (
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card sx={{ height: '100%', cursor: 'pointer' }}>
                  {product.images && product.images.length > 0 && (
                    <CardMedia
                      component="img"
                      height="250"
                      image={product.images[0]}
                      alt={product.name}
                      onClick={() => navigate(`${prefix}/${locale === 'en' ? 'shop' : 'prodavnica'}/${product.slug}`)}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        {product.price} {product.currency || 'EUR'}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`${prefix}/${locale === 'en' ? 'shop' : 'prodavnica'}/${product.slug}`)}
                      >
                        {locale === 'en' ? 'View' : 'Погледај'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center" color="text.secondary">
            {locale === 'en' ? 'No products available' : 'Нема доступних производа'}
          </Typography>
        )}
      </Container>
    </Box>
  )
}

export default ShopPage
