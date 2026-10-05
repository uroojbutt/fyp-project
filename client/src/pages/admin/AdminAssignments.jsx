import { useState, useMemo } from 'react'
import { FaCalendarAlt, FaClock, FaExclamationTriangle, FaCheckCircle, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import StatCard from '../../components/stat-card/StatCard'
import Toast from '../../components/toast/ToastMsg'

const TOAST_DURATION = 3000

// dummy data - replace with API call (e.g. getDeadlines) later
const initialDeadlines = [
  { _id: '1', title: 'Proposal Submission', description: 'Submit FYP proposal document', dueDate: '2026-10-12', audience: 'All Students', status: 'upcoming', updatedAt: '2026-10-01T10:00:00Z' },
  { _id: '2', title: 'SRS Document', description: 'Software requirement specification', dueDate: '2026-10-03', audience: 'Group A', status: 'overdue', updatedAt: '2026-09-29T09:30:00Z' },
  { _id: '3', title: 'Mid Evaluation', description: 'Mid-term project evaluation', dueDate: '2026-10-20', audience: 'All Students', status: 'upcoming', updatedAt: '2026-10-02T12:15:00Z' },
  { _id: '4', title: 'Literature Review', description: 'Related work summary', dueDate: '2026-09-28', audience: 'Group B', status: 'completed', updatedAt: '2026-09-27T08:00:00Z' },
]

const statusStyle = {
  upcoming: 'bg-blue-50 text-blue-600',
  overdue: 'bg-red-50 text-red-500',
  completed: 'bg-emerald-50 text-emerald-700',
}

export default function AdminDeadlines() {
  const [deadlines, setDeadlines] = useState(initialDeadlines)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | upcoming | overdue | completed
  const [toast, setToast] = useState(null)

  const showToast = (msg, success = true) => {
    setToast({ msg, success })
    setTimeout(() => setToast(null), TOAST_DURATION)
  }

  // ── Stat cards ──
  const countBy = (status) => deadlines.filter((d) => d.status === status).length

  // ── Search + filter ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return deadlines.filter((d) => {
      const matchesSearch =
        !q || d.title?.toLowerCase().includes(q) || d.audience?.toLowerCase().includes(q)
      const matchesFilter = filter === 'all' || d.status === filter
      return matchesSearch && matchesFilter
    })
  }, [deadlines, search, filter])

  const handleDelete = (id) => {
    setDeadlines((prev) => prev.filter((d) => d._id !== id))
    showToast('Deadline deleted successfully', true)
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Deadlines</h1>
          <p className="text-sm text-gray-500">Create and track submission deadlines</p>
        </div>
        <button
          onClick={() => {/* open Add Deadline modal */}}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition bg-blue-500 hover:bg-blue-600 cursor-pointer"
        >
          <FaPlus /> Add Deadline
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<FaCalendarAlt />} label="Total Deadlines" value={deadlines.length}
          color="bg-blue-50" iconColor="text-blue-500" bg="#e0f2fe" />
        <StatCard icon={<FaClock />} label="Upcoming" value={countBy('upcoming')}
          color="bg-amber-50" iconColor="text-amber-500" bg="#fef3c7" />
        <StatCard icon={<FaExclamationTriangle />} label="Overdue" value={countBy('overdue')}
          color="bg-red-50" iconColor="text-red-400" bg="#fee2e2" />
        <StatCard icon={<FaCheckCircle />} label="Completed" value={countBy('completed')}
          color="bg-emerald-50" iconColor="text-emerald-500" bg="#dcfce7" />
      </div>

      {/* Search + filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">Search Deadlines</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or assigned group..."
            className="w-full mt-1 text-sm outline-none border-b border-gray-200 py-1.5 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block">Filter Status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mt-1 text-sm outline-none border-b border-gray-200 py-1.5 bg-transparent cursor-pointer"
          >
            <option value="all">All Deadlines</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">All Deadlines</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase text-gray-500">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-400">No deadlines found</td></tr>
              )}
              {filtered.map((d) => (
                <tr key={d._id} className="border-t border-gray-100">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-800">{d.title}</p>
                    <p className="text-xs text-gray-500">{d.description}</p>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{d.audience}</td>
                  <td className="px-4 py-4 text-gray-600">{String(d.dueDate).slice(0, 10)}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle[d.status]}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {d.updatedAt ? new Date(d.updatedAt).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-2 rounded-lg text-sm font-medium text-white transition bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="px-3 py-2 rounded-lg text-sm font-medium text-white transition bg-red-400 hover:bg-red-500 cursor-pointer"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Toast toast={toast} />
    </>
  )
}