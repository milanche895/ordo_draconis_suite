import axios from 'axios'

// U developmentu šalji zahteve direktno na backend (8080); u produkciji koristi relativni /api
const baseURL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8080/api' : '/api')

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // FormData: axios 1.x dispatchRequest would otherwise set application/x-www-form-urlencoded after this
  // interceptor, breaking multipart. Setting Content-Type to false skips sending the header so the
  // browser sets multipart/form-data with boundary (see AxiosHeaders.toJSON).
  if (config.data instanceof FormData && config.headers) {
    config.headers.set('Content-Type', false)
  }
  return config
})

export default api
