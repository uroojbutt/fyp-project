// MOCK DATA LAYER
// Every page talks to these functions only. When the backend is ready,
// replace the bodies with real calls, e.g.
//   const { data } = await api.get('/student/feedback'); return data
// and no page or component needs to change.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const hoursAgo = (h) => new Date(Date.now() - h * 3_600_000).toISOString()

const FEEDBACK = [
  {
    id: 'f1',
    submission: 'Final Report – Chapter 3',
    status: 'changes_requested',
    supervisor: 'Dr. Ayesha Khan',
    message:
      'The methodology section needs more detail on how you validated the role-based access rules. Please add a short test plan and update the sequence diagram to show the token refresh flow.',
    createdAt: hoursAgo(3),
    read: false,
    replies: [],
  },
  {
    id: 'f2',
    submission: 'Project Proposal',
    status: 'approved',
    supervisor: 'Dr. Ayesha Khan',
    message:
      'Scope and timeline look realistic. Proposal approved. You can start on the implementation phase.',
    createdAt: hoursAgo(30),
    read: false,
    replies: [],
  },
  {
    id: 'f3',
    submission: 'Mid-term Presentation',
    status: 'comment',
    supervisor: 'Dr. Ayesha Khan',
    message:
      'Good demo overall. Slow down during the live walkthrough and mention the database schema earlier so the panel has context.',
    createdAt: hoursAgo(96),
    read: true,
    replies: [
      {
        id: 'r1',
        author: 'You',
        message: 'Thank you, I will reorder the slides and rehearse the demo.',
        createdAt: hoursAgo(90),
      },
    ],
  },
  {
    id: 'f4',
    submission: 'Source Code – Sprint 1',
    status: 'changes_requested',
    supervisor: 'Dr. Ayesha Khan',
    message:
      'Move the API base URL into an environment variable and add basic input validation on the register route.',
    createdAt: hoursAgo(300),
    read: true,
    replies: [],
  },
]

const NOTIFICATIONS = [
  {
    id: 'n1',
    priority: 'low',
    type: 'feedback',
    title: 'New feedback on Final Report – Chapter 3',
    description: 'Your supervisor requested changes.',
    link: '/student/feedback',
    createdAt: hoursAgo(3),
    read: false,
  },
  {
    id: 'n2',
    priority: 'high',
    type: 'deadline',
    title: 'Final report due in 5 days',
    description: 'Submit your updated report before the deadline.',
    link: '/student/upload-files',
    createdAt: hoursAgo(6),
    read: false,
  },
  {
    id: 'n3',
    priority: 'low',
    type: 'approval',
    title: 'Proposal approved',
    description: 'You can now start the implementation phase.',
    link: '/student/feedback',
    createdAt: hoursAgo(30),
    read: false,
  },
  {
    id: 'n4',
    priority: 'low',
    type: 'system',
    title: 'Supervisor assigned',
    description: 'Dr. Ayesha Khan is now your FYP supervisor.',
    link: '/student/supervisor',
    createdAt: hoursAgo(200),
    read: true,
  },
]

export const fetchFeedback = async () => {
  await delay(400)
  return structuredClone(FEEDBACK)
}

export const fetchNotifications = async () => {
  await delay(400)
  return structuredClone(NOTIFICATIONS)
}