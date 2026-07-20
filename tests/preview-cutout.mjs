// Preview the hero cutout on a dark background to verify the body is solid.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 600, height: 900 } });
const dataUrl =
  "data:image/png;base64," +
  fs.readFileSync("public/images/hero-kiosk-front.png").toString("base64");
await p.setContent(
  `<body style="margin:0;background:#0a0c11;display:flex;justify-content:center"><img src="${dataUrl}" style="height:880px"></body>`,
);
await p.waitForTimeout(300);
await p.screenshot({ path: "test-results/screens/cutout-on-dark.png" });
await b.close();
console.log("done");
