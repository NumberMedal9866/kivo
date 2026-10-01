import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { buttonClasses } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: Locale }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: "/guide",
    title: t("guide.title"),
    description: t("guide.description"),
  });
}

/** Anchor ids double as the section keys in messages `guidePage.*`. */
const SECTIONS = ["what", "how", "who", "benefits", "parts", "choose", "price", "kiyo"] as const;

/**
 * Long-form guide answering what people search before buying a kiosk
 * ("киоск самообслуживания: что это, как выбрать, сколько стоит").
 * General guidance only — no prices or figures beyond the sourced
 * industry data on the home page.
 */
export default async function GuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guidePage");
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  const bullets = (section: string, keys: string[]) => (
    <ul className="mt-5 space-y-3">
      {keys.map((k) => (
        <li key={k} className="flex items-start gap-3 text-[1rem] leading-relaxed text-ink">
          <span
            aria-hidden="true"
            className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand dark:bg-brand-bright"
          />
          {t(`${section}.${k}`)}
        </li>
      ))}
    </ul>
  );

  const para = "mt-4 text-[1.02rem] leading-relaxed text-ink-soft";
  const inlineLink =
    "font-bold text-brand underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand dark:text-brand-bright";

  return (
    <>
      <PageHero
        kicker={t("kicker")}
        title={t("title")}
        lead={t("lead")}
        path="/guide"
        breadcrumbLabel={tNav("guide")}
      />

      <section className="section-pad">
        <Container className="grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-16">
          {/* Table of contents */}
          <nav aria-label={t("toc")} className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.16em] text-ink-soft">
                {t("toc")}
              </p>
              <ol className="mt-4 space-y-2.5 border-l border-line">
                {SECTIONS.map((s) => (
                  <li key={s}>
                    <a
                      href={`#${s}`}
                      className="-ml-px block border-l-2 border-transparent pl-4 text-sm font-semibold text-ink-soft transition-colors hover:border-brand hover:text-ink"
                    >
                      {t(`${s}.h`)}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="max-w-3xl space-y-14">
            <section id="what" className="scroll-mt-28">
              <h2 className="text-title text-ink">{t("what.h")}</h2>
              <p className={para}>{t("what.p1")}</p>
              <p className={para}>{t("what.p2")}</p>
            </section>

            <section id="how" className="scroll-mt-28">
              <h2 className="text-title text-ink">{t("how.h")}</h2>
              <ol className="mt-6 space-y-4">
                {(["s1", "s2", "s3", "s4", "s5"] as const).map((k, i) => (
                  <li key={k} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-brand/30 bg-brand-soft text-[0.75rem] font-extrabold text-brand dark:text-brand-bright"
                    >
                      {i + 1}
                    </span>
                    <span className="pt-1 text-[1rem] leading-relaxed text-ink">
                      {t(`how.${k}`)}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section id="who" className="scroll-mt-28">
              <h2 className="text-title text-ink">{t("who.h")}</h2>
              <p className={para}>{t("who.p")}</p>
              {bullets("who", ["i1", "i2", "i3", "i4", "i5"])}
            </section>

            <section id="benefits" className="scroll-mt-28">
              <h2 className="text-title text-ink">{t("benefits.h")}</h2>
              {bullets("benefits", ["i1", "i2", "i3", "i4", "i5"])}
              <p className={para}>
                {t("benefits.p")}{" "}
                <Link href="/#evidence" className={inlineLink}>
                  {t("benefits.link")}
                </Link>
                .
              </p>
            </section>

            <section id="parts" className="scroll-mt-28">
              <h2 className="text-title text-ink">{t("parts.h")}</h2>
              {bullets("parts", ["i1", "i2", "i3", "i4", "i5", "i6"])}
            </section>

            <section id="choose" className="scroll-mt-28">
              <h2 className="text-title text-ink">{t("choose.h")}</h2>
              {bullets("choose", ["i1", "i2", "i3", "i4", "i5", "i6"])}
            </section>

            <section id="price" className="scroll-mt-28">
              <h2 className="text-title text-ink">{t("price.h")}</h2>
              <p className={para}>{t("price.p1")}</p>
              <p className={para}>{t("price.p2")}</p>
            </section>

            <section id="kiyo" className="scroll-mt-28">
              <h2 className="text-title text-ink">{t("kiyo.h")}</h2>
              <p className={para}>{t("kiyo.p")}</p>
              <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                <Link href="/implementation" className={inlineLink}>
                  {t("kiyo.linkImplementation")}
                </Link>
                <Link href="/product" className={inlineLink}>
                  {t("kiyo.linkProduct")}
                </Link>
              </p>
            </section>
          </article>
        </Container>
      </section>

      <section className="section-pad bg-surface">
        <Container className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-title text-ink">{t("cta.title")}</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{t("cta.text")}</p>
          </div>
          <TrackedLink
            href="/contact"
            event="hero_cta_click"
            eventProps={{ placement: "guide_page" }}
            className={buttonClasses({ variant: "primary", size: "lg" })}
          >
            {tCommon("requestConsultation")}
          </TrackedLink>
        </Container>
      </section>
    </>
  );
}
