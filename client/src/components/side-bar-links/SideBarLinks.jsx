import {
  FaHome, FaUserGraduate, FaChalkboardTeacher, FaLink,
  FaCalendarAlt, FaFolder, FaFolderOpen, FaClipboardList,
  FaUpload,
  FaRegCommentDots,
  FaRegBell,
  FaClock,
  FaUserCog
} from 'react-icons/fa'

// One list per role. To add or change a sidebar icon, edit only this file.
// `end: true` on the home link stops it staying highlighted on child pages.

export const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: <FaHome />, end: true },
  { to: '/admin/students', label: 'Students', icon: <FaUserGraduate /> },
  { to: '/admin/teachers', label: 'Teachers', icon: <FaChalkboardTeacher /> },
  { to: '/admin/assignments', label: 'Assignments', icon: <FaLink /> },
  { to: '/admin/deadlines', label: 'Deadlines', icon: <FaCalendarAlt /> },
  { to: '/admin/projects', label: 'Projects', icon: <FaFolder /> },
]

export const teacherLinks = [
  { to: '/instructor/dashboard', label: 'Dashboard', icon: <FaHome />, end: true },
  { to: '/instructor/pending-request', label: 'My Students', icon: <FaClock /> },
  { to: '/instructor/assigned-students', label: 'Requests', icon: <FaUserCog /> },
  { to: '/instructor/files', label: 'Files', icon: <FaFolder /> },
]

export const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard', icon: <FaHome />, end: true },
  { to: '/student/submit-proposal', label: 'Submit Proposal', icon: <FaFolderOpen /> },
  { to: '/student/upload-files', label: 'Upload Files', icon: <FaUpload /> },
  { to: '/student/supervisor', label: 'Supervisor', icon: <FaChalkboardTeacher /> },
  { to: '/student/feedback', label: 'Feedback', icon: <FaRegCommentDots /> },
  { to: '/student/notifications', label: 'Notifications', icon: <FaRegBell /> },
]
// }