import api from './axios'

export const getMuseumItems = async (lang = 'sr', script = 'cyrl') => {
  const response = await api.get('/public/museum', {
    params: { lang, script },
  })
  return response.data
}
