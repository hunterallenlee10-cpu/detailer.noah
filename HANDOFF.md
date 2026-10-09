# Noah's Detailing — Handoff

Spec site built by Lee Systems Co. Next.js 16 (App Router) + TypeScript + Tailwind v4 + Motion + Lenis. Static, deploys to Vercel with zero config.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (must pass clean)
npm run lint && npm run typecheck
```

## What was built

| Route | What's there |
|---|---|
| `/` | Hero ("Noble & Mobile." letter stagger + gloss light-sweep), vehicle marquee, before/after sliders (or an "after" gallery until pairs exist), 7 service tiles with "Add to quote", 3-step timeline, Noah's thank-you line + IG work grid, More than cars, 5-step quote form, Meet Noah, merch + Showcar Care code, SVG service-area map, FAQ, final CTA |
| `/services` | One detailed block per service, each with "Add to quote" → `/book?service=…` |
| `/mobile-detailing-harrisonburg-va` | Local SEO landing page (keyword in slug, title, H1, meta, body, alt text) + local FAQ |
| `/book` | Full-page quote form |
| `/about` | Noah's story + timeline |
| 404 | "Looks like this one needs a wash." |

SEO plumbing: `AutoWash` JSON-LD (no rating, no price range, phone/email only when filled), FAQPage + Breadcrumb JSON-LD, OG/Twitter image (`next/og`), `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, favicon/apple/PWA icons from the badge.

## Photos

### Where they came from

- **17 of Noah's own photos** (16 posts + the headlight split into before/after). These are the first image of each post in the checklist, pulled from his public Instagram (@detailer.noah) at 1080px. They appear everywhere a vehicle or job is named: the Work section, IG grid, More than cars, Meet Noah, the services page and the Harrisonburg page. **Get Noah's OK before launch.** They're his photos, and a few show clients' cars and plates.
- Instagram only serves the first slide of a carousel without logging in. So the before/after carousels (minivan, Dart, Jeep) only have their first slide, and the **headlight post** (already a side-by-side) is the only slider pair. Ask Noah for the original before/after files and the Work section turns into up to 4 sliders automatically.
- **3 licensed stock images** used as atmosphere only, never captioned as his work (flagged `stock: true` in `photo-meta.json` and excluded from the work grids):
  | File | Used for | Source / license |
  |---|---|---|
  | `stock-hero-pressure-wash` | Homepage hero background (plate blurred, blue tint baked in) | Unsplash `photo-1520340356584-f9917d1eea6f`, Unsplash License (free commercial use, no attribution required) |
  | `stock-engine-bay` | Engine Bay Detail on `/services` | Unsplash `photo-1606577924006-27d39b132ae2`, Unsplash License |
  | `stock-interior` | Steam Clean & Shampoo on `/services` | StockSnap `SF6UIKA8HT`, CC0 |

  To use Noah's own truck as the hero instead, change `HERO_PHOTO` in `src/components/Hero.tsx` to `"f150-noahs-truck"`. Replace the two services stock images as soon as he has an engine-bay or seat-shampoo shot. Then just change `photo:` in `src/data/services.ts`.

### Adding or replacing photos

1. Drop originals into `./source-photos/`, named like the checklist (`f150-noahs-truck.jpg`, `jeep-extraction-before.jpg` / `jeep-extraction-after.jpg`, …). Originals are git-ignored. The processed WebP files in `/public/work/` are committed.
2. Run `npm run images`. It auto-orients, crops 16:9 / 4:5 / 1:1, writes content-hashed WebP to `/public/work/`, and regenerates `src/data/photos.ts` with alt text.
3. Captions and alt text come from `src/data/photo-meta.json`. If an automatic crop misses the vehicle, add `"focus": 0.4` (y) or `"focus": [0.6, 0.5]` (x, y) to that photo's entry and re-run.
4. `*-before` + `*-after` pairs automatically become drag sliders in the homepage "Work" section (1 pair: slider + 2 featured shots; 2–4 pairs: all sliders).
5. Any slot without a photo falls back to an abstract "clear coat" placeholder, never a stand-in car.
6. Replace `/public/brand/*.svg` and the `Badge` component with Noah's original logo files if he has them.

## Service-area map

The homepage map is real geography: shaded relief from open elevation data (AWS Terrain Tiles, from USGS/SRTM), plus Natural Earth roads, rivers and state lines (public domain). Everything is projected around Harrisonburg.

- The blue zone is `serviceRadiusMiles` (50 mi, about a 100-mile diameter) in `src/site.config.ts`. It's strongest at Harrisonburg and fades toward the edge. Change the number and the zone, ring labels, legend, FAQ answer, SEO page copy and the `GeoCircle` in the structured data all follow.
- Town labels are map context only. Which towns appear, and on which side of the dot, is set in `TOWN_LABELS` in `src/components/ServiceArea.tsx`. Phones show a decluttered set.
- "Farther than this? Request a quote and I'll find a way to service you." overlays the map on wide screens and sits below it on phones and tablets.
- To regenerate the art (different centre or extent), run `node scripts/build-service-map.mjs`. It writes `public/map/valley-relief.webp` and `src/data/service-map.json`.

## Smooth scrolling

