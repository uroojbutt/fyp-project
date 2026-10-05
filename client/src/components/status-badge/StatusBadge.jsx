const tones = {
  green: 'bg-emerald-50 text-emerald-700',
  red: 'bg-red-50 text-red-600',
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
}

export default function StatusBadge({ tone = 'blue', children }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${tones[tone]}`}>
      {children}
    </span>
  )
}