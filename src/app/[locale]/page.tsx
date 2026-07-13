import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";
import {
  faqJsonLd,
  jsonLdScript,
  organizationJsonLd,
  serviceJsonLd,
  webSiteJsonLd,
} from "@/lib/structured-data";
import { Hero } from "@/components/home/Hero";
import { SwitchSection } from "@/components/home/SwitchSection";
import { StatsSection } from "@/components/home/StatsSection";
import { DemoSection } from "@/components/home/DemoSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { RentalSection } from "@/components/home/RentalSection";
import { IntegrationsSection } from "@/components/home/IntegrationsSection";
import { EvidenceSection } from "@/components/home/EvidenceSection";
import { ServiceSection } from "@/components/home/ServiceSection";
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
  return pageMetadata({
    locale,
    path: "",
    title: t("home.title"),
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
      <SwitchSection />
      <DemoSection />
      <StatsSection />
      <IntegrationsSection />
      <HowItWorks />
      <RentalSection />
      <EvidenceSection />
      <ServiceSection />
      <FaqSection />
      <FinalCta />
      <StickyContact />
    </>
  );
}
