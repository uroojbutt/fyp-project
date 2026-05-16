export default function StatCard({ icon, label, value, bg, iconColor }) {
  return (
    <div
      className="relative flex items-center gap-3 p-4 rounded-xl shadow-sm border overflow-hidden"
      style={{
        backgroundColor: bg || "#fff",
        borderColor: "#eef0f5",
      }}
    >
      {/* icon box */}
      <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/60 shadow-sm">
        <span className={`${iconColor} text-xl`}>{icon}</span>
      </div>

      {/* text */}
      <div>
        <div className="text-xs text-gray-600 font-medium">{label}</div>
        <div className="text-lg font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}