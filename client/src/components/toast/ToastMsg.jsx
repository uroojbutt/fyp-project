export default function Toast({ toast }) {
  if (!toast) return null
  return (
    <div
      className={`fixed bottom-5 right-5 z-[9999] flex items-center gap-2 px-4 py-2.5
        rounded-xl shadow-lg text-white text-sm font-medium
        ${toast.success ? 'bg-emerald-500' : 'bg-red-500'}`}
    >
      {toast.success ? '✓' : '✕'} {toast.msg}
    </div>
  )
}