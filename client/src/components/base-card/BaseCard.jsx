export default function BaseCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#eef0f5] p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}