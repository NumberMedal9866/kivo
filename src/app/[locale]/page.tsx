import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { brand, type Locale } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";
import {
  faqJsonLd,
  jsonLdScript,
  organizationJsonLd,
  serviceJsonLd,
  webSiteJsonLd,
} from "@/lib/structured-data";
import { Hero } from "@/components/home/Hero";
import { PeakCompareSection } from "@/components/home/PeakCompareSection";
import { StatsSection } from "@/components/home/StatsSection";
import { DemoSection } from "@/components/home/DemoSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { RentalSection } from "@/components/home/RentalSection";
import { IntegrationsSection } from "@/components/home/IntegrationsSection";
import { EvidenceSection } from "@/components/home/EvidenceSection";
import { ServiceSection } from "@/components/home/ServiceSection";
import { AboutKiosksSection } from "@/components/home/AboutKiosksSection";
import { FaqSection, FAQ_KEYS } from "@/components/home/FaqSection";
import { FinalCta } from "@/components/home/FinalCta";
import { StickyContact } from "@/components/layout/StickyContact";

type Props = { params: Promise<{ locale: Locale }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  // The layout's title template doesn't reach a page in its own segment,
  // so the brand suffix is added here.
  return pageMetadata({
    locale,
    path: "",
    title: `${t("home.title")} | ${brand.name}`,
    description: t("home.description"),
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const faqItems = FAQ_KEYS.map((key) => ({
    question: t(`faq.items.${key}.q`),
    answer: t(`faq.items.${key}.a`),
  }));

  const jsonLd = [
    organizationJsonLd(),
    webSiteJsonLd(locale),
    serviceJsonLd(locale, t("meta.home.title"), t("meta.home.description")),
    faqJsonLd(faqItems),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <Hero />
      <PeakCompareSection />
      <DemoSection />
      <StatsSection />
      <IntegrationsSection />
      <HowItWorks />
      <RentalSection />
      <EvidenceSection />
      <ServiceSection />
      <AboutKiosksSection />
      <FaqSection />
      <FinalCta />
      <StickyContact />
    </>
  );
}
