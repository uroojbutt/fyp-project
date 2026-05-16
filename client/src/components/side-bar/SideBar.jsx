import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  FaHome, FaUserGraduate, FaChalkboardTeacher,
  FaUserTie, FaClipboardList, FaChartBar, FaBars,
} from 'react-icons/fa'

const navItems = [
  { to: '/admin',             icon: <FaHome />,              label: 'Home' },
  { to: '/admin/students',    icon: <FaUserGraduate />,      label: 'Manage Students' },
  { to: '/admin/teachers',    icon: <FaChalkboardTeacher />, label: 'Manage Teachers' },
  { to: '/admin/supervisors', icon: <FaUserTie />,           label: 'Assign Supervisor' },
  { to: '/admin/projects',    icon: <FaClipboardList />,     label: 'Projects' },
  { to: '/admin/reports',     icon: <FaChartBar />,          label: 'Reports' },
]

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setExpanded(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-white border-r border-slate-100
          shadow-md transition-all duration-300 ease-in-out overflow-hidden
          ${expanded ? 'w-56' : 'w-[52px]'}`}
      >
        {/* Top bar with hamburger + logo */}
        <div className="flex items-center h-14 px-3 border-b border-slate-100 shrink-0 gap-2">
          <button
            onClick={() => setExpanded(p => !p)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500
                       hover:bg-indigo-50 hover:text-indigo-600 transition shrink-0"
            aria-label="Toggle sidebar"
          >
            <FaBars size={15} />
          </button>

          <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300
            ${expanded ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600
                            flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-[10px]">FYP</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-700 leading-tight whitespace-nowrap">
              FYP Mgmt <span className="text-indigo-500">System</span>
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-0.5 px-1.5 mt-3 flex-1">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-2 py-2.5 rounded-xl font-medium
                 transition-all group
                 ${isActive
                   ? 'bg-indigo-50 text-indigo-600'
                   : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'}`}
            >
              <span className="text-[15px] shrink-0">{icon}</span>
              <span className={`whitespace-nowrap text-xs overflow-hidden transition-all duration-300
                ${expanded ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}>
                {label}
              </span>
              {!expanded && (
                <span className="pointer-events-none absolute left-[52px] bg-slate-800 text-white
                  text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100
                  transition-opacity duration-150 z-50">
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="h-4" />
      </aside>
    </>
  )
}