import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/Login'
import Register from './pages/sign-up/Signup'
import ForgotPassword from './pages/forgot-password/ForgotPassword'

import AdminRoute from './components/admin-route/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'


// Simple protected route — redirects to /login if no token found
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />



      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />

    </Routes>
  )
}