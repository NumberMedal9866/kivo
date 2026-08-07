import { describe, expect, it } from "vitest";
import { buildCashierSim, buildKioskSim, servedCount } from "@/components/home/peak/engine";

describe("peak-hour sims", () => {
  const cash = buildCashierSim("tc");
  const kiosk = buildKioskSim("tk");

  it("serves every guest exactly once per loop", () => {
    expect(cash.serveEvents).toHaveLength(cash.agentCount);
    expect(kiosk.serveEvents).toHaveLength(kiosk.agentCount);
    for (const e of [...cash.serveEvents, ...kiosk.serveEvents]) {
      expect(e).toBeGreaterThanOrEqual(0);
    }
    expect(Math.max(...cash.serveEvents)).toBeLessThan(cash.loopT);
    expect(Math.max(...kiosk.serveEvents)).toBeLessThan(kiosk.loopT);
  });

  it("kiosk model outpaces the till model", () => {
    expect(kiosk.ratePerMinute).toBeGreaterThan(cash.ratePerMinute * 1.4);
  });

  it("served counter is monotonic and loop-consistent", () => {
    let prev = 0;
    for (let t = 0; t <= cash.loopT * 2; t += 3) {
      const n = servedCount(cash, t);
      expect(n).toBeGreaterThanOrEqual(prev);
      prev = n;
    }
    expect(servedCount(cash, cash.loopT * 2)).toBe(2 * cash.agentCount);
    expect(servedCount(kiosk, kiosk.loopT * 3)).toBe(3 * kiosk.agentCount);
  });

  it("cashier queue breathes but stays bounded and single-lane", () => {
    let min = Infinity;
    let max = -Infinity;
    for (let t = 0; t < cash.loopT; t += 0.5) {
      const q = cash.queueAt!(t);
      min = Math.min(min, q);
      max = Math.max(max, q);
    }
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeGreaterThanOrEqual(4); // the rush visibly piles up
    expect(max).toBeLessThanOrEqual(9); // but never overflows the lane
  });

  it("kiosk scene never forms a line at any kiosk", () => {
    // No two guests should ever occupy the same kiosk spot at once.
    const spots = [
      { x: 180, y: 222 },
      { x: 350, y: 222 },
      { x: 520, y: 222 },
    ];
    for (let t = 0; t < kiosk.loopT; t += 0.5) {
      for (const s of spots) {
        let n = 0;
        for (let i = 0; i < kiosk.agentCount; i++) {
          const p = kiosk.posAt(i, t);
          if (p.o > 0.5 && Math.hypot(p.x - s.x, p.y - s.y) < 12) n++;
        }
        expect(n).toBeLessThanOrEqual(1);
      }
    }
  });

  it("no two guests ever eat at the same seat simultaneously", () => {
    for (let t = 0; t < kiosk.loopT; t += 1) {
      const seated = new Map<string, number>();
      for (let i = 0; i < kiosk.agentCount; i++) {
        const p = kiosk.posAt(i, t);
        if (p.o > 0.5 && p.tray > 0.5) {
          const key = `${Math.round(p.x)}:${Math.round(p.y)}`;
          seated.set(key, (seated.get(key) ?? 0) + 1);
        }
      }
      for (const n of seated.values()) expect(n).toBeLessThanOrEqual(1);
    }
  });

  it("generates keyframes for every agent with the given prefix", () => {
    expect((cash.css.match(/@keyframes tcm/g) ?? []).length).toBe(cash.agentCount);
    expect((kiosk.css.match(/@keyframes tkm/g) ?? []).length).toBe(kiosk.agentCount);
    // Distinct prefixes: no cross-scene keyframe collisions.
    expect(cash.css.includes("tkm")).toBe(false);
  });
});
