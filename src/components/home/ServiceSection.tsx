import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { KioskMockup } from "@/components/media/KioskMockup";

const SERVICE_KEYS = [
  "hardware",
  "software",
  "installation",
  "menu",
  "iiko",
  "payments",
  "branding",
  "languages",
  "training",
  "warranty",
  "maintenance",
  "support",
  "custom",
] as const;

/** "Everything included": compact checklist around the product. */
export async function ServiceSection() {
  const t = await getTranslations("service");

  return (
    <section className="section-pad bg-surface">
      <Container className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.4fr]">
        <div>
          <SectionHeading kicker={t("kicker")} heading={t("heading")} lead={t("intro")} />
          <div className="mx-auto mt-10 hidden w-56 lg:block">
            <KioskMockup />
          </div>
        </div>

        <ul className="grid gap-2.5 sm:grid-cols-2">
          {SERVICE_KEYS.map((key, i) => (
            <Reveal key={key} as="li" delay={(i % 6) * 40}>
              <div className="flex h-full items-center gap-3.5 rounded-2xl border border-line bg-bg/60 px-5 py-3.5">
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-success/10 text-success"
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
                <div className="min-w-0">
                  <p className="text-[0.95rem] font-extrabold text-ink">
                    {t(`items.${key}.title`)}
                  </p>
                  <p className="truncate text-[0.8rem] text-ink-soft">{t(`items.${key}.text`)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
