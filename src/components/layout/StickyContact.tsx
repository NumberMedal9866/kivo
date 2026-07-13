"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Subtle mobile-only contact button. Appears after the visitor scrolls past
 * the hero and hides near the page-end CTA/form so it never covers the form.
 */
export function StickyContact() {
  const t = useTranslations("stickyCta");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = window.scrollY;
      const nearEnd = scrolled + window.innerHeight > doc.scrollHeight - 900;
      setVisible(scrolled > 700 && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-4 z-40 flex justify-center px-5 transition-all duration-300 lg:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <Link
        href="/contact"
        onClick={() => trackEvent("hero_cta_click", { placement: "sticky_mobile" })}
        className="inline-flex h-12 w-full max-w-sm items-center justify-center rounded-full bg-night px-6 font-semibold text-white shadow-float dark:ring-1 dark:ring-white/20"
        tabIndex={visible ? 0 : -1}
      >
        {t("label")}
      </Link>
    </div>
  );
}
