import { useState, useEffect, useMemo } from 'react'
import { FaTimes } from 'react-icons/fa'

// Change to match your backend. Expected item shape:
// { _id, fileName, projectTitle, studentName, url }
const FILES_URL = 'http://localhost:4000/api/files'

const getToken = () => {
  try { return JSON.parse(localStorage.getItem('user') || '{}')?.token || localStorage.getItem('token') || '' }
  catch { return '' }
}

export default function ViewReport({ onClose }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const token = getToken()
        const res = await fetch(FILES_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json()
        if (!res.ok) throw new Error()
        setFiles(Array.isArray(data) ? data : data.files || [])
      } catch {
        setError('Could not load files.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return files
    return files.filter((f) =>
      [f.fileName, f.projectTitle, f.studentName].some((v) => v?.toLowerCase().includes(q))
    )
  }, [files, search])

  // Fetch as blob so the browser downloads instead of navigating (works cross-origin)
  const handleDownload = async (file) => {
    try {
      const res = await fetch(file.url)
      const blob = await res.blob()
      const href = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = href
      a.download = file.fileName || 'file'
      a.click()
      URL.revokeObjectURL(href)
    } catch {
      window.open(file.url, '_blank') // fallback
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Files</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaTimes size={15} />
          </button>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by file name, project title, or student name"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none
                     focus:border-blue-400 transition mb-4"
        />

        <div className="overflow-y-auto flex flex-col gap-3">
          {loading && <p className="text-sm text-gray-400 text-center py-6">Loading files…</p>}
          {error && <p className="text-sm text-red-500 text-center py-6">{error}</p>}
          {!loading && !error && filtered.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">No files found.</p>
          )}
          {filtered.map((f) => (
            <div key={f._id || f.id}
              className="flex items-center justify-between gap-3 bg-gray-50 rounded-lg px-4 py-3">
              <div className="min-w-0">
                <div className="font-semibold text-sm text-gray-800 truncate">{f.fileName}</div>
                <div className="text-xs text-gray-500 truncate">{f.projectTitle} - {f.studentName}</div>
              </div>
              <button onClick={() => handleDownload(f)}
                className="shrink-0 px-3 py-1.5 border border-blue-500 text-blue-600 rounded-lg
                           text-sm font-medium hover:bg-blue-50 transition">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}