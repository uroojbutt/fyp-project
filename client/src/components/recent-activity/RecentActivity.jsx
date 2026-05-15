export default function RecentActivity({ activities }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', minWidth: '280px' }}>
      <h3 style={{ marginBottom: '16px', fontWeight: '600' }}>Recent Activity</h3>
      {activities.map((a, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', marginTop: '6px', flexShrink: 0 }} />
          <div style={{ fontSize: '13px', color: '#333' }}>
            {a.message}
            <span style={{ display: 'inline-block', marginLeft: '6px', background: '#fef3c7', color: '#92400e', fontSize: '11px', padding: '1px 8px', borderRadius: '20px' }}>
              {a.tag}
            </span>
            <span style={{ display: 'inline-block', marginLeft: '4px', background: '#fee2e2', color: '#991b1b', fontSize: '11px', padding: '1px 8px', borderRadius: '20px' }}>
              {a.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}