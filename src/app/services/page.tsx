import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/data/services";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { ServiceIcon } from "@/components/ServiceIcon";
import { AddToQuote } from "@/components/AddToQuote";
import { Reveal } from "@/components/Reveal";
import { FinalCta } from "@/components/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { ArrowRight, Check } from "@/components/icons";

export const metadata: Metadata = {
  title: "Detailing Services — Interior, Exterior, Paint Correction & More",
  description:
    "Mobile detailing services in Harrisonburg VA: exterior & interior washes, paint correction & wax, steam cleaning & shampoo, pet hair removal, headlight restoration, engine bays.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Detailing <span className="text-blue-glow">services</span>
          </>
        }
        intro={<p>Seven services, all done at your place. Every vehicle is different, so every job is quoted from your photos — pick what you need and I&apos;ll put a price together.</p>}
      >
        <nav aria-label="Jump to a service">
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <a href={`#${s.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-semibold text-foam/85 transition-colors hover:border-blue-glow hover:text-foam">
                  {s.name.replace("Seat & Carpet Steam Cleaning & Shampooing", "Steam Clean & Shampoo")}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <div className="bg-ink pb-24">
        {services.map((s, i) => (
          <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-h`} className="border-t border-line">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:gap-20 lg:px-8">
              <Reveal className={i % 2 ? "md:order-2" : ""}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-panel">
                  <Photo id={s.photo ?? s.slug} crop="wide" sizes="(min-width: 768px) 50vw, 100vw" tone={i % 3 === 1 ? "blue" : "dark"} />
                  <div className="absolute left-5 top-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-ink/70 text-blue-glow backdrop-blur">
                    <ServiceIcon name={s.icon} className="h-10 w-10" />
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="font-display text-lg font-extrabold italic text-blue-glow">
                  0{i + 1}
                  {s.isNew && <span className="ml-3 rounded-full bg-blue px-2.5 py-1 align-middle font-sans text-[11px] font-bold not-italic uppercase tracking-widest text-white">New</span>}
                </p>
                <h2 id={`${s.slug}-h`} className="display mt-3 text-5xl text-foam sm:text-6xl">
                  {s.name}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted">{s.long}</p>
                <ul className="mt-6 space-y-3">
                  {s.includes.map((inc) => (
                    <li key={inc} className="flex gap-3 text-foam/90">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue/20 text-blue-glow">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {inc}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <AddToQuote name={s.name} slug={s.slug} mode="link" className="btn btn-primary gloss px-6" />
                  <span className="text-sm text-muted">Quoted from photos</span>
                </div>
              </Reveal>
            </div>
          </section>
        ))}

        <section aria-labelledby="beyond-h" className="border-t border-line">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <Reveal className="rounded-3xl border border-line bg-panel p-8 sm:p-12">
              <p className="eyebrow">Beyond cars</p>
              <h2 id="beyond-h" className="display mt-3 text-5xl text-foam sm:text-6xl">
                Boats, tractors &amp; trailers too.
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-muted">
                I&apos;ve detailed a boat inside and out with a polymer paint sealant, a large tractor, and trailers for a local farm. If it rolls or floats, I&apos;ll make it shine.
              </p>
              <Link href="/book" className="mt-8 inline-flex min-h-11 items-center gap-2 font-bold text-blue-glow hover:text-foam">
                Ask about your equipment <ArrowRight />
              </Link>
            </Reveal>
          </div>
        </section>
      </div>
      <FinalCta title="Not sure what you need? Send photos." />
      <JsonLd data={breadcrumbSchema("Services", "/services")} />
    </>
  );
}
