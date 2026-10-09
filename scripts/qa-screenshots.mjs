#!/usr/bin/env node
/**
 * QA: full-page screenshots of every route at several widths → /qa/
 *   npm run build && npx next start -p 3100 &
 *   NODE_PATH=$(npm root -g) node scripts/qa-screenshots.mjs [baseUrl] [widths]
 */
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const base = process.argv[2] ?? "http://localhost:3100";
const widths = (process.argv[3] ?? "390,1440").split(",").map(Number);
const routes = ["/", "/services", "/mobile-detailing-harrisonburg-va", "/book", "/about", "/this-page-does-not-exist"];
const reduced = process.env.REDUCED === "1";

await mkdir("qa", { recursive: true });
const browser = await chromium.launch();
const issues = [];
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => issues.push(`[${w}] pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && !/status of 404/.test(m.text()) && issues.push(`[${w}] console: ${m.text()}`));
  // Log failing requests with their URL (the 404 route's own 404 is expected and skipped).
  page.on("response", (r) => r.status() >= 400 && !r.url().includes("this-page-does-not-exist") && issues.push(`[${w}] ${r.status()} ${r.url()}`));
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    // scroll through so whileInView reveals fire
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 500) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(90);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1600);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) issues.push(`[${w}] ${r}: horizontal overflow ${overflow}px`);
    const name = (r === "/" ? "home" : r.slice(1).replace(/\//g, "-")) + `-${w}${reduced ? "-reduced" : ""}.png`;
    await page.screenshot({ path: `qa/${name}`, fullPage: true });
    console.log("✓", name);
  }
  await ctx.close();
}
await browser.close();
console.log(issues.length ? "\nIssues:\n" + issues.join("\n") : "\nNo overflow / console errors.");
