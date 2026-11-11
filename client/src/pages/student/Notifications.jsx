import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaCheckDouble,
  FaRegBell,
  FaRegCheckCircle,
  FaRegClock,
  FaRegCommentDots,
  FaTimes,
  FaExclamationCircle
} from 'react-icons/fa'
import useFetch from '../../hooks/use-fetch'
import { fetchNotifications } from '../../services/student-service'
import { timeAgo } from '../../utils/format-date'
import BaseCard from '../../components/base-card/BaseCard'
import StatCard from '../../components/stat-card/StatCard'
import EmptyState from '../../components/empty-state/EmptyState'
const TYPE_META = {
  feedback: { label: 'Feedback', icon: FaRegCommentDots, tone: 'bg-blue-50 text-blue-600' },
  approval: { label: 'Approval', icon: FaRegCheckCircle, tone: 'bg-green-50 text-green-600' },
  deadline: { label: 'Deadline', icon: FaRegClock, tone: 'bg-amber-50 text-amber-600' },
  system: { label: 'System', icon: FaRegBell, tone: 'bg-slate-100 text-slate-500' },
}
 
const WEEK_MS = 7 * 86_400_000
 
const groupByDay = (list) => {
  const today = new Date().toDateString()
  const groups = { Today: [], Earlier: [] }
  list.forEach((n) =>
    (new Date(n.createdAt).toDateString() === today ? groups.Today : groups.Earlier).push(n)
  )
  return Object.entries(groups).filter(([, group]) => group.length > 0)
}
 
const Skeleton = () => (
  <div className="space-y-3" aria-hidden="true">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
    ))}
  </div>
)
 
const Notifications = () => {
  const navigate = useNavigate()
  const { data, setData, loading, error, reload } = useFetch(fetchNotifications)
  const items = data ?? []
  const unreadCount = items.filter((n) => !n.read).length
 
  const stats = [
    { label: 'Total', value: items.length, icon: <FaRegBell />, bg: '#d2e3f9ff', iconColor: 'text-blue-600' },
    { label: 'Unread', value: unreadCount, icon: <FaExclamationCircle />, bg: '#f9c9bbff', iconColor: 'text-red-600' },
    {
      label: 'High Priority',
      value: items.filter((n) => n.priority === 'high' && !n.read).length,
      icon: <FaRegClock />,
      bg: '#fef9bdff',
      iconColor: 'text-amber-600',
    },
    {
      label: 'This Week',
      value: items.filter((n) => Date.now() - new Date(n.createdAt).getTime() < WEEK_MS).length,
      icon: <FaRegCheckCircle />,
      bg: '#c8fad7ff',
      iconColor: 'text-green-600',
    },
  ]
 
  const groups = useMemo(() => groupByDay(items), [items])
 
  const markRead = (id) =>
    setData((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
 
  const markAllRead = () => setData((prev) => prev.map((n) => ({ ...n, read: true })))
 
  const dismiss = (id) => setData((prev) => prev.filter((n) => n.id !== id))
 
  const open = (n) => {
    markRead(n.id)
    if (n.link) navigate(n.link)
  }
 
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Notifications</h1>
          <p className="mt-1 text-sm text-slate-400">
            Feedback, approvals, and deadline reminders for your project.
          </p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent"
        >
          <FaCheckDouble aria-hidden="true" /> Mark all as read
        </button>
      </div>
 
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
 
      {loading ? (
        <Skeleton />
      ) : error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Could not load notifications: {error}.{' '}
          <button type="button" onClick={reload} className="font-medium underline">
            Try again
          </button>
        </div>
      ) : groups.length === 0 ? (
        <BaseCard title="Notifications">
          <EmptyState icon={<FaRegBell />} message="No notifications found" />
        </BaseCard>
      ) : (
        groups.map(([label, list]) => (
          <BaseCard key={label} title={label}>
            <ul className="divide-y divide-slate-100">
              {list.map((n) => {
                const { icon: Icon, tone } = TYPE_META[n.type] ?? TYPE_META.system
                return (
                  <li key={n.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => open(n)}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-lg py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tone}`}
                        aria-hidden="true"
                      >
                        <Icon />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span
                            className={`truncate text-sm ${
                              n.read ? 'text-slate-600' : 'font-semibold text-slate-800'
                            }`}
                          >
                            {n.title}
                          </span>
                          {!n.read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600">
                              <span className="sr-only">Unread</span>
                            </span>
                          )}
                        </span>
                        <span className="block truncate text-xs text-slate-400">{n.description}</span>
                      </span>
                      <span className="shrink-0 text-xs text-slate-400">{timeAgo(n.createdAt)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => dismiss(n.id)}
                      aria-label={`Dismiss: ${n.title}`}
                      className="rounded-lg p-2 text-slate-300 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <FaTimes />
                    </button>
                  </li>
                )
              })}
            </ul>
          </BaseCard>
        ))
      )}
    </div>
  )
}
 
export default Notifications
 