import { getLocale, getTranslations } from "next-intl/server";
import { type Locale } from "@/config/brand";
import { media } from "@/content/media";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { Link } from "@/i18n/navigation";
import { HeroKiosk } from "@/components/home/HeroKiosk";

export async function Hero() {
  const t = await getTranslations("hero");
  const locale = (await getLocale()) as Locale;
  const heroAlt = media["hero-kiosk-front"].alt[locale];

  return (
    <section className="chapter-dark overflow-hidden">
      <Container className="grid items-center gap-14 pb-10 pt-28 md:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <div className="min-w-0 max-w-2xl">
          {/* The search phrase ("Киоски самообслуживания · Узбекистан") is the
              h1; the large slogan below is styled as the headline but kept
              out of the heading outline. */}
          <h1 className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[0.78rem] font-bold tracking-wide text-white/75">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-success"
            />
            {t("badge")}
          </h1>
          <p className="mt-7 text-display text-balance text-white">{t("title")}</p>
          <p className="mt-6 max-w-md text-lead text-pretty text-white/65">{t("subtitle")}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <TrackedLink
              href="/contact"
              event="hero_cta_click"
              eventProps={{ placement: "hero_primary" }}
              className={buttonClasses({ variant: "primary", size: "lg" })}
            >
              {t("ctaPrimary")}
            </TrackedLink>
            <Link
              href="/#demo"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-white/20 px-8 text-base font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/5"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M5 3.5a1 1 0 0 1 1.5-.87l7 4.5a1 1 0 0 1 0 1.74l-7 4.5A1 1 0 0 1 5 12.5v-9Z" />
              </svg>
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        <div className="relative min-w-0 px-2 sm:px-6 lg:px-2">
          <HeroKiosk
            cardTitle={t("cardTitle")}
            cardSubtitle={t("cardSubtitle")}
            upsellChip={t("upsellChip")}
            alt={heroAlt}
          />
          <p className="mt-4 text-center text-[0.68rem] text-white/30">{t("kioskCaption")}</p>
        </div>
      </Container>
    </section>
  );
}
