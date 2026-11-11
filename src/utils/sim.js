import { TANKS, PIPES, STAFF } from "../data/zones.js";

/* Simulated sensors. One tick = 5 simulated minutes.
   To use real sensors, replace tick() with a fetch of live readings and keep the same state shape. */
const DT = 5;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function createInitial() {
  const pipes = PIPES.map((p) => ({ ...p, leak: 0, leakTicks: 0, pressure: 4.2, lostTick: 0 }));
  Object.assign(pipes.find((p) => p.id === "p-vahni"), { leak: 22, leakTicks: 2 }); // demo leak already running
  return {
    t: 0, paused: false, lost: 0, fixed: 0, flow: [], alerts: [], pipes,
    tanks: TANKS.map((k) => ({ ...k, pump: false, stuck: false, inlet: 0, outlet: 0, net: 0, ovf: 0, demandNow: k.demand })),
    staff: STAFF.map((s) => ({ ...s, job: null })),
  };
}

export function tick(s) {
  const t = s.t + DT;
  const day = 1 + 0.35 * Math.sin(t / 150);
  const tanks = s.tanks.map((k) => ({ ...k, ovf: 0 }));
  const pipes = s.pipes.map((p) => ({ ...p, lostTick: 0 }));
  const staff = s.staff.map((x) => ({ ...x }));
  const alerts = s.alerts.map((a) => ({ ...a }));
  const byId = Object.fromEntries(tanks.map((k) => [k.id, k]));
  let { lost, fixed } = s;

  // repairs finish 20 simulated minutes after dispatch
  alerts.forEach((a) => {
    if (a.status !== "dispatched" || t - a.dispatchedAt < 20) return;
    if (a.kind === "leak") Object.assign(pipes.find((p) => p.id === a.pipeId), { leak: 0, leakTicks: 0 });
    if (a.kind === "overflow") byId[a.tankId].stuck = false;
    Object.assign(a, { status: "resolved", resolvedAt: t, how: "fixed" });
    fixed++;
    const st = staff.find((x) => x.id === a.staffId); if (st) st.job = null;
  });

  // pumps switch on/off with hysteresis
  tanks.forEach((k) => {
    const pct = k.level / k.cap;
    if (k.stuck) k.pump = true; else if (pct < k.on) k.pump = true; else if (pct > k.off) k.pump = false;
  });

  // flows and levels
  let sumpDemand = 0, totalDemand = 0;
  tanks.filter((k) => !k.source).forEach((k) => {
    const p = pipes.find((x) => x.id === k.pipe);
    const inlet = k.pump ? k.pumpFlow : 0;
    const arrive = Math.max(0, inlet - p.leak);
    const demand = k.demand * day * (0.92 + Math.random() * 0.16);
    let lvl = k.level + (arrive - demand) * DT;
    if (lvl > k.cap) { k.ovf = lvl - k.cap; lost += k.ovf; lvl = k.cap; }
    Object.assign(k, { level: Math.max(0, lvl), inlet, outlet: inlet ? arrive * (0.985 + Math.random() * 0.03) : 0, net: arrive - demand, demandNow: demand });
    p.pressure = +(4.2 - p.leak * 0.045 + (Math.random() - 0.5) * 0.1).toFixed(2);
    if (p.leak > 0) { p.lostTick = p.leak * DT * (inlet ? 1 : 0.4); lost += p.lostTick; p.leakTicks++; } else p.leakTicks = 0;
    sumpDemand += inlet; totalDemand += demand;
  });
  const sump = byId.sump, borewell = sump.pump ? sump.pumpFlow : 0;
  Object.assign(sump, { level: clamp(sump.level + (borewell - sumpDemand) * DT, 0, sump.cap), inlet: borewell, net: borewell - sumpDemand, demandNow: sumpDemand });

  // which problems exist right now?
  const want = [];
  tanks.forEach((k) => {
    const pct = (k.level / k.cap) * 100;
    if (pct < 20) want.push({ key: `low-${k.id}`, kind: "low", tankId: k.id, severity: pct < 10 ? "critical" : "warning" });
    else if (k.pump && k.net < 0 && k.level / -k.net < 120) want.push({ key: `dry-${k.id}`, kind: "dry", tankId: k.id, severity: "warning" });
    if (!k.source && pct >= 96 && k.pump) want.push({ key: `ovf-${k.id}`, kind: "overflow", tankId: k.id, severity: "critical" });
  });
  pipes.forEach((p) => { if (p.leakTicks >= 2) want.push({ key: `leak-${p.id}`, kind: "leak", pipeId: p.id, severity: p.leak > 30 ? "critical" : "warning" }); });

  const active = alerts.filter((a) => a.status !== "resolved");
  active.forEach((a) => {
    const w = want.find((x) => x.key === a.key);
    if (w) a.severity = w.severity;
    else if (a.status !== "dispatched") Object.assign(a, { status: "resolved", resolvedAt: t, how: "cleared" });
  });
  want.forEach((w) => { if (!active.some((a) => a.key === w.key)) alerts.push({ ...w, id: `${w.key}-${t}`, at: t, status: "open", wasted: 0 }); });
  alerts.forEach((a) => {
    if (a.status === "resolved") return;
    if (a.kind === "leak") a.wasted += pipes.find((p) => p.id === a.pipeId).lostTick;
    if (a.kind === "overflow") a.wasted += byId[a.tankId].ovf;
  });
  const open = alerts.filter((a) => a.status !== "resolved");
  const done = alerts.filter((a) => a.status === "resolved").sort((a, b) => b.resolvedAt - a.resolvedAt).slice(0, 5);

  return { ...s, t, tanks, pipes, staff, lost, fixed, alerts: [...open, ...done], flow: [...s.flow, { in: sumpDemand, out: totalDemand }].slice(-60) };
}

