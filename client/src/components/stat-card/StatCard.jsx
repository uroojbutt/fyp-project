export default function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: color || '#f0f4ff',
      borderRadius: '12px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: 1,
      minWidth: '160px'
    }}>
      <span style={{ fontSize: '28px' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '13px', color: '#666' }}>{label}</div>
        <div style={{ fontSize: '24px', fontWeight: '700' }}>{value}</div>
      </div>
    </div>
  )
}