import { brand } from "@/config/brand";
import { LogoMark } from "@/components/brand/Logo";
import { FoodIcon, type FoodKind } from "@/components/media/FoodIcon";
import { cn } from "@/lib/utils";

/**
 * Temporary product composition (CSS/SVG) — replaced by real renders later
 * (docs/MEDIA_REPLACEMENT_GUIDE.md). White body, black display bezel,
 * payment terminal, floor reflection and studio glow on the dark variant.
 *
 * Text inside the screen stays abstract (bars, no words) so the mockup is
 * language-independent.
 */

function ScreenTile({ kind, active = false }: { kind: FoodKind; active?: boolean }) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col items-center gap-[5%] rounded-[9%] bg-white p-[7%] shadow-[0_1px_3px_rgb(11_13_18/0.06)]",
        active && "ring-2 ring-brand",
      )}
    >
      <div className="min-h-0 w-full flex-1">
        <FoodIcon kind={kind} className="h-full" />
      </div>
      <div className="h-[3px] w-3/4 shrink-0 rounded-full bg-ink/15" />
      <div
        className={cn("h-[4px] w-1/2 shrink-0 rounded-full", active ? "bg-brand" : "bg-brand/40")}
      />
    </div>
  );
}

export function KioskScreen({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-full w-full select-none flex-col overflow-hidden bg-[#f2f3f7]",
        className,
      )}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between bg-white px-[7%] py-[4%]">
        <LogoMark className="h-4 w-4 text-ink" />
        <div className="flex gap-[3px]">
          <span className="rounded-full bg-ink px-[7px] py-[2px] text-[6px] font-extrabold text-white">
            UZ
          </span>
          <span className="rounded-full bg-ink/8 px-[7px] py-[2px] text-[6px] font-bold text-ink/50">
            RU
          </span>
          <span className="rounded-full bg-ink/8 px-[7px] py-[2px] text-[6px] font-bold text-ink/50">
            EN
          </span>
        </div>
      </div>
      {/* Promo banner */}
      <div className="mx-[6%] mt-[5%] flex shrink-0 items-center gap-[6%] rounded-2xl bg-[linear-gradient(120deg,#315cff,#2038a8)] px-[7%] py-[6%]">
        <div className="flex-1 space-y-[6px]">
          <div className="h-[5px] w-4/5 rounded-full bg-white/85" />
          <div className="h-[4px] w-3/5 rounded-full bg-white/40" />
          <div className="mt-[9px] h-[11px] w-2/5 rounded-full bg-white" />
        </div>
        <div className="aspect-square w-[26%]">
          <FoodIcon kind="burger" />
        </div>
      </div>
      {/* Grid — overflow clipped, basket bar always visible */}
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-[4.5%] overflow-hidden px-[6%] py-[5.5%]">
        <ScreenTile kind="coffee" active />
        <ScreenTile kind="sandwich" />
        <ScreenTile kind="donut" />
        <ScreenTile kind="drink" />
      </div>
      {/* Basket bar */}
      <div className="mx-[6%] mb-[5%] flex shrink-0 items-center justify-between rounded-full bg-ink px-[7%] py-[3.5%]">
        <div className="h-[5px] w-1/3 rounded-full bg-white/50" />
        <div className="h-[7px] w-[20%] rounded-full bg-brand-bright" />
      </div>
    </div>
  );
}

