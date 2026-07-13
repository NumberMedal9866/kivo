import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { brand, type Locale } from "@/config/brand";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function OpengraphImage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #F6F7F9 0%, #E9EEFF 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "#0B0D12",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: 36,
            fontWeight: 800,
          }}
        >
          {brand.monogram}
        </div>
        <div style={{ fontSize: 44, fontWeight: 800, color: "#0B0D12", letterSpacing: -1 }}>
          {brand.logoText}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 62,
            fontWeight: 800,
            color: "#0B0D12",
            letterSpacing: -2,
            lineHeight: 1.1,
            maxWidth: 980,
          }}
        >
          {t("home.title")}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 28,
            color: "#626975",
          }}
        >
          <div style={{ width: 52, height: 6, background: "#315CFF", borderRadius: 3 }} />
          {brand.seo.siteName} · iiko · Click · Payme · Uzum · HUMO · Uzcard
        </div>
      </div>
    </div>,
    size,
  );
}
