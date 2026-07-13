import { brand, type Locale } from "@/config/brand";

/**
 * JSON-LD builders. Only truthful, verifiable types are emitted:
 * no ratings, reviews, prices, founding dates, awards or addresses.
 */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: brand.seo.siteUrl,
    description: brand.description,
    areaServed: brand.location.serviceArea,
    ...(brand.socialLinks.length > 0 && { sameAs: brand.socialLinks.map((s) => s.url) }),
  };
}

export function webSiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.seo.siteName,
    url: `${brand.seo.siteUrl}/${locale}`,
    inLanguage: locale,
  };
}

export function serviceJsonLd(locale: Locale, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: "Self-service ordering kiosk supply and integration",
    areaServed: brand.location.serviceArea,
    provider: { "@type": "Organization", name: brand.name, url: brand.seo.siteUrl },
    inLanguage: locale,
  };
}

export function productJsonLd(locale: Locale, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: { "@type": "Brand", name: brand.name },
    inLanguage: locale,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(locale: Locale, crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${brand.seo.siteUrl}/${locale}${crumb.path}`,
    })),
  };
}

/** Serialize for a <script type="application/ld+json"> tag. */
export function jsonLdScript(data: object | object[]): string {
  // "<" escaping prevents script-context injection from translated strings.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
