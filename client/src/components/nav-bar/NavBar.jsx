import { useState, useRef, useEffect } from 'react'
import { FaChevronDown, FaSignOutAlt } from 'react-icons/fa'

export default function Navbar({ user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useRef(null)

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AD'

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <header className="fixed top-0 left-[52px] right-0 h-14 bg-white border-b border-slate-100 z-20
                       flex items-center justify-between px-4 sm:px-6 shadow-sm">

      {/* Left: Logo circle + Project Name */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600
                        flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xs">FYP</span>
        </div>
        <span className="font-semibold text-slate-700 text-sm hidden sm:block tracking-wide">
          Final Year Project Management System
        </span>
        <span className="font-semibold text-slate-700 text-sm sm:hidden">FYP System</span>
      </div>

      {/* Right: Admin avatar + name + dropdown */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setDropdownOpen(p => !p)}
          className="flex items-center gap-2 hover:bg-slate-50 rounded-xl px-2 py-1.5 transition"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
                          flex items-center justify-center text-white font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-700 leading-none">{user?.name || 'Admin'}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 capitalize">{user?.role || 'Admin'}</p>
          </div>
          <FaChevronDown size={11} className="text-slate-400 hidden sm:block" />
        </button>

        {/* Dropdown — matches picture 3 */}
        {dropdownOpen && (
          <div className="absolute right-0 top-12 w-60 bg-white rounded-xl shadow-xl border border-slate-100
                          py-3 z-50 animate-fade-in">
            <div className="flex items-center gap-3 px-4 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600
                              flex items-center justify-center text-white font-bold text-sm shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{user?.name || 'Admin'}</p>
                <p className="text-xs text-slate-400">{user?.email || ''}</p>
                <p className="text-xs text-indigo-500 capitalize font-medium">{user?.role || 'Admin'}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-4 py-2.5 mt-1 text-sm text-red-500
                         hover:bg-red-50 transition text-left"
            >
              <FaSignOutAlt size={13} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}