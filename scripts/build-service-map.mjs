#!/usr/bin/env node
/**
 * Service-area map generator (run once, outputs are committed):
 *   node scripts/build-service-map.mjs
 *
 * 1. Downloads open elevation tiles (AWS Terrain Tiles, "terrarium" encoding) around Harrisonburg
 *    and renders a dark, blue-toned shaded-relief image → public/map/valley-relief.webp
 * 2. Projects Natural Earth roads / rivers / state lines (public domain) + town points into the same
 *    pixel space → src/data/service-map.json, drawn as an SVG overlay by <ServiceArea />.
 *
 * Natural Earth GeoJSON is read from GEO_DIR (default /tmp/ne-geo); missing files are downloaded.
 */
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const GEO_DIR = process.env.GEO_DIR ?? "/tmp/ne-geo";
const CENTER = { lat: 38.4496, lon: -78.8689 }; // Harrisonburg, VA
const HALF_MILES = 90; // map spans 180 × 180 miles so a 50-mile radius fits any crop
const Z = 10;
const OUT_SIZE = 1600;

const TILE = 256;
const world = TILE * 2 ** Z;
const mx = (lon) => ((lon + 180) / 360) * world;
const my = (lat) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * world;
};
const pxPerMileZ = world / 360 / (69.17 * Math.cos((CENTER.lat * Math.PI) / 180));
const half = Math.round(HALF_MILES * pxPerMileZ);
const cx = mx(CENTER.lon);
const cy = my(CENTER.lat);
const x0 = Math.round(cx - half);
const y0 = Math.round(cy - half);
const SIZE = half * 2;
const scale = OUT_SIZE / SIZE;
const P = (lon, lat) => [(mx(lon) - x0) * scale, (my(lat) - y0) * scale];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function fetchBuf(url) {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (i === 3) throw e;
      await new Promise((res) => setTimeout(res, 1000 * 2 ** i));
    }
  }
}

