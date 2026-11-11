export default function StaffCard({ s }) {
  return (
    <section className="card">
      <h2 className="mb-3 text-sm font-extrabold">Maintenance team</h2>
      <ul className="space-y-2">
        {s.staff.map((m) => (
          <li key={m.id} className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-aqua/10 text-xs font-extrabold text-aqua">{m.name.split(" ").map((w) => w[0]).join("")}</span>
            <span className="flex-1 text-sm"><span className="block font-bold">{m.name}</span><span className="text-xs text-deep/60">{m.role}</span></span>
            <span className={`chip ${m.job ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-700"}`}>{m.job ? "On a job" : "Available"}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-deep/50">In a live system, “Send maintenance” would push an SMS or app notification to the person.</p>
    </section>
  );
}
