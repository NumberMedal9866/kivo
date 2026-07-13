import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";

type Props = { params: Promise<{ locale: Locale }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: "/privacy",
    title: t("privacy.title"),
    description: t("privacy.description"),
  });
}

const SECTION_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] as const;

/**
 * TODO (LEGAL REVIEW REQUIRED): this privacy notice is a working draft.
 * Before public launch it must be reviewed by legal counsel, and the final
 * legal entity + data-controller contact details must be added (see the
 * "Legal entity" section in the translation files).
 */
export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacyPage");

  const updatedDate = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date("2026-07-13"));

  return (
    <>
      <PageHero
        kicker={t("kicker")}
        title={t("title")}
        lead={t("intro")}
        path="/privacy"
        breadcrumbLabel={t("kicker")}
      />
      <section className="section-pad">
        <Container className="max-w-3xl">
          <p className="text-sm text-ink-soft">{t("updated", { date: updatedDate })}</p>
          <div className="mt-10 space-y-10">
            {SECTION_KEYS.map((key, i) => (
              <section key={key}>
                <h2 className="flex items-baseline gap-3 text-lg font-bold text-ink">
                  <span aria-hidden="true" className="text-sm font-extrabold text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t(`${key}.title`)}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{t(`${key}.text`)}</p>
              </section>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
