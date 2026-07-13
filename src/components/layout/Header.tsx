"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { buttonClasses } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type NavItem = { key: string; href: string };

// Five top-level items max; /product is a detail page, the rest anchor home.
const NAV: NavItem[] = [
  { key: "product", href: "/product" },
  { key: "demo", href: "/#demo" },
  { key: "integrations", href: "/#integrations" },
  { key: "rental", href: "/#rental" },
  { key: "faq", href: "/#faq" },
];

/**
 * Dark chrome header: transparent over the dark hero band, gains a glass
 * night surface after scrolling. Consistent on every page because all pages
 * open with a dark band.
 */
export function Header() {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-white/10 bg-night/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8 md:h-[4.5rem]">
        <Link
          href="/"
          aria-label={t("nav.home")}
          className="shrink-0"
          onClick={() => setOpen(false)}
        >
          <Logo dark />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label={t("a11y.mainNavigation")} className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[0.92rem] font-semibold text-white/65 transition-colors hover:bg-white/8 hover:text-white"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <LanguageSwitcher dark />
          <Link
            href="/contact"
            className={buttonClasses({ variant: "primary", size: "md" })}
            onClick={() => trackEvent("hero_cta_click", { placement: "header" })}
          >
            {t("nav.contact")}
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <LanguageSwitcher dark />
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("a11y.closeMenu") : t("a11y.openMenu")}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M4 4l12 12M16 4L4 16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu — full night panel */}
      <div id="mobile-menu" ref={panelRef} hidden={!open} className="bg-night lg:hidden">
        <nav
          aria-label={t("a11y.mainNavigation")}
          className="mx-auto flex max-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col gap-1 overflow-y-auto px-5 pb-8 pt-4 sm:px-8"
        >
          {[
            { key: "product", href: "/product" },
            ...NAV.slice(1),
            { key: "implementation", href: "/implementation" },
          ].map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3.5 text-xl font-extrabold text-white transition-colors hover:bg-white/5"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => {
              setOpen(false);
              trackEvent("hero_cta_click", { placement: "mobile_menu" });
            }}
            className={cn(buttonClasses({ variant: "primary", size: "lg" }), "mt-5")}
          >
            {t("common.requestConsultation")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
