import { expect, test } from "@playwright/test";

test("switching language preserves the current page", async ({ page }) => {
  await page.goto("/ru/product");
  // Retry the click until hydration has attached the handler and the URL flips.
  await expect(async () => {
    await page.getByRole("button", { name: "English" }).first().click();
    await expect(page).toHaveURL(/\/en\/product$/, { timeout: 2_000 });
  }).toPass({ timeout: 15_000 });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("language choice persists via cookie", async ({ page, context }) => {
  await page.goto("/ru");
  await page.getByRole("button", { name: "O‘zbekcha" }).first().click();
  await expect(page).toHaveURL(/\/uz$/);

  // The cookie is synced after navigation; poll to avoid racing the effect.
  await expect
    .poll(async () => {
      const cookies = await context.cookies();
      return cookies.find((c) => c.name === "NEXT_LOCALE")?.value;
    })
    .toBe("uz");

  // A fresh visit to the root now lands on /uz.
  await page.goto("/");
  await expect(page).toHaveURL(/\/uz$/);
});
