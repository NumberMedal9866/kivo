"use client";

import { useTranslations } from "next-intl";

/**
 * Light/dark toggle. The `.dark` class is applied to <html> before hydration
 * (inline script in the locale layout), so the icons swap purely via CSS —
 * no state, no hydration mismatch.
 */
export function ThemeToggle() {
  const t = useTranslations("a11y");

  function toggle() {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      /* private mode */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t("themeToggle")}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-colors hover:bg-white/10 hover:text-white"
    >
      {/* moon (shown in light theme → switches to dark) */}
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 dark:hidden" fill="none" aria-hidden="true">
        <path
          d="M20 13.5A8 8 0 0 1 10.5 4 8 8 0 1 0 20 13.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
      {/* sun (shown in dark theme → switches to light) */}
      <svg
        viewBox="0 0 24 24"
        className="hidden h-4.5 w-4.5 dark:block"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
