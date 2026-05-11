import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/login'
import Register from './pages/sign-up/Signup'
import ForgotPassword from './pages/forgot-password/ForgotPassword'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  )
}