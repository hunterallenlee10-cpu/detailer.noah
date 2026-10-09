import Link from "next/link";
import { site } from "@/site.config";
import { getPhoto } from "@/lib/photos";
import { Photo } from "./Photo";
import { TruckArt } from "./Badge";
import { HeroSweep } from "./HeroSweep";
import { QuoteLink } from "./QuoteLink";
import { ArrowRight, CameraIcon, PinIcon, TruckIcon } from "./icons";

const HERO_PHOTO = "f150-noahs-truck";

function Letters({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {[...text].map((ch, i) => (
        <span key={i} className="hero-letter" style={{ animationDelay: `${start + i * 45}ms` }}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const hasPhoto = Boolean(getPhoto(HERO_PHOTO));
  return (
    <section className="relative isolate flex min-h-[calc(100svh-var(--mobilebar-h))] items-end overflow-hidden pb-10 pt-[calc(var(--header-h)+2rem)] sm:pb-20 md:min-h-[100svh]">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {hasPhoto ? (
          <Photo id={HERO_PHOTO} crop="wide" sizes="100vw" priority />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_75%_30%,rgba(46,107,255,0.35),transparent_70%),radial-gradient(50%_50%_at_10%_90%,rgba(90,162,255,0.16),transparent_70%),linear-gradient(180deg,#07090d_0%,#0b1220_60%,#07090d_100%)]">
            {/* studio floor reflection + truck line-art (illustration, not a photo) */}
            <svg viewBox="0 0 200 90" className="absolute right-[-12%] top-[18%] w-[95%] max-w-[980px] text-blue-glow/25 sm:right-[-4%] sm:top-[14%] sm:w-[70%]" aria-hidden="true">
              <TruckArt strokeWidth={0.9} />
            </svg>
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,rgba(46,107,255,0.08))]" />
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,13,0.55)_0%,rgba(7,9,13,0.15)_35%,rgba(7,9,13,0.75)_75%,#07090d_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,13,0.75)_0%,transparent_60%)]" />
      </div>

      <HeroSweep />
      <div className="relative w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow fade-up mb-5 flex items-center gap-3 max-sm:text-[11px] max-sm:tracking-[0.16em]" style={{ animationDelay: "0ms" }}>
            <span className="hidden h-px w-8 bg-blue-glow sm:block" aria-hidden="true" />
            Mobile detailing · {site.city}, {site.region}
          </p>

          <h1 className="display relative text-[clamp(4rem,21vw,8.5rem)] leading-[0.82] text-foam" data-hero-headline>
            <span className="sr-only">Noble &amp; Mobile. Noah&apos;s Detailing, mobile detailing in Harrisonburg, VA.</span>
            <span aria-hidden="true" className="block">
              <Letters text="Noble &" start={60} />
            </span>
            <span aria-hidden="true" className="block">
              <Letters text="Mobile" start={280} />
              <span className="hero-letter text-blue-glow" style={{ animationDelay: "520ms" }}>
                .
              </span>
            </span>
            {/* gloss band clipped to the glyphs */}
            <span aria-hidden="true" className="text-sweep pointer-events-none absolute inset-0" data-sweep-text>
              <span className="block">Noble &amp;</span>
              <span className="block">Mobile.</span>
            </span>
          </h1>

          <p className="fade-up mt-7 max-w-xl text-lg leading-relaxed text-foam/85 sm:text-xl" style={{ animationDelay: "350ms" }}>
            Professional detailing, done in your driveway. {site.city} and the surrounding Valley.
          </p>

          <div className="fade-up mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "480ms" }}>
            <QuoteLink className="btn btn-primary gloss min-h-14 px-8 text-base">
              Get a Free Quote <ArrowRight />
            </QuoteLink>
            <Link href="/#work" className="btn btn-ghost min-h-14 px-8 text-base">
              See the Work
            </Link>
          </div>

          <ul className="fade-up mt-10 flex flex-col gap-3 text-sm text-foam/75 sm:flex-row sm:flex-wrap sm:gap-x-8" style={{ animationDelay: "600ms" }}>
            <li className="flex items-center gap-2">
              <TruckIcon className="h-4 w-4 text-blue-glow" /> Mobile — I come to you
            </li>
            <li className="flex items-center gap-2">
              <PinIcon className="h-4 w-4 text-blue-glow" /> {site.serviceArea}
            </li>
            <li className="flex items-center gap-2">
              <CameraIcon className="h-4 w-4 text-blue-glow" /> Quotes from photos
            </li>
          </ul>
        </div>
      </div>

      <div className="scroll-cue absolute bottom-6 right-6 hidden flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-muted md:flex" aria-hidden="true">
        Scroll
        <span className="h-10 w-px bg-gradient-to-b from-blue-glow to-transparent" />
      </div>
    </section>
  );
}
