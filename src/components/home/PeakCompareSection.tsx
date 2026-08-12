"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import {
  buildCashierSim,
  buildKioskSim,
  servedCount,
  type Sim,
} from "@/components/home/peak/engine";
import { CashierScene } from "@/components/home/peak/CashierScene";
import { KioskScene } from "@/components/home/peak/KioskScene";
import { Odometer } from "@/components/home/peak/Odometer";
import { cn } from "@/lib/utils";

/**
 * Before/after, side by side: the same café simulated with one till and
 * with three kiosks. Both floor plans run the owner-supplied deterministic
 * crowd sims as pure CSS animations; the served counters and the queue
 * badge read the very same schedule, so numbers and motion never disagree.
 *
 * Time runs at SPEED× (a time-lapse — labelled on each panel). Animations
 * and counters pause together while the section is off-screen; the SSR
 * pass renders the scenes frozen at a telling moment.
 */
const SPEED = 2.5;

export function PeakCompareSection() {
  const t = useTranslations("switch");
  const locale = useLocale();

  const sims = useMemo(() => ({ cash: buildCashierSim("pkc"), kiosk: buildKioskSim("pkk") }), []);

  // The scenes animate for everyone once hydrated — like the rest of the
  // site, the OS reduced-motion flag is deliberately not consulted (the
  // owner wants the demo live; the motion is gentle constant-velocity
  // gliding, no flashing or parallax).
  const animated = useMounted();

  const { ref: viewRef, visible } = useInView<HTMLDivElement>();
  const live = useSimClock(sims, SPEED, animated && visible, animated);

  const nf = useMemo(
    () => new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
    [locale],
  );
  const ratio = live.cash >= 4 ? nf.format(live.kiosk / live.cash) : null;
  // The ×2.5 factor lives inside the translated label (formatting it with
  // Intl at render time hydration-mismatches on locales where server and
  // browser ICU disagree). Keep the strings in sync with SPEED.
  const timelapse = t("timelapse");
  const servedLabel = t("servedLabel");

  // Stable label objects so counter ticks don't re-render the scene trees
  // (the scenes are memoized; an inline object would defeat that).
  const cashLabels = useMemo(
    () => ({ menu: t("scene.menu"), orderHere: t("scene.orderHere"), pickup: t("scene.pickup") }),
    [t],
  );
  const kioskLabels = useMemo(() => ({ kiosk: t("scene.kiosk"), pickup: t("scene.pickup") }), [t]);

  return (
    <section className="section-pad">
      <Container>
        <div className="max-w-2xl">
          <p className="mb-3 text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-brand">
            {t("kicker")}
          </p>
          <h2 className="text-headline text-balance text-ink">{t("heading")}</h2>
          <p className="mt-4 text-pretty text-[1.02rem] leading-relaxed text-ink-soft">
            {t("sub")}
          </p>
        </div>

        <div ref={viewRef} className={cn("relative mt-10", animated && !visible && "pk-paused")}>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <Panel
              tone="before"
              title={t("beforeTitle")}
              tag={t("beforeTag")}
              count={live.cash}
              servedLabel={servedLabel}
              alt={t("beforeAlt")}
              badge={
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-bg px-3.5 py-1.5 text-xs font-bold text-ink-soft">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber" />
                  {t("queueNow")}: {live.queue}
                </span>
              }
              timelapse={timelapse}
            >
              <CashierScene sim={sims.cash} speed={SPEED} animated={animated} labels={cashLabels} />
            </Panel>

            <Panel
              tone="after"
              title={t("afterTitle")}
              tag={t("afterTag")}
              count={live.kiosk}
              servedLabel={servedLabel}
              alt={t("afterAlt")}
              badge={
                <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-3.5 py-1.5 text-xs font-bold text-brand dark:text-brand-bright">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 animate-pulse rounded-full bg-success"
                  />
                  {t("noQueue")}
                </span>
              }
              timelapse={timelapse}
            >
              <KioskScene sim={sims.kiosk} speed={SPEED} animated={animated} labels={kioskLabels} />
            </Panel>
          </div>

          {/* Scoreboard chip — centred over the decorative scenes so it can
              never occlude the counters, whose width varies per locale */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border border-white/10 bg-night px-4 py-2.5 text-white shadow-float md:flex dark:border-white/15 dark:bg-[#1b2130]"
          >
            <span className="text-xl font-black leading-none tabular-nums">
              {ratio ? `×${ratio}` : "VS"}
            </span>
            {ratio && (
              <span className="mt-1 text-[0.58rem] font-extrabold uppercase tracking-[0.14em] text-white/55">
                {t("ratioLabel")}
              </span>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {(["b1", "b2", "b3", "b4"] as const).map((key, i) => (
            <div key={key} className="rounded-2xl border border-line bg-surface p-5">
              <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand dark:text-brand-bright">
                <BenefitIcon i={i} />
              </span>
              <h3 className="mt-3.5 text-[0.98rem] font-extrabold text-ink">
                {t(`benefits.${key}.title`)}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {t(`benefits.${key}.text`)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-2xl text-[0.8rem] leading-relaxed text-ink-soft/80">
          {t("caption")}
        </p>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Panel({
  tone,
  title,
  tag,
  count,
  servedLabel,
  badge,
  alt,
  timelapse,
  children,
}: {
  tone: "before" | "after";
  title: string;
  tag: string;
  count: number;
  servedLabel: string;
  badge: ReactNode;
  alt: string;
  timelapse: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-card border bg-surface",
        tone === "after"
          ? "border-brand/30 shadow-[0_0_44px_-12px_rgb(49_92_255/0.4)]"
          : "border-line",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 p-5 sm:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-wider",
                tone === "after"
                  ? "bg-brand text-white"
                  : "bg-ink/8 text-ink-soft dark:bg-white/10 dark:text-ink",
              )}
            >
              {title}
            </span>
            <span className="text-xs font-bold text-ink-soft">{tag}</span>
          </div>
          <div className="mt-3.5 flex items-baseline gap-1">
            <Odometer
              value={count}
              className={cn(
                "text-[2.6rem] font-black leading-none sm:text-5xl",
                tone === "after" ? "text-brand dark:text-brand-bright" : "text-ink",
              )}
            />
          </div>
          <p className="mt-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.15em] text-ink-soft">
            {servedLabel}
          </p>
        </div>
        {badge}
      </div>

      <div className="relative border-t border-line">
        {children}
        {timelapse && (
          <span className="absolute bottom-2.5 right-2.5 z-30 rounded-full bg-night/70 px-2.5 py-1 text-[0.6rem] font-bold tracking-wide text-white/80 backdrop-blur-sm">
            {timelapse}
          </span>
        )}
      </div>

      <p className="sr-only">{alt}</p>
    </div>
  );
}

function BenefitIcon({ i }: { i: number }) {
  const paths = [
    // three parallel arrows
    "M5 4v11m0 0-2.7-2.7M5 15l2.7-2.7M12 4v13m0 0-2.7-2.7M12 17l2.7-2.7M19 4v11m0 0-2.7-2.7M19 15l2.7-2.7",
    // pot with steam
    "M5 12h14v5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-5Zm-1.5 0h17M9 8.5c0-1.2.8-1.6 .8-2.6M13.5 8.5c0-1.2.8-1.6.8-2.6",
    // plus in circle
    "M12 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15ZM12 9v6M9 12h6",
    // screen with check
    "M4.5 5.5h15v10.5h-15V5.5Zm4.5 5 2.2 2.2 4.3-4.4M12 16v3M8.5 19h7",
  ];
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d={paths[i]}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */

const emptySubscribe = () => () => {};

/** True only after hydration — the SSR pass renders the static scenes. */
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    // The last entry is the newest — IO batches all threshold crossings
    // since the previous callback, and a fast scroll can deliver several.
    const io = new IntersectionObserver(
      (entries) => setVisible(entries[entries.length - 1]?.isIntersecting ?? false),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

/**
 * Shared clock for both counters. Accumulates only while running (visible
 * and animating) — exactly matching the CSS animations, which are paused
 * through the same condition — so the on-screen trays and the numbers
 * always agree. When `animated` flips back on (e.g. the OS reduced-motion
 * setting was toggled off), the CSS animations are recreated from the loop
 * origin, so the clock rewinds with them to stay in phase.
 */
function useSimClock(
  sims: { cash: Sim; kiosk: Sim },
  speed: number,
  running: boolean,
  animated: boolean,
) {
  const [state, setState] = useState(() => ({
    cash: 0,
    kiosk: 0,
    queue: sims.cash.queueAt ? sims.cash.queueAt(0) : 0,
  }));
  const activeRef = useRef(0);
  const wasAnimatedRef = useRef(animated);

  useEffect(() => {
    if (animated && !wasAnimatedRef.current) activeRef.current = 0;
    wasAnimatedRef.current = animated;
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      activeRef.current += (now - last) / 1000;
      last = now;
      const simT = activeRef.current * speed;
      const cash = servedCount(sims.cash, simT);
      const kiosk = servedCount(sims.kiosk, simT);
      const queue = sims.cash.queueAt ? sims.cash.queueAt(simT % sims.cash.loopT) : 0;
      setState((prev) =>
        prev.cash !== cash || prev.kiosk !== kiosk || prev.queue !== queue
          ? { cash, kiosk, queue }
          : prev,
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, animated, sims, speed]);

  return state;
}
