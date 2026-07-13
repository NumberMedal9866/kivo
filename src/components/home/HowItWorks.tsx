import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HowSteps } from "@/components/home/HowSteps";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";

export const HOW_KEYS = ["assessment", "setup", "installation", "support"] as const;
export type HowKey = (typeof HOW_KEYS)[number];

export type HowStep = {
  key: HowKey;
  num: string;
  title: string;
  short: string;
  details: string[];
};

/**
 * Interactive launch journey: the four steps are a keyboard-accessible
 * tablist; details for the active step render in the panel. All step
 * content is server-rendered (passed as props), so it stays crawlable.
 */
export async function HowItWorks() {
  const t = await getTranslations("how");

  const steps: HowStep[] = HOW_KEYS.map((key) => ({
    key,
    num: t(`steps.${key}.num`),
    title: t(`steps.${key}.title`),
    short: t(`steps.${key}.short`),
    details: [t(`steps.${key}.d1`), t(`steps.${key}.d2`), t(`steps.${key}.d3`)],
  }));

  return (
    <section id="how-it-works" className="section-pad scroll-mt-24">
      <Container>
        <SectionHeading kicker={t("kicker")} heading={t("heading")} lead={t("intro")} />
        <HowSteps steps={steps} />
        <div className="mt-10">
          <Link
            href="/implementation"
            className={buttonClasses({ variant: "secondary", size: "md" })}
          >
            {t("cta")}
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
              <path
                d="M3 8h10m0 0L9 4m4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
}
