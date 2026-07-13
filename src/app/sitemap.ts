import type { MetadataRoute } from "next";
import { brand, locales } from "@/config/brand";

const PAGES = ["", "/product", "/integrations", "/implementation", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = brand.seo;
  const lastModified = new Date();

  return PAGES.flatMap((page) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${page}`,
      lastModified,
      changeFrequency: (page === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: page === "" ? 1 : page === "/privacy" ? 0.3 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${page}`])),
      },
    })),
  );
}
