import api from './axios'

export const getAlbums = async (lang = 'sr', script = 'cyrl') => {
  const response = await api.get('/public/albums', {
    params: { lang, script },
  })
  return response.data
}

export const getAlbumById = async (id, lang = 'sr', script = 'cyrl') => {
  const response = await api.get(`/public/albums/${id}`, {
    params: { lang, script },
  })
  return response.data
}
