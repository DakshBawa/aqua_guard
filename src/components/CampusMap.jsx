import mapImage from "../assets/campus-map.jpeg";
import { tankById, pipeMid } from "../data/zones.js";

export default function CampusMap({ s }) {
  const sump = tankById("sump");
  return (
    <section className="card !p-3">
      <h2 className="px-2 pb-2 pt-1 text-sm font-extrabold">Sensor map</h2>
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "1600 / 892" }}>
        <img src={mapImage} alt="Campus map with water sensors" className="absolute inset-0 h-full w-full object-fill" />
        <div className="absolute inset-0 bg-white/30" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {s.pipes.map((p) => {
            const k = tankById(p.tank);
            return <line key={p.id} x1={sump.x} y1={sump.y} x2={k.x} y2={k.y} stroke={p.leak ? "#f43f5e" : "#0e7490"} strokeWidth={p.leak ? 4 : 3} strokeDasharray="6 4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />;
          })}
        </svg>
        {s.pipes.filter((p) => p.leak > 0).map((p) => {
          const m = pipeMid(p);
          return <span key={p.id} title={`Leak: ${p.name}`} style={{ left: `${m.x}%`, top: `${m.y}%` }} className="leak-pulse map-pin absolute grid h-7 w-7 place-items-center rounded-full bg-rose-500 text-sm shadow">💧</span>;
        })}
        {s.tanks.map((k) => {
          const pct = Math.round((k.level / k.cap) * 100);
          const bad = pct < 20 || k.stuck;
          return (
            <span key={k.id} title={`${k.name}: ${pct}%`} style={{ left: `${k.x}%`, top: `${k.y}%` }}
              className={`map-pin absolute grid h-9 w-9 place-items-center rounded-full border-2 border-white text-[11px] font-extrabold text-white shadow-lg ${bad ? "bg-rose-500" : "bg-aqua"}`}>{pct}%</span>
          );
        })}
      </div>
      <p className="px-2 pt-2 text-xs text-deep/60">Circles are tanks (fill %). Dashed lines are pipes. A pulsing 💧 marks a leak.</p>
    </section>
  );
}
