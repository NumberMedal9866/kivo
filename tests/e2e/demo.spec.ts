import { expect, test } from "@playwright/test";

test("kiosk demo: full order flow to success", async ({ page }) => {
  await page.goto("/en");
  // The demo bundle lazy-loads when the section approaches the viewport.
  await page.locator("#demo").scrollIntoViewIfNeeded();
  const demo = page.getByRole("group", { name: "Interactive kiosk demonstration" });
  await expect(demo).toBeVisible({ timeout: 15_000 });

  // Switch demo language independent of site locale
  await demo.getByRole("button", { name: "RU", exact: true }).click();
  await expect(demo.getByRole("button", { name: "Основное" })).toBeVisible();
  await demo.getByRole("button", { name: "EN", exact: true }).click();
  await expect(demo.getByRole("button", { name: "Mains" })).toBeVisible();

  // Add a simple item
  await demo.getByRole("button", { name: "Add", exact: true }).nth(1).click();

  // Add an item with modifiers
  await demo.getByRole("button", { name: "Add", exact: true }).first().click();
  await expect(demo.getByText("Choose a size")).toBeVisible();
  await demo.getByRole("button", { name: /Double patty/ }).click();

  // Open basket and checkout
  await demo.getByRole("button", { name: /Basket · /, exact: false }).click();
  await expect(demo.getByText("Total")).toBeVisible();
  await demo.getByRole("button", { name: "Checkout" }).click();

  // Upsell appears (no dessert in basket) — accept it
  await expect(demo.getByText("Add a dessert?")).toBeVisible();
  await demo.getByRole("button", { name: "Yes, add it" }).click();

  // Payment screen with marks, then simulated payment
  await expect(demo.getByText("Visa")).toBeVisible();
  await expect(demo.getByText("no real payment is processed")).toBeVisible();
  await demo.getByRole("button", { name: "Pay (demo)" }).click();

  // Success
  await expect(demo.getByText("Order confirmed!")).toBeVisible({ timeout: 10_000 });
  await demo.getByRole("button", { name: "New order" }).click();
  await expect(demo.getByRole("button", { name: "Add", exact: true }).first()).toBeVisible();
});
