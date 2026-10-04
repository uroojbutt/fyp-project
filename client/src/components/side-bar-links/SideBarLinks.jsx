import {
  FaHome, FaUserGraduate, FaChalkboardTeacher, FaLink,
  FaCalendarAlt, FaFolder, FaFolderOpen, FaClipboardList,
} from 'react-icons/fa'

// One list per role. To add or change a sidebar icon, edit only this file.
// `end: true` on the home link stops it staying highlighted on child pages.

export const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: <FaHome />, end: true },
  { to: '/admin/students', label: 'Students', icon: <FaUserGraduate /> },
  { to: '/admin/teachers', label: 'Teachers', icon: <FaChalkboardTeacher /> },
  { to: '/admin/assignments', label: 'Assignments', icon: <FaLink /> },
  { to: '/admin/deadlines', label: 'Deadlines', icon: <FaCalendarAlt /> },
  { to: '/admin/files', label: 'Files', icon: <FaFolder /> },
]

export const teacherLinks = [
  { to: '/teacher', label: 'Dashboard', icon: <FaHome />, end: true },
  { to: '/teacher/students', label: 'My Students', icon: <FaUserGraduate /> },
  { to: '/teacher/requests', label: 'Requests', icon: <FaClipboardList /> },
  { to: '/teacher/deadlines', label: 'Deadlines', icon: <FaCalendarAlt /> },
  { to: '/teacher/files', label: 'Files', icon: <FaFolder /> },
]

export const studentLinks = [
  { to: '/student', label: 'Dashboard', icon: <FaHome />, end: true },
  { to: '/student/project', label: 'My Project', icon: <FaFolderOpen /> },
  { to: '/student/supervisor', label: 'Supervisor', icon: <FaChalkboardTeacher /> },
  { to: '/student/deadlines', label: 'Deadlines', icon: <FaCalendarAlt /> },
  { to: '/student/files', label: 'My Files', icon: <FaFolder /> },
]