"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * Interactive before/after: a top-down café floor plan. One toggle
 * re-arranges the same rush hour — guests either pile into a single queue
 * at the till, or spread across kiosks while orders stream to the kitchen.
 *
 * The scene is decorative (aria-hidden); the bullet list carries the
 * semantics. Idle animations (queue shuffle, screen taps, steam, order
 * pulses) are CSS/SMIL and are disabled under prefers-reduced-motion.
 */
export function SwitchSection() {
  const t = useTranslations("switch");
  const [after, setAfter] = useState(false);

  const items = (["i1", "i2", "i3", "i4"] as const).map((key) =>
    after ? t(`after.${key}`) : t(`before.${key}`),
  );

  return (
    <section className="section-pad">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-brand">
              {t("kicker")}
            </p>
            <h2 className="text-headline text-balance text-ink">{t("heading")}</h2>
          </div>

          {/* Toggle */}
          <div
            role="group"
            aria-label={t("kicker")}
            className="inline-flex rounded-full border border-line bg-surface p-1.5 shadow-soft"
          >
            {[
              { key: false, label: t("beforeLabel") },
              { key: true, label: t("afterLabel") },
            ].map((opt) => (
              <button
                key={String(opt.key)}
                type="button"
                aria-pressed={after === opt.key}
                onClick={() => setAfter(opt.key)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-bold transition-colors",
                  after === opt.key
                    ? opt.key
                      ? "bg-brand text-white"
                      : "bg-night text-white dark:ring-1 dark:ring-white/25"
                    : "text-ink-soft hover:text-ink",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1.5fr]">
          {/* Bullet list — swaps with the toggle */}
          <ul className="flex flex-col justify-center gap-3">
            {items.map((item, i) => (
              <li
                key={`${after}-${i}`}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border px-5 py-4 text-[0.98rem] font-semibold transition-all duration-300",
                  after
                    ? "border-brand/25 bg-brand-soft/60 text-ink"
                    : "border-line bg-surface text-ink-soft",
                )}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors",
                    after ? "bg-brand text-white" : "bg-ink/10 text-ink-soft",
                  )}
                >
                  {after ? (
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                      <path
                        d="m2.5 6.5 2.5 2.5 4.5-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
                      <path
                        d="M2.5 6h7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* ---- Floor plan ---- */}
          <div
            aria-hidden="true"
            className="relative h-90 overflow-hidden rounded-card border border-line bg-surface select-none"
          >
            {/* Floor tiles */}
            <div className="absolute inset-3 rounded-2xl border-2 border-line bg-[repeating-linear-gradient(0deg,transparent_0_44px,var(--color-line)_44px_45px),repeating-linear-gradient(90deg,transparent_0_44px,var(--color-line)_44px_45px)] opacity-60" />

            {/* Entrance gap in the bottom wall */}
            <div className="absolute bottom-[3px] left-[9%] h-3.5 w-16 bg-surface" />
            <div className="absolute bottom-4 left-[9%] flex w-16 flex-col items-center gap-0.5">
              <svg viewBox="0 0 16 16" className="h-4 w-4 text-ink-soft/70" fill="none">
                <path
                  d="M8 13V3m0 0L4 7m4-4 4 4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[0.6rem] font-extrabold uppercase tracking-wider text-ink-soft/70">
                {t("sceneEntrance")}
              </span>
            </div>

            {/* Decorative tables */}
            <CafeTable x="34%" y="26%" />
            <CafeTable x="33%" y="74%" />

            {/* Kitchen (top right) */}
            <div
              className={cn(
                "absolute right-[5%] top-[7%] h-[26%] w-[36%] rounded-xl border-2 transition-colors duration-500",
                after ? "border-success/50 bg-success/10" : "border-line bg-bg",
              )}
            >
              <div className="absolute inset-0 rounded-[10px] bg-[repeating-linear-gradient(45deg,transparent_0_10px,rgb(11_165_124/0.06)_10px_13px)]" />
              <span
                className={cn(
                  "absolute left-3 top-2 text-xs font-extrabold uppercase tracking-wider",
                  after ? "text-success" : "text-ink-soft/60",
                )}
              >
                {t("sceneKitchen")}
              </span>
              {/* Serving pass along the bottom edge */}
              <div
                className={cn(
                  "absolute -bottom-1 left-1/2 h-2 w-3/5 -translate-x-1/2 rounded-full transition-colors duration-500",
                  after ? "bg-success/70" : "bg-line",
                )}
              />
              {/* Steam (after only) */}
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "animate-steam absolute top-8 h-4 w-1 rounded-full bg-success/50 transition-opacity duration-500 motion-reduce:hidden",
                    !after && "opacity-0 [animation-play-state:paused]",
                  )}
                  style={{ left: `${34 + i * 14}%`, animationDelay: `${i * 0.7}s` }}
                />
              ))}
            </div>

            {/* Till / counter (left, away from the entrance below it) */}
            <div
              className={cn(
                "absolute bottom-[34%] left-[6%] flex h-13 w-[21%] items-center justify-center rounded-xl font-bold transition-all duration-500",
                after
                  ? "bg-bg text-ink-soft/50 ring-1 ring-line"
                  : "bg-night text-white shadow-float dark:ring-1 dark:ring-white/25",
              )}
            >
              <span className="text-sm">{t("sceneCounter")}</span>
            </div>

            {/* Queue path to the till (before only) */}
            <div
              className={cn(
                "absolute left-[28%] top-[57%] h-0 w-[40%] origin-left -rotate-[20deg] border-t-2 border-dashed border-ink/20 transition-opacity duration-500",
                after && "opacity-0",
              )}
            />

            {/* Kiosks (bottom right) */}
            {KIOSK_X.map((x, i) => (
              <div
                key={i}
                className={cn(
                  "absolute bottom-[12%] flex w-11 -translate-x-1/2 flex-col items-center gap-1 transition-all duration-500",
                  after ? "opacity-100" : "opacity-25 grayscale",
                )}
                style={{ left: x, transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className={cn(
                    "flex h-11 w-9 flex-col items-center justify-center gap-1 rounded-lg bg-brand transition-shadow duration-500",
                    after && "shadow-[0_0_20px_-2px_rgb(49_92_255/0.6)]",
                  )}
                >
                  <span className="h-1 w-5 rounded-full bg-white/80" />
                  <span className="h-1 w-3.5 rounded-full bg-white/40" />
                  <span className="h-1.5 w-4 rounded-full bg-white" />
                </div>
                <span className="h-1 w-5 rounded-full bg-ink/25" />
              </div>
            ))}
            <span
              className={cn(
                "absolute bottom-[4%] left-[73%] -translate-x-1/2 text-[0.6rem] font-extrabold uppercase tracking-wider transition-colors duration-500",
                after ? "text-brand" : "text-ink-soft/50",
              )}
            >
              {t("sceneKiosks")}
            </span>

            {/* Order flow: kiosks → kitchen (after) / till → kitchen (before) */}
            <svg
              viewBox="0 0 160 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <g
                className={cn(
                  "text-ink transition-opacity duration-500",
                  after ? "opacity-0" : "opacity-100",
                )}
              >
                <path
                  d={BEFORE_PATH}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  vectorEffect="non-scaling-stroke"
                />
                <circle r="1.7" fill="var(--color-ink-soft)" className="motion-reduce:hidden">
                  <animateMotion dur="5s" repeatCount="indefinite" path={BEFORE_PATH} />
                </circle>
              </g>
              <g
                className={cn(
                  "transition-opacity duration-500",
                  after ? "opacity-100" : "opacity-0",
                )}
              >
                {AFTER_PATHS.map((d, i) => (
                  <g key={i}>
                    <path
                      d={d}
                      fill="none"
                      stroke="var(--color-brand)"
                      strokeOpacity="0.25"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle r="1.7" fill="var(--color-brand)" className="motion-reduce:hidden">
                      <animateMotion
                        dur="2.4s"
                        begin={`${i * 0.8}s`}
                        repeatCount="indefinite"
                        path={d}
                      />
                    </circle>
                  </g>
                ))}
              </g>
            </svg>

            {/* Guests (amber) */}
            {GUESTS.map((g, i) => (
              <Person
                key={`g${i}`}
                tone="guest"
                x={after ? g.after.x : g.before.x}
                y={after ? g.after.y : g.before.y}
                anim={after ? g.animAfter : g.animBefore}
                delay={i * 60}
              />
            ))}
            {/* Staff (dark) — the cashier walks over to the kitchen */}
            {STAFF.map((s, i) => (
              <Person
                key={`s${i}`}
                tone="staff"
                x={after ? s.after.x : s.before.x}
                y={after ? s.after.y : s.before.y}
                anim="none"
                delay={i * 90}
              />
            ))}
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft">{t("caption")}</p>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Person({
  tone,
  x,
  y,
  anim,
  delay,
}: {
  tone: "guest" | "staff";
  x: string;
  y: string;
  anim: "bob" | "tap" | "none";
  delay: number;
}) {
  return (
    <span
      className={cn(
        "absolute z-10 grid h-8 w-8 place-items-center rounded-full border-2 border-surface shadow-soft transition-[left,top,background-color] duration-700",
        anim === "none" && "-translate-x-1/2 -translate-y-1/2",
        anim === "bob" &&
          "animate-bob motion-reduce:-translate-x-1/2 motion-reduce:-translate-y-1/2",
        anim === "tap" &&
          "animate-tap motion-reduce:-translate-x-1/2 motion-reduce:-translate-y-1/2",
        tone === "guest"
          ? "bg-amber text-white"
          : "bg-night text-white dark:ring-1 dark:ring-white/30",
      )}
      style={{ left: x, top: y, transitionDelay: `${delay}ms`, animationDelay: `${delay * 4}ms` }}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M12 11.2a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Zm-6.8 8.3a6.8 6.8 0 0 1 13.6 0V20H5.2v-.5Z" />
      </svg>
    </span>
  );
}

function CafeTable({ x, y }: { x: string; y: string }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 opacity-60"
      style={{ left: x, top: y }}
    >
      <div className="relative h-10 w-10 rounded-full border-2 border-line bg-bg">
        {[0, 90, 180, 270].map((deg) => (
          <span
            key={deg}
            className="absolute h-2.5 w-2.5 rounded-full bg-line"
            style={{
              left: `${50 + 78 * Math.cos((deg * Math.PI) / 180)}%`,
              top: `${50 + 78 * Math.sin((deg * Math.PI) / 180)}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Kiosk column centers (percent of scene width). */
const KIOSK_X = ["58%", "73%", "88%"];

/** SVG paths in the 160×100 scene space. */
const BEFORE_PATH = "M 28 52 L 118 36";
const AFTER_PATHS = ["M 92.8 56 L 110 36", "M 116.8 56 L 119 36", "M 140.8 56 L 128 36"];

/**
 * Guest positions. before: single-file queue along the dashed path to the
 * till + one entering at the door. after: one guest at each kiosk (tapping),
 * one collecting at the pass, one walking in, one entering.
 */
const GUESTS: {
  before: { x: string; y: string };
  after: { x: string; y: string };
  animBefore: "bob" | "tap" | "none";
  animAfter: "bob" | "tap" | "none";
}[] = [
  {
    before: { x: "31%", y: "55%" },
    after: { x: "58%", y: "56%" },
    animBefore: "bob",
    animAfter: "tap",
  },
  {
    before: { x: "39%", y: "50%" },
    after: { x: "73%", y: "56%" },
    animBefore: "bob",
    animAfter: "tap",
  },
  {
    before: { x: "47%", y: "45%" },
    after: { x: "88%", y: "56%" },
    animBefore: "bob",
    animAfter: "tap",
  },
  {
    before: { x: "55%", y: "40%" },
    after: { x: "76%", y: "40%" },
    animBefore: "bob",
    animAfter: "none",
  },
  {
    before: { x: "63%", y: "35%" },
    after: { x: "40%", y: "58%" },
    animBefore: "bob",
    animAfter: "bob",
  },
  {
    before: { x: "13%", y: "80%" },
    after: { x: "13%", y: "80%" },
    animBefore: "none",
    animAfter: "none",
  },
];

/** Staff: the cashier leaves the till and joins the kitchen. */
const STAFF: { before: { x: string; y: string }; after: { x: string; y: string } }[] = [
  { before: { x: "16%", y: "43%" }, after: { x: "86%", y: "15%" } },
  { before: { x: "86%", y: "15%" }, after: { x: "74%", y: "15%" } },
];
