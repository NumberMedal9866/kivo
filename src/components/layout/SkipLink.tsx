import { getTranslations } from "next-intl/server";

export async function SkipLink() {
  const t = await getTranslations("a11y");
  return (
    <a
      href="#main"
      className="sr-only z-[100] rounded-full bg-brand px-5 py-2.5 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {t("skipToContent")}
    </a>
  );
}
