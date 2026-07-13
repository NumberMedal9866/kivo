import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/structured-data";
import type { Locale } from "@/config/brand";

/**
 * Breadcrumb trail for detail pages, with matching BreadcrumbList JSON-LD.
 */
export async function Breadcrumbs({
  current,
  path,
  dark = false,
}: {
  current: string;
  path: string;
  dark?: boolean;
}) {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;

  const crumbs = [
    { name: t("nav.home"), path: "" },
    { name: current, path },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(locale, crumbs)) }}
      />
      <nav
        aria-label={t("a11y.breadcrumb")}
        className={dark ? "text-sm text-white/50" : "text-sm text-ink-soft"}
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/"
              className={
                dark ? "transition-colors hover:text-white" : "transition-colors hover:text-ink"
              }
            >
              {t("nav.home")}
            </Link>
          </li>
          <li aria-hidden="true">
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
              <path
                d="m4.5 2.5 3.5 3.5-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </li>
          <li
            aria-current="page"
            className={dark ? "font-semibold text-white" : "font-semibold text-ink"}
          >
            {current}
          </li>
        </ol>
      </nav>
    </>
  );
}
