import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";

/**
 * Plain-language summary of the service for searchers who land on the home
 * page: says what kiyo does in the words people search with ("киоск
 * самообслуживания", city, payment brands) and links into the guide,
 * product and contact pages.
 */
export async function AboutKiosksSection() {
  const t = await getTranslations("seoText");

  const links = [
    { href: "/guide", label: t("linkGuide") },
    { href: "/product", label: t("linkProduct") },
    { href: "/contact", label: t("linkContact") },
  ];

  return (
    <section className="section-pad">
      <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="mb-3 text-[0.78rem] font-extrabold uppercase tracking-[0.18em] text-brand">
            {t("kicker")}
          </p>
          <h2 className="text-headline text-balance text-ink">{t("heading")}</h2>
        </div>
        <div>
          <div className="space-y-4 text-[1.02rem] leading-relaxed text-ink-soft">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
          </div>
          <ul className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex items-center gap-2 text-[0.95rem] font-bold text-brand transition-colors hover:text-ink"
                >
                  {l.label}
                  <svg
                    viewBox="0 0 16 16"
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 8h10m0 0L9 4m4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
