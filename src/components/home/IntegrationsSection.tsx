import { getTranslations } from "next-intl/server";
import { brand } from "@/config/brand";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { hasIntegrationLogo, IntegrationLogo } from "@/components/home/IntegrationLogo";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/**
 * Dark integration chapter: order-flow diagram with an animated pulse
 * traveling from guest to kitchen (CSS offset-path; static under
 * prefers-reduced-motion), real payment-system logos, and a custom-work card.
 */
export async function IntegrationsSection() {
  const t = await getTranslations("integrations");

  const flow = ["flowCustomer", "flowKiosk", "flowPos", "flowKitchen"] as const;

  return (
    <section id="integrations" className="chapter-dark section-pad scroll-mt-24 overflow-hidden">
      {/* Watermark */}
      <p
        aria-hidden="true"
        className="watermark-text pointer-events-none absolute -top-4 right-0 hidden select-none text-[10rem] font-extrabold leading-none tracking-tighter lg:block"
      >
        iiko
      </p>
      <Container className="relative">
        <p className="mb-3 text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-brand-bright">
          {t("kicker")}
        </p>
        <h2 className="max-w-2xl text-headline text-balance">{t("heading")}</h2>
        <p className="mt-4 max-w-xl text-lead text-white/60">{t("intro")}</p>

        {/* Flow diagram */}
        <Reveal className="mt-12">
          <div className="overflow-x-auto rounded-card border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            {/* Extra bottom padding hosts the payment branch under the kiosk node */}
            <div className="relative min-w-130 pb-20">
              <ol className="flex items-center justify-between gap-3">
                {flow.map((key, i) => (
                  <li key={key} className="flex flex-1 items-center gap-3 last:flex-none">
                    <div className="relative z-10">
                      <div
                        className={cn(
                          "whitespace-nowrap rounded-xl px-5 py-3.5 text-center text-sm font-bold",
                          key === "flowKiosk"
                            ? "bg-brand text-white shadow-[0_0_32px_-4px_rgb(49_92_255/0.55)]"
                            : "border border-white/12 bg-night-soft text-white/85",
                        )}
                      >
                        {t(key)}
                      </div>
                      {/* Payment branch hangs off the kiosk node */}
                      {key === "flowKiosk" && (
                        <div className="absolute left-1/2 top-full flex -translate-x-1/2 flex-col items-center">
                          <span
                            aria-hidden="true"
                            className="h-7 w-px bg-white/25 [background-image:linear-gradient(to_bottom,rgb(255_255_255/0.4)_50%,transparent_50%)] [background-size:1px_6px]"
                          />
                          <span className="whitespace-nowrap rounded-full border border-white/15 bg-night-soft px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70">
                            {t("flowPayment")}
                          </span>
                        </div>
                      )}
                    </div>
                    {i < flow.length - 1 && (
                      <div className="relative h-px flex-1 overflow-visible bg-white/15">
                        {/* Pulse traveling the full connector width */}
                        <span
                          aria-hidden="true"
                          className="animate-flow-x absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-bright opacity-0 shadow-[0_0_12px_2px_rgb(125_151_255/0.8)]"
                          style={{ animationDelay: `${i * 1.05}s` }}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-2 text-xs text-white/35">{t("disclaimer")}</p>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_1.3fr_1fr]">
          {/* iiko card */}
          <Reveal>
            <div className="h-full rounded-card border border-white/10 bg-white/[0.03] p-7">
              {/* Skip the text fallback here — the heading already says iiko */}
              {hasIntegrationLogo("iiko") ? (
                <div className="flex h-10 items-center text-white">
                  <IntegrationLogo integration={brand.integrations[0]} tile />
                </div>
              ) : (
                <span
                  aria-hidden="true"
                  className="grid h-11 w-11 place-items-center rounded-xl bg-white/8 text-white/70"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="3" />
                    <path d="M8 12h8M8 16h5M8 8h.01" />
                  </svg>
                </span>
              )}
              <h3 className="mt-3 text-lg font-extrabold">{t("posTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{t("posText")}</p>
            </div>
          </Reveal>

          {/* Payments card with real logos */}
          <Reveal delay={70}>
            <div className="h-full rounded-card border border-white/10 bg-white/[0.03] p-7">
              <ul className="flex flex-wrap gap-2">
                {brand.integrations
                  .filter((i) => i.kind !== "pos")
                  .map((integration) => (
                    <li key={integration.id}>
                      <IntegrationLogo
                        integration={integration}
                        tile
                        className="h-11 min-w-19 px-3"
                      />
                    </li>
                  ))}
              </ul>
              <h3 className="mt-4 text-lg font-extrabold">{t("paymentsTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{t("paymentsText")}</p>
            </div>
          </Reveal>

          {/* Custom integrations */}
          <Reveal delay={140}>
            <div className="flex h-full flex-col rounded-card border border-dashed border-brand-bright/40 bg-brand/10 p-7">
              <span
                aria-hidden="true"
                className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <h3 className="mt-3 text-lg font-extrabold">{t("customTitle")}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{t("customText")}</p>
              <Link
                href="/integrations"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-bright transition-colors hover:text-white"
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
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
