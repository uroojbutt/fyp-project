import { useState, useEffect, useMemo } from 'react'
import { FaUsers, FaUserCheck, FaBuilding, FaPlus } from 'react-icons/fa'
import { getTeachers, deleteTeacher, updateTeacher } from '../../api/adminApi'
import StatCard from '../../components/stat-card/StatCard'
import Toast from '../../components/toast/ToastMsg'
import AddTeacher from '../../components/add-teacher/AddTeacher'
import ConfirmDialog from '../../components/confirm-dialogue/ConfirmDialogue'
import TeacherList from '../../components/list/TeacherList'

const TOAST_DURATION = 3000

// TEMP: remove once your backend has real teachers
const DUMMY_TEACHERS = [
  { _id: 'dummy-1', name: 'Dr. Ahmed', email: 'ahmed@university.edu', department: 'Computer Science', expertise: 'Machine Learning', assignedStudents: 4, createdAt: '2026-08-12T09:00:00Z' },
  { _id: 'dummy-2', name: 'Dr. Fatima', email: 'fatima@university.edu', department: 'Software Engineering', expertise: 'Web Development', assignedStudents: 3, createdAt: '2026-08-20T11:30:00Z' },
  { _id: 'dummy-3', name: 'Prof. Usman', email: 'usman@university.edu', department: 'Computer Science', expertise: 'Databases', assignedStudents: 2, createdAt: '2026-09-02T08:15:00Z' },
]

// assignedStudents may be an array of students or a plain number
const countAssigned = (t) =>
  Array.isArray(t.assignedStudents) ? t.assignedStudents.length : Number(t.assignedStudents) || 0

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, success = true) => {
    setToast({ msg, success })
    setTimeout(() => setToast(null), TOAST_DURATION)
  }

  const fetchTeachers = async () => {
    try {
      const { data } = await getTeachers()
      const list = Array.isArray(data) ? data : data.teachers || []
      setTeachers(list.length ? list : DUMMY_TEACHERS) // TEMP fallback
    } catch {
      setTeachers(DUMMY_TEACHERS) // TEMP fallback
      showToast('Failed to load teachers (showing sample data)', false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTeachers() }, [])

  const departments = useMemo(
    () => [...new Set(teachers.map((t) => t.department).filter(Boolean))],
    [teachers]
  )

  const totalAssigned = useMemo(
    () => teachers.reduce((sum, t) => sum + countAssigned(t), 0),
    [teachers]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return teachers.filter((t) => {
      const matchesSearch =
        !q || t.name?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q)
      const matchesDept = department === 'all' || t.department === department
      return matchesSearch && matchesDept
    })
  }, [teachers, search, department])

  const handleSuccess = (msg) => {
    showToast(msg || 'Teacher added successfully', true)
    fetchTeachers()
  }

  // Called by DataList's built-in edit modal. Throwing keeps the modal open.
  const handleSave = async (form) => {
    const { name, email, department, expertise } = form
    try {
      if (String(form._id).startsWith('dummy-')) {
        // TEMP: dummy rows are updated locally only
        setTeachers((prev) => prev.map((t) => (t._id === form._id ? { ...t, name, email, department, expertise } : t)))
      } else {
        await updateTeacher(form._id, { name, email, department, expertise })
        fetchTeachers()
      }
      showToast('Teacher updated successfully', true)
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update teacher', false)
      throw err
    }
  }

  const confirmDelete = async () => {
    setDeleteLoading(true)
    try {
      if (String(deleting._id).startsWith('dummy-')) {
        // TEMP: dummy rows are removed locally only
        setTeachers((prev) => prev.filter((t) => t._id !== deleting._id))
      } else {
        await deleteTeacher(deleting._id)
        fetchTeachers()
      }
      showToast('Teacher deleted', true)
      setDeleting(null)
    } catch {
      showToast('Delete failed', false)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Manage Teachers</h1>
          <p className="text-sm text-gray-500">Add, edit, and manage teacher accounts</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600
                     text-white rounded-lg text-sm font-medium transition cursor-pointer"
        >
          <FaPlus size={11} /> Add New Teacher
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard icon={<FaUsers />} label="Total Teachers" value={teachers.length}
          color="bg-blue-50" iconColor="text-blue-500" bg="#e0f2fe" />
        <StatCard icon={<FaUserCheck />} label="Assigned Students" value={totalAssigned}
          color="bg-purple-50" iconColor="text-purple-500" bg="#f3e8ff" />
        <StatCard icon={<FaBuilding />} label="Departments" value={departments.length}
          color="bg-amber-50" iconColor="text-amber-500" bg="#fef3c7" />
      </div>

      {/* Search + department filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">Search Teachers</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full mt-1 text-sm outline-none border-b border-gray-200 py-1.5 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block">Filter by Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="mt-1 text-sm outline-none border-b border-gray-200 py-1.5 bg-transparent cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Teachers list */}
      <TeacherList
        teachers={filtered}
        loading={loading}
        onSave={handleSave}
        onDelete={setDeleting}
      />

      {/* Modals + toast */}
      {showAdd && <AddTeacher onClose={() => setShowAdd(false)} onSuccess={handleSuccess} />}
      {deleting && (
        <ConfirmDialog
          title="Delete teacher?"
          message={`${deleting.name} will be permanently removed. This can't be undone.`}
          loading={deleteLoading}
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
      <Toast toast={toast} />
    </>
  )
}