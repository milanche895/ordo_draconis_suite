import api from './axios'

export const getGalleryAdminAlbums = async () => {
  const response = await api.get('/admin/gallery/albums')
  return response.data
}

export const createCustomGalleryAlbum = async (data) => {
  const response = await api.post('/admin/gallery/albums/custom', data)
  return response.data
}

export const updateCustomGalleryAlbum = async (id, data) => {
  const response = await api.put(`/admin/gallery/albums/custom/${id}`, data)
  return response.data
}

export const deleteCustomGalleryAlbum = async (id) => {
  const response = await api.delete(`/admin/gallery/albums/custom/${id}`)
  return response.data
}

export const updateDefaultGalleryAlbumImages = async (key, images) => {
  const response = await api.put(`/admin/gallery/albums/default/${key}/images`, images)
  return response.data
}