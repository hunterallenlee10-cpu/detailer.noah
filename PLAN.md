# Noah's Detailing — Build Plan

Spec site by Lee Systems Co. Goal: looks like a $5k site on the first scroll, fast on a phone, 100% honest.

## Sitemap

| Route | Purpose | H1 |
|---|---|---|
| `/` | Long-scroll homepage (sections below) | "Noble & Mobile." |
| `/services` | Full menu, one detailed block per service, "Add to quote" → `/book?service=…` | "Detailing services" |
| `/mobile-detailing-harrisonburg-va` | Local SEO landing page (keyword in slug, title, H1, meta, body, alt) | "Mobile Detailing in Harrisonburg, VA" |
| `/book` | Full-page multi-step quote form | "Get a free quote" |
| `/about` | Noah's story, longer | "Meet Noah" |
| 404 | "Looks like this one needs a wash." | same |
| `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `opengraph-image`, `icon.svg`, `apple-icon` | SEO plumbing | — |

### Homepage section order
1. Hero — "Noble & Mobile.", letter stagger (CSS, runs before hydration), one-time gloss sweep, re-sweep on hover
2. Vehicle marquee — outlined condensed type, two rows, pause on hover
3. Before / After — interactive sliders when `*-before/*-after` pairs exist, else an "after" gallery
4. Services — 7 tiles on a light section, SVG stroke draw-in + gloss on hover, "Add to quote"
5. How it works — 3 steps, connecting line scales with scroll
6. Proof — Noah's own thank-you line, IG-style work grid, `<Reviews />` (renders nothing while empty)
7. More than cars — Boats · Tractors & farm equipment · Trailers, expanding panels
8. Quote form — 5-step rebuild of his Google Form
9. Meet Noah — split layout + pull quote (light section)
10. Shop & merch — merch panel + Showcar Care code NOAH (copy button + toast)
11. Service area — stylized SVG valley map, pulsing ring on Harrisonburg
12. FAQ — accordion + FAQPage JSON-LD (light section)
13. Final CTA band — blue gradient, CSS water-bead texture
14. Footer

## Components (`src/components`)
`Header`, `MobileBar`, `Footer`, `Logo` (badge + wordmark), `Badge`, `Hero`, `Marquee`,
`BeforeAfter` + `CompareSlider`, `ServicesGrid` + `ServiceIcon`, `HowItWorks`, `Proof` + `WorkGrid` + `Reviews`,
`MoreThanCars`, `QuoteForm` (multi-step) + `quote-store`, `MeetNoah`, `ShopMerch` + `CopyCode`,
`ServiceArea` (SVG map), `Faq`, `FinalCta`, `Photo` (next/image or abstract placeholder), `Reveal`,
`Providers` (LazyMotion + MotionConfig reducedMotion="user" + Lenis), `JsonLd`, `Toast`, `icons`.

Data lives in `src/site.config.ts` (every business fact) and `src/data/*` (services, vehicles, faq, work slots,
photos — generated, reviews — empty).

## Design tokens
```
--ink #07090D  --panel #0E131B  --line #1C2533  --blue #2E6BFF  --blue-glow #5AA2FF
--blue-deep #1A4FD6 (blue text on light bg, AA)  --foam #EAF2FF  --muted #8A97AB
--chrome: linear-gradient(#CFD8E6 → #8FA3BF)
```
- Display: Barlow Condensed 800/900 *italic* (true italic, echoes the logo), uppercase, tight leading.
- Body: Manrope.
- Hero headline `clamp(3.5rem, 13vw, 7.5rem)`.
- Contrast: blue-glow for blue text on dark, blue-deep for blue text on foam; white on `--blue` buttons (4.6:1).

## Animation plan
| Where | What | How |
|---|---|---|
| Hero | letter stagger, gloss sweep across headline + photo, re-sweep on hover | CSS keyframes (transform/opacity; sweep is a translated gradient band) |
| Sections | fade/rise on enter, once | Motion `whileInView` |
| Marquee | infinite ticker, pause on hover | CSS translateX |
| Services | icon stroke draw-in, gloss band | CSS on hover/focus |
| How it works | connector line grows with scroll | Motion `useScroll` → `scaleY/scaleX` |
| Before/after | drag / arrow keys / touch | pointer capture, `role="slider"` |
| Quote form | step transitions, progress bar, animated check | Motion + `scaleX` |
| Service area | pulsing radius ring | CSS scale/opacity |
| Smooth scroll | Lenis | disabled on `prefers-reduced-motion` |

`prefers-reduced-motion`: Lenis off, sweeps/marquee/pulse off, Motion transforms off (opacity only) — content always visible.

## Honesty rules baked in
No reviews/ratings, no prices except merch, no third-party logos, no stock car photos, empty config fields hide their UI,
no `aggregateRating` / empty phone/address in JSON-LD. The demo-mode form never pretends a request was sent.
