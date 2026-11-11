import useSim from "./hooks/useSim.js";
import Hero from "./components/Hero.jsx";
import KpiCard from "./components/KpiCard.jsx";
import TankCard from "./components/TankCard.jsx";
import CampusMap from "./components/CampusMap.jsx";
import FlowChart from "./components/FlowChart.jsx";
import PipeTable from "./components/PipeTable.jsx";
import AlertsPanel from "./components/AlertsPanel.jsx";
import StaffCard from "./components/StaffCard.jsx";

export default function App() {
  const { s, togglePause, simLeak, simPump, ack, send } = useSim();
  const open = s.alerts.filter((a) => a.status !== "resolved");
  const critical = open.filter((a) => a.severity === "critical").length;
  const warnings = open.length - critical;
  const tanks = s.tanks.filter((k) => !k.source);
  const stored = tanks.reduce((a, k) => a + k.level, 0), cap = tanks.reduce((a, k) => a + k.cap, 0);
  const leaks = s.pipes.filter((p) => p.leakTicks >= 2).length;

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-4 md:p-6">
      <Hero s={s} critical={critical} warnings={warnings} togglePause={togglePause} simLeak={simLeak} simPump={simPump} />
      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <KpiCard label="Water in tanks" value={`${Math.round((stored / cap) * 100)}%`} sub={`${(stored / 1000).toFixed(1)} of ${(cap / 1000).toFixed(0)} kL`} />
            <KpiCard label="Active leaks" value={leaks} sub={`${s.fixed} fixed so far`} tone={leaks ? "text-rose-600" : "text-emerald-600"} />
            <KpiCard label="Water wasted" value={`${(s.lost / 1000).toFixed(1)} kL`} sub="Leaks and overflow" tone={s.lost > 0 ? "text-amber-600" : ""} />
            <KpiCard label="Open alerts" value={open.length} sub={`${critical} critical`} tone={critical ? "text-rose-600" : ""} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">{tanks.map((k) => <TankCard key={k.id} tank={k} />)}</div>
          <div className="grid gap-5 xl:grid-cols-2"><CampusMap s={s} /><FlowChart flow={s.flow} /></div>
          <PipeTable s={s} />
        </div>
        <aside className="order-first space-y-5 lg:order-none lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
          <AlertsPanel s={s} ack={ack} send={send} />
          <StaffCard s={s} />
        </aside>
      </div>
    </div>
  );
}
