import { useRef, useState } from 'react'
import { FaFileAlt, FaArchive, FaFileCode, FaFileUpload } from 'react-icons/fa'

import BaseCard from '../../components/base-card/BaseCard'
import EmptyState from '../../components/empty-state/EmptyState'

const MAX_SIZE_MB = 20

const uploadTypes = [
  { key: 'report', title: 'Report', hint: 'PDF, DOC', accept: '.pdf,.doc,.docx', icon: <FaFileAlt /> },
  { key: 'presentation', title: 'Presentation', hint: 'PPT, PPTX, PDF', accept: '.ppt,.pptx,.pdf', icon: <FaArchive /> },
  { key: 'code', title: 'Code Files', hint: 'ZIP, RAR, TAR', accept: '.zip,.rar,.tar', icon: <FaFileCode /> },
]

function UploadBox({ type, file, onSelect }) {
  const inputRef = useRef(null)

  return (
    <div className="flex flex-col items-center text-center border-2 border-dashed border-slate-200 rounded-xl px-4 py-6">
      <span className="text-4xl text-slate-400 mb-2">{type.icon}</span>
      <h4 className="text-sm font-semibold text-slate-700">{type.title}</h4>
      <p className="text-xs text-slate-500 mt-1 mb-3">
        Upload your {type.title.toLowerCase()} ({type.hint})
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={type.accept}
        className="hidden"
        onChange={(e) => onSelect(type.key, e.target.files[0])}
      />
      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="text-sm font-semibold text-indigo-500 border border-indigo-500 rounded-lg px-4 py-1.5 hover:bg-indigo-50 transition"
      >
        Choose File
      </button>

      {file && <p className="text-xs text-green-600 mt-3 truncate max-w-full">{file.name}</p>}
    </div>
  )
}

export default function UploadFiles() {
  const [selected, setSelected] = useState({ report: null, presentation: null, code: null })
  const [uploaded, setUploaded] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSelect = (key, file) => {
    if (!file) return
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return setError(`${file.name} is larger than ${MAX_SIZE_MB} MB.`)
    }
    setError('')
    setSelected((prev) => ({ ...prev, [key]: file }))
  }

  const hasSelection = Object.values(selected).some(Boolean)

  const handleUpload = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(selected).forEach(([key, file]) => file && formData.append(key, file))
      // TODO: POST formData to API (e.g. /api/files/upload), then setUploaded(response.files)
      setSelected({ report: null, presentation: null, code: null })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <BaseCard title="Upload Project Files">
        <p className="text-xs text-slate-500 -mt-3 mb-4 pb-4 border-b border-slate-100">
          Upload your project documents including reports, presentations, and code files.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {uploadTypes.map((t) => (
            <UploadBox key={t.key} type={t} file={selected[t.key]} onSelect={handleSelect} />
          ))}
        </div>

        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!hasSelection || loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
          >
            {loading ? 'Uploading...' : 'Upload Selected Files'}
          </button>
        </div>
      </BaseCard>

      <BaseCard title="Uploaded Files">
        <p className="text-xs text-slate-500 -mt-3 mb-4 pb-4 border-b border-slate-100">
          Manage your uploaded project files
        </p>

        {uploaded.length === 0 ? (
          <EmptyState icon={<FaFileUpload />} message="No files uploaded yet" />
        ) : (
          uploaded.map((f) => (
            <div key={f._id} className="flex justify-between items-center border-b border-slate-100 py-2 last:border-0">
              <span className="text-sm text-slate-700">{f.name}</span>
              <span className="text-xs text-slate-400">{f.type}</span>
            </div>
          ))
        )}
      </BaseCard>
    </>
  )
}