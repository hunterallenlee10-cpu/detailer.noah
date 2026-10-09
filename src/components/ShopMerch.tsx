import { site } from "@/site.config";
import { MerchCard } from "./MerchCard";
import { CopyCode } from "./CopyCode";
import { Reveal } from "./Reveal";
import { ArrowRight, InstagramIcon } from "./icons";

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

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-panel p-6 sm:p-10 lg:col-span-7">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 bg-[radial-gradient(closest-side,rgba(46,107,255,0.22),transparent)]" aria-hidden="true" />
            <p className="eyebrow">Rep the brand</p>
            <h3 className="display mt-3 text-5xl text-foam sm:text-6xl">Noah&apos;s Detailing merch</h3>
            <blockquote className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
              &ldquo;Designed some hoodies with my new logo to help support my business. I also have a few t-shirts with the same design.&rdquo;
            </blockquote>
            <p className="mt-2 text-sm font-semibold text-foam/80">— {site.ownerFirstName}</p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {site.merch.map((m) => (
                <MerchCard key={m.item} {...m} />
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">Small &ldquo;Noah&apos;s Detailing&rdquo; on the chest, the full Noble &amp; Mobile badge on the back.</p>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-primary gloss shrink-0">
                <InstagramIcon /> DM to order
                <span className="sr-only">(opens Instagram in a new tab)</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative flex flex-col overflow-hidden rounded-3xl border border-line lg:col-span-5 bg-[radial-gradient(90%_70%_at_100%_0%,rgba(46,107,255,0.28),transparent_60%),var(--panel)] p-7 sm:p-10">
            <p className="eyebrow">Products I use</p>
            <h3 className="display mt-3 text-5xl text-foam">
              {d.percent}% off at {d.brand}
            </h3>
            <p className="mt-3 max-w-md text-muted">
              Use my code to get {d.percent}% off all {d.brand} products — the same stuff I use on the job.
            </p>
            <p aria-hidden="true" className="display text-outline mt-8 select-none text-[6.5rem] leading-none sm:text-[8rem] lg:text-[6.5rem] xl:text-[7.5rem]">
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
