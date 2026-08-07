"use client";

import { memo } from "react";
import type { Sim } from "@/components/home/peak/engine";
import {
  Agents,
  BoxCorners,
  Chair,
  Doorway,
  ServeShelf,
  Stage,
  StageCorners,
  Staff,
  StandSpot,
  TableBox,
} from "@/components/home/peak/stage";

export type CashierLabels = { menu: string; orderHere: string; pickup: string };

/**
 * "Before" floor plan: one till, one rigid service cadence, a queue lane
 * that grows and shrinks as irregular arrivals pile against it.
 * Memoized: the parent re-renders on every counter tick, but the scene's
 * props (sim, speed, animated, memoized labels) are stable.
 */
export const CashierScene = memo(function CashierScene({
  sim,
  speed,
  animated,
  labels,
}: {
  sim: Sim;
  speed: number;
  animated: boolean;
  labels: CashierLabels;
}) {
  const loop = ` ${sim.loopT / speed}s linear infinite`;
  const anim = (key: string) => (animated ? `${sim.ambient[key]}${loop}` : undefined);

  return (
    <Stage>
      {animated && <style>{sim.css}</style>}
      <div aria-hidden="true" className="pk-stage absolute inset-0">
        <StageCorners />

        {/* Back of house */}
        <div
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: 900,
            height: 150,
            background: "var(--pk-soft)",
            borderBottom: "2.5px solid var(--pk-ink)",
          }}
        />

        {/* Menu board above the register */}
        <div
          className="absolute"
          style={{
            left: 318,
            top: 26,
            width: 224,
            height: 74,
            background: "var(--pk-accent)",
            border: "2.5px solid var(--pk-ink)",
          }}
        >
          <span
            className="pk-sign"
            style={{ left: 14, top: 9, fontSize: 17, letterSpacing: 3, color: "#fff" }}
          >
            {labels.menu}
          </span>
          <div
            className="absolute"
            style={{
              left: 14,
              right: 14,
              top: 32,
              display: "flex",
              flexDirection: "column",
              gap: 7,
            }}
          >
            {[
              [0.5, 0.85],
              [0.42, 0.75],
              [0.34, 0.65],
            ].map(([a, b], i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ height: 5, flex: 1, background: `rgba(255,255,255,${a})` }} />
                <div style={{ height: 5, width: 30, background: `rgba(255,255,255,${b})` }} />
              </div>
            ))}
          </div>
          <BoxCorners />
        </div>

        {/* Order counter with register */}
        <div
          className="absolute"
          style={{
            left: 70,
            top: 150,
            width: 490,
            height: 100,
            background: "var(--pk-surface)",
            border: "2.5px solid var(--pk-ink)",
            boxShadow: "var(--pk-shadow-sm)",
          }}
        >
          <BoxCorners />
        </div>
        <div
          className="absolute"
          style={{
            left: 388,
            top: 170,
            width: 88,
            height: 62,
            background: "var(--pk-accent)",
            opacity: 0.16,
            animation: anim("ping"),
          }}
        />
        <div
          className="absolute"
          style={{
            left: 398,
            top: 180,
            width: 68,
            height: 42,
            background: "var(--pk-accent-soft)",
            border: "2px solid var(--pk-ink)",
          }}
        />
        <div
          className="pk-sign absolute flex items-center"
          style={{
            left: 70,
            top: 250,
            width: 490,
            height: 38,
            background: "var(--pk-accent)",
            border: "2.5px solid var(--pk-ink)",
            borderTop: "none",
            paddingLeft: 24,
            fontSize: 17,
            letterSpacing: 5,
            color: "#fff",
            position: "absolute",
          }}
        >
          {labels.orderHere}
        </div>
        <StandSpot x={430} y={310} />

        {/* Pickup station */}
        <div
          className="absolute"
          style={{
            left: 600,
            top: 150,
            width: 240,
            height: 138,
            background: "var(--pk-accent)",
            border: "2.5px solid var(--pk-ink)",
            boxShadow: "var(--pk-shadow-md)",
          }}
        >
          <span
            className="pk-sign"
            style={{ left: 14, top: 11, fontSize: 20, letterSpacing: 3, color: "#fff" }}
          >
            {labels.pickup}
          </span>
          <div
            className="absolute overflow-hidden"
            style={{
              left: 16,
              right: 16,
              bottom: 14,
              height: 56,
              background: "var(--pk-counter-top)",
              border: "2px solid var(--pk-ink)",
            }}
          >
            <ServeShelf width={110} animMove={anim("shelfMove")} animFade={anim("shelfFade")} />
          </div>
          <BoxCorners />
        </div>
        <StandSpot x={720} y={316} />

        {/* Cashier at the register, server at pickup */}
        <Staff x={430} y={118} hair="#26324a" animation={anim("cashier")} />
        <Staff x={720} y={118} hair="#3a3f4a" animation={anim("server")} />

        {/* Queue lane */}
        <div
          className="absolute"
          style={{
            left: 380,
            top: 300,
            width: 100,
            height: 590,
            borderLeft: "3px solid color-mix(in srgb, var(--pk-accent) 50%, transparent)",
            borderRight: "3px solid color-mix(in srgb, var(--pk-accent) 50%, transparent)",
            background:
              "repeating-linear-gradient(180deg, transparent 0 96px, color-mix(in srgb, var(--pk-accent) 5%, transparent) 96px 100px)",
          }}
        />
        {[420, 620, 820].map((y) => (
          <div
            key={y}
            className="absolute"
            style={{
              left: 430,
              top: y,
              width: 0,
              height: 0,
              borderLeft: "9px solid transparent",
              borderRight: "9px solid transparent",
              borderBottom: "12px solid color-mix(in srgb, var(--pk-accent) 38%, transparent)",
              transform: "translateX(-50%)",
            }}
          />
        ))}

        {/* Table A (2-seat, left upper) */}
        <Chair x={150} y={440} w={60} h={18} />
        <TableBox x={120} y={470} w={120} h={100} />
        <Chair x={150} y={582} w={60} h={18} />

        {/* Table C (2-seat, right upper) */}
        <Chair x={680} y={440} w={60} h={18} />
        <TableBox x={650} y={470} w={120} h={100} />
        <Chair x={680} y={582} w={60} h={18} />

        {/* Table B (4-seat, left lower) */}
        <Chair x={175} y={730} w={70} h={18} />
        <Chair x={110} y={785} w={18} h={70} />
        <TableBox x={140} y={760} w={140} h={120} />
        <Chair x={292} y={785} w={18} h={70} />
        <Chair x={175} y={892} w={70} h={18} />

        {/* Table D (4-seat, right lower) */}
        <Chair x={655} y={730} w={70} h={18} />
        <Chair x={590} y={785} w={18} h={70} />
        <TableBox x={620} y={760} w={140} h={120} />
        <Chair x={772} y={785} w={18} h={70} />
        <Chair x={655} y={892} w={70} h={18} />

        <Doorway animL={anim("doorL")} animR={anim("doorR")} />

        <Agents sim={sim} speed={speed} animated={animated} />
      </div>
    </Stage>
  );
});
