export default function EmptyState({ icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-slate-300">
      <span className="text-4xl mb-2">{icon}</span>
      <p className="text-xs text-slate-400">{message}</p>
    </div>
  )
}