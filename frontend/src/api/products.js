import api from './axios'

export const getProducts = async (lang = 'sr', script = 'cyrl') => {
  const response = await api.get('/public/products', {
    params: { lang, script },
  })
  return response.data
}

export const getProductBySlug = async (slug, lang = 'sr', script = 'cyrl') => {
  const response = await api.get(`/public/products/${slug}`, {
    params: { lang, script },
  })
  return response.data
}
