import Link from "next/link";
import { site } from "@/site.config";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { ArrowRight } from "./icons";

export function MeetNoah() {
  return (
    <section id="about" aria-labelledby="about-heading" className="light relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink shadow-[0_40px_80px_-30px_rgba(7,9,13,0.5)]">
            <Photo id="f150-noahs-truck" crop="tall" sizes="(min-width: 768px) 45vw, 100vw" tone="blue" alt="Noah's own white Ford F-150 — the truck he waxed the day he got it" />
          </div>
          <p className="absolute -bottom-5 left-6 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-foam shadow-xl">
            Noah&apos;s truck · since August 2021
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow">Meet Noah</p>
          <h2 id="about-heading" className="display mt-4 text-6xl text-ink sm:text-7xl">
            The guy in
            <br />
            your driveway.
          </h2>
          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-ink">
            <p>
              I grew up around cool cars and trucks. When I got my first car in 2020, I asked my dad how to wash it. In August 2021 I got my truck — and put a coat of wax on it the day I got it.
            </p>
            <p>
              I started watching professional detailers because I found it satisfying, picked up tips and strategies, and started washing cars around my neighborhood. Every vehicle made me love it more. Now I bring it to your driveway.
            </p>
          </div>
          <blockquote className="display mt-10 border-l-4 border-blue-deep pl-6 text-4xl leading-[0.95] text-ink sm:text-5xl">
            “I put a coat of wax on it the day I got it.”
          </blockquote>
          <Link href="/about" className="btn btn-ghost mt-10">
            Read my story <ArrowRight />
          </Link>
          <p className="sr-only">{site.owner}, owner of {site.name}.</p>
        </Reveal>
      </div>
    </section>
  );
}
