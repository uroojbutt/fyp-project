import { useState } from 'react'
import StatCard from '../../components/stat-card/StatCard'
import Graph from '../../components/graph/Graph'
import RecentActivity from '../../components/recent-activity/RecentActivity'
import {
  FaUserGraduate, FaChalkboardTeacher, FaClock,
  FaFolderOpen, FaExclamationTriangle, FaTimes, FaPlus
} from 'react-icons/fa'
import { MdFileOpen } from 'react-icons/md'

const TOAST_DURATION = 3000

const Modal = ({ title, onClose, onSubmit, children }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 w-[380px] relative shadow-xl">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
        <FaTimes size={16} />
      </button>
      <h2 className="text-lg font-semibold mb-6">{title}</h2>
      {children}
      <div className="flex gap-3 justify-end mt-4">
        <button onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-200 text-red-500 font-medium hover:bg-gray-50 transition">
          Cancel
        </button>
        <button onClick={onSubmit} className="px-5 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition">
          {title}
        </button>
      </div>
    </div>
  </div>
)

const inputClass = "w-full border-b border-gray-200 py-2 text-sm outline-none mb-4 bg-transparent focus:border-blue-400 transition"

export default function AdminDashboard() {
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [showAddTeacher, setShowAddTeacher] = useState(false)
  const [toast, setToast] = useState(null)

  const [studentForm, setStudentForm] = useState({ name: '', email: '', password: '', department: '' })
  const [teacherForm, setTeacherForm] = useState({ name: '', email: '', password: '', department: '', expertise: '', maxStudents: 1 })

  const showToast = (msg, success = true) => {
    setToast({ msg, success })
    setTimeout(() => setToast(null), TOAST_DURATION)
  }

  const handleAddStudent = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...studentForm, role: 'student' })
      })
      if (res.ok) {
        showToast('Student created successfully', true)
        setShowAddStudent(false)
        setStudentForm({ name: '', email: '', password: '', department: '' })
      } else {
        showToast('Failed to add student', false)
      }
    } catch {
      showToast('Server error', false)
    }
  }

  const handleAddTeacher = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...teacherForm, role: 'teacher' })
      })
      if (res.ok) {
        showToast('Teacher added successfully', true)
        setShowAddTeacher(false)
        setTeacherForm({ name: '', email: '', password: '', department: '', expertise: '', maxStudents: 1 })
      } else {
        showToast('Failed to add teacher', false)
      }
    } catch {
      showToast('Server error', false)
    }
  }

  const graphData = [
    { name: 'Dr. Ahmed Raza', projects: 3 },
    { name: 'Ms. Ayesha Malik', projects: 2 },
  ]

  const activities = [
    { message: 'Maryam Iqbal has request Prof. Sana Khan to be their supervisor.', tag: 'Request', priority: 'Medium' },
    { message: 'Hira Aslam has request Ms. Ayesha Malik to be their supervisor.', tag: 'Request', priority: 'Medium' },
    { message: 'Laiba Noor has request Mr. Bilal Hussain to be their supervisor.', tag: 'Request', priority: 'Medium' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-8">

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all
          ${toast.success ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.success ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl px-8 py-7 mb-7 text-white">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm mt-1 opacity-80">Manage the entire project management system and oversee all activities.</p>
      </div>

      {/* Stat Cards */}
      <div className="flex gap-4 mb-7 flex-wrap">
        <StatCard icon={<FaUserGraduate />} label="Total Students" value="6" color="bg-blue-50" iconColor="text-blue-500" />
        <StatCard icon={<FaChalkboardTeacher />} label="Total Teachers" value="5" color="bg-emerald-50" iconColor="text-emerald-500" />
        <StatCard icon={<FaClock />} label="Pending Requests" value="2" color="bg-amber-50" iconColor="text-amber-500" />
        <StatCard icon={<FaFolderOpen />} label="Active Projects" value="5" color="bg-yellow-50" iconColor="text-yellow-500" />
        <StatCard icon={<FaExclamationTriangle />} label="Nearing Deadlines" value="0" color="bg-red-50" iconColor="text-red-400" />
      </div>

      {/* Graph + Activity */}
      <div className="flex gap-5 mb-7 flex-wrap">
        <Graph data={graphData} />
        <RecentActivity activities={activities} />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-semibold mb-4 text-gray-700">Quick Actions</h3>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setShowAddStudent(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition"
          >
            <FaPlus size={12} /> Add Student
          </button>
          <button
            onClick={() => setShowAddTeacher(true)}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm transition"
          >
            <FaPlus size={12} /> Add Teacher
          </button>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudent && (
        <Modal title="Add Student" onClose={() => setShowAddStudent(false)} onSubmit={handleAddStudent}>
          <input className={inputClass} placeholder="Full Name" value={studentForm.name} onChange={e => setStudentForm({ ...studentForm, name: e.target.value })} />
          <input className={inputClass} placeholder="Email" value={studentForm.email} onChange={e => setStudentForm({ ...studentForm, email: e.target.value })} />
          <input className={inputClass} type="password" placeholder="Password" value={studentForm.password} onChange={e => setStudentForm({ ...studentForm, password: e.target.value })} />
          <select className={inputClass} value={studentForm.department} onChange={e => setStudentForm({ ...studentForm, department: e.target.value })}>
            <option value="">Select Department</option>
            <option>Software Engineering</option>
            <option>Computer Science</option>
            <option>Electrical Engineering</option>
          </select>
        </Modal>
      )}

      {/* Add Teacher Modal */}
      {showAddTeacher && (
        <Modal title="Add Teacher" onClose={() => setShowAddTeacher(false)} onSubmit={handleAddTeacher}>
          <input className={inputClass} placeholder="Full Name" value={teacherForm.name} onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })} />
          <input className={inputClass} placeholder="Email" value={teacherForm.email} onChange={e => setTeacherForm({ ...teacherForm, email: e.target.value })} />
          <input className={inputClass} type="password" placeholder="Password" value={teacherForm.password} onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })} />
          <select className={inputClass} value={teacherForm.department} onChange={e => setTeacherForm({ ...teacherForm, department: e.target.value })}>
            <option value="">Select Department</option>
            <option>Software Engineering</option>
            <option>Computer Science</option>
            <option>Electrical Engineering</option>
          </select>
          <select className={inputClass} value={teacherForm.expertise} onChange={e => setTeacherForm({ ...teacherForm, expertise: e.target.value })}>
            <option value="">Select Expertise</option>
            <option>Database Systems</option>
            <option>Machine Learning</option>
            <option>Web Development</option>
            <option>Networking</option>
          </select>
          <input className={inputClass} type="number" placeholder="Max Students" min="1" value={teacherForm.maxStudents} onChange={e => setTeacherForm({ ...teacherForm, maxStudents: e.target.value })} />
        </Modal>
      )}
    </div>
  )
}