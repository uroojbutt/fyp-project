import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/Login'
import Register from './pages/sign-up/Signup'
import ForgotPassword from './pages/forgot-password/ForgotPassword'

import AdminRoute from './components/admin-route/AdminRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import Sidebar from './components/side-bar/SideBar'
import { adminLinks } from './components/side-bar-links/SideBarLinks'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminStudents from './pages/admin/AdminStudents'
import AdminTeachers from './pages/admin/AdminTeachers'
import AdminAssignments from './pages/admin/AdminAssignments'
import AdminDeadlines from './pages/admin/AdminDeadlines'
import AdminFiles from './pages/admin/AdminFiles'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin area: one guard + one layout, pages render inside <Outlet /> */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <DashboardLayout sidebar={<Sidebar links={adminLinks} />} />

          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="assignments" element={<AdminAssignments />} /> 
        <Route path="deadlines" element={<AdminDeadlines />}/>
        <Route path="files" element={<AdminFiles />}/>
      </Route>
    </Routes>
  )
}