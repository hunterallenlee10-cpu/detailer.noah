#!/usr/bin/env node
/** QA: Lenis smooth-scroll behaviour. NODE_PATH=$(npm root -g) node scripts/qa-scroll.mjs [baseUrl] */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const base = process.argv[2] ?? "http://localhost:3100";
const out = [];
const check = (n, ok, x = "") => out.push(`${ok ? "PASS" : "FAIL"}  ${n}${x ? " — " + x : ""}`);
const b = await chromium.launch();
const errors = [];

// Desktop
let p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on("pageerror", (e) => errors.push(e.message));
await p.goto(base, { waitUntil: "networkidle" });
check("Lenis active (html.lenis)", await p.evaluate(() => document.documentElement.classList.contains("lenis")));

// wheel → smoothed: position keeps moving after the wheel event
await p.mouse.move(700, 500);
await p.mouse.wheel(0, 800);
const y1 = await p.evaluate(() => scrollY);
await p.waitForTimeout(120);
const y2 = await p.evaluate(() => scrollY);
await p.waitForTimeout(900);
const y3 = await p.evaluate(() => scrollY);
check("Wheel scroll glides (keeps easing after input)", y2 > y1 && y3 > y2 && Math.abs(y3 - 800) < 40, `${Math.round(y1)} → ${Math.round(y2)} → ${Math.round(y3)}`);

// header progress bar moves
const bar = await p.evaluate(() => document.querySelector("header > div[aria-hidden]")?.style.transform);
check("Header progress line tracks scroll", /scaleX\(0\.\d+/.test(bar ?? ""), bar);

// in-page nav link "Work" → smooth glide, no reload, lands under header, URL hash set
await p.evaluate(() => scrollTo(0, 0));
await p.waitForTimeout(400);
const startTop = await p.evaluate(() => document.getElementById("work").getBoundingClientRect().top);
await p.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" }).click();
await p.waitForTimeout(40);
const mid = await p.evaluate(() => document.getElementById("work").getBoundingClientRect().top);
await p.waitForTimeout(1700);
const top = await p.evaluate(() => document.getElementById("work").getBoundingClientRect().top);
check("Work link glides (mid-flight, not a jump)", mid > 120 && mid < startTop, `start ${Math.round(startTop)} → 40ms ${Math.round(mid)}`);
check("Work lands just under the fixed header", Math.abs(top - 80) < 6, `top ${Math.round(top)}`);
check("URL hash updated to #work", (await p.evaluate(() => location.hash)) === "#work");

// Get a Quote → glide + focus handoff
await p.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Get a Quote" }).click();
await p.waitForTimeout(1900);
const qTop = await p.evaluate(() => document.getElementById("quote").getBoundingClientRect().top);
check("Get a Quote glides to the form", Math.abs(qTop - 80) < 6, `top ${Math.round(qTop)}`);
check("Focus handed to the form heading", (await p.evaluate(() => document.activeElement?.id)) === "quote-heading");

// cross-page hash: /services → "/#work" lands on #work
await p.goto(base + "/services", { waitUntil: "networkidle" });
await p.getByRole("contentinfo").getByRole("link", { name: "Work" }).click();
await p.waitForURL(/\/#work$/);
await p.waitForTimeout(1500);
const wTop = await p.evaluate(() => document.getElementById("work")?.getBoundingClientRect().top ?? 9999);
check("Cross-page /#work lands on the section", Math.abs(wTop - 80) < 40, `top ${Math.round(wTop)}`);
await p.close();

// Mobile menu: page locked while open; menu link closes + glides
p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
p.on("pageerror", (e) => errors.push(e.message));
await p.goto(base, { waitUntil: "networkidle" });
await p.getByRole("button", { name: "Open menu" }).click();
await p.waitForTimeout(300);
check("Open menu locks page scroll", await p.evaluate(() => document.documentElement.style.overflow === "hidden"));
await p.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Work" }).click();
await p.waitForTimeout(1800);
check("Menu link closes the menu", (await p.getByRole("navigation", { name: "Mobile" }).count()) === 0);
check("Scroll unlocked after close", await p.evaluate(() => document.documentElement.style.overflow === ""));
const mTop = await p.evaluate(() => document.getElementById("work").getBoundingClientRect().top);
check("Mobile menu link lands on #work", Math.abs(mTop - 80) < 6, `top ${Math.round(mTop)}`);
await p.close();

// Reduced motion: Lenis off
p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await p.goto(base, { waitUntil: "networkidle" });
check("Reduced motion: Lenis disabled", !(await p.evaluate(() => document.documentElement.classList.contains("lenis"))));
await p.close();

check("No page errors", errors.length === 0, errors.join("; "));
await b.close();
console.log(out.join("\n"));
process.exit(out.some((r) => r.startsWith("FAIL")) ? 1 : 0);
