import { brand } from "@/config/brand";
import { LogoMark } from "@/components/brand/Logo";
import { KioskScreen } from "@/components/media/KioskMockup";
import { cn } from "@/lib/utils";
import type { MediaEntry } from "@/content/media";

/**
 * Polished SVG/CSS fallback compositions shown until real product imagery
 * is supplied. Four art directions cover every registered media entry.
 * These are decorative stand-ins: the semantic alt text is applied by
 * <ProductMedia>, which wraps this component.
 */
export function ImagePlaceholder({ entry, className }: { entry: MediaEntry; className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-card border border-line bg-surface",
        className,
      )}
      style={{ aspectRatio: `${entry.width} / ${entry.height}` }}
    >
      {entry.placeholder === "kiosk" && <KioskArt />}
      {entry.placeholder === "scene" && <SceneArt />}
      {entry.placeholder === "closeup" && <CloseupArt />}
      {entry.placeholder === "diagram" && <DiagramArt />}
    </div>
  );
}

function KioskArt() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(160deg,#ffffff_0%,#eef1f7_100%)]">
      <div className="absolute left-1/2 top-1/2 aspect-[9/14] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-[6%/4%] bg-kiosk-bezel p-[1.8%] shadow-kiosk">
        <KioskScreen className="rounded-[4%/3%]" />
      </div>
    </div>
  );
}

function SceneArt() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#f3ede5_0%,#e9e2d8_58%,#d9d2c6_58%,#cfc8bc_100%)]">
      {/* Abstract interior: window light, counter, kiosk silhouette */}
      <div className="absolute left-[8%] top-[12%] h-[42%] w-[20%] rounded-t-full bg-white/50" />
      <div className="absolute left-[34%] top-[18%] h-[36%] w-[14%] rounded-t-full bg-white/35" />
      <div className="absolute bottom-[18%] right-[10%] w-[24%]">
        <div className="rounded-[8%/5%] bg-kiosk-bezel p-[4%] shadow-float">
          <div className="aspect-[9/14]">
            <KioskScreen className="rounded-[6%/4%]" />
          </div>
        </div>
        <div className="mx-auto h-[2.2rem] w-[18%] bg-[#b9b2a6]" />
        <div className="mx-auto h-1.5 w-[50%] rounded-full bg-[#a8a196]" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-[#bfb8ac]" />
      <LogoMark className="absolute left-[6%] top-[6%] h-[8%] w-auto text-ink/10" />
    </div>
  );
}

function CloseupArt() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#ffffff_0%,#e6e9f0_70%)]">
      <div className="absolute right-[12%] top-1/2 w-[38%] -translate-y-1/2 rounded-[10%/8%] bg-kiosk-bezel p-[4%] shadow-float">
        <div className="rounded-[8%/12%] bg-[#1d2027] px-[10%] py-[12%]">
          <div className="mb-[8%] h-[6px] w-3/5 rounded-full bg-white/40" />
          <div className="h-[6px] w-2/5 rounded-full bg-success" />
        </div>
        <div className="mt-[8%] grid grid-cols-3 gap-[6%]">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-[20%] bg-white/12" />
          ))}
        </div>
      </div>
      <div className="absolute left-[10%] top-[20%] h-[60%] w-[34%] rounded-[2rem] border border-kiosk-edge bg-kiosk-body shadow-soft" />
      <span className="absolute bottom-[8%] left-[10%] text-[0.6rem] font-extrabold tracking-[0.3em] text-ink/15">
        {brand.logoText}
      </span>
    </div>
  );
}

function DiagramArt() {
  return (
    <div className="absolute inset-0 bg-surface p-[6%]">
      <svg viewBox="0 0 160 100" className="h-full w-full" aria-hidden="true">
        <circle
          cx="80"
          cy="50"
          r="14"
          fill="var(--color-brand-soft)"
          stroke="var(--color-brand)"
          strokeWidth="1.4"
        />
        <text
          x="80"
          y="53"
          textAnchor="middle"
          fontSize="7"
          fontWeight="800"
          fill="var(--color-brand)"
        >
          {brand.monogram}
        </text>
        {[
          [20, 16],
          [140, 16],
          [20, 84],
          [140, 84],
        ].map(([x, y], i) => (
          <g key={i}>
            <line
              x1="80"
              y1="50"
              x2={x}
              y2={y}
              stroke="var(--color-line)"
              strokeWidth="1.4"
              strokeDasharray="3 3"
            />
            <rect
              x={x! - 12}
              y={y! - 8}
              width="24"
              height="16"
              rx="4"
              fill="var(--color-bg)"
              stroke="var(--color-line)"
              strokeWidth="1.2"
            />
            <rect
              x={x! - 7}
              y={y! - 2.5}
              width="14"
              height="2.4"
              rx="1.2"
              fill="var(--color-ink-soft)"
              opacity="0.5"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
