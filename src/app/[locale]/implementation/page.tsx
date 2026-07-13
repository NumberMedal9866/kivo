import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";
import { jsonLdScript, serviceJsonLd } from "@/lib/structured-data";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { ProductMedia } from "@/components/media/ProductMedia";
import { Reveal } from "@/components/ui/Reveal";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { buttonClasses } from "@/components/ui/Button";

type Props = { params: Promise<{ locale: Locale }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: "/implementation",
    title: t("implementation.title"),
    description: t("implementation.description"),
  });
}

/** Relative phases — no invented day counts. */
const PHASES = [
  { phase: "before", stages: ["discovery", "review", "menu", "interface", "hardware"] },
  { phase: "during", stages: ["install", "testing", "training"] },
  { phase: "after", stages: ["launch", "maintenance"] },
] as const;

export default async function ImplementationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("implementationPage");
  const tMeta = await getTranslations("meta");
  const tNav = await getTranslations("nav");

  // Continuous stage numbering across phase groups, computed up front.
  const groupOffsets = PHASES.map((_, i) =>
    PHASES.slice(0, i).reduce((sum, g) => sum + g.stages.length, 0),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            serviceJsonLd(
              locale,
              tMeta("implementation.title"),
              tMeta("implementation.description"),
            ),
          ),
        }}
      />
      <PageHero
        kicker={t("kicker")}
        title={t("title")}
        lead={t("lead")}
        path="/implementation"
        breadcrumbLabel={tNav("implementation")}
      />

      <section className="section-pad">
        <Container>
          <p className="max-w-2xl rounded-xl border border-line bg-surface p-5 text-sm leading-relaxed text-ink-soft">
            {t("note")}
          </p>

          <div className="mt-14 space-y-14">
            {PHASES.map((group, groupIndex) => (
              <div key={group.phase} className="grid gap-8 lg:grid-cols-[16rem_1fr]">
                <div>
                  <p className="sticky top-24 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-brand">
                    {t(`phases.${group.phase}`)}
                  </p>
                </div>
                <ol className="relative space-y-5 border-l border-line pl-8">
                  {group.stages.map((stage, stageIndex) => {
                    const num = groupOffsets[groupIndex]! + stageIndex + 1;
                    return (
                      <Reveal as="li" key={stage} className="relative">
                        <span
                          aria-hidden="true"
                          className="absolute -left-[2.55rem] top-1 grid h-7 w-7 place-items-center rounded-full border border-brand/30 bg-brand-soft text-[0.68rem] font-extrabold text-brand"
                        >
                          {String(num).padStart(2, "0")}
                        </span>
                        <h3 className="font-bold text-ink">{t(`stages.${stage}.title`)}</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft">
                          {t(`stages.${stage}.text`)}
                        </p>
                      </Reveal>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-pad bg-surface">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <ProductMedia id="installation-team" className="block w-full" />
          </Reveal>
          <div>
            <TrackedLink
              href="/contact"
              event="hero_cta_click"
              eventProps={{ placement: "implementation_page" }}
              className={buttonClasses({ variant: "primary", size: "lg" })}
            >
              {t("cta")}
            </TrackedLink>
          </div>
        </Container>
      </section>
    </>
  );
}
