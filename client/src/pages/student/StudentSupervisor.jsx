import { useState } from 'react'

import BaseCard from '../../components/base-card/BaseCard'

// ---- Sample data: replace with your API calls later ----
const sampleProject = {
  title: 'Smart Deadline & Project Tracking System',
  status: 'Pending',
  deadline: null,
  createdAt: '2026-01-09',
  description:
    'This project is a web-based system designed to help universities manage student projects and their deadlines efficiently. Supervisors can assign deadlines to approved projects, while students can easily view their project status and submission dates. The system provides real-time updates, role-based access, and a clear overview of project progress, making project management simple, transparent, and organized.',
}

const sampleSupervisors = [
  { id: 1, name: 'Dr. Ahmed Raza', department: 'Computer Science', email: 'ahmed.raza@university.edu', expertise: 'Computer Networks' },
  { id: 2, name: 'Prof. Sana Khan', department: 'Data Science', email: 'sana.khan@university.edu', expertise: 'Machine Learning' },
  { id: 3, name: 'Mr. Bilal Hussain', department: 'Mechanical Engineering', email: 'bilal.hussain@university.edu', expertise: 'Blockchain Technology' },
  { id: 4, name: 'Ms. Ayesha Malik', department: 'Electrical Engineering', email: 'ayesha.malik@university.edu', expertise: 'Cybersecurity' },
  { id: 5, name: 'Dr. Usman Ali', department: 'Data Science', email: 'usman.ali@university.edu', expertise: 'Artificial Intelligence' },
  { id: 6, name: 'Dr. Aneela', department: 'Electrical Engineering', email: 'aneela@gmail.com', expertise: 'Database Systems' },
]

// Full class names (Tailwind needs them written out, not built from strings)
const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-600',
}

// 2026-01-09 -> "9th January 2026"
function formatDate(value) {
  if (!value) return null
  const d = new Date(value)
  const day = d.getDate()
  const suffix =
    day % 10 === 1 && day !== 11 ? 'st'
    : day % 10 === 2 && day !== 12 ? 'nd'
    : day % 10 === 3 && day !== 13 ? 'rd'
    : 'th'
  const month = d.toLocaleString('en-GB', { month: 'long' })
  return `${day}${suffix} ${month} ${d.getFullYear()}`
}

function Avatar({ name }) {
  const letter = name.replace(/^(Dr|Prof|Mr|Ms)\.?\s*/i, '').charAt(0)
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
      {letter}
    </div>
  )
}

function Divider() {
  return <div className="-mt-3 mb-4 border-b border-slate-100" />
}

function Label({ children }) {
  return <p className="text-xs text-slate-500 uppercase mb-1">{children}</p>
}

export default function StudentSupervisor() {
  const [project] = useState(sampleProject)
  const [supervisor] = useState(null) // set to a supervisor object once assigned
  const [supervisors] = useState(sampleSupervisors)
  const [requestedIds, setRequestedIds] = useState([])

  // Modal state: the supervisor being requested (null = modal closed)
  const [modalSupervisor, setModalSupervisor] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const openModal = (s) => {
    setMessage('')
    setModalSupervisor(s)
  }

  const closeModal = () => {
    if (sending) return
    setModalSupervisor(null)
    setMessage('')
  }

  const handleSend = async () => {
    setSending(true)
    try {
      // TODO: call your API here, e.g.
      // await api.post('/requests', { supervisorId: modalSupervisor.id, message })
      setRequestedIds((prev) => [...prev, modalSupervisor.id])
      setModalSupervisor(null)
      setMessage('')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <BaseCard title="Current Supervisor">
        <Divider />
        {supervisor ? (
          <div className="flex items-center gap-3">
            <Avatar name={supervisor.name} />
            <div>
              <h4 className="text-sm font-semibold text-slate-700">{supervisor.name}</h4>
              <p className="text-xs text-slate-500">{supervisor.department}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-6">Supervisor not assigned yet.</p>
        )}
      </BaseCard>

      <BaseCard title="Project Details">
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label>Project Title</Label>
            <p className="text-sm font-semibold text-slate-700">{project.title}</p>
          </div>
          <div>
            <Label>Deadline</Label>
            <p className="text-sm font-semibold text-slate-700">
              {formatDate(project.deadline) ?? 'No deadline set'}
            </p>
          </div>
          <div>
            <Label>Status</Label>
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                statusStyles[project.status] ?? 'bg-slate-100 text-slate-600'
              }`}
            >
              {project.status}
            </span>
          </div>
          <div>
            <Label>Created</Label>
            <p className="text-sm font-semibold text-slate-700">{formatDate(project.createdAt)}</p>
          </div>
        </div>

        <div className="mt-5">
          <Label>Description</Label>
          <p className="text-sm text-slate-600 leading-relaxed">{project.description}</p>
        </div>
      </BaseCard>

      <BaseCard title="Available Supervisors">
        <p className="text-xs text-slate-500 -mt-3 mb-4 pb-4 border-b border-slate-100">
          Browse and request supervision from available faculty members
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supervisors.map((s) => {
            const requested = requestedIds.includes(s.id)
            return (
              <div key={s.id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={s.name} />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700">{s.name}</h4>
                    <p className="text-xs text-slate-500">{s.department}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400">Email</p>
                <p className="text-sm text-slate-700 mb-3 break-all">{s.email}</p>

                <p className="text-xs text-slate-400">Expertise</p>
                <p className="text-sm text-slate-700 mb-4">{s.expertise}</p>

                <button
                  type="button"
                  onClick={() => openModal(s)}
                  disabled={requested || Boolean(supervisor)}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-lg transition"
                >
                  {requested ? 'Request Sent' : 'Request Supervisor'}
                </button>
              </div>
            )
          })}
        </div>
      </BaseCard>

      {/* Request Supervision modal */}
      {modalSupervisor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 id="request-title" className="text-base font-semibold text-slate-800">
                Request Supervision
              </h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="text-xl leading-none text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-slate-600 mb-5">
              {modalSupervisor.name}
            </div>

            <label htmlFor="request-message" className="block text-sm font-medium text-slate-700 mb-2">
              Message to Supervisor
            </label>
            <textarea
              id="request-message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain your project idea..."
              className="w-full resize-none rounded-lg border border-indigo-500 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />

            <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={closeModal}
                className="text-sm font-semibold text-indigo-500 border border-indigo-500 rounded-lg px-5 py-2 hover:bg-indigo-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim() || sending}
                className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
              >
                {sending ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}