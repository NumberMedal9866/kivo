import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { LeadForm } from "@/components/forms/LeadForm";
import { ContactLinks } from "@/components/layout/ContactLinks";
import { DevContactWarning } from "@/components/layout/DevContactWarning";
import { hasAnyContactChannel } from "@/lib/contacts";

export async function FinalCta() {
  const t = await getTranslations("cta");
  const hasChannels = hasAnyContactChannel();

  return (
    <section id="contact-cta" className="chapter-dark section-pad scroll-mt-24 overflow-hidden">
      <Container className="grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
        <div className="lg:sticky lg:top-28">
          <h2 className="text-headline text-balance text-white">{t("heading")}</h2>
          <p className="mt-5 max-w-lg text-lead text-pretty text-white/60">{t("text")}</p>
          {hasChannels ? (
            <div className="mt-9">
              <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.16em] text-white/40">
                {t("altHeading")}
              </p>
              <ContactLinks variant="buttons" />
            </div>
          ) : null}
          <DevContactWarning />
        </div>

        <div className="rounded-card bg-surface p-6 shadow-[0_32px_80px_-24px_rgb(0_0_0/0.5)] sm:p-9">
          <LeadForm source="home" />
        </div>
      </Container>
    </section>
  );
}
