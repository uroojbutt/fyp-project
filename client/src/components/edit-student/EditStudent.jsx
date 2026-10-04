import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import API from '../../api/axios'
import { DEPARTMENTS } from '../../constants/Departments'

const inputClass =
  'w-full border-b border-gray-200 py-2 text-sm outline-none mb-4 bg-transparent focus:border-blue-400 transition'

export default function EditStudent({ student, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: student.name || '',
    email: student.email || '',
    department: student.department || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.department) {
      setError('All fields are required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/${student._id || student.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(form),
      })
      if (res.ok) {
        onSuccess?.('Student updated successfully')
        onClose()
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data?.message || 'Failed to update student.')
      }
    } catch {
      setError('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm relative shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
          <FaTimes size={15} />
        </button>
        <h2 className="text-lg font-semibold mb-1">Edit Student</h2>
        <p className="text-xs text-gray-400 mb-5">Update student details</p>

        {error && <p className="text-red-500 text-xs mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <input className={inputClass} placeholder="Full Name" value={form.name} onChange={set('name')} />
        <input className={inputClass} placeholder="Email" type="email" value={form.email} onChange={set('email')} />
        <select className={inputClass} value={form.department} onChange={set('department')}>
          <option value="">Select Department</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>

        <div className="flex gap-3 justify-end mt-2">
          <button onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-200 text-red-500 font-medium hover:bg-gray-50 transition text-sm">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition text-sm disabled:opacity-60">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}