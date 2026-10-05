import { useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'

const MAX_MB = 10
const inputCls = 'w-full mt-1 text-sm outline-none border-b border-gray-200 py-1.5 focus:border-blue-500 bg-transparent'

// onSubmit({ file, category }) -> async; throw to keep the modal open
export default function UploadFile({ categories, onSubmit, onClose }) {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState(categories[0])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const pick = (f) => {
    if (!f) return
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`File is too large (max ${MAX_MB} MB)`)
      setFile(null)
      return
    }
    setError('')
    setFile(f)
  }

  const submit = async () => {
    if (!file) return setError('Please choose a file')
    setSaving(true)
    try {
      await onSubmit({ file, category })
      onClose()
    } catch {
      /* page shows the error toast */
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold text-gray-800 mb-4">Upload File</h3>

        <label className="block border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition">
          <FaCloudUploadAlt className="mx-auto text-blue-500 mb-2" size={28} />
          <p className="text-sm text-gray-700">{file ? file.name : 'Click to choose a file'}</p>
          <p className="text-xs text-gray-400 mt-1">PDF, DOCX, PNG, JPG up to {MAX_MB} MB</p>
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={(e) => pick(e.target.files[0])} />
        </label>

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 cursor-pointer">Cancel</button>
          <button onClick={submit} disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 cursor-pointer">
            {saving ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}