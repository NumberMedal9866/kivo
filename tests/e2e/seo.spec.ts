import { expect, test } from "@playwright/test";

test("home page exposes hreflang alternates and canonical", async ({ request }) => {
  const res = await request.get("/ru");
  // Next.js serializes the attribute as `hrefLang` — compare lowercased.
  const html = (await res.text()).toLowerCase();
  expect(html).toContain('hreflang="ru"');
  expect(html).toContain('hreflang="uz"');
  expect(html).toContain('hreflang="en"');
  expect(html).toContain('hreflang="x-default"');
  expect(html).toContain('rel="canonical"');
});

test("structured data is valid JSON-LD with truthful types only", async ({ request }) => {
  const res = await request.get("/en");
  const html = await res.text();
  const matches = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  expect(matches.length).toBeGreaterThan(0);
  for (const match of matches) {
    const data = JSON.parse(match[1]!);
    const items = Array.isArray(data) ? data : [data];
    for (const item of items) {
      expect([
        "Organization",
        "WebSite",
        "Service",
        "Product",
        "FAQPage",
        "BreadcrumbList",
      ]).toContain(item["@type"]);
      // No fake signals
      expect(item.aggregateRating).toBeUndefined();
      expect(item.review).toBeUndefined();
      expect(item.offers).toBeUndefined();
      expect(item.address).toBeUndefined();
      expect(item.foundingDate).toBeUndefined();
    }
  }
});

test("sitemap covers all locales and pages", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  for (const locale of ["ru", "uz", "en"]) {
    expect(xml).toContain(`/${locale}/product`);
    expect(xml).toContain(`/${locale}/contact`);
  }
  expect(xml).toContain("xhtml");
});

test("robots.txt exists and references the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const text = await res.text();
  expect(text).toContain("Sitemap:");
  expect(text).toContain("/api/");
});

test("security headers are present", async ({ request }) => {
  const res = await request.get("/en");
  expect(res.headers()["content-security-policy"]).toContain("default-src 'self'");
  expect(res.headers()["x-content-type-options"]).toBe("nosniff");
  expect(res.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
});

test("localized meta titles differ per locale", async ({ request }) => {
  const ru = await (await request.get("/ru")).text();
  const en = await (await request.get("/en")).text();
  expect(ru).toContain("Киоски самообслуживания");
  expect(en).toContain("Self-service ordering kiosks");
});
