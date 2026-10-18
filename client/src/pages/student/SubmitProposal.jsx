import { useState } from 'react'
import BaseCard from '../../components/base-card/BaseCard'

const inputClass =
  'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 ' +
  'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition'

export default function SubmitProposal() {
  const [form, setForm] = useState({ title: '', description: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setSuccess(false)
  }

  const validate = () => {
    const next = {}
    if (!form.title.trim()) next.title = 'Project title is required.'
    if (!form.description.trim()) next.description = 'Project description is required.'
    else if (form.description.trim().length < 30) next.description = 'Please write at least 30 characters.'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate()
    if (Object.keys(found).length) return setErrors(found)

    setLoading(true)
    try {
      // TODO: POST form to API (e.g. /api/proposals)
      setSuccess(true)
      setForm({ title: '', description: '' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <BaseCard title="Submit Proposal">
      <p className="text-xs text-slate-500 -mt-3 mb-4 pb-4 border-b border-slate-100">
        Please fill out all sections of your project proposal. Make sure to be detailed and clear about your project goals.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="title" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Project Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter your project title"
            className={inputClass}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Project Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            placeholder="Provide a detailed description of your project..."
            className={`${inputClass} resize-y`}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
          {success && <p className="text-xs text-green-600">Proposal submitted successfully.</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition cursor-pointer"
          >
            {loading ? 'Submitting...' : 'Submit Proposal'}
          </button>
        </div>
      </form>
    </BaseCard>
  )
}