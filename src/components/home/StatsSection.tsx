import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const CHIP_KEYS = ["lang", "errors", "upsell", "stoplist", "menu", "same"] as const;

const CHIP_ICONS: Record<(typeof CHIP_KEYS)[number], React.ReactNode> = {
  lang: (
    <path d="M3 5h8M7 3v2M5 5c0 3.5 2.5 6 5 7M10 5c-1 3.5-3.5 7-7 8m9 8 3.5-8 3.5 8m-6-2.5h5" />
  ),
  errors: <path d="M4 12.5 9 17.5 20 6.5" />,
  upsell: <path d="M4 16l5-5 4 3 7-8m0 0v5m0-5h-5" />,
  stoplist: <path d="M12 4a8 8 0 1 0 8 8M16 3l5 5m0-5-5 5" />,
  menu: <path d="M5 4h14v16H5zM9 8h6M9 12h6M9 16h4" />,
  same: <path d="M8 7h12v12H8zM4 3h12v2M4 3v12h2" />,
};

/**
 * Impact section: two stat tiles + one visual tile, then a chip row of
 * secondary benefits — replaces the former ten-card benefits grid.
 */
export async function StatsSection() {
  const t = await getTranslations("stats");

  return (
    <section id="stats" className="section-pad scroll-mt-24 bg-surface">
      <Container>
        <p className="mb-3 text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-brand">
          {t("kicker")}
        </p>
        <h2 className="max-w-2xl text-headline text-balance text-ink">{t("heading")}</h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {/* AOV */}
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-card border border-line bg-bg/60 p-7">
              <p className="text-numeral whitespace-nowrap text-[clamp(2.6rem,1.4rem+3.4vw,4.6rem)] text-brand">
                {t("aov.stat")}
              </p>
              <div className="mt-6">
                <p className="text-lg font-extrabold text-ink">{t("aov.statLabel")}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t("aov.text")}</p>
              </div>
            </div>
          </Reveal>

          {/* Ordering points */}
          <Reveal delay={80}>
            <div className="flex h-full flex-col justify-between rounded-card border border-line bg-bg/60 p-7">
              <p className="text-numeral whitespace-nowrap text-[clamp(2.6rem,1.4rem+3.4vw,4.6rem)] text-ink">
                {t("speed.stat")}
              </p>
              <div className="mt-6">
                <p className="text-lg font-extrabold text-ink">{t("speed.statLabel")}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t("speed.text")}</p>
              </div>
            </div>
          </Reveal>

          {/* Team focus — visual tile */}
          <Reveal delay={160}>
            <div className="flex h-full flex-col justify-between rounded-card bg-night p-7 text-white dark:ring-1 dark:ring-white/12">
              <div aria-hidden="true" className="flex items-center gap-3">
                <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white/45">
                  {/* keyboard, crossed out */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5.5 w-5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  >
                    <rect x="3" y="7" width="18" height="11" rx="2" />
                    <path d="M6.5 10.5h.01M10 10.5h.01M13.5 10.5h.01M17 10.5h.01M8 14.5h8" />
                  </svg>
                  <span className="absolute h-[1.8px] w-8 rotate-45 rounded-full bg-error/80" />
                </span>
                <svg viewBox="0 0 24 12" className="h-3 w-6 text-brand-bright" fill="none">
                  <path
                    d="M1 6h20m0 0-5-5m5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white">
                  {/* chef hat */}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5.5 w-5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 13a4 4 0 1 1 1-7.9 4.5 4.5 0 0 1 8 0A4 4 0 1 1 17 13v5H7v-5Z" />
                    <path d="M7 20.5h10" />
                  </svg>
                </span>
              </div>
              <div className="mt-6">
                <p className="text-lg font-extrabold">{t("staff.title")}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{t("staff.text")}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Secondary benefits as compact chips */}
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHIP_KEYS.map((key, i) => (
            <Reveal key={key} as="li" delay={i * 50}>
              <div className="flex h-full items-center gap-3.5 rounded-2xl border border-line bg-surface px-5 py-4">
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand",
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {CHIP_ICONS[key]}
                  </svg>
                </span>
                <p className="text-[0.92rem] font-bold leading-snug text-ink">
                  {t(`chips.${key}`)}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <p className="mt-8 text-xs leading-relaxed text-ink-soft/80">{t("footnote")}</p>
      </Container>
    </section>
  );
}
