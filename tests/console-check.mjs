// Dump browser console warnings/errors from the dev server home page.
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const messages = [];
page.on("console", (msg) => {
  if (msg.type() === "warning" || msg.type() === "error") {
    messages.push(`[${msg.type()}] ${msg.text().slice(0, 400)}`);
  }
});
page.on("pageerror", (err) => messages.push(`[pageerror] ${String(err).slice(0, 400)}`));

await page.goto("http://localhost:3000/ru", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
// Scroll through the page to trigger lazy content
for (let i = 0; i < 10; i++) {
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(300);
}
await page.waitForTimeout(1500);

console.log(messages.length ? messages.join("\n") : "no console warnings/errors");
await browser.close();
