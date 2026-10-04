import { useState, useEffect, useMemo } from 'react'
import { FaUsers, FaUserCheck, FaBuilding, FaPlus } from 'react-icons/fa'
import StatCard from '../../components/stat-card/StatCard'
import Toast from '../../components/toast/ToastMsg'
import AddTeacher from '../../components/add-teacher/AddTeacher'
import ConfirmDialog from '../../components/confirm-dialogue/ConfirmDialogue'
import API from '../../api/axios'
const TOAST_DURATION = 3000

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
      const token = localStorage.getItem('token')
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setTeachers(Array.isArray(data) ? data : data.teachers || [])
    } catch {
      showToast('Failed to load teachers', false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTeachers() }, [])

  // ── Derived values (recalculated automatically when `teachers` changes) ──
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

  const confirmDelete = async () => {
    setDeleteLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/${deleting._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error()
      showToast('Teacher deleted', true)
      setDeleting(null)
      fetchTeachers()
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
          <label className="text-sm font-medium text-gray-700 block">Filter Status</label>
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
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Teachers List</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase text-gray-500">
                <th className="px-4 py-3">Teacher Info</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Expertise</th>
                <th className="px-4 py-3">Join Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400">No teachers found</td></tr>
              )}
              {filtered.map((t) => (
                <tr key={t._id} className="border-t border-gray-100">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-gray-800">{t.name}</p>
                    <p className="text-gray-500">{t.email}</p>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{t.department}</td>
                  <td className="px-4 py-4 text-gray-700">{t.expertise}</td>
                  <td className="px-4 py-4 text-gray-600">
                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-blue-600 font-medium mr-3 cursor-pointer">Edit</button>
                    <button
                      onClick={() => setDeleting(t)}
                      className="text-red-600 font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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