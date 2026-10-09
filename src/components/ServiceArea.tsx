import { site } from "@/site.config";
import { QuoteLink } from "./QuoteLink";
import { Reveal } from "./Reveal";
import { ArrowRight, PinIcon } from "./icons";

// Stylized (not to scale) Shenandoah Valley: ridges run SW→NE, Harrisonburg sits on the valley floor.
type Pt = [number, number];

function ridge(a: Pt, b: Pt, offset: number, amp: number, freq: number, phase: number) {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const pts: string[] = [];
  const N = 48;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const w = Math.sin(t * Math.PI * freq + phase) * amp + Math.sin(t * Math.PI * freq * 2.7 + phase * 1.3) * amp * 0.35;
    const x = x1 + (x2 - x1) * t + nx * (offset + w);
    const y = y1 + (y2 - y1) * t + ny * (offset + w);
    pts.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join("");
}

const HBG: Pt = [380, 300];

function ValleyMap() {
  const west = Array.from({ length: 7 }, (_, i) => ridge([-40, 420], [560, -40], -110 - i * 14, 10 + i, 3.2, i * 0.6));
  const east = Array.from({ length: 7 }, (_, i) => ridge([200, 600], [860, 140], 60 + i * 14, 9 + i, 3.6, i * 0.5 + 1));
  const massanutten = Array.from({ length: 4 }, (_, i) => ridge([430, 250], [640, 90], -4 + i * 7, 3 + i * 0.6, 2, i));
  return (
    <svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-labelledby="map-title map-desc">
      <title id="map-title">Service area map</title>
      <desc id="map-desc">Stylized map of the Shenandoah Valley with Harrisonburg, Virginia marked and a ring showing the surrounding service area.</desc>
      <defs>
        <radialGradient id="area-fill">
          <stop offset="0" stopColor="#2E6BFF" stopOpacity="0.35" />
          <stop offset="1" stopColor="#2E6BFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="valley" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0E131B" />
          <stop offset="0.5" stopColor="#111a28" />
          <stop offset="1" stopColor="#0E131B" />
        </linearGradient>
      </defs>
      <rect width="800" height="560" fill="url(#valley)" />
      <g fill="none" strokeLinecap="round">
        {west.map((d, i) => (
          <path key={`w${i}`} d={d} stroke="#5AA2FF" strokeOpacity={0.08 + i * 0.025} strokeWidth="1.2" />
        ))}
        {east.map((d, i) => (
          <path key={`e${i}`} d={d} stroke="#5AA2FF" strokeOpacity={0.24 - i * 0.025} strokeWidth="1.2" />
        ))}
        {massanutten.map((d, i) => (
          <path key={`m${i}`} d={d} stroke="#5AA2FF" strokeOpacity="0.22" strokeWidth="1.1" />
        ))}
        {/* I-81 runs the length of the valley */}
        <path d="M120 560 C 250 420, 300 360, 380 300 S 560 150, 760 0" stroke="#8A97AB" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="2 7" />
      </g>

      <g style={{ fontFamily: "var(--font-body), sans-serif" }} fontSize="11" fontWeight="700" letterSpacing="3" fill="#8A97AB">
        <text transform="translate(110 210) rotate(-37)">ALLEGHENY MOUNTAINS</text>
        <text transform="translate(560 430) rotate(-35)">BLUE RIDGE</text>
        <text transform="translate(545 228) rotate(-38)" fill="#5AA2FF" fillOpacity="0.7">SHENANDOAH VALLEY</text>
        <text x="150" y="530" fontSize="10" letterSpacing="2" fillOpacity="0.8">I-81</text>
      </g>

      {/* service radius */}
      <circle cx={HBG[0]} cy={HBG[1]} r="150" fill="url(#area-fill)" />
      <circle cx={HBG[0]} cy={HBG[1]} r="150" fill="none" stroke="#5AA2FF" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="4 6" />
      <circle className="pulse-ring" cx={HBG[0]} cy={HBG[1]} r="60" fill="none" stroke="#5AA2FF" strokeWidth="2" />
      <circle className="pulse-ring" style={{ animationDelay: "1.5s" }} cx={HBG[0]} cy={HBG[1]} r="60" fill="none" stroke="#5AA2FF" strokeWidth="2" />
      <circle cx={HBG[0]} cy={HBG[1]} r="9" fill="#2E6BFF" stroke="#EAF2FF" strokeWidth="3" />
      <g style={{ fontFamily: "var(--font-display-face), sans-serif" }} fontStyle="italic" fontWeight="800">
        <text x={HBG[0] + 20} y={HBG[1] + 7} fontSize="30" fill="#EAF2FF" letterSpacing="0.5">
          HARRISONBURG
        </text>
        <text x={HBG[0] + 22} y={HBG[1] + 28} fontSize="13" fill="#5AA2FF" letterSpacing="2" fontStyle="normal" style={{ fontFamily: "var(--font-body), sans-serif" }} fontWeight="700">
          VIRGINIA · &amp; SURROUNDING AREAS
        </text>
      </g>
    </svg>
  );
}

export function ServiceArea() {
  return (
    <section aria-labelledby="area-heading" className="relative overflow-hidden border-t border-line bg-ink py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Service area</p>
          <h2 id="area-heading" className="display mt-4 text-6xl text-foam sm:text-7xl">
            Harrisonburg &amp; surrounding areas
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            I come to you around {site.city} and the surrounding Valley. All I need is a hose spigot and an outlet — or drop your vehicle off at my place.
          </p>
          {site.serviceTowns.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {site.serviceTowns.map((t) => (
                <li key={t} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-foam">
                  <PinIcon className="h-3.5 w-3.5 text-blue-glow" /> {t}
                </li>
              ))}
            </ul>
          )}
          <QuoteLink className="btn btn-primary gloss mt-8">
            Check if I come to you <ArrowRight />
          </QuoteLink>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line sm:aspect-[10/7]">
            <ValleyMap />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
