import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { Badge } from "@/components/Badge";
import { FinalCta } from "@/components/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { ArrowRight, InstagramIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About Noah — Owner of Noah's Detailing",
  description:
    "Meet Noah Urquhart, the owner-operator behind Noah's Detailing — mobile car detailing in Harrisonburg VA. From washing his first car in 2020 to detailing cars, trucks, boats and tractors.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

const timeline = [
  { when: "Growing up", what: "Grew up around cool cars and trucks." },
  { when: "2020", what: "Got my first car — and asked my dad how to wash it." },
  { when: "August 2021", what: "Got my truck. Put a coat of wax on it the day I got it." },
  { when: "Then", what: "Started watching professional detailers, learned tips and strategies, and began washing cars around my neighborhood." },
  { when: "Now", what: "Booked-out schedule, referrals, and cars, trucks, boats, tractors and trailers around the Valley." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`${site.tagline} · ${site.city}, ${site.region}`}
        title={
          <>
            Meet <span className="text-blue-glow">Noah</span>
          </>
        }
        intro={<p>I&apos;m {site.owner}, the owner-operator of {site.name}. When you book, I&apos;m the one who shows up.</p>}
      />

      <section aria-labelledby="story-h" className="light py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-2 lg:gap-20 lg:px-8">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink md:sticky md:top-28">
              <Photo id="f150-noahs-truck" crop="tall" sizes="(min-width: 768px) 45vw, 100vw" tone="blue" alt="Noah's own white Ford F-150 — the truck that started it all" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="story-h" className="display text-6xl text-ink sm:text-7xl">
              How it started
            </h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-ink">
              <p>
                I grew up around cool cars and trucks. When I got my first car in 2020, I asked my dad how to wash it — and that was the start.
              </p>
              <p>
                In August 2021 I got my current truck, and I put a coat of wax on it the day I got it. Around then I started watching professional detailers, because honestly, I found it satisfying. From that day forward, my truck stayed clean.
              </p>
              <p>
                I kept learning tips and strategies and started washing cars around my neighborhood. With each vehicle, I fell more in love with it. I started my Instagram to share the satisfying before-and-afters — and the business grew from there.
              </p>
              <p>
                Today I do it all mobile: I come to you with everything I need except a hose spigot and an outlet. I&apos;m even bringing the business with me to school.
              </p>
            </div>
            <blockquote className="display mt-10 border-l-4 border-blue-deep pl-6 text-4xl leading-[0.95] text-ink sm:text-5xl">
              “A busy life is a blessed life.”
            </blockquote>
            <p className="mt-4 text-muted-ink">
              Thankful for a booked-out schedule, referrals, and constant support from friends and clients.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="timeline-h" className="bg-ink py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="eyebrow">The road here</p>
            <h2 id="timeline-h" className="display mt-4 text-6xl text-foam sm:text-7xl">
              From one truck to the whole Valley
            </h2>
          </Reveal>
          <ol className="mt-14 border-l border-line">
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.when} delay={i * 0.06} className="relative pb-10 pl-8 last:pb-0">
                <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-blue-glow bg-ink" aria-hidden="true" />
                <p className="font-display text-xl font-extrabold italic uppercase text-blue-glow">{t.when}</p>
                <p className="mt-1 text-lg text-foam/90">{t.what}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="noble-h" className="border-t border-line bg-ink py-24">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <Badge className="h-48 w-auto shrink-0" />
          <div>
            <h2 id="noble-h" className="display text-5xl text-foam sm:text-6xl">
              Noble &amp; Mobile.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Mobile: I come to you. Noble: doing the work right — every panel, every seat, every wheel.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
              <Link href="/book" className="btn btn-primary gloss">
                Get a free quote <ArrowRight />
              </Link>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <InstagramIcon /> {site.instagramHandle}
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
      <JsonLd data={breadcrumbSchema("About", "/about")} />
    </>
  );
}
