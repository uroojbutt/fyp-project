import { useMemo, useState } from 'react'
import { FaPaperPlane, FaRegCommentDots, FaReply,
  FaRegCheckCircle, FaExclamationTriangle,FaRegComment,
FaRegCalendarAlt } from 'react-icons/fa'
import useFetch from '../../hooks/use-fetch'
import { fetchFeedback } from '../../services/student-service'
import { formatDate,timeAgo } from '../../utils/format-date'
import BaseCard from '../../components/base-card/BaseCard'
import StatCard from '../../components/stat-card/StatCard'
import EmptyState from '../../components/empty-state/EmptyState'
import StatusBadge from '../../components/status-badge/StatusBadge'

// Maps each feedback status to a label and a StatusBadge tone
const STATUS = {
  approved: { label: 'Approved', tone: 'green', icon: FaRegCheckCircle, iconColor: 'text-green-500' },
  changes_requested: {
    label: 'Changes requested',
    tone: 'amber',
    icon: FaExclamationTriangle,
    iconColor: 'text-amber-500',
  },
  comment: { label: 'Comment', tone: 'blue', icon: FaRegCommentDots, iconColor: 'text-blue-500' },
}
 
const getInitials = (name) =>
  name
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
 
// Local to this page: nothing else uses it, so it stays out of /components.
const FeedbackItem = ({ item, onMarkRead, onReply }) => {
  const [replying, setReplying] = useState(false)
  const [draft, setDraft] = useState('')
  const { label, tone, icon: StatusIcon, iconColor } = STATUS[item.status] ?? STATUS.comment
 
  const handleSubmit = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    onReply(item.id, text)
    setDraft('')
    setReplying(false)
  }
 
  return (
    <BaseCard
      title={
        <span className="flex items-center gap-2">
          <StatusIcon className={`text-base ${iconColor}`} aria-hidden="true" />
          {item.submission}
        </span>
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700"
            aria-hidden="true"
          >
            {getInitials(item.supervisor)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{item.supervisor}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
              <FaRegCalendarAlt aria-hidden="true" />
              {formatDate(item.createdAt)} · {timeAgo(item.createdAt)}
            </p>
          </div>
        </div>
 
        <div className="flex items-center gap-2">
          {!item.read && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
              New
            </span>
          )}
          <StatusBadge tone={tone}>{label}</StatusBadge>
        </div>
      </div>
 
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.message}</p>
 
      {item.replies.length > 0 && (
        <ul className="mt-4 space-y-2 border-l-2 border-slate-100 pl-4">
          {item.replies.map((reply) => (
            <li key={reply.id} className="text-sm text-slate-600">
              <span className="font-medium text-slate-800">{reply.author}</span>
              <span className="text-xs text-slate-400"> · {timeAgo(reply.createdAt)}</span>
              <p>{reply.message}</p>
            </li>
          ))}
        </ul>
      )}
 
      {replying ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label htmlFor={`reply-${item.id}`} className="sr-only">
            Reply to {item.supervisor}
          </label>
          <textarea
            id={`reply-${item.id}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            autoFocus
            placeholder="Write your reply..."
            className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-blue-400"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReplying(false)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!draft.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaPaperPlane aria-hidden="true" /> Send reply
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setReplying(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            <FaReply aria-hidden="true" /> Reply
          </button>
          {!item.read && (
            <button
              type="button"
              onClick={() => onMarkRead(item.id)}
              className="text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Mark as read
            </button>
          )}
        </div>
      )}
    </BaseCard>
  )
}
 
const Skeleton = () => (
  <div className="space-y-4" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <div key={i} className="h-36 animate-pulse rounded-xl bg-slate-100" />
    ))}
  </div>
)
 
const Feedback = () => {
  const { data, setData, loading, error, reload } = useFetch(fetchFeedback)
  const items = data ?? []
  const unreadCount = items.filter((f) => !f.read).length
 
  const stats = [
    {
      label: 'Total Feedback',
      value: items.length,
      icon: <FaRegComment />,
      bg: '#dae7f8ff',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Positive',
      value: items.filter((f) => f.status === 'approved').length,
      icon: <FaRegCheckCircle />,
      bg: '#d4f8dfff',
      iconColor: 'text-green-600',
    },
    {
      label: 'Needs Revision',
      value: items.filter((f) => f.status === 'changes_requested').length,
      icon: <FaExclamationTriangle />,
      bg: '#f8cfb3ff',
      iconColor: 'text-amber-600',
    },
  ]
 
  const markRead = (id) =>
    setData((prev) => prev.map((f) => (f.id === id ? { ...f, read: true } : f)))
 
  const addReply = (id, message) =>
    setData((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              read: true,
              replies: [
                ...f.replies,
                { id: crypto.randomUUID(), author: 'You', message, createdAt: new Date().toISOString() },
              ],
            }
          : f
      )
    )
 
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-slate-800">Feedback</h1>
        <p className="mt-1 text-sm text-slate-400">
          Comments from your supervisor on your proposal, reports, and code.
          {unreadCount > 0 && ` ${unreadCount} unread.`}
        </p>
      </div>
 
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
 
      {loading ? (
        <Skeleton />
      ) : error ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Could not load feedback: {error}.{' '}
          <button type="button" onClick={reload} className="font-medium underline">
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <BaseCard title="Feedback">
          <EmptyState icon={<FaRegCommentDots />} message="No feedback received yet" />
        </BaseCard>
      ) : (
        items.map((item) => (
          <FeedbackItem key={item.id} item={item} onMarkRead={markRead} onReply={addReply} />
        ))
      )}
    </div>
  )
}
 
export default Feedback
