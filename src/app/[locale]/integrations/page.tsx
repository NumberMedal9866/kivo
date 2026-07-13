import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { brand, type Locale } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";
import { jsonLdScript, serviceJsonLd } from "@/lib/structured-data";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { IntegrationLogo } from "@/components/home/IntegrationLogo";
import { ProductMedia } from "@/components/media/ProductMedia";
import { Reveal } from "@/components/ui/Reveal";
import { ViewTracker } from "@/components/ui/ViewTracker";
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
    path: "/integrations",
    title: t("integrations.title"),
    description: t("integrations.description"),
  });
}

export default async function IntegrationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("integrationsPage");
  const tMeta = await getTranslations("meta");
  const tNav = await getTranslations("nav");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            serviceJsonLd(locale, tMeta("integrations.title"), tMeta("integrations.description")),
          ),
        }}
      />
      <ViewTracker event="integrations_page_opened" />
      <PageHero
        kicker={t("kicker")}
        title={t("title")}
        lead={t("lead")}
        path="/integrations"
        breadcrumbLabel={tNav("integrations")}
      />

      {/* iiko */}
      <section className="section-pad">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="flex h-10 items-center">
              <IntegrationLogo integration={brand.integrations[0]} />
            </div>
            <h2 className="mt-4 text-title text-ink">{t("iiko.title")}</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{t("iiko.text")}</p>
            <ul className="mt-6 space-y-3">
              {(["p1", "p2", "p3", "p4"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3 text-[0.95rem] text-ink">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand"
                  >
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                      <path
                        d="m2.5 6.5 2.5 2.5 4.5-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {t(`iiko.${key}`)}
                </li>
              ))}
            </ul>
          </div>
          <Reveal>
            <ProductMedia id="multi-location-diagram" className="block w-full" />
          </Reveal>
        </Container>
      </section>

      {/* Order flow */}
      <section className="section-pad bg-surface">
        <Container>
          <h2 className="text-title text-ink">{t("flow.title")}</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {(["s1", "s2", "s3", "s4"] as const).map((key, i) => (
              <Reveal key={key} as="li" delay={i * 80}>
                <div className="relative h-full rounded-card border border-line bg-bg/50 p-6">
                  <span className="text-[0.78rem] font-extrabold tracking-[0.2em] text-brand">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 font-bold text-ink">{t(`flow.${key}.title`)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {t(`flow.${key}.text`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Payments */}
      <section className="section-pad">
        <Container>
          <h2 className="text-title text-ink">{t("payments.title")}</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{t("payments.text")}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-card border border-line bg-surface p-7">
              <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-success">
                {t("payments.confirmed")}
              </p>
              <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
                {brand.integrations.map((integration) => (
                  <li key={integration.id}>
                    <IntegrationLogo integration={integration} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card border border-dashed border-brand/40 bg-brand-soft/40 p-7">
              <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-brand">
                {t("payments.custom")}
              </p>
              <h3 className="mt-4 font-bold text-ink">{t("custom.title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t("custom.text")}</p>
              <ol className="mt-5 space-y-2.5">
                {(["s1", "s2", "s3", "s4"] as const).map((key, i) => (
                  <li key={key} className="flex items-start gap-3 text-sm text-ink">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-[0.68rem] font-extrabold text-brand"
                    >
                      {i + 1}
                    </span>
                    {t(`custom.${key}`)}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* Sync & multi-location */}
      <section className="section-pad bg-surface">
        <Container className="grid gap-4 md:grid-cols-2">
          <div className="rounded-card border border-line bg-bg/50 p-7">
            <h2 className="text-lg font-bold text-ink">{t("sync.title")}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{t("sync.text")}</p>
          </div>
          <div className="rounded-card border border-line bg-bg/50 p-7">
            <h2 className="text-lg font-bold text-ink">{t("multi.title")}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{t("multi.text")}</p>
          </div>
        </Container>
        <Container className="mt-10">
          <TrackedLink
            href="/contact"
            event="hero_cta_click"
            eventProps={{ placement: "integrations_page" }}
            className={buttonClasses({ variant: "primary", size: "lg" })}
          >
            {t("cta")}
          </TrackedLink>
        </Container>
      </section>
    </>
  );
}
