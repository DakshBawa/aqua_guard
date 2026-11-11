import { tankById } from "../data/zones.js";

export default function PipeTable({ s }) {
  return (
    <section className="card">
      <h2 className="mb-3 text-sm font-extrabold">Pipeline health</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-deep/50">
            <tr><th className="pb-2 font-bold">Pipe</th><th className="pb-2 font-bold">Sent</th><th className="pb-2 font-bold">Received</th><th className="pb-2 font-bold">Lost</th><th className="pb-2 font-bold">Pressure</th><th className="pb-2 font-bold">Status</th></tr>
          </thead>
          <tbody>
            {s.pipes.map((p) => {
              const k = s.tanks.find((x) => x.id === tankById(p.tank).id);
              const loss = k.inlet > 0 ? Math.max(0, ((k.inlet - k.outlet) / k.inlet) * 100) : 0;
              const st = p.leakTicks >= 2 ? ["Leak", "bg-rose-100 text-rose-700"] : p.leak ? ["Checking", "bg-amber-100 text-amber-800"] : ["Healthy", "bg-emerald-100 text-emerald-700"];
              return (
                <tr key={p.id} className="border-t border-deep/10">
                  <td className="py-2.5 font-semibold">{p.name}</td>
                  <td>{k.inlet ? `${Math.round(k.inlet)} L/min` : "Idle"}</td>
                  <td>{k.inlet ? `${Math.round(k.outlet)} L/min` : "–"}</td>
                  <td className={loss > 6 ? "font-bold text-rose-600" : ""}>{k.inlet ? `${loss.toFixed(0)}%` : "–"}</td>
                  <td className={p.pressure < 3.8 ? "font-bold text-rose-600" : ""}>{p.pressure} bar</td>
                  <td><span className={`chip ${st[1]}`}>{st[0]}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
