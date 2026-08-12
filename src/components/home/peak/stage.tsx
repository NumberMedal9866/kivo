"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { SCENE_W, SCENE_H, type Sim } from "@/components/home/peak/engine";
import { cn } from "@/lib/utils";

// Layout effect on the client so the first measured paint already shows
// the plan (no post-hydration blank frame); plain effect during SSR.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Fixed-plan stage: the scenes are authored in a 900×1200 coordinate
 * space; this frame measures its own width and scales the whole plan to
 * fit, so every scene reads identically at any size.
 */
export function Stage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScale(el.clientWidth / SCENE_W);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("pk-scene relative w-full select-none overflow-hidden", className)}
      style={{ aspectRatio: `${SCENE_W} / ${SCENE_H}` }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left transition-opacity duration-500"
        style={{
          width: SCENE_W,
          height: SCENE_H,
          transform: `scale(${scale ?? 0})`,
          opacity: scale === null ? 0 : 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Blueprint "+" registration mark. */
export function Plus({ style, size = 13 }: { style: CSSProperties; size?: number }) {
  return (
    <span aria-hidden="true" className="pk-plus" style={{ fontSize: size, ...style }}>
      +
    </span>
  );
}

/** The four inset corner marks of a stage. */
export function StageCorners() {
  return (
    <>
      <Plus size={15} style={{ left: 12, top: 12, transform: "translate(-50%,-50%)" }} />
      <Plus size={15} style={{ right: 12, top: 12, transform: "translate(50%,-50%)" }} />
      <Plus size={15} style={{ left: 12, bottom: 12, transform: "translate(-50%,50%)" }} />
      <Plus size={15} style={{ right: 12, bottom: 12, transform: "translate(50%,50%)" }} />
    </>
  );
}

/** Corner marks for a furniture box (placed on its edges). */
export function BoxCorners({ size = 13 }: { size?: number }) {
  return (
    <>
      <Plus size={size} style={{ left: 0, top: 0, transform: "translate(-50%,-50%)" }} />
      <Plus size={size} style={{ right: 0, top: 0, transform: "translate(50%,-50%)" }} />
      <Plus size={size} style={{ left: 0, bottom: 0, transform: "translate(-50%,50%)" }} />
      <Plus size={size} style={{ right: 0, bottom: 0, transform: "translate(50%,50%)" }} />
    </>
  );
}

/** The tray a guest carries: burger, drink, fries. */
function TrayContents() {
  return (
    <>
      <span className="pk-burger" />
      <span className="pk-cup" />
      <span className="pk-fries" />
    </>
  );
}

/**
 * The walking guests. Animated mode plays the precompiled keyframes;
 * static mode (SSR first paint) renders the
 * scene frozen at the sim's most telling moment.
 */
export function Agents({ sim, speed, animated }: { sim: Sim; speed: number; animated: boolean }) {
  const dur = sim.loopT / speed;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      {sim.agents.map((a, i) => {
        if (!animated) {
          const p = sim.posAt(i, sim.snapshotT);
          if (p.o < 0.05) return null;
          return (
            <div
              key={i}
              className="pk-agent"
              style={{ transform: `translate(${p.x}px, ${p.y}px)`, opacity: p.o }}
            >
              <div className="pk-agent-shadow" />
              <div className="pk-agent-face" style={{ transform: `rotate(${p.rot}deg)` }}>
                <div className="pk-tray" style={{ opacity: p.tray }}>
                  <TrayContents />
                </div>
                <div className="pk-agent-body" style={{ background: a.body }} />
                <div className="pk-agent-head" style={{ background: a.hair }} />
              </div>
            </div>
          );
        }
        return (
          <div
            key={i}
            className="pk-agent"
            style={{
              animation: `${a.move} ${dur}s linear ${a.delay / speed}s infinite`,
              willChange: "transform, opacity",
            }}
          >
            <div className="pk-agent-shadow" />
            <div
              className="pk-agent-face"
              style={{ animation: `${a.face} ${dur}s linear ${a.delay / speed}s infinite` }}
            >
              <div
                className="pk-tray"
                style={{ animation: `${a.tray} ${dur}s linear ${a.delay / speed}s infinite` }}
              >
                <TrayContents />
              </div>
              <div className="pk-agent-body" style={{ background: a.body }} />
              <div className="pk-agent-head" style={{ background: a.hair }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Staff figure (pill body + head), optionally bobbing to an ambient
 * keyframe. `headOffset` mirrors the source scenes: figures drawn behind a
 * counter tuck the head into the body (-6%), free-standing ones carry it
 * above (-94%) like the walking guests.
 */
export function Staff({
  x,
  y,
  hair,
  animation,
  headOffset = "-6%",
}: {
  x: number;
  y: number;
  hair: string;
  animation?: string;
  headOffset?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute"
      style={{ left: x, top: y, width: 0, height: 0, animation }}
    >
      <div className="pk-staff-body" />
      <div
        className="pk-agent-head"
        style={{ background: hair, transform: `translate(-50%,${headOffset})` }}
      />
    </div>
  );
}

/** Sliding double door with its glass panels driven by ambient keyframes. */
export function Doorway({
  animL,
  animR,
  topLine = 1106,
}: {
  animL?: string;
  animR?: string;
  topLine?: number;
}) {
  return (
    <>
      <div
        className="absolute"
        style={{
          left: 326,
          top: topLine,
          width: 248,
          borderTop: "2px solid color-mix(in srgb, var(--pk-accent) 45%, transparent)",
        }}
      />
      <div
        className="absolute overflow-hidden"
        style={{
          left: 326,
          top: 1120,
          width: 248,
          height: 60,
          background: "var(--pk-soft)",
          border: "2.5px solid var(--pk-ink)",
        }}
      >
        <div className="pk-door" style={{ left: 5, animation: animL }} />
        <div className="pk-door" style={{ right: 5, animation: animR }} />
      </div>
    </>
  );
}

/**
 * Pickup station shelf: the tray that slides out just in time. Two nested
 * elements because position and fade run as separate keyframe tracks.
 */
export function ServeShelf({
  width = 104,
  animMove,
  animFade,
}: {
  width?: number;
  animMove?: string;
  animFade?: string;
}) {
  return (
    <div
      className="absolute"
      style={{
        left: "50%",
        top: 7,
        width,
        height: 40,
        marginLeft: -width / 2,
        animation: animMove,
      }}
    >
      <div
        className="pk-tray-shelf"
        style={{ animation: animFade, opacity: animFade ? undefined : 0 }}
      >
        <TrayContents />
      </div>
    </div>
  );
}

/** Dashed square marking where a guest stands. */
export function StandSpot({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: 46,
        height: 46,
        border: "2px dashed color-mix(in srgb, var(--pk-accent) 45%, transparent)",
        transform: "translate(-50%,-50%)",
      }}
    />
  );
}

/** A table box with its blueprint corner marks. */
export function TableBox({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        background: "var(--pk-surface)",
        border: "2.5px solid var(--pk-ink)",
      }}
    >
      <BoxCorners size={12} />
    </div>
  );
}

/** A chair: accent block against the table edge. */
export function Chair({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        background: "var(--pk-accent)",
        border: "1.5px solid var(--pk-ink)",
      }}
    />
  );
}
