"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/config/brand";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const SHORT: Record<Locale, string> = { ru: "RU", uz: "UZ", en: "EN" };

/** Persist explicitly so the root redirect honors the user's choice. */
function persistLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

/**
 * Segmented language control (RU / UZ / EN). No flags — these are languages,
 * not countries. Switching preserves the current pathname; the choice is
 * persisted in the NEXT_LOCALE cookie.
 */
export function LanguageSwitcher({
  size = "sm",
  dark = false,
}: {
  size?: "sm" | "lg";
  dark?: boolean;
}) {
  const t = useTranslations("langSwitcher");
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  function switchTo(locale: Locale) {
    if (locale === active) return;
    persistLocaleCookie(locale);
    trackEvent("language_changed", { to: locale });
    router.replace(
      // Pass through dynamic params (none today, future-proof).
      // @ts-expect-error -- params shape matches the current route
      { pathname, params },
      { locale },
    );
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center rounded-full border p-1",
        dark ? "border-white/15 bg-white/5" : "border-line bg-surface",
        size === "lg" && "p-1.5",
      )}
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-pressed={locale === active}
          aria-label={t(locale)}
          className={cn(
            "rounded-full font-bold transition-colors",
            size === "sm" ? "px-2.5 py-1 text-[0.72rem]" : "px-4 py-2 text-sm",
            locale === active
              ? dark
                ? "bg-white text-night"
                : "bg-ink text-bg"
              : dark
                ? "text-white/55 hover:bg-white/10 hover:text-white"
                : "text-ink-soft hover:bg-ink/5 hover:text-ink",
          )}
        >
          {SHORT[locale]}
        </button>
      ))}
    </div>
  );
}
