import { NavLink } from 'react-router-dom'

export default function Sidebar({ links = [] }) {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[70px] bg-indigo-600 border-r border-indigo-700/50
                      pt-20 flex flex-col items-center gap-3 z-50">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          title={l.label}
          className={({ isActive }) =>
            `w-11 h-11 flex items-center justify-center rounded-xl text-xl transition-all duration-200
             ${isActive ? 'bg-white text-indigo-600 shadow-md font-semibold' : 'text-indigo-100 hover:text-white hover:bg-indigo-500/50'}`
          }
        >
          {l.icon}
        </NavLink>
      ))}
    </aside>
  )
}