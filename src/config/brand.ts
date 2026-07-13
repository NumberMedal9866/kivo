/**
 * ============================================================================
 * TEMPORARY BRAND — replace this configuration when the final company name
 * and logo are selected. See docs/BRAND_REPLACEMENT_GUIDE.md.
 *
 * Nothing in this file has been checked for trademark availability.
 * All visible brand references across the site must come from this file or
 * from the translation dictionaries — never hardcode the brand name in
 * components or copy.
 * ============================================================================
 */

export const locales = ["ru", "uz", "en"] as const;
export type Locale = (typeof locales)[number];

export const brand = {
  /** Public brand name shown in UI. */
  name: "KIVO",
  /** Placeholder legal name — must be replaced with the registered entity before launch. */
  legalName: "KIVO (legal entity to be confirmed)",
  shortName: "KIVO",
  /** English master tagline; localized variants live in messages/<locale>.json. */
  tagline: "Self-ordering made simple",
  description:
    "Self-service ordering kiosks for restaurants, coffee shops and quick-service businesses in Uzbekistan — hardware, software, installation, iiko and payment integration, training and support.",
  /** Text used by the wordmark component. */
  logoText: "KIVO",
  /** Single-letter monogram used on the kiosk mockup, favicon and watermarks. */
  monogram: "K",

  /**
   * Contact channels. Values come from environment variables so that no
   * invented phone/Telegram/email ever ships. A channel is rendered only
   * when its value is present (see src/lib/contacts.ts).
   */
  contacts: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
    telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  },

  /** Supported website locales and the fallback used when detection fails. */
  locales,
  defaultLocale: "ru" as Locale,

  /**
   * Social profiles — none exist yet for the temporary brand. Add entries
   * as { name, url } and the footer will render them automatically.
   */
  socialLinks: [] as { name: string; url: string }[],

  seo: {
    /** Site URL without trailing slash; overridden by NEXT_PUBLIC_SITE_URL. */
    siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
    siteName: "KIVO",
    /** Used when a page does not define its own metadata. */
    defaultTitle: "KIVO — self-service ordering kiosks for Uzbekistan",
    defaultDescription:
      "Complete self-ordering kiosk solution for restaurants and cafés in Uzbekistan: hardware, software, installation, iiko POS integration, local payment systems, training and support.",
    twitterCard: "summary_large_image" as const,
  },

  /** Where the company operates. No street address is published on purpose. */
  location: {
    country: "Uzbekistan",
    countryCode: "UZ",
    serviceArea: "Uzbekistan",
  },

  /**
   * Integrations shown on the site. `confirmed` distinguishes the supported
   * stack from anything discussed individually after a technical review.
   * Logo files are expected in public/brands/integrations/<id>.svg —
   * see docs/INTEGRATION_LOGO_GUIDE.md.
   */
  integrations: [
    { id: "iiko", name: "iiko", kind: "pos", confirmed: true },
    { id: "click", name: "Click", kind: "payment", confirmed: true },
    { id: "uzum", name: "Uzum", kind: "payment", confirmed: true },
    { id: "payme", name: "Payme", kind: "payment", confirmed: true },
    { id: "humo", name: "HUMO", kind: "card", confirmed: true },
    { id: "uzcard", name: "Uzcard", kind: "card", confirmed: true },
    { id: "visa", name: "Visa", kind: "card", confirmed: true },
    { id: "mastercard", name: "Mastercard", kind: "card", confirmed: true },
  ] as const,
} as const;

export type Integration = (typeof brand.integrations)[number];
