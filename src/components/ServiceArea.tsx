import Image from "next/image";
import { site } from "@/site.config";
import map from "@/data/service-map.json";
import { QuoteLink } from "./QuoteLink";
import { Reveal } from "./Reveal";
import { ArrowRight, PinIcon } from "./icons";

// Real geography: shaded relief from open elevation data + Natural Earth roads/rivers/state lines,
// all projected into one 1600×1600 frame centred on Harrisonburg (see scripts/build-service-map.mjs).
const S = map.size;
const [CX, CY] = map.center;
const R = site.serviceRadiusMiles * map.pxPerMile;

// Which reference towns to label, and which side of the dot the label sits on (tuned to avoid collisions).
// `desk` labels only show from tablet up — phones get a decluttered set.
const TOWN_LABELS: Record<string, { side: "l" | "r" | "b"; desk?: boolean }> = {
  Staunton: { side: "l" },
  Waynesboro: { side: "l", desk: true },
  Charlottesville: { side: "r" },
  Luray: { side: "r" },
  "Front Royal": { side: "l" },
  Woodstock: { side: "l", desk: true },
  Winchester: { side: "r" },
  Monterey: { side: "l", desk: true },
  Franklin: { side: "l" },
};
// Shields hidden on phones (they'd crowd town labels at that scale).
const DESK_SHIELDS = new Set([1, 3]);

/** Places an HTML label at a map coordinate. --k = rendered px per map unit (slice ⇒ the larger axis scale). */
function At({ x, y, className = "", children }: { x: number; y: number; className?: string; children: React.ReactNode }) {
  return (
    <div className={`map-at ${className}`} style={{ "--x": x, "--y": y } as React.CSSProperties}>
      {children}
    </div>
  );
}

/** Labels live in HTML (not SVG text) so they stay a constant, readable size at every screen width. */
function MapLabels() {
  return (
    <div className="map-labels pointer-events-none absolute inset-0" aria-hidden="true">
      {/* top of the ring on wider screens; bottom on phones so the legend never covers it */}
      <At x={CX} y={CY - R} className="map-ring map-desk">≈ {site.serviceRadiusMiles} miles</At>
      <At x={CX} y={CY + R} className="map-ring map-phone">≈ {site.serviceRadiusMiles} miles</At>
      <At x={CX} y={CY - R / 2} className="map-ring map-ring--inner map-desk">{site.serviceRadiusMiles / 2} mi</At>
      {map.shields.map((sh, i) => (
        <At key={i} x={sh.x} y={sh.y} className={`map-shield ${DESK_SHIELDS.has(i) ? "map-desk" : ""}`}>
          {sh.name}
        </At>
      ))}
      {map.towns
        .filter((t) => t.name in TOWN_LABELS)
        .map((t) => (
          <At
            key={t.name}
            x={t.x}
            y={t.y}
            className={`map-town map-town--${TOWN_LABELS[t.name].side} ${TOWN_LABELS[t.name].desk ? "map-desk" : ""} ${t.miles > site.serviceRadiusMiles ? "map-town--out" : ""}`}
          >
            <span className="map-town__dot" />
            <span className="map-town__name">{t.name}</span>
          </At>
        ))}
      <At x={CX} y={CY} className="map-home">
        <span className="map-home__name">Harrisonburg</span>
        <span className="map-home__sub">Home base</span>
      </At>
    </div>
  );
}

