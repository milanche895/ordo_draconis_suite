import api from './axios'

export const getKrcmaPage = async (lang = 'sr', script = 'cyrl') => {
  const response = await api.get('/public/krcma', {
    params: { lang, script },
  })
  return response.data
}
