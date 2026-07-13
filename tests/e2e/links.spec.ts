import { expect, test } from "@playwright/test";

test("no broken internal links on the home page", async ({ page, request }) => {
  await page.goto("/en");
  const hrefs = await page.$$eval("a[href]", (links) =>
    links
      .map((a) => a.getAttribute("href")!)
      .filter((href) => href.startsWith("/") && !href.startsWith("//")),
  );
  const unique = [...new Set(hrefs.map((h) => h.split("#")[0]).filter(Boolean))];
  expect(unique.length).toBeGreaterThan(3);
  for (const href of unique) {
    const res = await request.get(href!);
    expect(res.status(), href).toBeLessThan(400);
  }
});

test("evidence sources link to the documented external URLs", async ({ page }) => {
  await page.goto("/en");
  const externals = await page.$$eval("a[target='_blank']", (links) =>
    links.map((a) => a.getAttribute("href")!),
  );
  expect(externals.some((h) => h.includes("investopedia.com"))).toBe(true);
  expect(externals.some((h) => h.includes("sec.gov"))).toBe(true);
  // External links must be safe
  const rels = await page.$$eval("a[target='_blank']", (links) =>
    links.map((a) => a.getAttribute("rel") ?? ""),
  );
  for (const rel of rels) {
    expect(rel).toContain("noopener");
  }
});
