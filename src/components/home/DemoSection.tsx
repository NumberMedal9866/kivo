import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DemoLoader } from "@/components/demo/DemoLoader";
import type { DemoLang } from "@/content/demo-menu";

export async function DemoSection() {
  const t = await getTranslations("demo");
  const locale = (await getLocale()) as DemoLang;

  const hints = [t("hint1"), t("hint2"), t("hint3")];

  return (
    <section id="demo" className="section-pad scroll-mt-24 relative overflow-hidden bg-surface">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 -z-0 w-1/2 bg-[radial-gradient(60%_60%_at_70%_50%,var(--color-brand-soft),transparent_75%)]"
      />
      <Container className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto]">
        <div className="max-w-xl">
          <SectionHeading kicker={t("kicker")} heading={t("heading")} lead={t("intro")} />
          <ul className="mt-8 space-y-3">
            {hints.map((hint, i) => (
              <li
                key={hint}
                className="flex items-center gap-3 text-[0.95rem] font-semibold text-ink"
              >
                <span
                  aria-hidden="true"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-[0.7rem] font-extrabold text-white"
                >
                  {i + 1}
                </span>
                {hint}
              </li>
            ))}
          </ul>
          <p className="mt-8 flex items-start gap-3 rounded-xl border border-line bg-bg/70 p-4 text-sm leading-relaxed text-ink-soft">
            <svg
              viewBox="0 0 20 20"
              className="mt-0.5 h-5 w-5 shrink-0 text-brand"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M10 9v5M10 6.2v.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            {t("note")}
          </p>
        </div>
        <div className="w-full lg:w-95">
          <DemoLoader initialLang={locale} label={t("screenLabel")} />
        </div>
      </Container>
    </section>
  );
}
