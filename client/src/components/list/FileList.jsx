import { FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaDownload } from 'react-icons/fa'
import DataList from '../data-list/DataList'
import StatusBadge from '../status-badge/StatusBadge'

const ext = (name = '') => name.split('.').pop().toLowerCase()

export const fileIcon = (name) => {
  const e = ext(name)
  if (e === 'pdf') return <FaFilePdf className="text-red-400" />
  if (['doc', 'docx'].includes(e)) return <FaFileWord className="text-blue-500" />
  if (['png', 'jpg', 'jpeg'].includes(e)) return <FaFileImage className="text-emerald-500" />
  return <FaFileAlt className="text-gray-400" />
}

const categoryTone = { Guidelines: 'blue', Templates: 'amber', Submissions: 'green' }

const columns = [
  { header: 'File', render: (f) => (
      <div className="flex items-center gap-3">
        <span className="text-xl">{fileIcon(f.name)}</span>
        <div>
          <div className="font-semibold text-gray-800 text-sm">{f.name}</div>
          <div className="text-xs text-gray-500">{f.sizeLabel}</div>
        </div>
      </div>
  )},
  { header: 'Category', render: (f) => <StatusBadge tone={categoryTone[f.category] || 'blue'}>{f.category}</StatusBadge> },
  { header: 'Uploaded By', render: (f) => f.uploadedBy || '—' },
  { header: 'Date', render: (f) => (f.createdAt ? new Date(f.createdAt).toLocaleString() : '—') },
]

// Delete -> the page's own ConfirmDialog. Download -> extra action button.
export default function FileList({ files, loading, onDownload, onDelete }) {
  return (
    <DataList
      title="All Files"
      columns={columns}
      rows={files}
      loading={loading}
      emptyText="No files found"
      onDelete={onDelete}
      confirmDelete={false}
      actions={(f) => (
        <button
          onClick={() => onDownload(f)}
          title="Download"
          className="px-3 py-2 rounded-lg text-sm text-white bg-emerald-500 hover:bg-emerald-600 transition cursor-pointer"
        >
          <FaDownload />
        </button>
      )}
    />
  )
}