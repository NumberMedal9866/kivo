"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * Localized error boundary. Technical details are intentionally not shown
 * to visitors; the error is reported to the console for diagnostics.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorPage");
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-title text-ink">{t("title")}</h1>
      <p className="mt-3 max-w-md text-ink-soft">{t("text")}</p>
      <Button variant="primary" size="lg" className="mt-8" onClick={() => reset()}>
        {t("retry")}
      </Button>
    </Container>
  );
}
