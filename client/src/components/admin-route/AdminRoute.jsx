import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }) {
  let user = {}
  try { user = JSON.parse(localStorage.getItem('user') || '{}') }
  catch { user = {} }

  if (!user?.role) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/login" replace />

  return children
}