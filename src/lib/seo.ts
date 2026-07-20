import type { Metadata } from "next";
import { brand, locales, type Locale } from "@/config/brand";

const OG_LOCALE: Record<Locale, string> = {
  ru: "ru_RU",
  uz: "uz_UZ",
  en: "en_US",
};

/**
 * Builds localized metadata with canonical URL, hreflang alternates and
 * Open Graph data for a given route. `path` is the locale-less pathname
 * ("" for home, "/product", …).
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const { siteUrl, siteName } = brand.seo;
  const canonical = `${siteUrl}/${locale}${path}`;
  const languages = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])) as Record<
    string,
    string
  >;
  languages["x-default"] = `${siteUrl}/${brand.defaultLocale}${path}`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: canonical,
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: brand.seo.twitterCard,
      title,
      description,
      images: [`${siteUrl}/og.png`],
    },
  };
}
