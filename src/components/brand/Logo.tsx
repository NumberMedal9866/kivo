import { brand } from "@/config/brand";
import { cn } from "@/lib/utils";

/**
 * TEMPORARY wordmark + monogram for the provisional brand.
 * Replace with the final SVG logo later — see docs/BRAND_REPLACEMENT_GUIDE.md.
 * Both variants read their text from src/config/brand.ts.
 */

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {/* Abstract kiosk shape: rounded slab with a screen cut-out and a "K" stroke.
          The K uses the brand accent so the mark reads on light and dark. */}
      <rect x="4" y="2" width="24" height="28" rx="6" fill="currentColor" />
      <rect x="8.5" y="7" width="15" height="13" rx="2.5" fill="#fff" opacity="0.94" />
      <path
        d="M12.5 9.5v8M12.5 13.5l5-4M12.5 13.5l5 4"
        stroke="var(--color-brand, #315CFF)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect
        x="12"
        y="23.5"
        width="8"
        height="2.4"
        rx="1.2"
        fill="var(--color-brand, #315CFF)"
        opacity="0.5"
      />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
  dark = false,
}: {
  className?: string;
  markClassName?: string;
  /** Render the lockup for dark surfaces (white text). */
  dark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={cn("h-7 w-7", dark ? "text-white" : "text-ink", markClassName)} />
      <span
        className={cn(
          "text-[1.15rem] font-extrabold tracking-[-0.02em]",
          dark ? "text-white" : "text-ink",
        )}
      >
        {brand.logoText}
      </span>
    </span>
  );
}
