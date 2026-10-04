import { Outlet } from 'react-router-dom'
import Navbar from '../nav-bar/NavBar'

export default function DashboardLayout({ sidebar }) {
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}') }
    catch { return {} }
  })()

  return (
  <div className="min-h-screen bg-slate-50">
    {sidebar}

    <div className="ml-[70px] flex flex-col min-h-screen">
      <Navbar user={currentUser} />
      <main className="mt-14 p-3 sm:p-5 flex-1 flex flex-col gap-4">
        <Outlet />
      </main>
    </div>
  </div>
)
}