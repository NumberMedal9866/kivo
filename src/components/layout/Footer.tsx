import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { brand } from "@/config/brand";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ContactLinks } from "@/components/layout/ContactLinks";
import { DevContactWarning } from "@/components/layout/DevContactWarning";

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  const productLinks = [
    { href: "/product", label: t("nav.product") },
    { href: "/integrations", label: t("nav.integrations") },
    { href: "/implementation", label: t("nav.implementation") },
  ];
  const infoLinks = [
    { href: "/#demo", label: t("nav.demo") },
    { href: "/#rental", label: t("nav.rental") },
    { href: "/#faq", label: t("nav.faq") },
    { href: "/privacy", label: t("footer.privacy") },
  ];

  return (
    <footer className="chapter-dark-flat border-t border-white/8">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
            <Link href="/" aria-label={t("nav.home")}>
              <Logo dark />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/55">{t("footer.description")}</p>
            <p className="mt-4 text-sm font-semibold text-white/80">{t("footer.builtFor")}</p>
          </div>

          <nav aria-label={t("footer.colProduct")}>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/40">
              {t("footer.colProduct")}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.colCompany")}>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/40">
              {t("footer.colCompany")}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {infoLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/40">
              {t("footer.colContact")}
            </h2>
            <div className="mt-4">
              <ContactLinks variant="footer" dark />
              <DevContactWarning />
            </div>
            <h2 className="mt-6 text-xs font-extrabold uppercase tracking-[0.16em] text-white/40">
              {t("footer.language")}
            </h2>
            <div className="mt-3">
              <LanguageSwitcher dark />
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.copyright", { year, brand: brand.name })}</p>
          <p className="max-w-md sm:text-right">{t("footer.trademarks")}</p>
        </div>
      </Container>
    </footer>
  );
}