Lenis runs site-wide (`src/components/SmoothScroll.tsx`):
- **Feel:** wheel and trackpad get a weighted glide (`lerp: 0.085`; lower is silkier, higher is snappier). Touch stays native.
- **In-page links:** `#quote`, or `/#work` while on the homepage, glide to the section just under the fixed header and update the URL.
- **Navigation:** momentum stops when you go to another page. Next decides where each page lands (top, a hash, or the Back-button position).
- **Mobile menu:** page scrolling is paused while it's open.
- **Code-driven scrolling:** quote buttons and form steps use `scrollToTarget()` in `src/lib/scroll.ts`, which goes through Lenis.
- **Reduced motion:** Lenis is off when the visitor's system asks for less motion.
- **Progress line:** a thin blue bar along the bottom of the header tracks how far down the page you are.

## Connecting the quote form

The form runs in **demo mode** until an endpoint is set. In demo mode it never claims a request was sent. Instead it sends people to Noah's Google Form or Instagram DM, with a "Copy my answers" button.

To go live, set one env var (Vercel → Project → Settings → Environment Variables):

```
NEXT_PUBLIC_QUOTE_ENDPOINT=https://formspree.io/f/xxxxxxx   # or an n8n webhook / Resend route
```

The form POSTs `multipart/form-data`: `firstName, lastName, phone, vehicle, services, address, dropOff, hoseSpigotAndOutlet, notes, _subject`, plus `photos` (up to 10 files). Any non-2xx response shows an error with Google Form + DM fallbacks. Formspree accepts this as-is. For n8n, use a Webhook node with "Binary data" enabled.

## Deploy to Vercel

1. Push this repo to GitHub, then go to vercel.com → **Add New Project** → import it. No settings needed.
2. Add `NEXT_PUBLIC_QUOTE_ENDPOINT` when the form backend is ready.
3. Add the real domain in Vercel → Domains, then update `domain` in `src/site.config.ts` (it drives canonical URLs, sitemap, OG and JSON-LD) and redeploy.
4. Submit `https://<domain>/sitemap.xml` in Google Search Console and request indexing for `/mobile-detailing-harrisonburg-va`.

## TODO — needs Noah's input

All business facts live in **`src/site.config.ts`**. Empty fields hide their UI automatically.

- [ ] **Phone** (`phone`): footer + JSON-LD appear once filled
- [ ] **Email** (`email`)
- [ ] **Service radius**: map + copy say about 50 miles (100-mile diameter). Confirm with Noah (`serviceRadiusMiles`)
- [ ] **Exact towns served** (`serviceTowns`): shows chips on the map section + SEO page and adds them to `areaServed`
- [ ] **Real domain** (`domain`): currently `https://noahsdetailing.example`
- [ ] **Merch**: $38 hoodie / $26 tee and the product mockups come from his Apparel story highlight (reposted Apr 1, 2025). Confirm prices are still current and which sizes are in stock (`merch` in `site.config.ts`, images in `/public/merch/`)
- [ ] **Permission to name the farm client** (`farmClientName`): currently says "farm trailers" generically
- [ ] **Photo permission + originals**: OK to use his Instagram photos; original before/after files (minivan, Dart, Jeep) for more sliders; an engine-bay and seat-shampoo shot to replace the stock images
- [ ] **Original logo files**: the badge is now redrawn to match his apparel logo (pill outline, truck, blue DETAILING band). Swap in his original vector file if he has one
- [ ] **Quote form endpoint** (`NEXT_PUBLIC_QUOTE_ENDPOINT`), or keep the Google Form fallback
- [ ] **Google Business Profile**: none found. Once live with real reviews, add them to `src/data/reviews.ts` (the `<Reviews />` block stays hidden while it's empty). Never fabricate.
- [ ] **Pricing**: the site is quote-only by design. Only add prices if Noah wants them public.
- [ ] **Insurance / licensing**: unknown, so the site doesn't mention it. Add only if true.
- [ ] Approve brand copy written in his voice, e.g. on `/about`: "Noble: doing the work right — every panel, every seat, every wheel."
- [ ] Optional: Lee Systems Co. URL for the footer credit (`credit.url`)

## QA scripts

```bash
npm run build && npx next start -p 3100 &
NODE_PATH=$(npm root -g) node scripts/qa-screenshots.mjs http://localhost:3100 360,390,768,1024,1440   # → /qa/*.png (convert to JPG before committing) + overflow check
REDUCED=1 NODE_PATH=$(npm root -g) node scripts/qa-screenshots.mjs http://localhost:3100 390          # reduced-motion pass
NODE_PATH=$(npm root -g) node scripts/qa-interactions.mjs http://localhost:3100                        # keyboard / form / JSON-LD checks
NODE_PATH=$(npm root -g) node scripts/qa-scroll.mjs http://localhost:3100                              # Lenis smooth-scroll checks
```

Last QA run (with real photos):
- **Build:** `npm run build`, ESLint and `tsc` all clean.
- **Layout:** no horizontal overflow at 360 / 390 / 768 / 1024 / 1440.
- **Interactions:** 25/25 checks pass (skip link, nav, Add to quote, all 5 form steps + validation, photo upload/remove, phone formatting, FAQ, copy code, JSON-LD).
- **Lighthouse (mobile, local):**

  | Page | Perf | A11y | Best Practices | SEO |
  |---|---|---|---|---|
  | Home | 88–93 | 100 | 100 | 100 |
  | Services | 96 | 100 | 100 | 100 |
  | Harrisonburg page | 97 | 100 | 100 | 100 |
  | Book | 93 | 100 | 100 | 100 |
  | About | 95–98 | 100 | 100 | 100 |

  These are warm runs. The first hit on a cold local server scores lower because `next start` optimizes each image on first request. Vercel caches optimized images at the edge. CLS was 0 everywhere. The hero photo is the LCP image (preloaded, `fetchPriority="high"`).
