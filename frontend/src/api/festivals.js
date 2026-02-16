import api from './axios'

export const getFestivals = async (lang = 'sr', script = 'cyrl') => {
  const response = await api.get('/public/festivals', {
    params: { lang, script },
  })
  return response.data
}

export const getFestivalByYear = async (year, lang = 'sr', script = 'cyrl') => {
  const response = await api.get(`/public/festivals/${year}`, {
    params: { lang, script },
  })
  return response.data
}
