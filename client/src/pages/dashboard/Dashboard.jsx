import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(storedUser))
    const timer = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  const greeting = () => {
    const h = time.getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const stats = [
    { label: 'FYP Status',  value: 'In Progress',  icon: '📋', ring: 'ring-amber-500/30',   text: 'text-amber-400',   bg: 'bg-amber-500/10'   },
    { label: 'Supervisor',  value: 'Not Assigned', icon: '👨‍🏫', ring: 'ring-indigo-500/30',  text: 'text-indigo-400',  bg: 'bg-indigo-500/10'  },
    { label: 'Submissions', value: '0 / 4',        icon: '📤', ring: 'ring-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Deadline',    value: 'Dec 2025',     icon: '📅', ring: 'ring-rose-500/30',    text: 'text-rose-400',    bg: 'bg-rose-500/10'    },
  ]

  const announcements = [
    { dot: 'bg-amber-400',   text: 'FYP proposal submission deadline extended to June 30.' },
    { dot: 'bg-indigo-400',  text: 'Supervisor allocation will be announced next week.' },
    { dot: 'bg-emerald-400', text: 'Orientation session scheduled for all FYP students.' },
  ]

  const actions = ['Submit Proposal', 'View Feedback', 'Message Supervisor', 'Upload Report']

  return (
    <div className="min-h-screen bg-[#111111] text-slate-200 font-sans relative overflow-hidden">

      {/* Ambient blobs */}
      <div className="pointer-events-none fixed -top-20 -right-20 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-24 -left-16 w-80 h-80 rounded-full bg-emerald-600/15 blur-3xl" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 bg-white/[0.03] border-b border-white/[0.07] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <span className="text-sm font-bold tracking-tight text-slate-100 hidden sm:block">
            FYP Management System
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center font-bold text-sm text-white shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <span className="text-sm text-slate-400 hidden sm:block">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 rounded-lg border border-white/10 text-slate-400 text-xs font-medium hover:bg-white/5 hover:text-slate-200 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 relative z-10 space-y-7">

        {/* Hero Card */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 via-transparent to-emerald-600/8 backdrop-blur-sm p-8 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }}
          />
          <div className="space-y-2 relative">
            <p className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
              {greeting()}
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-50">
              Hello, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Welcome to your{' '}
              <span className="text-slate-200 font-semibold">Student Dashboard</span>.
              Track your Final Year Project, manage submissions, and meet every deadline.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-2 bg-white/[0.05] border border-white/10 rounded-xl px-7 py-5">
            <span className="text-4xl">🎓</span>
            <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Student</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-4 rounded-xl bg-white/[0.03] border border-white/[0.07] ring-1 ${s.ring} p-5 hover:bg-white/[0.06] transition-all duration-200`}
            >
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center text-xl flex-shrink-0`}>
                {s.icon}
              </div>
              <div>
                <p className={`text-sm font-bold ${s.text}`}>{s.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Announcements */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span>📌</span> Recent Announcements
            </h3>
            <div className="space-y-3">
              {announcements.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${a.dot}`} />
                  <p className="text-xs text-slate-400 leading-relaxed">{a.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span>✅</span> Quick Actions
            </h3>
            <div className="space-y-2.5">
              {actions.map((action) => (
                <button
                  key={action}
                  className="w-full text-left px-4 py-3 rounded-xl border border-white/[0.07] bg-white/[0.02] text-slate-300 text-xs font-medium hover:bg-indigo-600/10 hover:border-indigo-500/30 hover:text-indigo-300 transition-all duration-200 flex items-center justify-between group"
                >
                  {action}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400">→</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}