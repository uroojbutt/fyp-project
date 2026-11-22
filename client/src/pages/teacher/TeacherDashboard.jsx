import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserGraduate, FaClock, FaCheckCircle, FaExpandAlt } from 'react-icons/fa'
import StatCard from '../../components/stat-card/StatCard'

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

// TEMP dummy data - replace with API calls (getTeacherStats, getTeacherActivity)
const TEACHER_NAME = 'Prof. Sana Khan'

const DUMMY_STUDENTS = [] // students already assigned to this teacher

const DUMMY_REQUESTS = [
  { _id: 'req-1', studentName: 'Ahmed Saeed', status: 'pending', createdAt: '2026-01-09T16:00:40Z' },
  { _id: 'req-2', studentName: 'Maryam Iqbal', status: 'pending', createdAt: '2026-01-09T15:10:15Z' },
]

const DUMMY_COMPLETED = [] // projects this teacher has supervised to completion

export default function TeacherDashboard() {
  const navigate = useNavigate()

  const pendingRequests = useMemo(
    () => DUMMY_REQUESTS.filter((r) => r.status === 'pending'),
    []
  )

  // newest first
  const activity = useMemo(
    () =>
      [...DUMMY_REQUESTS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    []
  )

  return (
    <>
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl p-5 text-white">
        <h1 className="text-lg font-semibold">Teacher Dashboard</h1>
        <p className="text-sm text-white/90">Manage your students and provide guidance on their projects.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard icon={<FaUserGraduate />} label="Assigned Students" value={DUMMY_STUDENTS.length}
          iconColor="text-blue-500" bg="#e0f2fe" />
        <StatCard icon={<FaClock />} label="Pending Requests" value={pendingRequests.length}
          iconColor="text-amber-500" bg="#fef3c7" />
        <StatCard icon={<FaCheckCircle />} label="Completed Projects" value={DUMMY_COMPLETED.length}
          iconColor="text-emerald-500" bg="#dcfce7" />
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-base font-semibold text-gray-800">Recent Activity</h2>
        <p className="text-sm text-gray-500 mb-4">Latest notifications and updates</p>

        {activity.length === 0 ? (
          <p className="text-sm text-gray-500 border-t border-gray-100 pt-4">No recent activity yet.</p>
        ) : (
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
            {activity.map((a) => (
              <div
                key={a._id}
                className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3"
              >
                <button
                  onClick={() => navigate('/teacher/requests')}
                  title="View request"
                  className="text-gray-500 hover:text-indigo-600 transition cursor-pointer"
                >
                  <FaExpandAlt size={13} />
                </button>
                <div className="min-w-0">
                  <p className="text-sm text-gray-800">
                    {a.studentName} has requested {TEACHER_NAME} to be their supervisor.
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}