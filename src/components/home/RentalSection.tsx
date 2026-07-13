import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ViewTracker } from "@/components/ui/ViewTracker";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { brand } from "@/config/brand";

const POINT_KEYS = ["p1", "p2", "p3", "p4"] as const;

/** The one loud brand moment on the page: rental as a low-risk entry. */
export async function RentalSection() {
  const t = await getTranslations("rental");

  return (
    <section
      id="rental"
      className="chapter-brand section-pad scroll-mt-24 relative overflow-hidden"
    >
      <ViewTracker event="rental_section_viewed" />
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-6 select-none text-[12rem] font-extrabold leading-none tracking-tighter text-white/8"
      >
        {brand.logoText}
      </p>
      <Container className="relative">
        <div className="max-w-3xl">
          <p className="mb-3 text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-white/60">
            {t("kicker")}
          </p>
          <h2 className="text-headline text-balance">{t("heading")}</h2>
          <p className="mt-4 max-w-xl text-lead text-white/75">{t("intro")}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POINT_KEYS.map((key, i) => (
            <Reveal key={key} delay={i * 70}>
              <div className="h-full rounded-card border border-white/20 bg-white/10 p-6 backdrop-blur-[2px]">
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand"
                >
                  <svg viewBox="0 0 12 12" className="h-3.5 w-3.5" fill="none">
                    <path
                      d="m2.5 6.5 2.5 2.5 4.5-5"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="mt-4 font-extrabold">{t(`points.${key}.title`)}</h3>
                <p className="mt-1 text-sm text-white/70">{t(`points.${key}.text`)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm leading-relaxed text-white/70">{t("note")}</p>
          <TrackedLink
            href="/contact"
            event="hero_cta_click"
            eventProps={{ placement: "rental" }}
            className="inline-flex h-13 shrink-0 items-center rounded-full bg-white px-8 text-base font-bold text-brand transition-transform hover:scale-[1.03]"
          >
            {t("cta")}
          </TrackedLink>
        </div>
      </Container>
    </section>
  );
}
