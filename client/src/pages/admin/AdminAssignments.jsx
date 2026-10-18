import { useState, useEffect, useMemo } from 'react'
import { FaCheckCircle, FaExclamationTriangle, FaUsers } from 'react-icons/fa'
import { getStudents, getTeachers, assignSupervisor } from '../../api/adminApi'
import StatCard from '../../components/stat-card/StatCard'
import Toast from '../../components/toast/ToastMsg'
import DataList from '../../components/data-list/DataList'
import StatusBadge from '../../components/status-badge/StatusBadge'

const TOAST_DURATION = 3000

// TEMP: remove once your backend has real data
const DUMMY_TEACHERS = [
  { _id: 't1', name: 'Dr. Ahmed' },
  { _id: 't2', name: 'Dr. Fatima' },
  { _id: 't3', name: 'Prof. Usman' },
]
const DUMMY_STUDENTS = [
  { _id: 'dummy-1', name: 'Ali Raza', email: 'ali@student.edu', projectTitle: 'Smart Attendance System', supervisor: DUMMY_TEACHERS[0], deadline: '2026-10-12', updatedAt: '2026-10-01T10:00:00Z' },
  { _id: 'dummy-2', name: 'Sara Khan', email: 'sara@student.edu', projectTitle: 'AI Study Planner', supervisor: null, deadline: '2026-10-20', updatedAt: '2026-10-02T12:15:00Z' },
  { _id: 'dummy-3', name: 'Hamza Tariq', email: 'hamza@student.edu', projectTitle: '', supervisor: null, deadline: null, updatedAt: null },
]

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
      const sList = Array.isArray(sData) ? sData : sData.students || sData.users || []
      const tList = Array.isArray(tData) ? tData : tData.teachers || tData.users || []
      setStudents(sList.length ? sList : DUMMY_STUDENTS) // TEMP fallback
      setTeachers(tList.length ? tList : DUMMY_TEACHERS) // TEMP fallback
    } catch {
      setStudents(DUMMY_STUDENTS) // TEMP fallback
      setTeachers(DUMMY_TEACHERS) // TEMP fallback
      showToast('Failed to load data (showing sample data)', false)
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
  const assignedCount = useMemo(() => students.filter((s) => s.supervisor).length, [students])
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
      if (String(student._id).startsWith('dummy-')) {
        // TEMP: dummy rows are updated locally only
        const teacher = teachers.find((t) => t._id === teacherId)
        setStudents((prev) => prev.map((s) => (s._id === student._id ? { ...s, supervisor: teacher } : s)))
      } else {
        await assignSupervisor(student._id, teacherId)
        loadData()
      }
      showToast('Supervisor assigned successfully', true)
      setSelected((prev) => {
        const { [student._id]: _removed, ...rest } = prev
        return rest
      })
    } catch {
      showToast('Failed to assign supervisor', false)
    } finally {
      setSavingId(null)
    }
  }

  const buttonLabel = (s) => {
    const picked = selected[s._id]
    const sup = supervisorOf(s)
    if (savingId === s._id) return 'Saving...'
    if (picked) return sup ? 'Reassign' : 'Assign'
    return sup ? 'Assigned' : 'Assign'
  }

  // ── DataList columns ──
  const columns = [
    { header: 'Student', render: (s) => (
        <>
          <div className="font-semibold text-gray-800 text-sm">{s.name}</div>
          <div className="text-xs text-gray-500">{s.email}</div>
        </>
    )},
    { header: 'Project Title', render: (s) => s.projectTitle || '—' },
    { header: 'Supervisor', render: (s) => {
        const sup = supervisorOf(s)
        return sup
          ? <StatusBadge tone="green">{sup.name}</StatusBadge>
          : <StatusBadge tone="red">Unassigned</StatusBadge>
    }},
    { header: 'Deadline', render: (s) => (s.deadline ? String(s.deadline).slice(0, 10) : '—') },
    { header: 'Updated', render: (s) => (s.updatedAt ? new Date(s.updatedAt).toLocaleString() : '—') },
    { header: 'Assign Supervisor', render: (s) => (
        <select
          value={selected[s._id] || ''}
          onChange={(e) => setSelected((prev) => ({ ...prev, [s._id]: e.target.value }))}
          className="w-full text-sm text-gray-600 outline-none border-b border-gray-200 py-1 bg-transparent cursor-pointer"
        >
          <option value="">Select Supervisor</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
    )},
  ]

  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h1 className="text-lg font-semibold text-gray-800">Assign Supervisor</h1>
        <p className="text-sm text-gray-500">Manage supervisor assignments for students and projects</p>
      </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard icon={<FaCheckCircle />} label="Assigned Students" value={assignedCount}
          color="bg-emerald-50" iconColor="text-emerald-500" bg="#dcfce7" />
        <StatCard icon={<FaExclamationTriangle />} label="Unassigned Students" value={unassignedCount}
          color="bg-red-50" iconColor="text-red-400" bg="#fee2e2" />
        <StatCard icon={<FaUsers />} label="Available Teachers" value={teachers.length}
          color="bg-blue-50" iconColor="text-blue-500" bg="#e0f2fe" />
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

      {/* List (no edit/delete - just the Assign button via `actions`) */}
      <DataList
        title="Student Assignments"
        columns={columns}
        rows={filtered}
        loading={loading}
        emptyText="No students found"
        actions={(s) => (
          <button
            onClick={() => handleAssign(s)}
            disabled={!selected[s._id] || savingId === s._id}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition
                       bg-blue-500 hover:bg-blue-600 cursor-pointer
                       disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {buttonLabel(s)}
          </button>
        )}
      />

      {/* Stat cards at the bottom */}
    

      <Toast toast={toast} />
    </>
  )
}