import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaClipboardList,
  FaChartBar,
  FaBars,
} from 'react-icons/fa'

const adminNavItems = [
  { to: '/admin',             icon: <FaHome size={18} />,              label: 'Home' },
  { to: '/admin/students',    icon: <FaUserGraduate size={18} />,      label: 'Manage Students' },
  { to: '/admin/teachers',    icon: <FaChalkboardTeacher size={18} />, label: 'Manage Teachers' },
  { to: '/admin/supervisors', icon: <FaUserTie size={18} />,           label: 'Assign Supervisor' },
  { to: '/admin/projects',    icon: <FaClipboardList size={18} />,     label: 'Projects' },
  { to: '/admin/reports',     icon: <FaChartBar size={18} />,          label: 'Reports' },
]

export default function Sidebar({ navItems = adminNavItems }) {
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
        className={`fixed top-0 left-0 h-full z-40 flex flex-col
        bg-white border-r border-slate-100
        shadow-sm transition-all duration-300 ease-in-out overflow-hidden
        ${expanded ? 'w-60' : 'w-[72px]'}`}
      >

        {/* Top Section */}
        <div className="flex items-center h-16 px-3 border-b border-slate-100 shrink-0 gap-3">

          <button
            onClick={() => setExpanded(p => !p)}
            className="w-10 h-10 flex items-center justify-center rounded-2xl
            text-slate-500 hover:bg-slate-100 hover:text-indigo-600
            transition-all duration-300 shrink-0"
            aria-label="Toggle sidebar"
          >
            <FaBars size={16} />
          </button>

          <div
            className={`flex items-center gap-2 overflow-hidden transition-all duration-300
            ${expanded ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}
          >
            <div
              className="w-9 h-9 rounded-2xl
              bg-gradient-to-br from-indigo-500 to-purple-600
              flex items-center justify-center shrink-0 shadow-sm"
            >
              <span className="text-white font-bold text-xs">FYP</span>
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                FYP Management
              </span>

              <span className="text-[11px] text-indigo-500 font-medium">
                Dashboard System
              </span>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-2 px-2 mt-4 flex-1">

          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `group relative flex items-center
                gap-2 px-2 h-[40px]
                rounded-2xl font-medium
                transition-all duration-300

                ${isActive
                  ? 'bg-[#eef4ff] text-indigo-600 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                }`
              }
            >

              {/* Icon */}
              <span
                className={`flex items-center justify-center
                min-w-[42px] h-[42px] rounded-xl transition-all duration-300`}
              >
                {icon}
              </span>

              {/* Label */}
              <span
                className={`whitespace-nowrap text-sm overflow-hidden transition-all duration-300
                ${expanded ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}
              >
                {label}
              </span>

              {/* Tooltip */}
              {!expanded && (
                <span
                  className="pointer-events-none absolute left-[78px]
                  bg-slate-800 text-white text-xs
                  px-3 py-1.5 rounded-lg whitespace-nowrap
                  opacity-0 group-hover:opacity-100
                  transition-all duration-200 z-50"
                >
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