"use client";

import { useId, useState } from "react";
import type { HowStep } from "@/components/home/HowItWorks";
import { cn } from "@/lib/utils";

const STEP_ART: Record<string, React.ReactNode> = {
  assessment: (
    <g>
      <circle cx="10" cy="10" r="6.5" />
      <path d="m15 15 6 6M7.5 10h5M10 7.5v5" />
    </g>
  ),
  setup: (
    <g>
      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
    </g>
  ),
  installation: (
    <g>
      <rect x="7" y="3" width="10" height="15" rx="2" />
      <path d="M10 21h4M12 18v3M10.5 7.5h3" />
    </g>
  ),
  support: (
    <g>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="2.5" y="12" width="4.5" height="7" rx="2" />
      <rect x="17" y="12" width="4.5" height="7" rx="2" />
      <path d="M19 19v1a2.5 2.5 0 0 1-2.5 2.5H13" />
    </g>
  ),
};

export function HowSteps({ steps }: { steps: HowStep[] }) {
  const [active, setActive] = useState(0);
  const baseId = useId();

  function onKeyDown(e: React.KeyboardEvent) {
    if (
      e.key !== "ArrowDown" &&
      e.key !== "ArrowUp" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight"
    )
      return;
    e.preventDefault();
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const next = (active + dir + steps.length) % steps.length;
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  const step = steps[active]!;

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
      {/* Step rail */}
      <div
        role="tablist"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2"
      >
        {steps.map((s, i) => (
          <button
            key={s.key}
            id={`${baseId}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "group flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300",
              i === active
                ? "border-night bg-night text-white shadow-float dark:border-white/20"
                : "border-line bg-surface text-ink hover:border-ink/30",
            )}
          >
            <span
              className={cn(
                "text-[0.8rem] font-extrabold tracking-[0.18em]",
                i === active ? "text-brand-bright" : "text-brand",
              )}
            >
              {s.num}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[1.05rem] font-extrabold">{s.title}</span>
              <span
                className={cn(
                  "block truncate text-sm",
                  i === active ? "text-white/55" : "text-ink-soft",
                )}
              >
                {s.short}
              </span>
            </span>
            <svg
              viewBox="0 0 16 16"
              className={cn(
                "h-4 w-4 shrink-0 transition-transform",
                i === active
                  ? "translate-x-0 text-brand-bright"
                  : "-translate-x-1 text-ink-soft/40 group-hover:translate-x-0",
              )}
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h10m0 0L9 4m4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>

      {/* Active panel */}
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className="relative overflow-hidden rounded-card border border-line bg-surface p-8"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-8 text-[9rem] font-extrabold leading-none tracking-tighter text-ink/4 select-none"
        >
          {step.num}
        </span>
        <span
          aria-hidden="true"
          className="grid h-13 w-13 place-items-center rounded-2xl bg-brand-soft text-brand"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {STEP_ART[step.key]}
          </svg>
        </span>
        <h3 className="mt-5 text-title text-ink">{step.title}</h3>
        <ul className="mt-5 space-y-3.5">
          {step.details.map((d) => (
            <li key={d} className="flex items-start gap-3 text-[0.98rem] text-ink">
              <span
                aria-hidden="true"
                className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"
              >
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                  <path
                    d="m2.5 6.5 2.5 2.5 4.5-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {d}
            </li>
          ))}
        </ul>

        {/* All step details stay in the HTML for crawlers/no-JS */}
        <div hidden aria-hidden="true">
          {steps.map((s) => s.details.join(" "))}
        </div>
      </div>
    </div>
  );
}
