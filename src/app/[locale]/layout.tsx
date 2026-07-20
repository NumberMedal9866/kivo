import type { Metadata, Viewport } from "next";
import { Manrope, Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { routing } from "@/i18n/routing";
import { brand, type Locale } from "@/config/brand";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { LocaleCookieSync } from "@/components/layout/LocaleCookieSync";
import { AnalyticsScripts } from "@/components/layout/AnalyticsScripts";
import "../globals.css";

// Single variable family with verified Cyrillic and Uzbek-Latin coverage.
const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

// Brand wordmark font — the "kiyo" lockup only. Self-hosted via next/font,
// so the logo's proportions never depend on a runtime CDN fetch.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-montserrat",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(brand.seo.siteUrl),
    title: {
      template: `%s — ${brand.name}`,
      default: `${brand.name} — ${t("home.title")}`,
    },
    description: t("home.description"),
    applicationName: brand.name,
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#0A0C11",
  width: "device-width",
  initialScale: 1,
  // Required for env(safe-area-inset-*) used by the sticky mobile CTA.
  viewportFit: "cover",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale as Locale);

  return (
    // suppressHydrationWarning: the inline script below may add `.dark`
    // to <html> before React hydrates (theme persistence, no FOUC).
    <html
      lang={locale}
      className={`${manrope.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
        <NextIntlClientProvider>
          <LocaleCookieSync />
          <SkipLink />
          <Header />
          {/* Pages start with dark bands that extend behind the fixed header */}
          <main id="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <AnalyticsScripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
