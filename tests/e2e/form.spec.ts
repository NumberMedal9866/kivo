import { expect, test } from "@playwright/test";

test("lead form shows localized validation errors", async ({ page }) => {
  await page.goto("/ru/contact");
  await page.getByRole("button", { name: "Заказать звонок" }).click();
  await expect(page.getByText("Укажите, пожалуйста, ваше имя")).toBeVisible();

  await page.getByLabel(/Ваше имя/).fill("Тест");
  await page.getByLabel(/Номер телефона/).fill("abc");
  await page.getByRole("button", { name: "Заказать звонок" }).click();
  await expect(page.getByText("Укажите корректный номер телефона")).toBeVisible();
});

test("lead form submits successfully in mock mode", async ({ page }) => {
  await page.goto("/ru/contact");
  await page.getByLabel(/Ваше имя/).fill("Тестовый Гость");
  await page.getByLabel(/Название заведения/).fill("Кофейня Тест");
  await page.getByLabel(/Номер телефона/).fill("+998 90 123 45 67");
  await page.getByLabel(/Сообщение/).fill("Две точки, iiko уже используем.");
  await page.getByRole("checkbox").check();

  // Respect the minimum form-completion time (anti-bot).
  await page.waitForTimeout(3200);

  await page.getByRole("button", { name: "Заказать звонок" }).click();
  await expect(page.getByText("Заявка получена")).toBeVisible({ timeout: 10_000 });

  // Duplicate submission is not possible from the success state.
  await expect(page.getByRole("button", { name: "Заказать звонок" })).toHaveCount(0);
});

test("api rejects malformed and too-fast requests", async ({ request }) => {
  // Malformed JSON
  const bad = await request.post("/api/leads", {
    headers: { "Content-Type": "application/json" },
    data: "not-json",
  });
  expect([400, 422]).toContain(bad.status());

  // Valid shape but instant submission (min-time check)
  const fast = await request.post("/api/leads", {
    data: {
      name: "Bot",
      phone: "+998901234567",
      consent: true,
      locale: "ru",
      startedAt: Date.now(),
      context: {},
    },
  });
  expect(fast.status()).toBe(400);

  // Honeypot filled → 200 but silently dropped
  const honey = await request.post("/api/leads", {
    data: {
      name: "Bot",
      phone: "+998901234567",
      consent: true,
      locale: "ru",
      website: "http://spam.example",
      startedAt: Date.now() - 10_000,
      context: {},
    },
  });
  expect([200, 422]).toContain(honey.status());
});
