const mins = (m) => (m >= 60 ? `${Math.floor(m / 60)}h ${Math.round(m % 60)}m` : `${Math.round(m)} min`);
const L = (n) => `${Math.round(n).toLocaleString("en-IN")} L`;

export default function TankCard({ tank: k }) {
  const pct = Math.round((k.level / k.cap) * 100);
  const low = pct < 20;
  const status = k.stuck ? ["Pump stuck ON", "bg-rose-100 text-rose-700"] : low ? ["Low", "bg-rose-100 text-rose-700"] : pct >= 96 ? ["Full", "bg-amber-100 text-amber-800"] : ["Normal", "bg-emerald-100 text-emerald-700"];
  return (
    <article className="card flex gap-4 !p-4">
      <div className="tank h-32 w-20 shrink-0" role="img" aria-label={`${k.name} at ${pct}%`}>
        <div className={`water ${low ? "low" : ""}`} style={{ height: `${pct}%` }} />
        <span className="absolute inset-0 grid place-items-center"><span className="rounded-full bg-white/80 px-2 py-0.5 text-sm font-extrabold">{pct}%</span></span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-extrabold leading-tight">{k.name}</h3>
          <span className={`chip shrink-0 ${status[1]}`}>{status[0]}</span>
        </div>
        <p className="mt-1 text-xs text-deep/60">{L(k.level)} of {L(k.cap)}</p>
        <p className="mt-2 text-xs font-semibold">{k.pump ? "🟢 Pump running" : "⚪ Pump idle"}</p>
        <p className="mt-1 text-xs text-deep/70">
          {k.net > 0 ? `▲ Filling ${Math.round(k.net)} L/min · full in ${mins((k.cap - k.level) / k.net)}` : `▼ Using ${Math.round(-k.net)} L/min${k.net < 0 ? ` · empty in ${mins(k.level / -k.net)}` : ""}`}
        </p>
      </div>
    </article>
  );
}