// ---------- 1. Shaded relief ----------
async function relief() {
  const tx0 = Math.floor(x0 / TILE);
  const ty0 = Math.floor(y0 / TILE);
  const tx1 = Math.floor((x0 + SIZE - 1) / TILE);
  const ty1 = Math.floor((y0 + SIZE - 1) / TILE);
  const W = (tx1 - tx0 + 1) * TILE;
  const H = (ty1 - ty0 + 1) * TILE;
  const elev = new Float32Array(W * H);
  const jobs = [];
  for (let ty = ty0; ty <= ty1; ty++)
    for (let tx = tx0; tx <= tx1; tx++)
      jobs.push(async () => {
        const png = await fetchBuf(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${tx}/${ty}.png`);
        const { data } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
        for (let y = 0; y < TILE; y++)
          for (let x = 0; x < TILE; x++) {
            const i = (y * TILE + x) * 3;
            const e = data[i] * 256 + data[i + 1] + data[i + 2] / 256 - 32768;
            elev[((ty - ty0) * TILE + y) * W + (tx - tx0) * TILE + x] = e;
          }
      });
  // small concurrency pool
  let n = 0;
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (jobs.length) {
        await jobs.shift()();
        n++;
      }
    }),
  );
  console.log(`✓ ${n} elevation tiles`);

  const ox = x0 - tx0 * TILE;
  const oy = y0 - ty0 * TILE;
  const cell = (156543.03 * Math.cos((CENTER.lat * Math.PI) / 180)) / 2 ** Z; // metres per pixel
  const zf = 2.2; // vertical exaggeration
  const az = (315 * Math.PI) / 180;
  const zen = ((90 - 38) * Math.PI) / 180;
  const at = (x, y) => elev[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];
  const out = Buffer.alloc(SIZE * SIZE * 3);
  // palette: deep navy shadows → steel-blue lit ridges
  const dark = [3, 5, 10];
  const lit = [70, 100, 150];
  for (let y = 0; y < SIZE; y++)
    for (let x = 0; x < SIZE; x++) {
      const X = x + ox;
      const Y = y + oy;
      const a = at(X - 1, Y - 1), b = at(X, Y - 1), c = at(X + 1, Y - 1);
      const d = at(X - 1, Y), f = at(X + 1, Y);
      const g = at(X - 1, Y + 1), h = at(X, Y + 1), i = at(X + 1, Y + 1);
      const dzdx = (c + 2 * f + i - (a + 2 * d + g)) / (8 * cell);
      const dzdy = (g + 2 * h + i - (a + 2 * b + c)) / (8 * cell);
      const slope = Math.atan(zf * Math.hypot(dzdx, dzdy));
      const aspect = Math.atan2(dzdy, -dzdx);
      let hs = Math.cos(zen) * Math.cos(slope) + Math.sin(zen) * Math.sin(slope) * Math.cos(az - aspect);
      hs = Math.max(0, hs);
      const e = at(X, Y);
      const en = Math.min(1, Math.max(0, (e - 250) / 1100)); // valley floor ~300 m, ridges ~1300 m
      // Flat ground sits at a dark base; only slopes facing the light brighten, shadowed slopes go near-black.
      const flat = Math.cos(zen);
      const t = Math.min(1, Math.max(0, 0.16 + 1.9 * (hs - flat) + 0.22 * en));
      const o = (y * SIZE + x) * 3;
      for (let k = 0; k < 3; k++) out[o + k] = Math.round(dark[k] + (lit[k] - dark[k]) * t);
    }
  await mkdir(path.join(ROOT, "public/map"), { recursive: true });
  await sharp(out, { raw: { width: SIZE, height: SIZE, channels: 3 } })
    .resize(OUT_SIZE, OUT_SIZE)
    .webp({ quality: 72 })
    .toFile(path.join(ROOT, "public/map/valley-relief.webp"));
  console.log(`✓ public/map/valley-relief.webp (${OUT_SIZE}px, from ${SIZE}px)`);
}

// ---------- 2. Vector overlay ----------
const NE = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/";
async function loadNE(name) {
  const p = path.join(GEO_DIR, `${name}.geojson`);
  if (!(await exists(p))) {
    await mkdir(GEO_DIR, { recursive: true });
    await writeFile(p, await fetchBuf(NE + name + ".geojson"));
  }
  return JSON.parse(await readFile(p, "utf8")).features;
}

const lines = (g) => (!g ? [] : g.type === "LineString" ? [g.coordinates] : g.type === "MultiLineString" ? g.coordinates : []);

/** Project a line, split it where it leaves the (padded) frame, return SVG path data. */
function toPath(coords) {
  const pad = 120;
  const inside = ([x, y]) => x > -pad && y > -pad && x < OUT_SIZE + pad && y < OUT_SIZE + pad;
  const runs = [];
  let cur = [];
  for (const [lon, lat] of coords) {
    const p = P(lon, lat);
    if (inside(p)) cur.push(p);
    else if (cur.length) {
      cur.push(p);
      runs.push(cur);
      cur = [];
    }
  }
  if (cur.length) runs.push(cur);
  return runs
    .filter((r) => r.length > 1)
    .map((r) => r.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(""))
    .join("");
}

async function vectors() {
  const roads = await loadNE("ne_10m_roads");
  const keepMajor = new Set(["81", "64", "66"]);
  const keepUS = new Set(["33", "250", "340", "211", "522", "11", "29", "50", "220", "60", "55", "15", "17", "7"]);
  const interstates = {};
  const highways = [];
  for (const f of roads) {
    const { type, name } = f.properties;
    const isI = type === "Major Highway" && keepMajor.has(name);
    const isUS = (type === "Secondary Highway" || type === "Major Highway") && keepUS.has(name);
    if (!isI && !isUS) continue;
    const d = lines(f.geometry).map(toPath).join("");
    if (!d) continue;
    if (isI) interstates[name] = (interstates[name] ?? "") + d;
    else highways.push(d);
  }

  const rivers = [];
  for (const f of await loadNE("ne_10m_rivers_north_america")) {
    const n = f.properties.name ?? "";
    if (!/Shenandoah|^North$|^South$|Potomac|Rapidan|James|Cowpasture|Calfpasture|Jackson|Maury/.test(n)) continue;
    const d = lines(f.geometry).map(toPath).join("");
    if (d) rivers.push(d);
  }

  const states = [];
  for (const f of await loadNE("ne_10m_admin_1_states_provinces_lines")) {
    if (f.properties.adm0_name && f.properties.adm0_name !== "United States of America") continue;
    const d = lines(f.geometry).map(toPath).join("");
    if (d) states.push(d);
  }

  // Reference towns (map context only). Coordinates from USGS GNIS.
  const towns = [
    ["Staunton", 38.1496, -79.0717],
    ["Waynesboro", 38.0685, -78.8895],
    ["Charlottesville", 38.0293, -78.4767],
    ["Luray", 38.6654, -78.4594],
    ["Front Royal", 38.9182, -78.1944],
    ["Woodstock", 38.8818, -78.5056],
    ["Winchester", 39.1857, -78.1633],
    ["Lexington", 37.784, -79.4428],
    ["Elkton", 38.4079, -78.6236],
    ["Bridgewater", 38.3821, -78.9767],
    ["New Market", 38.6479, -78.6714],
    ["Monterey", 38.4123, -79.5806],
    ["Franklin", 38.6429, -79.3317],
  ].map(([name, lat, lon]) => {
    const [x, y] = P(lon, lat);
    const miles = Math.hypot(x - OUT_SIZE / 2, y - OUT_SIZE / 2) / (pxPerMileZ * scale);
    return { name, x: +x.toFixed(1), y: +y.toFixed(1), miles: Math.round(miles) };
  });

  // Where to drop interstate shields: the point of each route nearest a target distance from centre.
  const shield = (name, targetMiles, side) => {
    const d = interstates[name];
    if (!d) return null;
    const pts = [...d.matchAll(/[ML]([\d.-]+) ([\d.-]+)/g)].map((m) => [+m[1], +m[2]]);
    const c = OUT_SIZE / 2;
    const r = targetMiles * pxPerMileZ * scale;
    let best = null;
    for (const p of pts) {
      if (side && !side(p)) continue;
      const err = Math.abs(Math.hypot(p[0] - c, p[1] - c) - r);
      if (!best || err < best.err) best = { err, p };
    }
    return best && { name, x: +best.p[0].toFixed(1), y: +best.p[1].toFixed(1) };
  };
  const shields = [
    shield("81", 30, ([x, y]) => x > OUT_SIZE / 2 && y < OUT_SIZE / 2),
    shield("81", 44, ([x, y]) => x < OUT_SIZE / 2 && y > OUT_SIZE / 2),
    shield("64", 30, ([x, y]) => x > OUT_SIZE / 2 && y > OUT_SIZE / 2),
    shield("66", 62),
  ].filter(Boolean);

  const data = {
    _source:
      "Generated by scripts/build-service-map.mjs. Roads, rivers, state lines: Natural Earth (public domain). Elevation: AWS Terrain Tiles (USGS/SRTM).",
    size: OUT_SIZE,
    pxPerMile: +(pxPerMileZ * scale).toFixed(4),
    center: [OUT_SIZE / 2, OUT_SIZE / 2],
    interstates: Object.entries(interstates).map(([name, d]) => ({ name, d })),
    highways,
    rivers,
    states,
    towns,
    shields,
  };
  await writeFile(path.join(ROOT, "src/data/service-map.json"), JSON.stringify(data));
  console.log(
    `✓ src/data/service-map.json — ${data.interstates.length} interstates, ${highways.length} highways, ${rivers.length} rivers, ${states.length} state lines, ${towns.length} towns (${data.pxPerMile} px/mi)`,
  );
}

const only = process.argv[2];
if (only !== "vectors") await relief();
if (only !== "relief") await vectors();
