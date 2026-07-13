import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";

export const FAQ_KEYS = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
  "q11",
  "q12",
  "q13",
  "q14",
] as const;

export async function FaqSection() {
  const t = await getTranslations("faq");

  const items = FAQ_KEYS.map((key) => ({
    id: key,
    question: t(`items.${key}.q`),
    answer: t(`items.${key}.a`),
  }));

  return (
    <section id="faq" className="section-pad scroll-mt-24 bg-surface">
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.6fr]">
        <div>
          <SectionHeading kicker={t("kicker")} heading={t("heading")} lead={t("intro")} />
        </div>
        <Accordion items={items} />
      </Container>
    </section>
  );
}
