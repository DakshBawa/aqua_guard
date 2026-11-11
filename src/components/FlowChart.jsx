export default function FlowChart({ flow }) {
  const max = Math.max(100, ...flow.flatMap((f) => [f.in, f.out]));
  const line = (key) => flow.map((f, i) => `${(i / 59) * 300},${96 - (f[key] / max) * 88}`).join(" ");
  return (
    <section className="card">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold">Water in vs. water used</h2>
        <div className="flex gap-3 text-xs font-bold"><span className="text-aqua">● Pumped in</span><span className="text-amber-500">● Used</span></div>
      </div>
      {flow.length < 2 ? <p className="py-10 text-center text-sm text-deep/50">Collecting data…</p> : (
        <svg viewBox="0 0 300 100" className="mt-3 h-40 w-full" preserveAspectRatio="none" role="img" aria-label="Chart of water pumped in versus used">
          {[24, 52, 80].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#08334414" vectorEffect="non-scaling-stroke" />)}
          <polyline points={line("in")} fill="none" stroke="#0e7490" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <polyline points={line("out")} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <p className="mt-2 text-xs text-deep/60">If water pumped in stays well above water used, some of it is going missing. That is how leaks are caught.</p>
    </section>
  );
}
