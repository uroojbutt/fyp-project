import API from './axios'

// ← the only place endpoint paths live. Match these to your backend routes.
export const getStudents = () => API.get('/students')
export const getTeachers = () => API.get('/teachers')
export const deleteTeacher = (id) => API.delete(`/teachers/${id}`)
export const assignSupervisor = (studentId, supervisorId) =>
  API.put(`/students/${studentId}/supervisor`, { supervisorId })