import { useState, useEffect, useMemo, useCallback } from 'react'
import { FaUsers, FaCheckCircle, FaExclamationTriangle, FaPlus } from 'react-icons/fa'
import StatCard from '../../components/stat-card/StatCard'
import AddStudent from '../../components/add-student/AddStudent'
import EditStudent from '../../components/edit-student/EditStudent'
import SearchFilter from '../../components/search-filter/SearchFilter'
import { DEPARTMENTS } from '../../constants/Departments'
import StudentList from '../../components/list/StudentList'
import ConfirmDialog from '../../components/confirm-dialogue/ConfirmDialogue'
import Toast from '../../components/toast/ToastMsg'
import API from '../../api/axios'

const TOAST_DURATION = 3000

// TEMP: remove once your backend has real students
const DUMMY_STUDENTS = [
  { _id: 'dummy-1', name: 'Ali Raza', email: 'ali@student.edu', department: 'Computer Science', year: '4th Year', supervisor: { name: 'Dr. Ahmed' }, projectTitle: 'Smart Attendance System' },
  { _id: 'dummy-2', name: 'Sara Khan', email: 'sara@student.edu', department: 'Software Engineering', year: '4th Year', supervisor: null, projectTitle: 'AI Study Planner' },
  { _id: 'dummy-3', name: 'Hamza Tariq', email: 'hamza@student.edu', department: 'Computer Science', year: '3rd Year', supervisor: { name: 'Dr. Fatima' }, projectTitle: '' },
]

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')

  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, success = true) => {
    setToast({ msg, success })
    setTimeout(() => setToast(null), TOAST_DURATION)
  }

  const fetchStudents = useCallback(async () => {
    try {
      const { data } = await API.get('/users', { params: { role: 'student' } })
      const list = Array.isArray(data) ? data : data.users || data.students || []
      setStudents(list.length ? list : DUMMY_STUDENTS) // TEMP fallback
    } catch {
      setStudents(DUMMY_STUDENTS) // TEMP fallback
      showToast('Could not load students (showing sample data)', false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  // Search + department filter, computed from the full list (no extra state to sync)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return students.filter((s) =>
      (!department || s.department === department) &&
      (!q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q))
    )
  }, [students, search, department])

  const stats = {
    total: students.length,
    completed: students.filter((s) => s.projectStatus === 'completed').length,
    unassigned: students.filter((s) => !s.supervisor).length,
  }

  const handleSuccess = (msg) => {
    showToast(msg, true)
    fetchStudents() // refresh list after add / edit
  }

  const confirmDelete = async () => {
    setDeleteLoading(true)
    try {
      const id = deleting._id || deleting.id
      if (String(id).startsWith('dummy-')) {
        // TEMP: dummy rows are removed locally only
        setStudents((prev) => prev.filter((s) => (s._id || s.id) !== id))
      } else {
        await API.delete(`/users/${id}`)
        fetchStudents()
      }
      showToast('Student deleted successfully', true)
      setDeleting(null)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete student', false)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <>
      <Toast toast={toast} />

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4
                      flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Manage Students</h1>
          <p className="text-xs text-gray-500">Add, edit, and manage student accounts</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600
                     text-white rounded-lg font-medium text-sm transition"
        >
          <FaPlus size={11} /> Add New Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard icon={<FaUsers />} label="Total Students" value={stats.total}
          bg="#e0f2fe" iconColor="text-blue-500" />
        <StatCard icon={<FaCheckCircle />} label="Completed Projects" value={stats.completed}
          bg="#f3e8ff" iconColor="text-purple-500" />
        <StatCard icon={<FaExclamationTriangle />} label="Unassigned" value={stats.unassigned}
          bg="#fef3c7" iconColor="text-amber-500" />
      </div>

      <SearchFilter
        searchLabel="Search Students"
        placeholder="Search by name or email..."
        search={search} onSearch={setSearch}
        options={DEPARTMENTS}
        filterLabel="Filter by Department"
        filterAllLabel="All Departments"
        filter={department} onFilter={setDepartment}
      />

      <StudentList
        students={filtered}
        loading={loading}
        onEdit={setEditing}
        onDelete={setDeleting}
      />

      {showAdd && <AddStudent onClose={() => setShowAdd(false)} onSuccess={handleSuccess} />}
      {editing && <EditStudent student={editing} onClose={() => setEditing(null)} onSuccess={handleSuccess} />}
      {deleting && (
        <ConfirmDialog
          title="Delete student?"
          message={`${deleting.name} will be permanently removed. This can't be undone.`}
          loading={deleteLoading}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  )
}