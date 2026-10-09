import Link from "next/link";
import { services } from "@/data/services";
import { AddToQuote } from "./AddToQuote";
import { ServiceIcon } from "./ServiceIcon";
import { Reveal } from "./Reveal";
import { ArrowRight, CameraIcon, Check } from "./icons";

export function ServicesGrid() {
  return (
    <section id="services" aria-labelledby="services-heading" className="light relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow">Services</p>
            <h2 id="services-heading" className="display mt-4 text-6xl text-ink sm:text-8xl">
              Seven ways
              <br />
              to <span className="text-blue-deep">shine.</span>
            </h2>
          </div>
          <p className="max-w-md text-lg text-muted-ink md:justify-self-end">
            Pick what your vehicle needs — or tap <strong className="text-ink">Add to quote</strong> on a few and I&apos;ll put a price together.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-[#c9d6ea] bg-[#c9d6ea] sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={(i % 4) * 0.06} className="group gloss relative flex flex-col bg-foam p-7 transition-colors duration-300 hover:bg-white sm:p-8">
              <div className="flex items-start justify-between">
                <ServiceIcon name={s.icon} className="h-14 w-14 text-blue-deep" />
                {s.isNew && <span className="rounded-full bg-blue-deep px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white">New</span>}
              </div>
              <h3 className="display mt-6 text-[2rem] leading-[0.9] text-ink">{s.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-ink">{s.short}</p>
              <ul className="mt-5 space-y-2 text-sm text-ink/80">
                {s.includes.slice(0, 3).map((inc) => (
                  <li key={inc} className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-deep" />
                    {inc}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <AddToQuote name={s.name} slug={s.slug} className="relative z-[2] -ml-1 px-1 text-blue-deep hover:text-ink" />
              </div>
            </Reveal>
          ))}
          <Reveal as="li" delay={0.18} className="relative flex flex-col justify-between gap-8 bg-ink p-7 text-foam sm:p-8">
            <CameraIcon className="h-10 w-10 text-blue-glow" />
            <div>
              <p className="display text-[2rem] leading-[0.9]">Not sure what you need?</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">Send photos — I&apos;ll recommend it.</p>
              <Link href="/services" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-glow hover:text-foam">
                Full service details <ArrowRight />
              </Link>
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
