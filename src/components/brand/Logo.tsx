"use client";

import { useId } from "react";
import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

/**
 * kiyo brand lockup — geometry from the owner-supplied SVG, used verbatim.
 *
 * Brand values: mark #315CFF, wordmark #0B0D12 (Montserrat 700,
 * letter-spacing -0.03em, always lowercase).
 *
 * The mark's "k" is punched out of the disc with an SVG <mask>. The mask id
 * is generated per instance with useId() — hardcoding it would break the
 * mark whenever the logo renders more than once on a page (header + footer).
 */

/* Mark paths — verbatim from the brand SVG (viewBox 0 0 120 120). */
function MarkPaths({ maskId }: { maskId: string }) {
  return (
    <>
      <defs>
        <mask id={maskId}>
          <rect x="-10" y="-10" width="140" height="140" fill="white" />
          <g transform="translate(60,60)">
            <path d="M -44 44 L 44 -32" stroke="black" strokeWidth="8" strokeLinecap="round" />
            <path
              d="M -44 44 C -6 20, 24 20, 56 34"
              fill="none"
              stroke="black"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M -9 -64 C -14 -28, -14 28, -7 64"
              fill="none"
              stroke="black"
              strokeWidth="8"
              strokeLinecap="round"
              transform="rotate(-14,-10,0)"
            />
          </g>
        </mask>
      </defs>
      <circle cx="60" cy="60" r="52" fill="currentColor" mask={`url(#${maskId})`} />
    </>
  );
}

/**
 * Standalone mark (currentColor). Used for watermarks and in-product
 * placements; carries <title> unless explicitly decorative.
 */
export function LogoMark({
  className,
  title,
  decorative = false,
}: {
  className?: string;
  title?: string;
  /** Set when the mark sits next to visible brand text (avoids double announcement). */
  decorative?: boolean;
}) {
  const maskId = useId();
  return (
    <svg
      viewBox="8 8 104 104"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
    >
      {!decorative && <title>{title ?? "Kiyo"}</title>}
      <MarkPaths maskId={maskId} />
    </svg>
  );
}

type LogoColor = "default" | "mono" | "inverse" | "white";
type LogoVariant = "lockup" | "mark" | "stacked";

const MARK_COLOR: Record<LogoColor, string> = {
  default: "text-brand", // #315CFF
  mono: "text-[#0B0D12]",
  inverse: "text-brand",
  white: "text-white",
};

const WORD_COLOR: Record<LogoColor, string> = {
  default: "text-[#0B0D12] dark:text-white",
  mono: "text-[#0B0D12]",
  inverse: "text-white",
  white: "text-white",
};

/**
 * The Kiyo logo.
 *
 * - `variant`: "lockup" (default, mark + wordmark), "mark", "stacked".
 * - `color`: "default" | "mono" | "inverse" (dark backgrounds) | "white".
 * - `size`: height in px of the mark; the wordmark scales so its cap height
 *   matches the mark, with a gap of ~0.35× the mark's width.
 *
 * When used as a home link, give the <Link> an accessible name
 * (aria-label="Kiyo, home"); the wordmark is live text, so the SVG is
 * decorative in the lockup variants.
 */
export function Logo({
  variant = "lockup",
  color = "default",
  size = 28,
  className,
  /** @deprecated legacy prop — maps to color="inverse". */
  dark,
}: {
  variant?: LogoVariant;
  color?: LogoColor;
  size?: number;
  className?: string;
  dark?: boolean;
}) {
  const resolved: LogoColor = dark ? "inverse" : color;

  // Montserrat 700 cap height ≈ 0.70 em → font-size that matches the mark.
  const fontSize = size / 0.7;
  const gap = variant === "stacked" ? size * 0.3 : size * 0.35;

  const mark = (
    <LogoMark
      decorative={variant !== "mark"}
      className={cn("shrink-0", MARK_COLOR[resolved])}
      title="Kiyo"
    />
  );

  if (variant === "mark") {
    return (
      <span className={cn("inline-flex", className)} style={{ height: size, width: size }}>
        {mark}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex select-none",
        variant === "stacked" ? "flex-col items-center" : "flex-row items-center",
        className,
      )}
      style={{ gap }}
    >
      <span className="inline-flex" style={{ height: size, width: size }}>
        {mark}
      </span>
      <span
        className={cn("font-logo font-bold leading-none", WORD_COLOR[resolved])}
        style={{ fontSize, letterSpacing: "-0.03em" }}
      >
        {brand.logoText}
      </span>
    </span>
  );
}
