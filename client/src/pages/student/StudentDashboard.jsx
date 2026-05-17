import { useEffect, useState } from 'react'
import { FaHome, FaFileAlt, FaUpload, FaUserTie, FaComments, FaBell } from 'react-icons/fa'
import { MdFeedback } from 'react-icons/md'
import { BsCalendarX, BsClock } from 'react-icons/bs'

import Navbar from "../../components/nav-bar/NavBar"
import Sidebar from "../../components/side-bar/SideBar"
import StatCard from "../../components/stat-card/StatCard"
import BaseCard from "../../components/base-card/BaseCard"

// ── Student nav items ─────────────────────────────────────────────────────────
const studentNavItems = [
    { to: '/student/dashboard', icon: <FaHome size={18} />, label: 'Home' },
    { to: '/student/submit-proposal', icon: <FaFileAlt size={18} />, label: 'Submit Proposal' },
    { to: '/student/upload-files', icon: <FaUpload size={18} />, label: 'Upload Files' },
    { to: '/student/supervisor', icon: <FaUserTie size={18} />, label: 'Supervisor' },
    { to: '/student/feedback', icon: <FaComments size={18} />, label: 'Feedback' },
    { to: '/student/notifications', icon: <FaBell size={18} />, label: 'Notifications' },
]

// ── Empty state helper ────────────────────────────────────────────────────────
function EmptyState({ icon, message }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-slate-300">
            <span className="text-4xl mb-2">{icon}</span>
            <p className="text-xs text-slate-400">{message}</p>
        </div>
    )
}

// ── Student Dashboard ─────────────────────────────────────────────────────────
export default function StudentDashboard() {
    const [user, setUser] = useState({ name: 'Ahmed Saeed', role: 'student' })
    const [project, setProject] = useState(null)
    const [feedback, setFeedback] = useState([])
    const [deadlines, setDeadlines] = useState([])
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('user') || '{}')
        if (stored?.name) setUser(stored)
        // TODO: fetch project, feedback, deadlines, notifications from API
    }, [])

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar navItems={studentNavItems} />
            <Navbar className='z-10' user={user} />

            {/* Main content — offset for fixed sidebar (52px) and fixed navbar (56px) */}
            <main className="ml-[70px] pt-10 mt-6 p-6 flex flex-col gap-6">

                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl px-5 py-4 text-white shadow-sm">
                    <h2 className="text-xl font-bold">Welcome back, {user?.name}</h2>
                    <p className="text-sm text-white/80 mt-1">Here's your project overview and recent updates.</p>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        icon={<FaHome />}
                        label="Project Title"
                        value={project?.title || 'No Project'}
                        bg="#d7e0f6ff"
                        iconColor="text-indigo-500"
                    />
                    <StatCard
                        icon={<FaUserTie />}
                        label="Supervisor"
                        value={project?.supervisor || 'N/A'}
                        bg="#f1e5d6ff"
                        iconColor="text-orange-400"
                    />
                    <StatCard
                        icon={<BsCalendarX />}
                        label="Next Deadline"
                        value={project?.nextDeadline || 'N/A'}
                        bg="#f4d5d5ff"
                        iconColor="text-red-400"
                    />
                    <StatCard
                        icon={<MdFeedback />}
                        label="Recent Feedback"
                        value={feedback.length > 0 ? feedback[0].summary : 'No feedback yet'}
                        bg="#daeee0ff"
                        iconColor="text-green-500"
                    />
                </div>

                {/* Bottom 2×2 grid — all using BaseCard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Project Overview */}
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

                    {/* Latest Feedback */}

                    <BaseCard title="Latest Feedback">
                        <div className="flex justify-between items-center -mt-6 mb-3">
                        <span />
                            <button className="text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-full hover:bg-indigo-600 transition">
                                View All
                            </button>
                        </div>
                        {feedback.length === 0 ? (
                            <EmptyState icon={<FaComments />} message="No feedback available yet." />
                        ) : (
                            feedback.slice(0, 3).map((f, i) => (
                                <div key={i} className="border-b border-slate-100 pb-3 mb-3 last:border-0 last:mb-0">
                                    <p className="text-sm text-slate-700">{f.message}</p>
                                    <span className="text-[11px] text-slate-400">{f.date}</span>
                                </div>
                            ))
                        )}
                    </BaseCard>

                    {/* Upcoming Deadlines */}
                    <BaseCard title="Upcoming Deadlines">
                        {deadlines.length === 0 ? (
                            <EmptyState icon={<BsClock />} message="No upcoming deadlines yet." />
                        ) : (
                            deadlines.map((d, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-slate-100 py-2 last:border-0">
                                    <span className="text-sm text-slate-700">{d.title}</span>
                                    <span className="text-xs text-indigo-500 font-semibold">{d.date}</span>
                                </div>
                            ))
                        )}
                    </BaseCard>

                    {/* Recent Notifications */}
                    <BaseCard title="Recent Notifications">
                        {notifications.length === 0 ? (
                            <EmptyState icon={<FaBell />} message="No notifications yet." />
                        ) : (
                            notifications.slice(0, 4).map((n, i) => (
                                <div key={i} className="flex items-start gap-3 border-b border-slate-100 py-2 last:border-0">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                    <span className="text-sm text-slate-700">{n.message}</span>
                                </div>
                            ))
                        )}
                    </BaseCard>

                </div>
            </main>
        </div>
    )
}