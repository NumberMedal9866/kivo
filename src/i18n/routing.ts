import { defineRouting } from "next-intl/routing";
import { brand } from "@/config/brand";

export const routing = defineRouting({
  locales: brand.locales,
  // Fallback when no supported browser language is detected.
  // Change brand.defaultLocale in src/config/brand.ts to adjust.
  defaultLocale: brand.defaultLocale,
  localePrefix: "always",
  // Detect Accept-Language on first visit at "/", then persist the choice.
  localeDetection: true,
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
  },
});
