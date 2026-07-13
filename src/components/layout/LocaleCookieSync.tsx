"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/**
 * Keeps the NEXT_LOCALE cookie in sync with the locale actually being
 * displayed. Runs after navigation, so it always wins over stale
 * Set-Cookie responses from in-flight requests — the root redirect then
 * reliably honors the last language the visitor used.
 */
export function LocaleCookieSync() {
  const locale = useLocale();

  useEffect(() => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }, [locale]);

  return null;
}
