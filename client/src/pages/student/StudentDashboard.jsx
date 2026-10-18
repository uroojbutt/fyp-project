import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FaProjectDiagram, FaUserTie, FaComments, FaBell } from 'react-icons/fa'
import { MdFeedback } from 'react-icons/md'
import { BsCalendarX, BsClock } from 'react-icons/bs'

import StatCard from '../../components/stat-card/StatCard'
import BaseCard from '../../components/base-card/BaseCard'
import EmptyState from '../../components/empty-state/EmptyState'

export default function StudentDashboard() {
  const { currentUser } = useOutletContext()
  const [project, setProject] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [deadlines, setDeadlines] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // TODO: fetch project, feedback, deadlines, notifications from API
  }, [])

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl px-5 py-4 text-white shadow-sm">
        <h2 className="text-xl font-bold">Welcome back, {currentUser?.name}</h2>
        <p className="text-sm text-white/80 mt-1">Here's your project overview and recent updates.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FaProjectDiagram />} label="Project Title" value={project?.title || 'No Project'} bg="#d7e0f6ff" iconColor="text-indigo-500" />
        <StatCard icon={<FaUserTie />} label="Supervisor" value={project?.supervisor || 'N/A'} bg="#f1e5d6ff" iconColor="text-orange-400" />
        <StatCard icon={<BsCalendarX />} label="Next Deadline" value={project?.nextDeadline || 'N/A'} bg="#f4d5d5ff" iconColor="text-red-400" />
        <StatCard icon={<MdFeedback />} label="Recent Feedback" value={feedback[0]?.summary || 'No feedback yet'} bg="#daeee0ff" iconColor="text-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BaseCard title="Project Overview">
          {[
            { label: 'Title', value: project?.title || 'N/A' },
            { label: 'Description', value: project?.description || 'No description provided' },
            { label: 'Status', value: project?.status || 'Unknown' },
            { label: 'Submission Deadline', value: project?.submissionDeadline || 'N/A' },
          ].map(({ label, value }) => (
            <div key={label} className="mb-3">
              <p className="text-[11px] text-slate-400 font-medium">{label}</p>
              <p className="text-sm text-slate-700 font-semibold">{value}</p>
            </div>
          ))}
        </BaseCard>

        <BaseCard title="Latest Feedback">
          {feedback.length === 0 ? (
            <EmptyState icon={<FaComments />} message="No feedback available yet." />
          ) : (
            feedback.slice(0, 3).map((f) => (
              <div key={f._id} className="border-b border-slate-100 pb-3 mb-3 last:border-0 last:mb-0">
                <p className="text-sm text-slate-700">{f.message}</p>
                <span className="text-[11px] text-slate-400">{f.date}</span>
              </div>
            ))
          )}
        </BaseCard>

        <BaseCard title="Upcoming Deadlines">
          {deadlines.length === 0 ? (
            <EmptyState icon={<BsClock />} message="No upcoming deadlines yet." />
          ) : (
            deadlines.map((d) => (
              <div key={d._id} className="flex justify-between items-center border-b border-slate-100 py-2 last:border-0">
                <span className="text-sm text-slate-700">{d.title}</span>
                <span className="text-xs text-indigo-500 font-semibold">{d.date}</span>
              </div>
            ))
          )}
        </BaseCard>

        <BaseCard title="Recent Notifications">
          {notifications.length === 0 ? (
            <EmptyState icon={<FaBell />} message="No notifications yet." />
          ) : (
            notifications.slice(0, 4).map((n) => (
              <div key={n._id} className="flex items-start gap-3 border-b border-slate-100 py-2 last:border-0">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span className="text-sm text-slate-700">{n.message}</span>
              </div>
            ))
          )}
        </BaseCard>
      </div>
    </>
  )
}