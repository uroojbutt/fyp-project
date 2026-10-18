import { useState, useMemo } from 'react'
import { FaCalendarAlt, FaClock, FaExclamationTriangle, FaCheckCircle, FaPlus } from 'react-icons/fa'
import StatCard from '../../components/stat-card/StatCard'
import Toast from '../../components/toast/ToastMsg'
import DataList, { EditModal } from '../../components/data-list/DataList'
import StatusBadge from '../../components/status-badge/StatusBadge'

const TOAST_DURATION = 3000
const tones = { upcoming: 'blue', overdue: 'red', completed: 'green' }

// dummy data - replace with API calls (getDeadlines, createDeadline, updateDeadline, deleteDeadline)
const seed = [
  { _id: '1', title: 'Proposal Submission', description: 'Submit FYP proposal document', audience: 'All Students', dueDate: '2026-10-12', status: 'upcoming', updatedAt: '2026-10-01T10:00:00Z' },
  { _id: '2', title: 'SRS Document', description: 'Software requirement specification', audience: 'Group A', dueDate: '2026-10-03', status: 'overdue', updatedAt: '2026-09-29T09:30:00Z' },
  { _id: '3', title: 'Mid Evaluation', description: 'Mid-term project evaluation', audience: 'All Students', dueDate: '2026-10-20', status: 'upcoming', updatedAt: '2026-10-02T12:15:00Z' },
  { _id: '4', title: 'Literature Review', description: 'Related work summary', audience: 'Group B', dueDate: '2026-09-28', status: 'completed', updatedAt: '2026-09-27T08:00:00Z' },
]

const columns = [
  { header: 'Title', render: (d) => (
      <>
        <div className="font-semibold text-gray-800">{d.title}</div>
        <div className="text-xs text-gray-500">{d.description}</div>
      </>
  )},
  { header: 'Assigned To', render: (d) => d.audience },
  { header: 'Due Date', render: (d) => String(d.dueDate).slice(0, 10) },
  { header: 'Status', render: (d) => <StatusBadge tone={tones[d.status]}>{d.status}</StatusBadge> },
  { header: 'Updated', render: (d) => (d.updatedAt ? new Date(d.updatedAt).toLocaleString() : '—') },
]

const formFields = [
  { name: 'title', label: 'Title' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'audience', label: 'Assigned To' },
  { name: 'dueDate', label: 'Due Date', type: 'date' },
  { name: 'status', label: 'Status', type: 'select', options: ['upcoming', 'overdue', 'completed'] },
]

export default function AdminDeadlines() {
  const [deadlines, setDeadlines] = useState(seed)
  const [loading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | upcoming | overdue | completed
  const [adding, setAdding] = useState(false)
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

  // ── Actions (swap bodies for API calls later) ──
  const handleAdd = async (form) => {
    setDeadlines((prev) => [{ ...form, _id: String(Date.now()), updatedAt: new Date().toISOString() }, ...prev])
    showToast('Deadline added successfully', true)
  }

  const handleSave = async (form) => {
    setDeadlines((prev) =>
      prev.map((d) => (d._id === form._id ? { ...form, updatedAt: new Date().toISOString() } : d))
    )
    showToast('Deadline updated successfully', true)
  }

  const handleDelete = async (row) => {
    setDeadlines((prev) => prev.filter((d) => d._id !== row._id))
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
          onClick={() => setAdding(true)}
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

      {/* List */}
      <DataList
        title="All Deadlines"
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyText="No deadlines found"
        editFields={formFields}
        onSave={handleSave}
        onDelete={handleDelete}
        deleteMessage={(d) => `Delete "${d.title}"? This cannot be undone.`}
      />

      {/* Add modal */}
      {adding && (
        <EditModal
          title="Add Deadline"
          saveLabel="Add Deadline"
          row={{ title: '', description: '', audience: '', dueDate: '', status: 'upcoming' }}
          fields={formFields}
          onSave={handleAdd}
          onClose={() => setAdding(false)}
        />
      )}

      <Toast toast={toast} />
    </>
  )
}