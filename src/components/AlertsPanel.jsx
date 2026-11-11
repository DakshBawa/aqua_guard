import { describe, canDispatch } from "../utils/sim.js";

const SEV = { critical: ["bg-rose-500", "Critical"], warning: ["bg-amber-400", "Warning"] };

function AlertCard({ a, s, ack, send }) {
  const { title, detail } = describe(a, s);
  const free = s.staff.some((x) => !x.job);
  return (
    <article className="flex gap-3 rounded-2xl bg-mist p-3">
      <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${SEV[a.severity][0]}`} aria-label={SEV[a.severity][1]} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-extrabold leading-tight">{title}</h3>
          <span className="shrink-0 text-[11px] text-deep/50">{Math.round(s.t - a.at)} min ago</span>
        </div>
        <p className="mt-1 text-xs text-deep/70">{detail}</p>
        {a.status === "dispatched" ? (
          <p className="mt-2 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-aqua">🛠 {a.staffName} is on the way and fixing it…</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {a.status === "open" && <button className="btn bg-white !py-1 text-xs text-deep hover:bg-white/70" onClick={() => ack(a.id)}>Acknowledge</button>}
            {a.status === "ack" && <span className="chip bg-white text-deep/60">Seen</span>}
            {canDispatch(a) && <button className="btn bg-deep !py-1 text-xs text-white hover:bg-deep/90" disabled={!free} onClick={() => send(a.id)}>{free ? "Send maintenance" : "No staff free"}</button>}
          </div>
        )}
      </div>
    </article>
  );
}

export default function AlertsPanel({ s, ack, send }) {
  const open = s.alerts.filter((a) => a.status !== "resolved").sort((a, b) => (a.severity === b.severity ? a.at - b.at : a.severity === "critical" ? -1 : 1));
  const done = s.alerts.filter((a) => a.status === "resolved");
  return (
    <section className="card">
      <h2 className="mb-3 flex items-center justify-between text-sm font-extrabold">Alerts <span className="chip bg-deep text-white">{open.length} open</span></h2>
      <div className="space-y-2.5" aria-live="polite">
        {open.length === 0 && <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">No open alerts. Everything looks good.</p>}
        {open.map((a) => <AlertCard key={a.id} a={a} s={s} ack={ack} send={send} />)}
      </div>
      {done.length > 0 && (
        <div className="mt-4 border-t border-deep/10 pt-3">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-deep/50">Recently resolved</p>
          {done.map((a) => <p key={a.id} className="py-0.5 text-xs text-deep/70">✓ {describe(a, s).title} · {a.how === "fixed" ? `fixed by ${a.staffName}` : "cleared on its own"}</p>)}
        </div>
      )}
    </section>
  );
}
