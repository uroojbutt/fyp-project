import { useState, useEffect, useMemo } from 'react'
import { FaCheckCircle, FaExclamationTriangle, FaUsers } from 'react-icons/fa'
import { getStudents, getTeachers, assignSupervisor } from '../../api/adminApi'
import StatCard from '../../components/stat-card/StatCard'
import Toast from '../../components/toast/ToastMsg'

const TOAST_DURATION = 3000

export default function AdminAssignments() {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')       // all | assigned | unassigned
  const [selected, setSelected] = useState({})      // { [studentId]: teacherId } picked in the dropdown
  const [savingId, setSavingId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, success = true) => {
    setToast({ msg, success })
    setTimeout(() => setToast(null), TOAST_DURATION)
  }

  const loadData = async () => {
    try {
      const [sRes, tRes] = await Promise.all([getStudents(), getTeachers()])
      const sData = sRes.data
      const tData = tRes.data
      setStudents(Array.isArray(sData) ? sData : sData.students || [])
      setTeachers(Array.isArray(tData) ? tData : tData.teachers || [])
    } catch {
      showToast('Failed to load data', false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  // supervisor may come back as a populated object or just an id
  const supervisorOf = (s) => {
    if (!s.supervisor) return null
    if (typeof s.supervisor === 'object') return s.supervisor
    return teachers.find((t) => t._id === s.supervisor) || null
  }

  // ── Stat cards ──
  const assignedCount = useMemo(
    () => students.filter((s) => s.supervisor).length,
    [students]
  )
  const unassignedCount = students.length - assignedCount

  // ── Search + filter ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return students.filter((s) => {
      const matchesSearch =
        !q || s.name?.toLowerCase().includes(q) || s.projectTitle?.toLowerCase().includes(q)
      const matchesFilter =
        filter === 'all' ||
        (filter === 'assigned' && s.supervisor) ||
        (filter === 'unassigned' && !s.supervisor)
      return matchesSearch && matchesFilter
    })
  }, [students, search, filter])

  const handleAssign = async (student) => {
    const teacherId = selected[student._id]
    if (!teacherId) return
    setSavingId(student._id)
    try {
      await assignSupervisor(student._id, teacherId)
      showToast('Supervisor assigned successfully', true)
      setSelected((prev) => {
        const { [student._id]: _removed, ...rest } = prev
        return rest
      })
      loadData()
    } catch {
      showToast('Failed to assign supervisor', false)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h1 className="text-lg font-semibold text-gray-800">Assign Supervisor</h1>
        <p className="text-sm text-gray-500">Manage supervisor assignments for students and projects</p>
      </div>

      {/* Search + filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">Search Students</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or project title..."
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
            <option value="all">All Students</option>
            <option value="assigned">Assigned</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Student Assignments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase text-gray-500">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Project Title</th>
                <th className="px-4 py-3">Supervisor</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Assign Supervisor</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-400">No students found</td></tr>
              )}
              {filtered.map((s) => {
                const sup = supervisorOf(s)
                const picked = selected[s._id]
                const isSaving = savingId === s._id
                const label = isSaving
                  ? 'Saving...'
                  : picked ? (sup ? 'Reassign' : 'Assign') : sup ? 'Assigned' : 'Assign'

                return (
                  <tr key={s._id} className="border-t border-gray-100">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.email}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{s.projectTitle || '—'}</td>
                    <td className="px-4 py-4">
                      {sup ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                          {sup.name}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-500 text-xs font-medium">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{s.deadline ? String(s.deadline).slice(0, 10) : '—'}</td>
                    <td className="px-4 py-4 text-gray-600">
                      {s.updatedAt ? new Date(s.updatedAt).toLocaleString() : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={picked || ''}
                        onChange={(e) => setSelected((prev) => ({ ...prev, [s._id]: e.target.value }))}
                        className="w-full text-sm text-gray-600 outline-none border-b border-gray-200 py-1 bg-transparent cursor-pointer"
                      >
                        <option value="">Select Supervisor</option>
                        {teachers.map((t) => (
                          <option key={t._id} value={t._id}>{t.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleAssign(s)}
                        disabled={!picked || isSaving}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white transition
                                   bg-blue-500 hover:bg-blue-600 cursor-pointer
                                   disabled:bg-blue-300 disabled:cursor-not-allowed"
                      >
                        {label}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stat cards at the bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard icon={<FaCheckCircle />} label="Assigned Students" value={assignedCount}
          color="bg-emerald-50" iconColor="text-emerald-500" bg="#dcfce7" />
        <StatCard icon={<FaExclamationTriangle />} label="Unassigned Students" value={unassignedCount}
          color="bg-red-50" iconColor="text-red-400" bg="#fee2e2" />
        <StatCard icon={<FaUsers />} label="Available Teachers" value={teachers.length}
          color="bg-blue-50" iconColor="text-blue-500" bg="#e0f2fe" />
      </div>

      <Toast toast={toast} />
    </>
  )
}