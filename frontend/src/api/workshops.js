import api from './axios'

export const getWorkshops = async (lang = 'sr', script = 'cyrl') => {
  const response = await api.get('/public/workshops', {
    params: { lang, script },
  })
  return response.data
}

export const getWorkshopsPageIntro = async (lang = 'sr', script = 'cyrl') => {
  const response = await api.get('/public/page-intros/workshops', {
    params: { lang, script },
  })
  return response.data
}
