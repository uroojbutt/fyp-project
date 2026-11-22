import { useState, useMemo } from 'react'
import { FaProjectDiagram, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import StatCard from '../../components/stat-card/StatCard'
import Toast from '../../components/toast/ToastMsg'
import ConfirmDialog from '../../components/confirm-dialogue/ConfirmDialogue'

const TOAST_DURATION = 3000
const STATUSES = ['pending', 'approved', 'rejected']

const STATUS_STYLES = {
    pending: 'bg-amber-50 text-amber-600',
    approved: 'bg-emerald-50 text-emerald-600',
    rejected: 'bg-red-50 text-red-600',
}

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

// TEMP dummy data - replace with API calls (getProjects, updateProjectStatus)
const DUMMY_PROJECTS = [
    {
        _id: 'dummy-1',
        title: 'Smart Attendance System',
        description: 'Face-recognition based attendance for classrooms using a web camera.',
        studentName: 'Ali Raza',
        supervisor: 'Dr. Ahmed',
        status: 'pending',
        remarks: '',
        createdAt: '2026-09-30T10:00:00Z',
    },
    {
        _id: 'dummy-2',
        title: 'Campus Bus Tracker',
        description: 'Live bus location tracking and arrival alerts for students.',
        studentName: 'Sara Khan',
        supervisor: 'Ms. Fatima',
        status: 'approved',
        remarks: '',
        createdAt: '2026-09-28T09:30:00Z',
    },
    {
        _id: 'dummy-3',
        title: 'E-Library Portal',
        description: 'A simple portal for browsing and issuing library books.',
        studentName: 'Hamza Tariq',
        supervisor: 'Dr. Ahmed',
        status: 'rejected',
        remarks: 'Scope is too small for an FYP. Add a recommendation module.',
        createdAt: '2026-10-01T14:10:00Z',
    },
    {
        _id: 'dummy-4',
        title: 'Hospital Appointment Manager',
        description: 'Online doctor appointment booking with reminders.',
        studentName: 'Ayesha Noor',
        supervisor: 'Mr. Bilal',
        status: 'pending',
        remarks: '',
        createdAt: '2026-10-02T12:15:00Z',
    },
]

export default function AdminProjects() {
    const [projects, setProjects] = useState(DUMMY_PROJECTS)
    const [loading] = useState(false)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('all')
    const [approving, setApproving] = useState(null)
    const [rejecting, setRejecting] = useState(null)
    const [remarks, setRemarks] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [toast, setToast] = useState(null)

    const showToast = (msg, success = true) => {
        setToast({ msg, success })
        setTimeout(() => setToast(null), TOAST_DURATION)
    }

    const countBy = (s) => projects.filter((p) => p.status === s).length

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return projects.filter(
            (p) =>
                (status === 'all' || p.status === status) &&
                (!q || p.title.toLowerCase().includes(q) || p.studentName?.toLowerCase().includes(q))
        )
    }, [projects, search, status])

    // ── Actions (swap bodies for PATCH /api/projects/:id/status later) ──
    const updateStatus = async (id, newStatus, newRemarks = '') => {
        setActionLoading(true)
        setProjects((prev) =>
            prev.map((p) => (p._id === id ? { ...p, status: newStatus, remarks: newRemarks } : p))
        )
        setActionLoading(false)
    }

    const confirmApprove = async () => {
        await updateStatus(approving._id, 'approved')
        showToast('Project approved successfully', true)
        setApproving(null)
    }

    const confirmReject = async () => {
        if (!remarks.trim()) return showToast('Please add a reason for rejection', false)
        await updateStatus(rejecting._id, 'rejected', remarks.trim())
        showToast('Project rejected', true)
        closeReject()
    }

    const closeReject = () => {
        setRejecting(null)
        setRemarks('')
    }

    return (
        <>
            {/* Header */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h1 className="text-lg font-semibold text-gray-800">Projects</h1>
                <p className="text-sm text-gray-500">Review student project proposals and approve or reject them</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon={<FaProjectDiagram />} label="Total Projects" value={projects.length}
                    color="bg-blue-50" iconColor="text-blue-500" bg="#e0f2fe" />
                <StatCard icon={<FaClock />} label="Pending" value={countBy('pending')}
                    color="bg-amber-50" iconColor="text-amber-500" bg="#fef3c7" />
                <StatCard icon={<FaCheckCircle />} label="Approved" value={countBy('approved')}
                    color="bg-emerald-50" iconColor="text-emerald-500" bg="#dcfce7" />
                <StatCard icon={<FaTimesCircle />} label="Rejected" value={countBy('rejected')}
                    color="bg-red-50" iconColor="text-red-500" bg="#fee2e2" />
            </div>

            {/* Search + filter */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row gap-4 sm:items-end">
                <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Search Projects</label>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by project title or student name..."
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
                        <option value="all">All Statuses</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
                {loading ? (
                    <p className="p-5 text-sm text-gray-500">Loading projects...</p>
                ) : filtered.length === 0 ? (
                    <p className="p-5 text-sm text-gray-500">No projects match your search.</p>
                ) : (
                    filtered.map((p) => (
                        <div key={p._id} className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h2 className="text-sm font-semibold text-gray-800">{p.title}</h2>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[p.status]}`}>
                                        {p.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{p.description}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {p.studentName} · Supervisor: {p.supervisor} · Submitted {formatDate(p.createdAt)}
                                </p>
                                {p.status === 'rejected' && p.remarks && (
                                    <p className="text-xs text-red-500 mt-1">Reason: {p.remarks}</p>
                                )}
                            </div>

                            {p.status === 'pending' && (
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => setApproving(p)}
                                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => setRejecting(p)}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition cursor-pointer"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Approve confirm */}
            {approving && (
                <ConfirmDialog
                    title="Approve project?"
                    message={`"${approving.title}" will be marked as approved and the student will be notified.`}
                    confirmLabel="Approve"
                    loadingLabel="Approving…"
                    confirmColor="bg-emerald-500 hover:bg-emerald-600"
                    loading={actionLoading}
                    onConfirm={confirmApprove}
                    onCancel={() => setApproving(null)}
                />
            )}

            {/* Reject modal (needs a reason) */}
            {rejecting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <h2 className="text-base font-semibold text-gray-800">Reject project</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Tell the student why "{rejecting.title}" was rejected so they can improve it.
                        </p>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows={4}
                            placeholder="Reason for rejection..."
                            className="w-full mt-4 text-sm outline-none border border-gray-200 rounded-lg p-3 focus:border-blue-500 resize-none"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={closeReject}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReject}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-60"
                            >
                                Reject project
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toast toast={toast} />
        </>
    )
}