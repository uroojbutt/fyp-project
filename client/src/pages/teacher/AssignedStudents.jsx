import { useState, useMemo } from 'react'
import {
  FaUserGraduate, FaCheckCircle, FaSpinner, FaFolderOpen,
  FaRegCommentDots, FaRegCheckCircle, FaTimes,FaUserCog,
} from 'react-icons/fa'
import StatCard from '../../components/stat-card/StatCard'
import Toast from '../../components/toast/ToastMsg'
import ConfirmDialog from '../../components/confirm-dialogue/ConfirmDialogue'

const TOAST_DURATION = 3000
const FEEDBACK_TYPES = ['General', 'Improvement', 'Issue', 'Appreciation']
const EMPTY_FORM = { title: '', type: 'General', message: '' }

const BADGE_STYLES = {
  approved: 'bg-blue-50 text-blue-600 border border-blue-200',
  completed: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })

const getInitials = (name) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

// TEMP dummy data - replace with API calls (getAssignedStudents, sendFeedback, markComplete)
// A student appears here once this teacher accepts their request (supervisor = this teacher).
// projectStatus: 'approved' (project running = In Progress) | 'completed'
// Set to [] to see the empty state.
const DUMMY_STUDENTS = [
  {
    _id: 'stu-1',
    name: 'Ahmed Saeed',
    email: 'ahmed.saeed.student.edu@gmail.com',
    projectTitle: 'Smart Deadline & Project Tracking System',
    projectStatus: 'approved',
    deadline: '2027-12-10T00:00:00Z',
    lastUpdate: '2026-01-09T16:00:40Z',
  },
]

export default function TeacherStudents() {
  const [students, setStudents] = useState(DUMMY_STUDENTS)
  const [loading] = useState(false)
  const [feedbackFor, setFeedbackFor] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [completing, setCompleting] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, success = true) => {
    setToast({ msg, success })
    setTimeout(() => setToast(null), TOAST_DURATION)
  }

  const stats = useMemo(
    () => ({
      total: students.length,
      completed: students.filter((s) => s.projectStatus === 'completed').length,
      inProgress: students.filter((s) => s.projectStatus === 'approved').length,
      projects: students.filter((s) => s.projectTitle).length,
    }),
    [students]
  )

  const touch = (id, changes) =>
    setStudents((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, ...changes, lastUpdate: new Date().toISOString() } : s
      )
    )

  // ── Feedback ──
  const openFeedback = (s) => {
    setForm(EMPTY_FORM)
    setFeedbackFor(s)
  }

  const closeFeedback = () => {
    setFeedbackFor(null)
    setForm(EMPTY_FORM)
  }

  // swap body for POST /api/feedback later
  const submitFeedback = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      return showToast('Please enter a title and a message', false)
    }
    setActionLoading(true)
    touch(feedbackFor._id, {})
    setActionLoading(false)
    showToast('Feedback sent successfully', true)
    closeFeedback()
  }

  // ── Mark complete (swap body for PATCH /api/projects/:id/complete later) ──
  const confirmComplete = async () => {
    setActionLoading(true)
    touch(completing._id, { projectStatus: 'completed' })
    setActionLoading(false)
    showToast('Project marked as completed', true)
    setCompleting(null)
  }

  return (
    <>
      {/* Header + stats */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h1 className="text-lg font-semibold text-gray-800">Assigned Students</h1>
        <p className="text-sm text-gray-500">Manage your assigned students and their projects</p>

        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={<FaUserGraduate />} label="Total Students" value={stats.total}
            iconColor="text-blue-500" bg="#e0f2fe" />
          <StatCard icon={<FaCheckCircle />} label="Projects Completed" value={stats.completed}
            iconColor="text-emerald-500" bg="#dcfce7" />
          <StatCard icon={<FaSpinner />} label="In Progress" value={stats.inProgress}
            iconColor="text-amber-500" bg="#fef3c7" />
          <StatCard icon={<FaFolderOpen />} label="Total Projects" value={stats.projects}
            iconColor="text-purple-500" bg="#f3e8ff" />
        </div>
      </div>

      {/* Student cards */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading students...</p>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-500">No assigned students found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {students.map((s) => (
            <div key={s._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold
                                  flex items-center justify-center">
                    {getInitials(s.name)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-gray-800">{s.name}</h2>
                    <p className="text-xs text-gray-500 truncate">{s.email}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize shrink-0 ${BADGE_STYLES[s.projectStatus]}`}>
                  {s.projectStatus}
                </span>
              </div>

              <p className="text-sm font-medium text-gray-800 mt-4">{s.projectTitle}</p>
              <p className="text-xs text-gray-400 mt-1">Last Update: {formatDate(s.lastUpdate)}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openFeedback(s)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white
                             rounded-lg text-sm font-medium transition cursor-pointer"
                >
                  <FaRegCommentDots size={13} /> Feedback
                </button>
                {s.projectStatus !== 'completed' && (
                  <button
                    onClick={() => setCompleting(s)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white
                               rounded-lg text-sm font-medium transition cursor-pointer"
                  >
                    <FaRegCheckCircle size={13} /> Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback modal */}
      {feedbackFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Provide Feedback</h2>
              <button
                onClick={closeFeedback}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-4 bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-1.5">
              <p><span className="font-semibold text-gray-700">Project:</span> {feedbackFor.projectTitle}</p>
              <p><span className="font-semibold text-gray-700">Student:</span> {feedbackFor.name}</p>
              <p><span className="font-semibold text-gray-700">Deadline:</span> {formatDate(feedbackFor.deadline)}</p>
              <p><span className="font-semibold text-gray-700">Last Updated:</span> {formatDate(feedbackFor.lastUpdate)}</p>
            </div>

            <label className="block text-sm font-medium text-gray-700 mt-4">Feedback Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter feedback title"
              className="w-full mt-1 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500"
            />

            <label className="block text-sm font-medium text-gray-700 mt-4">Feedback Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full mt-1 text-sm outline-none border border-gray-200 rounded-lg px-3 py-2 bg-white
                         focus:border-blue-500 cursor-pointer"
            >
              {FEEDBACK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>

            <label className="block text-sm font-medium text-gray-700 mt-4">Feedback Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              placeholder="Enter your feedback message..."
              className="w-full mt-1 text-sm outline-none border border-gray-200 rounded-lg p-3 focus:border-blue-500 resize-none"
            />

            <div className="flex gap-2 mt-5">
              <button
                onClick={closeFeedback}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                disabled={actionLoading}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium
                           transition cursor-pointer disabled:opacity-60"
              >
                {actionLoading ? 'Sending…' : 'Submit Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark complete confirm */}
      {completing && (
        <ConfirmDialog
          title="Mark project as complete?"
          message={`"${completing.projectTitle}" by ${completing.name} will be marked as completed.`}
          confirmLabel="Mark Complete"
          loadingLabel="Saving…"
          confirmColor="bg-emerald-500 hover:bg-emerald-600"
          loading={actionLoading}
          onConfirm={confirmComplete}
          onCancel={() => setCompleting(null)}
        />
      )}

      <Toast toast={toast} />
    </>
  )
}