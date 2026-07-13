import { expect, test } from "@playwright/test";

test("mobile menu opens, navigates and closes", async ({ page }) => {
  await page.goto("/ru");
  const toggle = page.getByRole("button", { name: "Открыть меню" });
  await toggle.click();
  await expect(page.locator("#mobile-menu")).toBeVisible();

  await page.locator("#mobile-menu").getByRole("link", { name: "Продукт" }).click();
  await expect(page).toHaveURL(/\/ru\/product$/);
  await expect(page.locator("#mobile-menu")).toBeHidden();
});

test("mobile menu closes with Escape", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-menu")).toBeHidden();
});

test("no horizontal scrolling on mobile", async ({ page }) => {
  for (const path of ["/ru", "/uz", "/en", "/ru/product", "/ru/contact"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(0);
  }
});

test("language switcher is reachable on mobile", async ({ page }) => {
  await page.goto("/ru");
  await page
    .getByRole("group", { name: "Язык" })
    .first()
    .getByRole("button", { name: "English" })
    .click();
  await expect(page).toHaveURL(/\/en$/);
});
