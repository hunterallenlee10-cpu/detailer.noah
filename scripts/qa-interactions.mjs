#!/usr/bin/env node
/**
 * QA: keyboard-only run through nav, "Add to quote", the multi-step form, FAQ and copy-code,
 * plus a JSON-LD sanity check. Usage: NODE_PATH=$(npm root -g) node scripts/qa-interactions.mjs [baseUrl]
 */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const base = process.argv[2] ?? "http://localhost:3100";
const results = [];
const check = (name, ok, extra = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(base, { waitUntil: "networkidle" });

// 1. Skip link + nav via Tab
await page.keyboard.press("Tab");
check("Skip link is first tab stop", (await page.evaluate(() => document.activeElement?.textContent?.trim())) === "Skip to content");
const tabStops = [];
for (let i = 0; i < 6; i++) {
  await page.keyboard.press("Tab");
  tabStops.push(await page.evaluate(() => document.activeElement?.textContent?.trim()));
}
check("Header nav reachable by keyboard", ["Services", "Work", "About", "Get a Quote"].every((t) => tabStops.includes(t)), tabStops.join(" | "));

// 2. Add to quote → form pre-checked
const add = page.getByRole("button", { name: /Add Pet Hair Removal to my quote/ });
await add.focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(1600);
const quoteTop = await page.evaluate(() => document.getElementById("quote")?.getBoundingClientRect().top ?? 9999);
check("Add to quote scrolls to form", Math.abs(quoteTop) < 400, `quote top=${Math.round(quoteTop)}`);

// 3. Multi-step form, keyboard only
const form = page.locator("#quote form");
await form.getByRole("button", { name: /Continue/ }).click();
check("Step 1 blocks empty vehicle", await form.getByText(/Tell me the year, make and model/).isVisible());
await form.getByLabel("Year / Make / Model").fill("2019 Ford F-150");
await page.keyboard.press("Enter");
await page.waitForTimeout(900);
check("Step 2 reached via Enter", await form.getByText(/Step 2 of 5/).isVisible());
check("Focus moved to step heading", (await page.evaluate(() => document.activeElement?.id)) === "quote-heading");
const petChecked = await form.getByRole("checkbox", { name: /Pet Hair Removal/ }).isChecked();
check("Add-to-quote pre-checked the service", petChecked);
await form.getByRole("checkbox", { name: /Headlight Restoration/ }).focus();
await page.keyboard.press("Space");
check("Space toggles a service chip", await form.getByRole("checkbox", { name: /Headlight Restoration/ }).isChecked());
await form.getByRole("button", { name: /Continue/ }).click();
await page.waitForTimeout(500);
await form.getByRole("button", { name: /Continue/ }).click();
check("Step 3 validates address + spigot", (await form.getByText(/Where should I come\? A street/).count()) > 0 && (await form.getByText(/hose spigot and outlet\./).count()) > 0);
await form.getByLabel("I'd rather drop it off").check();
await form.getByRole("button", { name: /Continue/ }).click();
await page.waitForTimeout(500);
check("Drop-off skips address requirement", await form.getByText(/Step 4 of 5/).isVisible());
// photos (synthetic PNG)
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");
await form.locator('input[type="file"]').setInputFiles([{ name: "a.png", mimeType: "image/png", buffer: png }, { name: "b.png", mimeType: "image/png", buffer: png }]);
check("Photo thumbnails render", (await form.locator("ul img").count()) === 2);
await form.getByRole("button", { name: "Remove photo 1" }).click();
check("Photo can be removed", (await form.locator("ul img").count()) === 1);
await form.getByRole("button", { name: /Continue/ }).click();
await page.waitForTimeout(500);
await form.getByLabel("First name").fill("Test");
await form.getByLabel("Last name").fill("Person");
await form.getByLabel("Phone number").pressSequentially("5405550123", { delay: 40 });
check("Phone formats as typed", (await form.getByLabel("Phone number").inputValue()) === "(540) 555-0123");
await form.getByRole("button", { name: /Send my quote request/ }).click();
await page.waitForTimeout(900);
const demo = page.locator("#quote");
check("Demo mode shows honest next step", await demo.getByText("One last step.").isVisible());
check("Google Form fallback offered", await demo.getByRole("link", { name: /Send via my Google Form/ }).isVisible());

// 4. FAQ keyboard
const summary = page.locator("details summary").first();
await summary.focus();
await page.keyboard.press("Enter");
check("FAQ opens with Enter", await page.locator("details").first().evaluate((d) => d.open));

// 5. Copy code
await page.getByRole("button", { name: /Copy discount code NOAH/ }).focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(300);
check("Copy code copies NOAH", (await page.evaluate(() => navigator.clipboard.readText())) === "NOAH");
check("Toast 'Code copied' shown", await page.getByText("Code copied").isVisible());

// 6. JSON-LD
const ld = await page.evaluate(() => [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)));
const biz = ld.find((d) => d["@type"] === "AutoWash");
check("AutoWash JSON-LD present", Boolean(biz));
check("No aggregateRating / priceRange", biz && !("aggregateRating" in biz) && !("priceRange" in biz));
check("No empty phone/address fields", biz && !("telephone" in biz && !biz.telephone) && !("address" in biz));
check("7 services in offer catalog", biz?.hasOfferCatalog?.itemListElement?.length === 7);
check("FAQPage JSON-LD present", ld.some((d) => d["@type"] === "FAQPage"));

// 7. /book?service= preselect
await page.goto(base + "/book?service=engine-bay-detail", { waitUntil: "networkidle" });
await page.getByLabel("Year / Make / Model").fill("Boat");
await page.keyboard.press("Enter");
await page.waitForTimeout(500);
check("/book?service= pre-selects service", await page.getByRole("checkbox", { name: /Engine Bay Detail/ }).isChecked());

check("No page errors", errors.length === 0, errors.join("; "));
await browser.close();
console.log(results.join("\n"));
process.exit(results.some((r) => r.startsWith("FAIL")) ? 1 : 0);
