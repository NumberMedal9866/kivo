import { getTranslations } from "next-intl/server";
import { evidence } from "@/content/evidence";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";

/**
 * External industry benchmarks with giant editorial numerals (animated on
 * view). Every card carries a source link + date; the section closes with
 * the outcome disclaimer. Editorial rules: src/content/evidence.ts.
 */
export async function EvidenceSection() {
  const t = await getTranslations("evidence");

  // Which entries get an animated numeral (value parsed from the stat).
  const numeric: Record<string, { value: number; prefix?: string; suffix: string } | undefined> = {
    arcos: { value: 61, suffix: "%" },
    mcdonalds: { value: 35, suffix: "%" },
  };

  return (
    <section className="section-pad">
      <Container>
        <SectionHeading kicker={t("kicker")} heading={t("heading")} lead={t("intro")} />

        <div className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-2">
          {evidence.map((entry, i) => {
            const num = numeric[entry.id];
            return (
              <Reveal key={entry.id} delay={(i % 2) * 80}>
                <article className="flex h-full flex-col bg-surface p-8">
                  <p className="text-numeral text-ink">
                    {num ? (
                      <CountUp value={num.value} prefix={num.prefix} suffix={num.suffix} />
                    ) : (
                      <span className={entry.id === "technomic" ? "text-brand" : undefined}>
                        {t(`items.${entry.id}.stat`)}
                      </span>
                    )}
                  </p>
                  <p className="mt-2 text-sm font-extrabold uppercase tracking-wider text-ink-soft">
                    {t(`items.${entry.id}.statLabel`)}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                    {t(`items.${entry.id}.text`)}
                  </p>
                  <p className="mt-6 text-xs text-ink-soft">
                    {t("sourceLabel")}:{" "}
                    <a
                      href={entry.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-ink underline decoration-line underline-offset-2 transition-colors hover:text-brand"
                    >
                      {t(`items.${entry.id}.sourceName`)}
                    </a>
                    {" · "}
                    {t(`items.${entry.id}.date`)}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink-soft/80">{t("disclaimer")}</p>
      </Container>
    </section>
  );
}
