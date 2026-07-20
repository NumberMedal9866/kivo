// Rasterizes the kiyo brand assets from the exact mark SVG:
// - icon tiles (mark on a solid #0B0D12 rounded tile): 32, 180, 192, 512
// - OG image 1200×630 (ink background, blue mark + white wordmark)
// Usage: node tests/gen-brand-assets.mjs
import { chromium } from "@playwright/test";
import fs from "node:fs";

const MARK = (fill) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="8 8 104 104" style="width:100%;height:100%">
  <defs>
    <mask id="kiyoK">
      <rect x="-10" y="-10" width="140" height="140" fill="white"/>
      <g transform="translate(60,60)">
        <path d="M -44 44 L 44 -32" stroke="black" stroke-width="8" stroke-linecap="round"/>
        <path d="M -44 44 C -6 20, 24 20, 56 34" fill="none" stroke="black" stroke-width="8" stroke-linecap="round"/>
        <path d="M -9 -64 C -14 -28, -14 28, -7 64" fill="none" stroke="black" stroke-width="8" stroke-linecap="round" transform="rotate(-14,-10,0)"/>
      </g>
    </mask>
  </defs>
  <circle cx="60" cy="60" r="52" fill="${fill}" mask="url(#kiyoK)"/>
</svg>`;

const tileHtml = (size) => `<!doctype html><html><body style="margin:0;background:transparent">
<div style="width:${size}px;height:${size}px;background:#0B0D12;border-radius:${Math.round(size * 0.22)}px;display:flex;align-items:center;justify-content:center">
  <div style="width:${Math.round(size * 0.62)}px;height:${Math.round(size * 0.62)}px">${MARK("#315CFF")}</div>
</div></body></html>`;

const ogHtml = `<!doctype html><html><head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet">
</head><body style="margin:0">
<div style="width:1200px;height:630px;background:#0B0D12;display:flex;align-items:center;justify-content:center;gap:34px">
  <div style="width:96px;height:96px">${MARK("#315CFF")}</div>
  <div style="font-family:'Montserrat',sans-serif;font-weight:700;font-size:132px;letter-spacing:-0.03em;color:#FFFFFF;line-height:1">kiyo</div>
</div></body></html>`;

fs.mkdirSync("public/icons", { recursive: true });

const browser = await chromium.launch();

// Icon tiles (transparent outside the rounded corners)
const targets = [
  { size: 32, path: "src/app/icon1.png" },
  { size: 180, path: "src/app/apple-icon.png" },
  { size: 192, path: "public/icons/icon-192.png" },
  { size: 512, path: "public/icons/icon-512.png" },
];
for (const t of targets) {
  const page = await browser.newPage({ viewport: { width: t.size, height: t.size } });
  await page.setContent(tileHtml(t.size));
  await page.waitForTimeout(120);
  await page.screenshot({ path: t.path, omitBackground: true });
  await page.close();
  console.log("wrote", t.path);
}

// OG image
const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await og.setContent(ogHtml, { waitUntil: "networkidle" });
await og.evaluate(() => document.fonts.ready);
await og.waitForTimeout(200);
await og.screenshot({ path: "public/og.png" });
console.log("wrote public/og.png");

await browser.close();
console.log("done");
