import axios from 'axios'
import { auth } from '../firebase'

const API_URL = 'https://buspoint-api-production.up.railway.app'

const api = axios.create({ baseURL: API_URL })

// Attach Firebase token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Routes
export const getRoutes = () => api.get('/api/routes')
export const getRouteById = (id) => api.get(`/api/routes/${id}`)

// Tickets
export const buyTicket = (data) => api.post('/api/tickets', data)
export const getMyTickets = () => api.get('/api/tickets/my')
export const cancelTicket = (id) => api.patch(`/api/tickets/${id}/cancel`)

// Admin stats
export const getGlobalStats = () => api.get('/api/admin/stats')
export const getStatsByRoute = (id) => api.get(`/api/admin/stats/route/${id}`)
export const getStatsByRange = (from, to) =>
  api.get(`/api/admin/stats/range?from=${from}&to=${to}`)

export default api
