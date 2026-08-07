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

export type KioskLabels = { kiosk: string; pickup: string };

const KIOSK_XS = [120, 290, 460];
const KIOSK_LETTERS = ["A", "B", "C"];

/**
 * "After" floor plan: three kiosks take orders in parallel, trays wait at
 * pickup, and the doorway sees twice the traffic with no line anywhere.
 * Memoized: the parent re-renders on every counter tick, but the scene's
 * props (sim, speed, animated, memoized labels) are stable.
 */
export const KioskScene = memo(function KioskScene({
  sim,
  speed,
  animated,
  labels,
}: {
  sim: Sim;
  speed: number;
  animated: boolean;
  labels: KioskLabels;
}) {
  const loop = ` ${sim.loopT / speed}s linear infinite`;
  const anim = (key: string) => (animated ? `${sim.ambient[key]}${loop}` : undefined);

  return (
    <Stage>
      {animated && <style>{sim.css}</style>}
      <div aria-hidden="true" className="pk-stage absolute inset-0">
        <StageCorners />

        {/* Kitchen line (back of house) */}
        <div
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: 900,
            height: 90,
            background: "var(--pk-soft)",
            borderBottom: "2.5px solid var(--pk-ink)",
          }}
        />

        {/* Kiosks A / B / C */}
        {KIOSK_XS.map((x, k) => (
          <div key={k}>
            <div
              className="absolute"
              style={{
                left: x,
                top: 90,
                width: 120,
                height: 70,
                background: "var(--pk-surface)",
                border: "2.5px solid var(--pk-ink)",
              }}
            >
              <span
                className="pk-sign"
                style={{ left: 8, top: 6, fontSize: 12, letterSpacing: 2, color: "var(--pk-ink)" }}
              >
                {labels.kiosk} {KIOSK_LETTERS[k]}
              </span>
              <div
                className="absolute"
                style={{
                  left: 20,
                  top: 26,
                  width: 80,
                  height: 32,
                  background: "var(--pk-accent-soft)",
                  border: "2px solid var(--pk-ink)",
                }}
              />
              <div
                className="absolute"
                style={{
                  left: 22,
                  top: 28,
                  width: 76,
                  height: 28,
                  background: "var(--pk-accent)",
                  opacity: 0.18,
                  animation: anim(`k${k}`),
                }}
              />
              <BoxCorners />
            </div>
            <StandSpot x={x + 60} y={222} />
          </div>
        ))}

        {/* Pickup station */}
        <div
          className="absolute"
          style={{
            left: 650,
            top: 90,
            width: 220,
            height: 110,
            background: "var(--pk-accent)",
            border: "2.5px solid var(--pk-ink)",
            boxShadow: "var(--pk-shadow-md)",
          }}
        >
          <span
            className="pk-sign"
            style={{ left: 12, top: 9, fontSize: 19, letterSpacing: 3, color: "#fff" }}
          >
            {labels.pickup}
          </span>
          <div
            className="absolute overflow-hidden"
            style={{
              left: 16,
              right: 16,
              bottom: 12,
              height: 54,
              background: "var(--pk-counter-top)",
              border: "2px solid var(--pk-ink)",
            }}
          >
            <ServeShelf width={104} animMove={anim("shelfMove")} animFade={anim("shelfFade")} />
          </div>
          <BoxCorners />
        </div>
        <StandSpot x={760} y={262} />

        {/* Server behind the pickup counter */}
        <Staff x={760} y={48} hair="#3a3f4a" animation={anim("server")} headOffset="-94%" />

        {/* Table A (2-seat) */}
        <Chair x={175} y={470} w={60} h={18} />
        <TableBox x={150} y={500} w={110} h={90} />
        <Chair x={175} y={602} w={60} h={18} />

        {/* Table C (2-seat) */}
        <Chair x={665} y={470} w={60} h={18} />
        <TableBox x={640} y={500} w={110} h={90} />
        <Chair x={665} y={602} w={60} h={18} />

        {/* Table B (4-seat) */}
        <Chair x={180} y={750} w={60} h={18} />
        <Chair x={110} y={800} w={18} h={60} />
        <TableBox x={140} y={780} w={140} h={100} />
        <Chair x={292} y={800} w={18} h={60} />
        <Chair x={180} y={892} w={60} h={18} />

        {/* Table D (4-seat) */}
        <Chair x={660} y={750} w={60} h={18} />
        <Chair x={590} y={800} w={18} h={60} />
        <TableBox x={620} y={780} w={140} h={100} />
        <Chair x={772} y={800} w={18} h={60} />
        <Chair x={660} y={892} w={60} h={18} />

        <Doorway animL={anim("doorL")} animR={anim("doorR")} topLine={1108} />

        <Agents sim={sim} speed={speed} animated={animated} />
      </div>
    </Stage>
  );
});
