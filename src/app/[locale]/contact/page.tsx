import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/config/brand";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { LeadForm } from "@/components/forms/LeadForm";
import { ContactLinks } from "@/components/layout/ContactLinks";
import { DevContactWarning } from "@/components/layout/DevContactWarning";
import { hasAnyContactChannel } from "@/lib/contacts";

type Props = { params: Promise<{ locale: Locale }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: "/contact",
    title: t("contact.title"),
    description: t("contact.description"),
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");
  const tNav = await getTranslations("nav");
  const hasChannels = hasAnyContactChannel();

  return (
    <>
      <PageHero
        kicker={t("kicker")}
        title={t("title")}
        lead={t("lead")}
        path="/contact"
        breadcrumbLabel={tNav("contact")}
      />

      <section className="section-pad">
        <Container className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-10">
            {hasChannels ? (
              <div>
                <h2 className="text-lg font-bold text-ink">{t("directTitle")}</h2>
                <div className="mt-4">
                  <ContactLinks variant="buttons" />
                </div>
              </div>
            ) : null}
            <DevContactWarning />

            <div>
              <h2 className="text-lg font-bold text-ink">{t("serviceAreaTitle")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t("serviceAreaText")}</p>
            </div>

            <div className="rounded-card border border-line bg-surface p-7">
              <h2 className="text-lg font-bold text-ink">{t("prepareTitle")}</h2>
              <ul className="mt-4 space-y-2.5">
                {(["i1", "i2", "i3", "i4", "i5", "i6"] as const).map((key) => (
                  <li key={key} className="flex items-start gap-3 text-sm text-ink">
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
                    {t(`prepare.${key}`)}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-ink-soft">{t("prepareNote")}</p>
            </div>
          </div>

          <div className="rounded-card border border-line bg-surface p-6 shadow-soft sm:p-9">
            <h2 className="mb-6 text-title text-ink">{t("formTitle")}</h2>
            <LeadForm source="contact" />
          </div>
        </Container>
      </section>
    </>
  );
}
