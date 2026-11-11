export default function Hero({ s, critical, warnings, togglePause, simLeak, simPump }) {
  const m = (360 + s.t) % 1440;
  const clock = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const headline = critical ? `${critical} critical issue${critical > 1 ? "s" : ""} need attention` : warnings ? `${warnings} warning${warnings > 1 ? "s" : ""} to review` : "All systems normal";
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-deep via-aqua to-aqua-light p-6 text-white md:p-8">
      <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10" aria-hidden />
      <div className="relative flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-white/80"><span aria-hidden>💧</span> AquaGuard · Campus water network · Simulated time {clock}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{headline}</h1>
          <p className="mt-1 max-w-lg text-sm text-white/80">Tank levels and pipeline flow are checked every few seconds. Problems are flagged before water is wasted.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn bg-white text-deep hover:bg-white/90" onClick={togglePause}>{s.paused ? "▶ Resume" : "⏸ Pause"}</button>
          <button className="btn bg-white/15 text-white hover:bg-white/25" onClick={simLeak}>Simulate a leak</button>
          <button className="btn bg-white/15 text-white hover:bg-white/25" onClick={simPump}>Simulate pump fault</button>
        </div>
      </div>
    </section>
  );
}
