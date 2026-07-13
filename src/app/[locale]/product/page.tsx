import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";
import { jsonLdScript, productJsonLd } from "@/lib/structured-data";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { KioskMockup } from "@/components/media/KioskMockup";
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
    path: "/product",
    title: t("product.title"),
    description: t("product.description"),
  });
}

const SPEC_KEYS = ["screen", "body", "payment", "printer", "connectivity", "mounting"] as const;

export default async function ProductPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("productPage");
  const tMeta = await getTranslations("meta");
  const tNav = await getTranslations("nav");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript(
            productJsonLd(locale, tMeta("product.title"), tMeta("product.description")),
          ),
        }}
      />
      <PageHero
        kicker={t("kicker")}
        title={t("title")}
        lead={t("lead")}
        path="/product"
        breadcrumbLabel={tNav("product")}
      />

      {/* Hardware design */}
      <section className="section-pad">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="mx-auto w-64 sm:w-72">
              <KioskMockup />
            </div>
          </Reveal>
          <div>
            <h2 className="text-title text-ink">{t("design.title")}</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{t("design.text")}</p>
            <ul className="mt-6 space-y-3">
              {(["p1", "p2", "p3", "p4"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3 text-[0.95rem] text-ink">
                  <CheckDot />
                  {t(`design.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Interface */}
      <section className="section-pad bg-surface">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <h2 className="text-title text-ink">{t("interface.title")}</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{t("interface.text")}</p>
            <ul className="mt-6 space-y-3">
              {(["p1", "p2", "p3", "p4"] as const).map((key) => (
                <li key={key} className="flex items-start gap-3 text-[0.95rem] text-ink">
                  <CheckDot />
                  {t(`interface.${key}`)}
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="order-1 lg:order-2">
            <ProductMedia id="kiosk-interface-menu" className="mx-auto block w-full max-w-75" />
          </Reveal>
        </Container>
      </section>

      {/* Service + scene */}
      <section className="section-pad">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <ProductMedia id="kiosk-in-coffee-shop" className="block w-full" />
          </Reveal>
          <div>
            <h2 className="text-title text-ink">{t("service.title")}</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">{t("service.text")}</p>
            <TrackedLink
              href="/contact"
              event="hero_cta_click"
              eventProps={{ placement: "product_page" }}
              className={`${buttonClasses({ variant: "primary", size: "lg" })} mt-8`}
            >
              {t("cta")}
            </TrackedLink>
          </div>
        </Container>
      </section>

      {/* Specifications — intentionally unconfirmed placeholders */}
      <section className="section-pad bg-surface">
        <Container>
          <h2 className="text-title text-ink">{t("specs.title")}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">{t("specs.note")}</p>
          <dl className="mt-8 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2">
            {SPEC_KEYS.map((key) => (
              <div key={key} className="flex flex-col gap-1 bg-surface px-6 py-5">
                <dt className="text-sm font-bold text-ink">{t(`specs.items.${key}`)}</dt>
                <dd className="text-sm text-ink-soft italic">{t("specs.toConfirm")}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}

function CheckDot() {
  return (
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
  );
}
