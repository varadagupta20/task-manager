export default function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}