import { expect, test } from "@playwright/test";

const LOCALES = [
  { locale: "ru", heading: /Заказы принимает киоск/i },
  { locale: "uz", heading: /Buyurtmani kiosk oladi/i },
  { locale: "en", heading: /The kiosk takes orders/i },
];

for (const { locale, heading } of LOCALES) {
  test(`home page renders in ${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    // Server-rendered FAQ content must be crawlable
    await expect(page.locator("#faq")).toBeVisible();
  });
}

test("root redirects using Accept-Language (uz)", async ({ browser }) => {
  const context = await browser.newContext({ locale: "uz" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/uz$/);
  await context.close();
});

test("root falls back to Russian without a matching language", async ({ browser }) => {
  const context = await browser.newContext({ locale: "de-DE" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/ru$/);
  await context.close();
});

test("NEXT_LOCALE cookie wins over Accept-Language", async ({ browser }) => {
  const context = await browser.newContext({ locale: "ru-RU" });
  await context.addCookies([{ name: "NEXT_LOCALE", value: "en", domain: "localhost", path: "/" }]);
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await context.close();
});

test("detail pages respond in every locale", async ({ request }) => {
  for (const locale of ["ru", "uz", "en"]) {
    for (const path of ["product", "integrations", "implementation", "contact", "privacy"]) {
      const res = await request.get(`/${locale}/${path}`);
      expect(res.status(), `/${locale}/${path}`).toBe(200);
    }
  }
});

test("unknown path renders localized 404", async ({ page }) => {
  const res = await page.goto("/ru/no-such-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByText("Страница не найдена")).toBeVisible();
});