const pick = (a) => a[Math.floor(Math.random() * a.length)];

export function injectLeak(s) {
  const free = s.pipes.filter((p) => p.leak === 0);
  if (!free.length) return s;
  const id = pick(free).id;
  return { ...s, pipes: s.pipes.map((p) => (p.id === id ? { ...p, leak: 20 + Math.floor(Math.random() * 25), leakTicks: 0 } : p)) };
}

export function injectStuckPump(s) {
  const free = s.tanks.filter((k) => !k.source && !k.stuck);
  if (!free.length) return s;
  const id = pick(free).id;
  return { ...s, tanks: s.tanks.map((k) => (k.id === id ? { ...k, stuck: true, level: k.cap * 0.88 } : k)) };
}

export const acknowledge = (s, id) => ({ ...s, alerts: s.alerts.map((a) => (a.id === id && a.status === "open" ? { ...a, status: "ack" } : a)) });

export function dispatch(s, id) {
  const st = s.staff.find((x) => !x.job);
  if (!st) return s;
  return {
    ...s,
    staff: s.staff.map((x) => (x.id === st.id ? { ...x, job: id } : x)),
    alerts: s.alerts.map((a) => (a.id === id ? { ...a, status: "dispatched", staffId: st.id, staffName: st.name, dispatchedAt: s.t } : a)),
  };
}

/* Plain-language text for an alert */
export function describe(a, s) {
  const k = a.tankId && s.tanks.find((x) => x.id === a.tankId);
  const p = a.pipeId && s.pipes.find((x) => x.id === a.pipeId);
  const pct = k ? Math.round((k.level / k.cap) * 100) : 0;
  if (a.kind === "leak") return { title: `Leak on ${p.name}`, detail: `Losing about ${Math.round(p.leak)} L/min. Pressure has dropped to ${p.pressure} bar. ${Math.round(a.wasted).toLocaleString("en-IN")} L wasted since detection.` };
  if (a.kind === "overflow") return { title: `${k.name} is overflowing`, detail: `The pump did not stop at full. ${Math.round(a.wasted).toLocaleString("en-IN")} L wasted so far.` };
  if (a.kind === "dry") return { title: `${k.name} may run dry`, detail: `Even with the pump on, it will empty in about ${Math.round(k.level / -k.net)} min. Check for a leak or a weak pump.` };
  return { title: `${k.name} is low (${pct}%)`, detail: k.pump ? "The pump is running and refilling it." : "The pump will start shortly." };
}

export const canDispatch = (a) => a.kind === "leak" || a.kind === "overflow";
