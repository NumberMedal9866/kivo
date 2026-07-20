"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { FoodIcon } from "@/components/media/FoodIcon";

/**
 * Hero product shot: the real kiosk render (transparent PNG at
 * public/images/hero-kiosk-front.png — see docs/MEDIA_REPLACEMENT_GUIDE.md)
 * on the dark stage with a studio glow, floor reflection and floating UI
 * chips. Gentle pointer tilt on desktop; disabled on touch and under
 * prefers-reduced-motion.
 */
export function HeroKiosk({
  cardTitle,
  cardSubtitle,
  upsellChip,
  alt,
}: {
  cardTitle: string;
  cardSubtitle: string;
  upsellChip: string;
  alt: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number>(0);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(1200px) rotateY(${px * 6}deg) rotateX(${py * -4}deg)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame.current);
      el.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg)";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative transition-transform duration-300 ease-out will-change-transform"
    >
      {/* Studio glow */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-16 top-0 bottom-16 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(70_110_255/0.45),rgb(49_92_255/0.14)_55%,transparent_78%)]"
      />

      <Image
        src="/images/hero-kiosk-v2.png"
        alt={alt}
        width={491}
        height={1323}
        priority
        sizes="(max-width: 1024px) 60vw, 380px"
        className="relative mx-auto h-[480px] w-auto sm:h-[540px] lg:h-[580px]"
      />

      {/* Floor reflection */}
      <div
        aria-hidden="true"
        className="kiosk-reflection relative -mt-1 flex h-24 justify-center overflow-hidden opacity-50"
      >
        <Image
          src="/images/hero-kiosk-v2.png"
          alt=""
          width={491}
          height={1323}
          className="h-[480px] w-auto sm:h-[540px] lg:h-[580px]"
        />
      </div>

      {/* Paid order chip */}
      <div className="animate-soft-float absolute left-0 top-[10%] w-56 max-w-[62%] rounded-2xl border border-white/12 bg-night-soft/90 p-3.5 shadow-[0_16px_48px_-12px_rgb(0_0_0/0.6)] backdrop-blur-sm sm:-left-4">
        <div className="flex items-start gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-success/15 text-success">
            <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="none" aria-hidden="true">
              <path
                d="m4.5 10.5 3.5 3.5 7.5-8"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="truncate text-[0.83rem] font-bold text-white">{cardTitle}</p>
            <p className="mt-0.5 text-[0.7rem] text-white/55">{cardSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Upsell chip */}
      <div
        className="animate-soft-float absolute right-0 bottom-[34%] flex max-w-[58%] items-center gap-2.5 rounded-full border border-white/12 bg-night-soft/90 py-2 pl-2.5 pr-4 shadow-[0_16px_48px_-12px_rgb(0_0_0/0.6)] backdrop-blur-sm sm:-right-2"
        style={{ animationDelay: "1.6s" }}
      >
        <span className="h-7 w-7 shrink-0">
          <FoodIcon kind="donut" />
        </span>
        <p className="truncate text-[0.78rem] font-bold text-white">{upsellChip}</p>
        <span
          aria-hidden="true"
          className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-white"
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path
              d="M6 2.5v7M2.5 6h7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
