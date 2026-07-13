// Visual QA capture script: full-page screenshots at desktop and mobile.
// Usage: node tests/screenshots.mjs [baseUrl] (default http://localhost:3100)
import { chromium } from "@playwright/test";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3100";
const outDir = "test-results/screens";
fs.mkdirSync(outDir, { recursive: true });

const shots = [
  { name: "home-ru-desktop", url: "/ru", width: 1440, height: 900 },
  { name: "home-uz-desktop", url: "/uz", width: 1440, height: 900 },
  { name: "home-en-desktop", url: "/en", width: 1440, height: 900 },
  { name: "home-ru-mobile", url: "/ru", width: 390, height: 844 },
  { name: "home-ru-mobile-small", url: "/ru", width: 360, height: 800 },
  { name: "product-ru-desktop", url: "/ru/product", width: 1440, height: 900 },
  { name: "product-ru-mobile", url: "/ru/product", width: 390, height: 844 },
  { name: "integrations-ru-desktop", url: "/ru/integrations", width: 1440, height: 900 },
  { name: "implementation-ru-desktop", url: "/ru/implementation", width: 1440, height: 900 },
  { name: "contact-ru-desktop", url: "/ru/contact", width: 1440, height: 900 },
  { name: "contact-uz-mobile", url: "/uz/contact", width: 390, height: 844 },
  { name: "privacy-en-desktop", url: "/en/privacy", width: 1440, height: 900 },
  { name: "home-en-tablet", url: "/en", width: 768, height: 1024 },
  { name: "home-ru-1024", url: "/ru", width: 1024, height: 768 },
  { name: "home-en-1920", url: "/en", width: 1920, height: 1080 },
];

const browser = await chromium.launch();
for (const shot of shots) {
  const page = await browser.newPage({
    viewport: { width: shot.width, height: shot.height },
    reducedMotion: "reduce", // reveal-all so full-page shots show content
  });
  await page.goto(base + shot.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/${shot.name}.png`, fullPage: true });
  await page.close();
  console.log("captured", shot.name);
}

// Interactive states
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(base + "/ru", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Открыть меню" }).click();
await page.waitForTimeout(300);
await page.screenshot({ path: `${outDir}/mobile-menu-open.png` });
console.log("captured mobile-menu-open");

await page.goto(base + "/en", { waitUntil: "networkidle" });
await page.locator("#demo").scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.locator("#demo").screenshot({ path: `${outDir}/demo-mobile.png` });
console.log("captured demo-mobile");

// Form success state
await page.goto(base + "/en/contact", { waitUntil: "networkidle" });
await page.getByLabel(/Your name/).fill("QA Test");
await page.getByLabel(/Phone number/).fill("+998901234567");
await page.getByRole("checkbox").check();
await page.waitForTimeout(3200);
await page.getByRole("button", { name: "Request a call" }).click();
await page.waitForTimeout(1500);
await page.screenshot({ path: `${outDir}/form-success-mobile.png`, fullPage: false });
console.log("captured form-success-mobile");

await browser.close();
console.log("done");