function PaymentTerminal({ dark }: { dark: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute -right-[14%] top-[57%] w-[27%] rounded-[12%/9%] p-[2.5%]",
        dark
          ? "border border-white/10 bg-[#1a1e27] shadow-[0_12px_40px_-8px_rgb(0_0_0/0.6)]"
          : "border border-line bg-surface shadow-float",
      )}
    >
      <div className="rounded-[10%/14%] bg-kiosk-bezel p-[6%]">
        <div className="rounded-[8%/16%] bg-[#1d2027] px-[10%] py-[13%]">
          <div className="mb-[8%] h-[4px] w-3/5 rounded-full bg-white/40" />
          <div className="h-[4px] w-2/5 rounded-full bg-success" />
        </div>
        <div className="mt-[8%] grid grid-cols-3 gap-[6%] px-[3%] pb-[3%]">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-[22%] bg-white/12" />
          ))}
        </div>
      </div>
      <div className="mx-auto mt-[7%] mb-[2%] w-[30%]">
        <svg
          viewBox="0 0 24 16"
          className={cn("w-full", dark ? "text-white/40" : "text-ink-soft")}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 2a12 12 0 0 1 0 12M9 4a8 8 0 0 1 0 8M14 6a4 4 0 0 1 0 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

function KioskBody({ dark }: { dark: boolean }) {
  return (
    <div
      className={cn(
        "relative rounded-[1.7rem] p-3",
        "bg-[linear-gradient(165deg,#ffffff_0%,#f2f3f7_60%,#e6e9f0_100%)]",
        dark ? "shadow-kiosk ring-1 ring-white/12" : "border border-kiosk-edge shadow-kiosk-light",
      )}
    >
      {/* Display bezel */}
      <div className="relative overflow-hidden rounded-[1.2rem] bg-kiosk-bezel p-2.5 shadow-[inset_0_1px_2px_rgb(255_255_255/0.1)]">
        <div className="aspect-9/14 overflow-hidden rounded-[0.7rem]">
          <KioskScreen />
        </div>
        {/* Glass reflection */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[1.2rem] bg-[linear-gradient(115deg,transparent_42%,rgb(255_255_255/0.09)_47%,rgb(255_255_255/0.02)_58%,transparent_62%)]"
        />
      </div>
      {/* Embossed brand on body */}
      <div className="flex items-center justify-center py-3">
        <span className="text-[0.82rem] font-extrabold tracking-[0.34em] text-ink/18">
          {brand.logoText}
        </span>
      </div>
      <PaymentTerminal dark={dark} />
    </div>
  );
}

function Stand({ dark }: { dark: boolean }) {
  return (
    <>
      <div
        className={cn(
          "mx-auto h-16 w-[21%] [clip-path:polygon(14%_0,86%_0,100%_100%,0_100%)]",
          dark
            ? "bg-gradient-to-b from-[#dfe3ea] to-[#aab0bd]"
            : "bg-gradient-to-b from-kiosk-edge to-[#cfd4de]",
        )}
      />
      <div
        className={cn("mx-auto h-2.5 w-[54%] rounded-full", dark ? "bg-[#a8aeba]" : "bg-[#cfd4de]")}
      />
    </>
  );
}

export function KioskMockup({
  className,
  variant = "light",
}: {
  className?: string;
  /** "stage" = dark hero treatment with glow + floor reflection. */
  variant?: "light" | "stage";
}) {
  const dark = variant === "stage";

  return (
    // theme-light: the physical product and its screen keep the light palette
    // regardless of the site theme.
    <div
      aria-hidden="true"
      className={cn("theme-light relative mx-auto w-full max-w-85", className)}
    >
      {dark ? (
        // Studio glow behind the unit
        <div className="absolute -inset-x-24 -top-16 bottom-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(70_110_255/0.5),rgb(49_92_255/0.16)_55%,transparent_78%)]" />
      ) : (
        <div className="absolute -inset-x-14 -top-10 bottom-0 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,#ffffff_10%,rgb(233_238_255/0.65)_55%,transparent_100%)]" />
      )}

      <KioskBody dark={dark} />
      <Stand dark={dark} />

      {dark ? (
        // Floor reflection
        <div
          className="kiosk-reflection relative -mt-1 h-40 overflow-hidden opacity-60"
          aria-hidden="true"
        >
          <KioskBody dark={dark} />
        </div>
      ) : (
        <div className="mx-auto mt-1 h-5 w-4/5 rounded-[50%] bg-ink/12 blur-lg" />
      )}
    </div>
  );
}
