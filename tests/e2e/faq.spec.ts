import { expect, test } from "@playwright/test";

test("FAQ accordion works with the keyboard", async ({ page }) => {
  await page.goto("/en");
  const firstButton = page.locator("#faq h3 button").first();
  const secondButton = page.locator("#faq h3 button").nth(1);

  // First item is open by default; content is in the DOM (crawlable).
  await expect(firstButton).toHaveAttribute("aria-expanded", "true");

  await secondButton.scrollIntoViewIfNeeded();
  await secondButton.focus();
  await page.keyboard.press("Enter");
  await expect(secondButton).toHaveAttribute("aria-expanded", "true");
  await expect(firstButton).toHaveAttribute("aria-expanded", "false");

  await page.keyboard.press("Space");
  await expect(secondButton).toHaveAttribute("aria-expanded", "false");
});

test("FAQ answers are present in server HTML", async ({ request }) => {
  const res = await request.get("/en");
  const html = await res.text();
  expect(html).toContain("Is iiko supported?");
  expect(html).toContain("Rental with a low initial payment");
});
