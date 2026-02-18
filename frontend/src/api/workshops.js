import api from './axios'

export const getWorkshops = async (lang = 'sr', script = 'cyrl') => {
  const response = await api.get('/public/workshops', {
    params: { lang, script },
  })
  return response.data
}
