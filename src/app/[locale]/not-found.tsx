import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { LogoMark } from "@/components/brand/Logo";

export default function NotFoundPage() {
  const t = useTranslations("notFound");
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <LogoMark className="h-14 w-14 text-line" />
      <p className="mt-8 text-[5rem] font-extrabold leading-none tracking-tight text-ink/10">404</p>
      <h1 className="mt-4 text-title text-ink">{t("title")}</h1>
      <p className="mt-3 max-w-md text-ink-soft">{t("text")}</p>
      <Link href="/" className={`${buttonClasses({ variant: "primary", size: "lg" })} mt-8`}>
        {t("cta")}
      </Link>
    </Container>
  );
}
