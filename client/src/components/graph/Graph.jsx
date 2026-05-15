import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Graph({ data }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', flex: 1 }}>
      <h3 style={{ marginBottom: '16px', fontWeight: '600' }}>Project Distribution by Supervisor</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="projects" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}