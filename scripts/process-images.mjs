#!/usr/bin/env node
/**
 * Image pipeline: ./source-photos/* → /public/work/*.webp + src/data/photos.ts
 *
 *   npm run images
 *
 * - auto-orients (EXIF), crops to 16:9 (wide), 4:5 (tall) and 1:1 (square)
 * - singles use attention-based cropping; before/after pairs use identical centre crops so sliders line up
 * - writes tiny blur placeholders + local-SEO alt text (from src/data/photo-meta.json, else the filename)
 * - optional "focus": y (0–1) or [x, y] in photo-meta.json pins the crop centre when the automatic crop misses the vehicle
 */
import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "source-photos");
const OUT = path.join(ROOT, "public", "work");
const DATA = path.join(ROOT, "src", "data", "photos.ts");
const META = JSON.parse(await readFile(path.join(ROOT, "src", "data", "photo-meta.json"), "utf8"));
const EXT = /\.(jpe?g|png|webp|avif|heic|heif|tiff?)$/i;
const LOCATION = "mobile detailing in Harrisonburg VA";

const CROPS = {
  wide: { ratio: 16 / 9, maxW: 2400 },
  tall: { ratio: 4 / 5, maxW: 1600 },
  square: { ratio: 1, maxW: 1000 },
};

const titleCase = (s) => s.replace(/(^|\s)\S/g, (c) => c.toUpperCase());

function describe(stem, stage) {
  const meta = META[stem];
  const vehicle = meta?.vehicle ?? titleCase(stem.split("-")[0]);
  const service = meta?.service ?? titleCase(stem.split("-").slice(1).join(" ") || "Detail");
  let alt;
  if (meta?.alt && !stage) alt = meta.alt;
  else if (stage === "before") alt = `${vehicle} before ${service.toLowerCase()} — ${LOCATION}`;
  else alt = `${vehicle} after ${service.toLowerCase()} — ${LOCATION}`;
  return { vehicle, service, alt, known: Boolean(meta), stock: Boolean(meta?.stock), credit: meta?.credit };
}

async function cropTo(input, name, { ratio, maxW }, position, outBase, focus) {
  const { width: W, height: H } = await sharp(input).rotate().metadata().then((m) =>
    // metadata() reports pre-rotation dims; swap for 90° orientations
    m.orientation && m.orientation >= 5 ? { width: m.height, height: m.width } : m,
  );
  const cw = Math.min(W, H * ratio);
  const tw = Math.round(Math.min(cw, maxW));
  const th = Math.round(tw / ratio);
  let pipeline;
  if (focus) {
    // Manual focus point: extract the largest ratio-correct box centred on it, then scale.
    const [fx, fy] = Array.isArray(focus) ? focus : [0.5, focus];
    const ch = Math.round(cw / ratio);
    const left = Math.round(Math.min(Math.max(fx * W - cw / 2, 0), W - cw));
    const top = Math.round(Math.min(Math.max(fy * H - ch / 2, 0), H - ch));
    pipeline = sharp(input).rotate().extract({ left, top, width: Math.round(cw), height: ch }).resize(tw, th, { fit: "cover" });
  } else {
    pipeline = sharp(input).rotate().resize(tw, th, { fit: "cover", position });
  }
  const buf = await pipeline.clone().webp({ quality: 78 }).toBuffer();
  // Content hash in the filename busts image-optimizer/CDN caches whenever a photo changes.
  const file = `${outBase}-${name}.${createHash("sha1").update(buf).digest("hex").slice(0, 8)}.webp`;
  await writeFile(path.join(OUT, file), buf);
  const blur = await pipeline.clone().resize(16, Math.max(1, Math.round(16 / ratio))).webp({ quality: 40 }).toBuffer();
  return { src: `/work/${file}`, width: tw, height: th, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}` };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const f of await readdir(OUT)) if (f.endsWith(".webp")) await rm(path.join(OUT, f));

  const files = (await readdir(SRC).catch(() => [])).filter((f) => EXT.test(f)).sort();
  const photos = [];
  const unknown = [];
  const stems = files.map((f) => path.parse(f).name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  const pairStems = new Set(
    stems.filter((s) => s.endsWith("-before") && stems.includes(s.replace(/-before$/, "-after"))).map((s) => s.replace(/-before$/, "")),
  );

  for (const [i, file] of files.entries()) {
    const id = stems[i];
    const m = id.match(/^(.*)-(before|after)$/);
    const base = m ? m[1] : id;
    const stage = m && pairStems.has(base) ? m[2] : undefined;
    const position = stage ? "centre" : sharp.strategy.attention;
    const input = await readFile(path.join(SRC, file));
    const crops = {};
    const focus = stage ? undefined : META[base]?.focus;
    for (const [name, spec] of Object.entries(CROPS)) crops[name] = await cropTo(input, name, spec, position, id, focus);
    const d = describe(base, stage);
    if (!d.known) unknown.push(file);
    photos.push({
      id,
      src: crops.tall.src,
      width: crops.tall.width,
      height: crops.tall.height,
      alt: d.alt,
      vehicle: d.vehicle,
      service: d.service,
      ...(stage ? { stage } : {}),
      ...(d.stock ? { stock: true, credit: d.credit } : {}),
      crops,
    });
    console.log(`✓ ${file} → /work/${id}-{wide,tall,square}.<hash>.webp`);
  }

  const pairs = [...pairStems].map((base) => {
    const d = describe(base);
    return { id: base, vehicle: d.vehicle, service: d.service, beforeId: `${base}-before`, afterId: `${base}-after` };
  });

  const ts = `// AUTO-GENERATED by scripts/process-images.mjs — do not edit by hand. Run \`npm run images\`.
import type { Photo, PhotoPair } from "@/lib/photo-types";

export const photos: Photo[] = ${JSON.stringify(photos, null, 2)};

${
    pairs.length
      ? `const byId = (id: string) => photos.find((p) => p.id === id)!;

export const pairs: PhotoPair[] = [
${pairs.map((p) => `  { id: ${JSON.stringify(p.id)}, vehicle: ${JSON.stringify(p.vehicle)}, service: ${JSON.stringify(p.service)}, before: byId(${JSON.stringify(p.beforeId)}), after: byId(${JSON.stringify(p.afterId)}) },`).join("\n")}
];`
      : "export const pairs: PhotoPair[] = [];"
  }
`;
  await writeFile(DATA, ts);
  console.log(`\n${photos.length} photo(s), ${pairs.length} before/after pair(s) → src/data/photos.ts`);
  if (!files.length) console.log("No photos in ./source-photos — the site will render abstract placeholders.");
  if (unknown.length)
    console.log(`\n⚠ No metadata for: ${unknown.join(", ")}\n  Add vehicle/service for these in src/data/photo-meta.json and re-run for accurate alt text.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
