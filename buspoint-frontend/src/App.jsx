import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import RoutesPage from './pages/Routes'
import BuyTicket from './pages/BuyTicket'
import MyTickets from './pages/MyTickets'
import Admin from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/routes" replace />} />

          <Route path="/routes" element={
            <ProtectedRoute>
              <Layout><RoutesPage /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/buy/:id" element={
            <ProtectedRoute>
              <Layout><BuyTicket /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/tickets" element={
            <ProtectedRoute>
              <Layout><MyTickets /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute>
              <Layout><Admin /></Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
