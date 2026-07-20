"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Mobile-only contact pill.
 *
 * Behavior tuned for Android browsers with dynamic bottom bars:
 * - bottom offset includes env(safe-area-inset-bottom), so the pill never
 *   sits under (or flush against) the system/browser bar;
 * - it shows only while scrolling UP (an intent to act) and hides while
 *   scrolling down, so it never covers the text being read;
 * - it stays hidden near the top (hero has its own CTA) and near the end
 *   (the lead form is on screen).
 */
export function StickyContact() {
  const t = useTranslations("stickyCta");
  const [visible, setVisible] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      // Ignore sub-pixel jitter from Android URL-bar collapse/expand.
      if (Math.abs(delta) < 6) return;
      const doc = document.documentElement;
      const nearEnd = y + window.innerHeight > doc.scrollHeight - 900;
      const scrollingUp = delta < 0;
      setVisible(scrollingUp && y > 700 && !nearEnd);
      lastY.current = y;
    };
    lastY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 z-40 flex justify-center px-5 transition-all duration-300 lg:hidden",
        "bottom-[calc(1rem+env(safe-area-inset-bottom))]",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <Link
        href="/contact"
        onClick={() => trackEvent("hero_cta_click", { placement: "sticky_mobile" })}
        className="inline-flex h-11 items-center gap-2 rounded-full bg-night/95 px-6 text-[0.95rem] font-semibold text-white shadow-float ring-1 ring-white/15 backdrop-blur-sm"
        tabIndex={visible ? 0 : -1}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 text-brand-bright"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 4h4l1.5 4.5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2L20 15v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
        {t("label")}
      </Link>
    </div>
  );
}
