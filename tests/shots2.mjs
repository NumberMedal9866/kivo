import { chromium } from "@playwright/test";
import fs from "node:fs";

const base = "http://localhost:3100";
const outDir = "test-results/screens";
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(base + "/ru", { waitUntil: "networkidle" });
await page.screenshot({ path: `${outDir}/crop-hero-desktop.png` });

await page.locator("#demo").scrollIntoViewIfNeeded();
await page.waitForTimeout(1800);
await page.locator("#demo").screenshot({ path: `${outDir}/crop-demo-desktop.png` });

await page.locator("#stats").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.locator("#stats").screenshot({ path: `${outDir}/crop-stats-desktop.png` });

await page.locator("#integrations").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.locator("#integrations").screenshot({ path: `${outDir}/crop-integrations-desktop.png` });

await page.locator("#how-it-works").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.locator("#how-it-works").screenshot({ path: `${outDir}/crop-how-desktop.png` });

// Switch interaction state
await page.locator("section").first().scrollIntoViewIfNeeded();
const switchBtn = page.getByRole("button", { name: "С kiyo" });
await switchBtn.scrollIntoViewIfNeeded();
await switchBtn.click();
await page.waitForTimeout(900);
await page
  .locator("section")
  .filter({ hasText: "Один час пик" })
  .first()
  .screenshot({ path: `${outDir}/crop-switch-after.png` });

// Mobile hero
const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
await m.goto(base + "/ru", { waitUntil: "networkidle" });
await m.screenshot({ path: `${outDir}/crop-hero-mobile.png` });

await browser.close();
console.log("done");
