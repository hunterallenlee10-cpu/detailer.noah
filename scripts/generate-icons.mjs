#!/usr/bin/env node
// Favicon/PWA PNGs from the badge mark (src/app/icon.svg). Run: npm run icons
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const svg = await readFile(path.join(ROOT, "src/app/icon.svg"));
const out = path.join(ROOT, "public/icons");
await mkdir(out, { recursive: true });

const bg = { r: 7, g: 9, b: 13, alpha: 1 };
async function square(size, pad, file) {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(svg, { density: 600 }).resize({ height: inner, fit: "inside" }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: bg } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(path.join(out, file));
  console.log("✓", file);
}

await square(192, 0.1, "icon-192.png");
await square(512, 0.1, "icon-512.png");
await square(512, 0.2, "icon-maskable-512.png");
await square(180, 0.1, "apple-touch-icon.png");
