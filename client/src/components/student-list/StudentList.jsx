function SupervisorBadge({ supervisor }) {
  const name = supervisor?.name || supervisor
  return name ? (
    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">{name}</span>
  ) : (
    <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium">Not Assigned</span>
  )
}

function StudentRow({ student, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-4 py-3">
        <div className="font-semibold text-gray-800 text-sm">{student.name}</div>
        <div className="text-xs text-gray-500">{student.email}</div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {student.department}
        {student.year && <div className="text-xs text-gray-400">{student.year}</div>}
      </td>
      <td className="px-4 py-3"><SupervisorBadge supervisor={student.supervisor} /></td>
      <td className="px-4 py-3 text-sm text-gray-700">{student.projectTitle || '—'}</td>
      <td className="px-4 py-3 text-sm whitespace-nowrap">
        <button onClick={() => onEdit(student)} className="text-blue-600 font-medium hover:underline mr-3">Edit</button>
        <button onClick={() => onDelete(student)} className="text-red-600 font-medium hover:underline">Delete</button>
      </td>
    </tr>
  )
}

export default function StudentList({ students, loading, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-800 px-5 py-4 border-b border-gray-100">Students List</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Student Info</th>
              <th className="px-4 py-3 font-medium">Department &amp; Year</th>
              <th className="px-4 py-3 font-medium">Supervisor</th>
              <th className="px-4 py-3 font-medium">Project Title</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">Loading students…</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No students match your search.</td></tr>
            ) : (
              students.map((s) => (
                <StudentRow key={s._id || s.id} student={s} onEdit={onEdit} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}