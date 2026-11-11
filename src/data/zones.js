/* Sample campus water network. x / y are % positions on the campus map.
   Replace with your real tanks and pipelines. */
export const TANKS = [
  { id: "sump", name: "Main Sump", x: 47, y: 67, cap: 20000, level: 14000, pumpFlow: 260, demand: 0, on: 0.55, off: 0.92, source: true },
  { id: "hostel", name: "Hostel PG Tank", x: 45, y: 83, cap: 10000, level: 6200, pumpFlow: 90, demand: 58, on: 0.3, off: 0.9, pipe: "p-hostel" },
  { id: "vahni", name: "Vahni Hall Tank", x: 56, y: 83, cap: 8000, level: 3600, pumpFlow: 80, demand: 50, on: 0.3, off: 0.9, pipe: "p-vahni" },
  { id: "academic", name: "Academic Block Tank", x: 76, y: 65, cap: 6000, level: 2700, pumpFlow: 70, demand: 45, on: 0.3, off: 0.9, pipe: "p-academic" },
  { id: "canteen", name: "Canteen Tank", x: 66, y: 74, cap: 3000, level: 2400, pumpFlow: 40, demand: 22, on: 0.3, off: 0.9, pipe: "p-canteen" },
  { id: "sports", name: "Sports Complex Tank", x: 47, y: 39, cap: 2000, level: 360, pumpFlow: 30, demand: 15, on: 0.3, off: 0.9, pipe: "p-sports" },
];

export const PIPES = [
  { id: "p-hostel", name: "Sump to Hostel PG", tank: "hostel" },
  { id: "p-vahni", name: "Sump to Vahni Hall", tank: "vahni" },
  { id: "p-academic", name: "Sump to Academic Block", tank: "academic" },
  { id: "p-canteen", name: "Sump to Canteen", tank: "canteen" },
  { id: "p-sports", name: "Sump to Sports Complex", tank: "sports" },
];

export const STAFF = [
  { id: "m1", name: "Ramesh Kumar", role: "Plumber" },
  { id: "m2", name: "Sunita Devi", role: "Pump technician" },
  { id: "m3", name: "Arjun Singh", role: "Plumber" },
];

export const tankById = (id) => TANKS.find((t) => t.id === id);
export const pipeMid = (p) => {
  const [a, b] = [tankById("sump"), tankById(p.tank)];
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
};
