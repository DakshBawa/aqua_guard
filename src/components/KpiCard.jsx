export default function KpiCard({ label, value, sub, tone = "text-deep" }) {
  return (
    <div className="card !p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-deep/50">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold ${tone}`}>{value}</p>
      <p className="text-xs text-deep/60">{sub}</p>
    </div>
  );
}
