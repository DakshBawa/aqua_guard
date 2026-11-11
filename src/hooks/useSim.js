import { useEffect, useState } from "react";
import { createInitial, tick, injectLeak, injectStuckPump, acknowledge, dispatch } from "../utils/sim.js";

export default function useSim() {
  const [s, setS] = useState(() => tick(createInitial()));
  useEffect(() => {
    const id = setInterval(() => setS((x) => (x.paused ? x : tick(x))), 1000);
    return () => clearInterval(id);
  }, []);
  return {
    s,
    togglePause: () => setS((x) => ({ ...x, paused: !x.paused })),
    simLeak: () => setS(injectLeak),
    simPump: () => setS(injectStuckPump),
    ack: (id) => setS((x) => acknowledge(x, id)),
    send: (id) => setS((x) => dispatch(x, id)),
  };
}