function ValleyMap() {
  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-labelledby="map-title map-desc"
    >
      <title id="map-title">Service area map</title>
      <desc id="map-desc">
        Map of the Shenandoah Valley centred on Harrisonburg, Virginia. A shaded zone about {site.serviceRadiusMiles * 2} miles across shows where Noah
        comes to you. It is strongest around Harrisonburg and fades toward the edge, roughly {site.serviceRadiusMiles} miles out.
      </desc>
      <defs>
        {/* Strongest at home base, fading out to the ~50-mile edge */}
        <radialGradient id="zone" cx={CX} cy={CY} r={R} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2E6BFF" stopOpacity="0.62" />
          <stop offset="0.3" stopColor="#2E6BFF" stopOpacity="0.44" />
          <stop offset="0.65" stopColor="#2E6BFF" stopOpacity="0.22" />
          <stop offset="0.9" stopColor="#2E6BFF" stopOpacity="0.08" />
          <stop offset="1" stopColor="#2E6BFF" stopOpacity="0.03" />
        </radialGradient>
        {/* Darken everything beyond the service edge so the zone reads first */}
        <radialGradient id="beyond" cx={CX} cy={CY} r={R * 1.9} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#07090D" stopOpacity="0" />
          <stop offset={1 / 1.9} stopColor="#07090D" stopOpacity="0.1" />
          <stop offset="1" stopColor="#07090D" stopOpacity="0.78" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <rect width={S} height={S} fill="url(#beyond)" />

      {/* rivers + state lines + roads */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
        {map.rivers.map((d, i) => (
          <path key={`r${i}`} d={d} stroke="#5AA2FF" strokeOpacity="0.32" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        ))}
        {map.states.map((d, i) => (
          <path key={`s${i}`} d={d} stroke="#EAF2FF" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
        ))}
        {map.highways.map((d, i) => (
          <path key={`h${i}`} d={d} stroke="#8A97AB" strokeOpacity="0.32" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        ))}
        {map.interstates.map((r) => (
          <g key={r.name}>
            <path d={r.d} stroke="#07090D" strokeOpacity="0.7" strokeWidth="4.5" vectorEffect="non-scaling-stroke" />
            <path d={r.d} stroke="#CFD8E6" strokeOpacity="0.75" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </g>

      {/* service zone */}
      <g className="map-zone">
        <circle cx={CX} cy={CY} r={R} fill="url(#zone)" />
        <circle cx={CX} cy={CY} r={R / 2} fill="none" stroke="#5AA2FF" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" />
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#5AA2FF" strokeOpacity="0.85" strokeWidth="2" strokeDasharray="10 8" vectorEffect="non-scaling-stroke" />
      </g>
      {/* home base */}
      <circle cx={CX} cy={CY} r={R * 0.16} fill="#5AA2FF" opacity="0.35" filter="url(#glow)" />
      <circle className="pulse-ring" cx={CX} cy={CY} r={R * 0.16} fill="none" stroke="#5AA2FF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <circle className="pulse-ring" style={{ animationDelay: "1.5s" }} cx={CX} cy={CY} r={R * 0.16} fill="none" stroke="#5AA2FF" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <circle cx={CX} cy={CY} r="13" fill="#2E6BFF" stroke="#EAF2FF" strokeWidth="5" />
    </svg>
  );
}

export function ServiceArea() {
  return (
    <section aria-labelledby="area-heading" className="relative overflow-hidden border-t border-line bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow">Service area</p>
            <h2 id="area-heading" className="display mt-4 text-5xl text-foam sm:text-7xl">
              Harrisonburg &amp; ~{site.serviceRadiusMiles} miles around
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-md text-lg leading-relaxed text-muted">
              I come to you across the central Shenandoah Valley — roughly a {site.serviceRadiusMiles * 2}-mile-wide area centred on {site.city}. All I need is a hose
              spigot and an outlet, or drop your vehicle off at my place.
            </p>
            {site.serviceTowns.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {site.serviceTowns.map((t) => (
                  <li key={t} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-foam">
                    <PinIcon className="h-3.5 w-3.5 text-blue-glow" /> {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="overflow-hidden rounded-3xl border border-line bg-[#05080f] shadow-[0_40px_120px_-40px_rgba(46,107,255,0.45)]">
            <div className="map-frame relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[16/10]">
              <Image src="/map/valley-relief.webp" alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
              <ValleyMap />
              <MapLabels />

              {/* legend */}
              <div className="pointer-events-none absolute left-3 top-3 rounded-2xl border border-white/10 bg-ink/70 px-4 py-3 backdrop-blur-md sm:left-5 sm:top-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-foam">Where I come to you</p>
                <div className="mt-2 h-2 w-36 rounded-full bg-[linear-gradient(90deg,rgba(46,107,255,0.95),rgba(46,107,255,0.45)_45%,rgba(46,107,255,0.08))] sm:w-44" aria-hidden="true" />
                <div className="mt-1.5 flex w-36 justify-between text-[10px] font-semibold text-muted sm:w-44">
                  <span>Home base</span>
                  <span>~{site.serviceRadiusMiles} mi</span>
                </div>
              </div>

              {/* "farther than this?" — overlays the map's empty corner on wide screens */}
              <div className="absolute bottom-5 right-5 hidden max-w-xs rounded-2xl border border-white/10 bg-ink/75 p-5 backdrop-blur-md xl:block">
                <FartherCallout />
              </div>

              <p className="pointer-events-none absolute bottom-2 left-3 text-[9px] text-foam/45 sm:left-5">
                Elevation: USGS/SRTM via AWS Terrain Tiles · Roads &amp; rivers: Natural Earth
              </p>
            </div>

            {/* phones + tablets: callout sits under the map so it never covers the zone */}
            <div className="border-t border-line bg-panel p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-7 xl:hidden">
              <FartherCallout row />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FartherCallout({ row = false }: { row?: boolean }) {
  return (
    <>
      <div>
        <p className="display text-3xl text-foam">Farther than this?</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">Request a quote and I&apos;ll find a way to service you.</p>
      </div>
      <QuoteLink className={`btn btn-primary gloss mt-4 min-h-11 w-full shrink-0 px-5 text-sm sm:w-auto ${row ? "sm:mt-0" : ""}`}>
        Request a quote <ArrowRight />
      </QuoteLink>
    </>
  );
}
