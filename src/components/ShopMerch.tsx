import { site } from "@/site.config";
import { Badge } from "./Badge";
import { CopyCode } from "./CopyCode";
import { Reveal } from "./Reveal";
import { ArrowRight, InstagramIcon } from "./icons";

function Garment({ kind }: { kind: "hoodie" | "tee" }) {
  // Simple garment silhouette with the badge on the back (no product photo yet).
  const path =
    kind === "hoodie"
      ? "M66 40Q70 6 100 6Q130 6 134 40L168 52Q180 57 183 70L197 196Q198 206 188 207L174 208Q166 208 165 200L158 98L161 222Q161 232 151 232H49Q39 232 39 222L42 98L35 200Q34 208 26 208L12 207Q2 206 3 196L17 70Q20 57 32 52Z"
      : "M74 28Q100 42 126 28L172 46Q182 50 186 60L196 96L164 106L162 228Q162 238 152 238H48Q38 238 38 228L36 106L4 96L14 60Q18 50 28 46Z";
  return (
    <svg viewBox="0 0 200 250" className="h-full w-full" aria-hidden="true">
      <path d={path} fill="#0B0F15" stroke="#1C2533" strokeWidth="2" />
      {kind === "hoodie" && (
        <>
          <path d="M70 42Q100 62 130 42" fill="none" stroke="#1C2533" strokeWidth="2" />
          <path d="M40 214H160M4 192H36M164 192H196" fill="none" stroke="#1C2533" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

export function ShopMerch() {
  const { partnerDiscount: d } = site;
  return (
    <section aria-labelledby="shop-heading" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow">Shop</p>
          <h2 id="shop-heading" className="display mt-4 text-6xl text-foam sm:text-8xl">
            Rep it. <span className="text-outline">Use it.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-panel p-7 sm:p-10">
            <p className="eyebrow">Rep the brand</p>
            <h3 className="display mt-3 text-5xl text-foam">Noah&apos;s Detailing apparel</h3>
            <p className="mt-3 max-w-md text-muted">Black, small &ldquo;Noah&apos;s Detailing&rdquo; on the chest, the big blue badge on the back. Every piece supports the business.</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {site.merch.map((item, i) => (
                <div key={item.item} className="rounded-2xl bg-ink p-4">
                  <div className="relative mx-auto aspect-[4/5] w-full max-w-[200px]">
                    <Garment kind={i === 0 ? "hoodie" : "tee"} />
                    <Badge className="absolute left-1/2 top-[30%] h-[38%] w-auto -translate-x-1/2" title={`Badge logo on the back of the ${item.item}`} />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="font-bold text-foam">{item.item}</span>
                    <span className="display text-2xl text-blue-glow">${item.price}</span>
                  </div>
                </div>
              ))}
            </div>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-primary gloss mt-8 w-full sm:w-auto">
              <InstagramIcon /> DM to order
              <span className="sr-only">(opens Instagram in a new tab)</span>
            </a>
          </Reveal>

          <Reveal delay={0.1} className="relative flex flex-col overflow-hidden rounded-3xl border border-line bg-[radial-gradient(90%_70%_at_100%_0%,rgba(46,107,255,0.28),transparent_60%),var(--panel)] p-7 sm:p-10">
            <p className="eyebrow">Products I use</p>
            <h3 className="display mt-3 text-5xl text-foam">
              {d.percent}% off at {d.brand}
            </h3>
            <p className="mt-3 max-w-md text-muted">
              Use my code to get {d.percent}% off all {d.brand} products — the same stuff I use on the job.
            </p>
            <p aria-hidden="true" className="display text-outline mt-8 select-none text-[6.5rem] leading-none sm:text-[8rem]">
              {d.percent}% off
            </p>
            <div className="mt-auto space-y-4 pt-8">
              <CopyCode code={d.code} />
              <a href={d.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full">
                Shop {d.url.replace(/^https?:\/\//, "")} <ArrowRight />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </div>
            <div className="mt-10 border-t border-line pt-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Pro-grade products I trust</p>
              <p className="mt-3 text-foam/90">Chemical Guys · Meguiar&apos;s · Adam&apos;s Polishes · Ryobi</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
