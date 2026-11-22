import { useState, useMemo } from 'react'
import {
  FaFolderOpen, FaFileAlt, FaFilePdf, FaFileWord, FaFilePowerpoint,
  FaFileCode, FaFileImage, FaDownload, FaThLarge, FaList,
} from 'react-icons/fa'
import StatCard from '../../components/stat-card/StatCard'
import Toast from '../../components/toast/ToastMsg'

const TOAST_DURATION = 3000

// Category is worked out from the file extension, so the backend only needs to send the file name
const EXTENSIONS = {
  report: ['pdf', 'doc', 'docx', 'txt'],
  presentation: ['ppt', 'pptx'],
  code: ['zip', 'rar', 'js', 'jsx', 'py', 'java', 'cpp', 'html', 'css'],
  image: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],
}

const FILTERS = [
  { value: 'all', label: 'All Files' },
  { value: 'report', label: 'Reports' },
  { value: 'presentation', label: 'Presentations' },
  { value: 'code', label: 'Code Files' },
  { value: 'image', label: 'Images' },
]

const getExt = (name) => name.split('.').pop().toLowerCase()

const getCategory = (name) => {
  const ext = getExt(name)
  return Object.keys(EXTENSIONS).find((c) => EXTENSIONS[c].includes(ext)) || 'other'
}

const getFileIcon = (name, size = 28) => {
  const ext = getExt(name)
  if (ext === 'pdf') return <FaFilePdf size={size} className="text-red-500" />
  if (ext === 'doc' || ext === 'docx') return <FaFileWord size={size} className="text-blue-500" />
  if (ext === 'ppt' || ext === 'pptx') return <FaFilePowerpoint size={size} className="text-orange-500" />
  const cat = getCategory(name)
  if (cat === 'code') return <FaFileCode size={size} className="text-purple-500" />
  if (cat === 'image') return <FaFileImage size={size} className="text-pink-500" />
  return <FaFileAlt size={size} className="text-gray-400" />
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })

// TEMP dummy data - replace with API call (getStudentFiles, downloadFile)
// These are files from the students assigned to this teacher.
const DUMMY_FILES = [
  { _id: 'f-1', name: 'Zeeshan Khan (1).docx', studentName: 'Ahmed Saeed', projectTitle: '', createdAt: '2026-01-09T10:00:00Z' },
  { _id: 'f-2', name: 'Solar Hybird Invertor Parts List (1) (1) (3).pdf', studentName: 'Hira Aslam', projectTitle: '', createdAt: '2026-01-08T10:00:00Z' },
  { _id: 'f-3', name: 'Solar Hybird Invertor Parts List (1) (1).pdf', studentName: 'Laiba Noor', projectTitle: '', createdAt: '2026-01-08T09:00:00Z' },
]

export default function TeacherFiles() {
  const [files] = useState(DUMMY_FILES)
  const [loading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState('grid')
  const [toast, setToast] = useState(null)

  const showToast = (msg, success = true) => {
    setToast({ msg, success })
    setTimeout(() => setToast(null), TOAST_DURATION)
  }

  const countBy = (c) => files.filter((f) => getCategory(f.name) === c).length

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return files.filter(
      (f) =>
        (filter === 'all' || getCategory(f.name) === filter) &&
        (!q || f.name.toLowerCase().includes(q) || f.studentName?.toLowerCase().includes(q))
    )
  }, [files, filter, search])

  // swap for a real download (e.g. GET /api/files/:id/download) later
  const handleDownload = (f) => {
    if (!f.url) return showToast('Sample file - nothing to download', false)
    const a = document.createElement('a')
    a.href = f.url
    a.download = f.name
    a.click()
  }

  const downloadBtn = (f, extra = '') => (
    <button
      onClick={() => handleDownload(f)}
      className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                  rounded-lg text-sm font-medium transition cursor-pointer ${extra}`}
    >
      <FaDownload size={12} /> Download
    </button>
  )

  return (
    <>
      {/* Header, filters, stats */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h1 className="text-lg font-semibold text-gray-800">Student Files</h1>
          <p className="text-xs text-gray-500">Manage files shared with and received from students</p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm outline-none border border-gray-200 rounded-lg px-3 py-2 bg-white cursor-pointer"
          >
            {FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="flex-1 sm:max-w-xs text-sm outline-none border border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500"
          />
          <div className="flex gap-1 sm:ml-auto">
            <button
              onClick={() => setView('grid')}
              title="Grid view"
              className={`p-2 rounded-lg transition cursor-pointer ${view === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setView('list')}
              title="List view"
              className={`p-2 rounded-lg transition cursor-pointer ${view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FaList />
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard icon={<FaFolderOpen />} label="Total Files" value={files.length}
            iconColor="text-blue-500" bg="#e0f2fe" />
          <StatCard icon={<FaFileAlt />} label="Reports" value={countBy('report')}
            iconColor="text-emerald-500" bg="#dcfce7" />
          <StatCard icon={<FaFilePowerpoint />} label="Presentations" value={countBy('presentation')}
            iconColor="text-orange-500" bg="#ffedd5" />
          <StatCard icon={<FaFileCode />} label="Code Files" value={countBy('code')}
            iconColor="text-purple-500" bg="#f3e8ff" />
          <StatCard icon={<FaFileImage />} label="Images" value={countBy('image')}
            iconColor="text-pink-500" bg="#fce7f3" />
        </div>
      </div>

      {/* Files */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading files...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-sm text-gray-500">No files found</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((f) => (
            <div key={f._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
              <div className="flex justify-center">{getFileIcon(f.name)}</div>
              <p className="text-sm font-semibold text-gray-800 mt-3 break-words">{f.name}</p>
              <p className="text-xs text-gray-500 mt-1">{f.studentName}</p>
              <p className="text-xs text-gray-400">{f.projectTitle || '-'}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(f.createdAt)}</p>
              {downloadBtn(f, 'w-full mt-4 py-2.5')}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
          {filtered.map((f) => (
            <div key={f._id} className="p-4 flex items-center gap-4">
              <div className="shrink-0">{getFileIcon(f.name, 22)}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate">{f.name}</p>
                <p className="text-xs text-gray-500">
                  {f.studentName} · {formatDate(f.createdAt)}
                </p>
              </div>
              {downloadBtn(f, 'px-4 py-2 shrink-0')}
            </div>
          ))}
        </div>
      )}

      <Toast toast={toast} />
    </>
  )
}