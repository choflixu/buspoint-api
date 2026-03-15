import axios from 'axios'
import { auth } from '../firebase'

const API_URL = 'https://buspoint-api-production.up.railway.app'

const api = axios.create({ baseURL: API_URL })

// Guarda el JWT token del backend
export const setJwtToken = (token) => {
    if (token) localStorage.setItem('jwt_token', token)
    else localStorage.removeItem('jwt_token')
}

export const getJwtToken = () => localStorage.getItem('jwt_token')

// Attach token to every request — JWT primero, Firebase si no hay JWT
api.interceptors.request.use(async (config) => {
    const jwt = getJwtToken()
    if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`
    } else {
        const user = auth.currentUser
        if (user) {
            const token = await user.getIdToken()
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config
})

// Auth backend
export const loginBackend = (email, password) =>
    api.post('/api/auth/login', { email, password })

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