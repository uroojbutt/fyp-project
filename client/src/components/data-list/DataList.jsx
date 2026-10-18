import { useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'

const rowId = (r) => r._id || r.id

/* ───────────── Modal shell ───────────── */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-semibold text-gray-800 mb-4">{title}</h3>
        {children}
      </div>
    </div>
  )
}

/* ───────────── Edit modal (built from editFields) ───────────── */
export function  EditModal({ row, fields, title, onSave, onClose }) {
  const [form, setForm] = useState(() => ({ ...row }))
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } catch {
      /* page shows the error toast; keep modal open */
    } finally {
      setSaving(false)
    }
  }

  const set = (name, value) => setForm((p) => ({ ...p, [name]: value }))
  const inputCls = 'w-full mt-1 text-sm outline-none border-b border-gray-200 py-1.5 focus:border-blue-500 bg-transparent'

  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="text-sm font-medium text-gray-700">{f.label}</label>
            {f.type === 'select' ? (
              <select value={form[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} className={inputCls}>
                {f.options.map((o) => (
                  <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
                ))}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea rows={3} value={form[f.name] || ''} onChange={(e) => set(f.name, e.target.value)} className={inputCls} />
            ) : (
              <input
                type={f.type || 'text'}
                value={f.type === 'date' ? String(form[f.name] || '').slice(0, 10) : form[f.name] || ''}
                onChange={(e) => set(f.name, e.target.value)}
                className={inputCls}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 cursor-pointer">Cancel</button>
        <button
          onClick={submit}
          disabled={saving}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 cursor-pointer"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </Modal>
  )
}

/* ───────────── Delete confirm modal ───────────── */
function ConfirmModal({ message, onConfirm, onClose }) {
  const [busy, setBusy] = useState(false)
  const confirm = async () => {
    setBusy(true)
    try {
      await onConfirm()
      onClose()
    } catch {
      /* page shows the error toast */
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal title="Confirm Delete" onClose={onClose}>
      <p className="text-sm text-gray-600">{message}</p>
      <div className="flex justify-end gap-2 mt-6">
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 cursor-pointer">Cancel</button>
        <button
          onClick={confirm}
          disabled={busy}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-400 hover:bg-red-500 disabled:bg-red-300 cursor-pointer"
        >
          {busy ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  )
}

/* ───────────── DataList ─────────────
  title        card heading
  columns      [{ header, render: (row) => node }]
  rows, loading, emptyText
  editFields   [{ name, label, type?: text|date|textarea|select, options? }]  -> enables Edit button + modal
  onSave       async (updatedRow) => void       (required with editFields)
  onDelete     async (row) => void              -> enables Delete button + confirm modal
  deleteMessage (row) => string                 optional custom confirm text
  actions      (row) => node                    optional extra buttons (e.g. Assign)
*/
export default function DataList({
  title, columns, rows, loading = false, emptyText = 'No records found.',
  editFields, onSave, onDelete, deleteMessage, actions,
}) {
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const hasActions = !!(editFields || onDelete || actions)
  const colCount = columns.length + (hasActions ? 1 : 0)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-800 px-5 py-4 border-b border-gray-100">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              {columns.map((c) => <th key={c.header} className="px-4 py-3 font-medium">{c.header}</th>)}
              {hasActions && <th className="px-4 py-3 font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={colCount} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={colCount} className="px-4 py-8 text-center text-sm text-gray-400">{emptyText}</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={rowId(row)} className="border-b border-gray-100 last:border-0">
                  {columns.map((c) => (
                    <td key={c.header} className="px-4 py-3 text-sm text-gray-700">{c.render(row)}</td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {actions?.(row)}
                        {editFields && (
                          <button onClick={() => setEditing(row)} title="Edit"
                            className="px-3 py-2 rounded-lg text-sm text-white bg-blue-500 hover:bg-blue-600 transition cursor-pointer">
                            <FaEdit />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => setDeleting(row)} title="Delete"
                            className="px-3 py-2 rounded-lg text-sm text-white bg-red-400 hover:bg-red-500 transition cursor-pointer">
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditModal
          row={editing}
          fields={editFields}
          title={`Edit ${title.replace(/ List$/i, '')}`}
          onSave={onSave}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmModal
          message={deleteMessage ? deleteMessage(deleting) : 'Are you sure you want to delete this record? This cannot be undone.'}
          onConfirm={() => onDelete(deleting)}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  )
}