import { useState, useMemo } from 'react'
import Toast from '../../components/toast/ToastMsg'
import ConfirmDialog from '../../components/confirm-dialogue/ConfirmDialogue'

const TOAST_DURATION = 3000
const STATUSES = ['pending', 'accepted', 'rejected']

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })

// TEMP dummy data - replace with API calls (getRequests, updateRequestStatus)
// projectStatus = admin's decision on the student's proposal (pending | approved | rejected)
// supervisorAssigned = true when another supervisor already has this student
const DUMMY_REQUESTS = [
  {
    _id: 'req-1',
    studentName: 'Ahmed Saeed',
    email: 'ahmed.saeed.student.edu@gmail.com',
    projectTitle: 'Smart Deadline & Project Tracking System',
    projectStatus: 'pending',
    supervisorAssigned: false,
    status: 'pending',
    createdAt: '2026-01-09T16:00:40Z',
  },
  {
    _id: 'req-2',
    studentName: 'Maryam Iqbal',
    email: 'maryam.iqbal@student.edu',
    projectTitle: 'Inventory Management System for SMEs',
    projectStatus: 'approved',
    supervisorAssigned: true,
    status: 'pending',
    createdAt: '2026-01-09T15:10:15Z',
  },
  {
    _id: 'req-3',
    studentName: 'Bilal Hussain',
    email: 'bilal.hussain@student.edu',
    projectTitle: 'Online Exam Proctoring Tool',
    projectStatus: 'approved',
    supervisorAssigned: false,
    status: 'pending',
    createdAt: '2026-01-08T11:20:00Z',
  },
]

// Why Accept is blocked (null = teacher can accept)
const getBlockReason = (r) => {
  if (r.supervisorAssigned) return 'Supervisor already assigned'
  if (r.projectStatus !== 'approved') return 'Project proposal pending'
  return null
}

const cardTint = (r) => {
  if (r.status !== 'pending') return 'bg-white border-gray-100'
  if (r.supervisorAssigned) return 'bg-sky-50 border-sky-200'
  if (r.projectStatus !== 'approved') return 'bg-amber-50 border-amber-200'
  return 'bg-white border-gray-100'
}

export default function PendingRequests() {
  const [requests, setRequests] = useState(DUMMY_REQUESTS)
  const [loading] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [accepting, setAccepting] = useState(null)
  const [rejecting, setRejecting] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, success = true) => {
    setToast({ msg, success })
    setTimeout(() => setToast(null), TOAST_DURATION)
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return requests.filter(
      (r) =>
        (status === 'all' || r.status === status) &&
        (!q || r.studentName.toLowerCase().includes(q) || r.projectTitle.toLowerCase().includes(q))
    )
  }, [requests, search, status])

  // ── Actions (swap bodies for PATCH /api/requests/:id later) ──
  const updateStatus = async (id, newStatus) => {
    setActionLoading(true)
    setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r)))
    setActionLoading(false)
  }

  const confirmAccept = async () => {
    await updateStatus(accepting._id, 'accepted')
    showToast('Request accepted successfully', true)
    setAccepting(null)
  }

  const confirmReject = async () => {
    await updateStatus(rejecting._id, 'rejected')
    showToast('Request rejected', true)
    setRejecting(null)
  }

  return (
    <>
      {/* Header + search + filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h1 className="text-lg font-semibold text-gray-800">Pending Supervision Requests</h1>
        <p className="text-sm text-gray-500">Review and respond to student supervision requests</p>

        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Search Requests</label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or project title..."
              className="w-full mt-1 text-sm outline-none border-b border-gray-200 py-1.5 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block">Filter by Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 text-sm outline-none border-b border-gray-200 py-1.5 bg-transparent cursor-pointer"
            >
              <option value="all">All Requests</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Request cards */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading requests...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">No requests match your search.</p>
        </div>
      ) : (
        filtered.map((r) => {
          const blockReason = getBlockReason(r)
          const isPending = r.status === 'pending'
          return (
            <div
              key={r._id}
              className={`rounded-xl border p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${cardTint(r)}`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm font-semibold text-gray-800">{r.studentName}</h2>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[r.status]}`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{r.email}</p>
                <p className="text-sm font-medium text-gray-800 mt-2">{r.projectTitle}</p>
                <p className="text-xs text-gray-400 mt-1">Submitted: {formatDate(r.createdAt)}</p>
                {isPending && blockReason && (
                  <p className="text-xs font-semibold text-gray-700 mt-2">{blockReason}</p>
                )}
              </div>

              {isPending && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setAccepting(r)}
                    disabled={!!blockReason}
                    title={blockReason || 'Accept this request'}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition
                      ${blockReason
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer'}`}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setRejecting(r)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          )
        })
      )}

      {/* Accept confirm */}
      {accepting && (
        <ConfirmDialog
          title="Accept request?"
          message={`You will become the supervisor of ${accepting.studentName} for "${accepting.projectTitle}".`}
          confirmLabel="Accept"
          loadingLabel="Accepting…"
          confirmColor="bg-emerald-500 hover:bg-emerald-600"
          loading={actionLoading}
          onConfirm={confirmAccept}
          onCancel={() => setAccepting(null)}
        />
      )}

      {/* Reject confirm */}
      {rejecting && (
        <ConfirmDialog
          title="Reject request?"
          message={`The supervision request from ${rejecting.studentName} will be rejected.`}
          confirmLabel="Reject"
          loadingLabel="Rejecting…"
          loading={actionLoading}
          onConfirm={confirmReject}
          onCancel={() => setRejecting(null)}
        />
      )}

      <Toast toast={toast} />
    </>
  )
}