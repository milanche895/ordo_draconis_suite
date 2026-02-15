import api from './axios'

export const getNews = async (lang = 'sr', script = 'cyrl', page = 0, size = 10) => {
  const response = await api.get('/public/news', {
    params: { lang, script, page, size },
  })
  return response.data
}

export const getNewsBySlug = async (slug, lang = 'sr', script = 'cyrl') => {
  const response = await api.get(`/public/news/${slug}`, {
    params: { lang, script },
  })
  return response.data
}
