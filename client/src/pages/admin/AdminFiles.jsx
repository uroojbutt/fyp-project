import { useState, useMemo } from 'react'
import { FaFolderOpen, FaFileAlt, FaBook, FaPlus } from 'react-icons/fa'
import StatCard from '../../components/stat-card/StatCard'
import Toast from '../../components/toast/ToastMsg'
import ConfirmDialog from '../../components/confirm-dialogue/ConfirmDialogue'
import FileList from '../../components/list/FileList'
import UploadFile from '../../components/upload-file/UploadFile'

const TOAST_DURATION = 3000
const CATEGORIES = ['Guidelines', 'Templates', 'Submissions']

const formatSize = (bytes) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

// TEMP dummy data - replace with API calls (getFiles, uploadFile, deleteFile)
const DUMMY_FILES = [
  { _id: 'dummy-1', name: 'FYP_Guidelines.pdf', size: 1.2 * 1024 * 1024, category: 'Guidelines', uploadedBy: 'Admin', createdAt: '2026-09-30T10:00:00Z' },
  { _id: 'dummy-2', name: 'Proposal_Template.docx', size: 340 * 1024, category: 'Templates', uploadedBy: 'Admin', createdAt: '2026-09-28T09:30:00Z' },
  { _id: 'dummy-3', name: 'Group_A_SRS.pdf', size: 2.8 * 1024 * 1024, category: 'Submissions', uploadedBy: 'Ali Raza', createdAt: '2026-10-01T14:10:00Z' },
  { _id: 'dummy-4', name: 'System_Diagram.png', size: 860 * 1024, category: 'Submissions', uploadedBy: 'Sara Khan', createdAt: '2026-10-02T12:15:00Z' },
].map((f) => ({ ...f, sizeLabel: formatSize(f.size) }))

export default function AdminFiles() {
  const [files, setFiles] = useState(DUMMY_FILES)
  const [loading] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [showUpload, setShowUpload] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, success = true) => {
    setToast({ msg, success })
    setTimeout(() => setToast(null), TOAST_DURATION)
  }

  const countBy = (c) => files.filter((f) => f.category === c).length

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return files.filter(
      (f) =>
        (category === 'all' || f.category === category) &&
        (!q || f.name.toLowerCase().includes(q) || f.uploadedBy?.toLowerCase().includes(q))
    )
  }, [files, search, category])

  // ── Actions (swap bodies for API calls later) ──
  const handleUpload = async ({ file, category }) => {
    setFiles((prev) => [
      {
        _id: String(Date.now()),
        name: file.name,
        size: file.size,
        sizeLabel: formatSize(file.size),
        category,
        uploadedBy: 'Admin',
        createdAt: new Date().toISOString(),
        url: URL.createObjectURL(file), // local preview only
      },
      ...prev,
    ])
    showToast('File uploaded successfully', true)
  }

  const handleDownload = (f) => {
    if (!f.url) return showToast('Sample file - nothing to download', false)
    const a = document.createElement('a')
    a.href = f.url
    a.download = f.name
    a.click()
  }

  const confirmDelete = async () => {
    setDeleteLoading(true)
    setFiles((prev) => prev.filter((f) => f._id !== deleting._id))
    showToast('File deleted successfully', true)
    setDeleting(null)
    setDeleteLoading(false)
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Files</h1>
          <p className="text-sm text-gray-500">Manage guidelines, templates and student submissions</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600
                     text-white rounded-lg text-sm font-medium transition cursor-pointer"
        >
          <FaPlus size={11} /> Upload File
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<FaFolderOpen />} label="Total Files" value={files.length}
          color="bg-blue-50" iconColor="text-blue-500" bg="#e0f2fe" />
        <StatCard icon={<FaBook />} label="Guidelines" value={countBy('Guidelines')}
          color="bg-purple-50" iconColor="text-purple-500" bg="#f3e8ff" />
        <StatCard icon={<FaFileAlt />} label="Templates" value={countBy('Templates')}
          color="bg-amber-50" iconColor="text-amber-500" bg="#fef3c7" />
        <StatCard icon={<FaFileAlt />} label="Submissions" value={countBy('Submissions')}
          color="bg-emerald-50" iconColor="text-emerald-500" bg="#dcfce7" />
      </div>

      {/* Search + filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">Search Files</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name or uploader..."
            className="w-full mt-1 text-sm outline-none border-b border-gray-200 py-1.5 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block">Filter by Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 text-sm outline-none border-b border-gray-200 py-1.5 bg-transparent cursor-pointer"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      <FileList files={filtered} loading={loading} onDownload={handleDownload} onDelete={setDeleting} />

      {/* Modals + toast */}
      {showUpload && <UploadFile categories={CATEGORIES} onSubmit={handleUpload} onClose={() => setShowUpload(false)} />}
      {deleting && (
        <ConfirmDialog
          title="Delete file?"
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