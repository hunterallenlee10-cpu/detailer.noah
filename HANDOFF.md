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

## Swapping in Noah's photos

1. Drop originals into `./source-photos/`, named like the checklist (`f150-noahs-truck.jpg`, `jeep-extraction-before.jpg` / `jeep-extraction-after.jpg`, …).
2. Run `npm run images`. It auto-orients, crops 16:9 / 4:5 / 1:1, writes WebP to `/public/work/`, and regenerates `src/data/photos.ts` with alt text + blur placeholders.
3. Captions and alt text come from `src/data/photo-meta.json`. The script warns about any file it has no metadata for, so add an entry there and re-run.
4. `*-before` + `*-after` pairs automatically turn the homepage "Work" section into drag sliders (up to 4). The hero uses `f150-noahs-truck`.
5. Until a photo exists its slot shows an abstract "clear coat" placeholder (in `npm run dev` it also shows a yellow note naming the file it wants). Placeholders never pretend to be his work.
6. Replace `/public/brand/*.svg` and the `Badge` component with Noah's original logo files if he has them.

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
- [ ] **Exact towns served** (`serviceTowns`): shows chips on the map section + SEO page and adds them to `areaServed`
- [ ] **Real domain** (`domain`): currently `https://noahsdetailing.example`
- [ ] **Current merch prices** (`merch`): $38 hoodie / $26 tee are from an older story
- [ ] **Permission to name the farm client** (`farmClientName`): currently says "farm trailers" generically
- [ ] **Photos**: the 16 posts in the photo checklist, saved into `./source-photos/`
- [ ] **Original logo files** (badge + wordmark) to replace the recreated SVGs
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
```

Last QA run (spec build, placeholder photos):
- **Build:** `npm run build`, ESLint and `tsc` all clean.
- **Layout:** no horizontal overflow at 360 / 390 / 768 / 1024 / 1440.
- **Interactions:** 25/25 checks pass (skip link, nav, Add to quote, all 5 form steps + validation, photo upload/remove, phone formatting, FAQ, copy code, JSON-LD).
- **Lighthouse (mobile, local):**

  | Page | Perf | A11y | Best Practices | SEO |
  |---|---|---|---|---|
  | Home | 93 | 100 | 100 | 100 |
  | Services | 95 | 100 | 100 | 100 |
  | Harrisonburg page | 95 | 100 | 100 | 100 |
  | Book | 97 | 100 | 100 | 100 |
  | About | 96 | 100 | 100 | 100 |

  CLS was 0 on every page. Re-run Lighthouse after real photos are added, because the hero photo becomes the LCP image (it's already preloaded with `fetchPriority="high"`).
