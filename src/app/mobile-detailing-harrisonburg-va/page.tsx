import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";
import { services } from "@/data/services";
import { PageHero } from "@/components/PageHero";
import { Photo } from "@/components/Photo";
import { Reveal } from "@/components/Reveal";
import { FaqList } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { ArrowRight } from "@/components/icons";

const PATH = "/mobile-detailing-harrisonburg-va";

export const metadata: Metadata = {
  title: "Mobile Detailing Harrisonburg VA — I Come to You",
  description:
    "Looking for mobile detailing in Harrisonburg VA? Noah's Detailing comes to you for interior, exterior, paint correction & more. Send photos for a free quote.",
  alternates: { canonical: PATH },
  openGraph: { url: PATH, title: "Mobile Detailing Harrisonburg VA — I Come to You | Noah's Detailing" },
};

const localFaq = [
  {
    q: "Who does mobile detailing in Harrisonburg, VA?",
    a: `${site.name}, run by ${site.owner}, is a mobile detailing service based in Harrisonburg, VA. I come to your home or work — or you can drop your vehicle off at my place.`,
  },
  {
    q: "How much does mobile detailing cost in Harrisonburg?",
    a: "Every vehicle is different, so I quote each job individually. Send a few photos through the quote form and I'll get back to you with a price.",
  },
  {
    q: "What do I need to have ready?",
    a: "Just access to a hose spigot and an outlet.",
  },
  {
    q: "Do you detail trucks, boats and farm equipment?",
    a: "Yes — big trucks, boats, a large tractor and farm trailers so far. If it rolls or floats, I'll make it shine.",
  },
];

const photos = [
  { id: "4runner-full-detail", alt: "Black Toyota 4Runner after a full detail — mobile detailing Harrisonburg VA" },
  { id: "dart-pet-hair", alt: "Dodge Dart interior after dog hair extraction — mobile detailing Harrisonburg VA" },
  { id: "ram3500-wash-wax", alt: "Black Ram 3500 after a wash and wax — mobile detailing Harrisonburg VA" },
];

export default function HarrisonburgPage() {
  return (
    <>
      <PageHero
        eyebrow={`${site.city}, ${site.region} · ${site.tagline}`}
        title={
          <>
            Mobile Detailing in <span className="text-blue-glow">Harrisonburg, VA</span>
          </>
        }
        intro={
          <p>
            {site.name} brings professional detailing to your driveway in Harrisonburg and the surrounding Shenandoah Valley. Send a few photos, get a quote, and I&apos;ll come to you.
          </p>
        }
      >
        <Link href="/book" className="btn btn-primary gloss min-h-14 px-8 text-base">
          Get a free quote <ArrowRight />
        </Link>
      </PageHero>

      <article className="light">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <h2 className="display text-5xl text-ink sm:text-6xl">Who does mobile detailing in Harrisonburg VA?</h2>
                <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-ink">
                  <p>
                    I&apos;m {site.owner}, and {site.name} is my mobile detailing business in Harrisonburg, Virginia. Mobile means you don&apos;t drive anywhere or sit in a waiting room —
                    I bring the detail to your home or work. All I need is access to a hose spigot and an outlet. If you&apos;d rather drop your vehicle off at my place, that works too.
                  </p>
                  <p>
                    I started by waxing my own truck and washing cars around my neighborhood, and the business grew through referrals and support from friends and clients. Today I detail
                    everything from daily drivers and family minivans to big trucks like the Ford F-250 and Ram 3500 — plus boats, a large tractor and farm trailers.
                  </p>
                </div>
              </Reveal>

              <Reveal className="mt-16">
                <h2 className="display text-5xl text-ink sm:text-6xl">Mobile detailing services in Harrisonburg</h2>
                <p className="mt-6 text-lg leading-relaxed text-muted-ink">
                  Every job is quoted from your photos, so you only get what your vehicle actually needs. Here&apos;s what I offer:
                </p>
                <ul className="mt-6 divide-y divide-[#c9d6ea] border-y border-[#c9d6ea]">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services#${s.slug}`} className="group flex min-h-16 items-center justify-between gap-4 py-4">
                        <span>
                          <span className="block text-lg font-bold text-ink group-hover:text-blue-deep">{s.name}</span>
                          <span className="block text-muted-ink">{s.short}</span>
                        </span>
                        <ArrowRight className="h-5 w-5 shrink-0 text-blue-deep transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className="mt-16">
                <h2 className="display text-5xl text-ink sm:text-6xl">How it works</h2>
                <ol className="mt-6 space-y-4 text-lg leading-relaxed text-muted-ink">
                  <li>
                    <strong className="text-ink">1. Send photos.</strong> Fill out the{" "}
                    <Link href="/book" className="font-semibold text-blue-deep underline underline-offset-4">
                      quick quote form
                    </Link>{" "}
                    with your vehicle, the services you want, and a few photos of its condition.
                  </li>
                  <li>
                    <strong className="text-ink">2. Get your quote.</strong> I&apos;ll reach out with a price and a time.
                  </li>
                  <li>
                    <strong className="text-ink">3. I come to you.</strong> Anywhere around Harrisonburg with a hose spigot and an outlet — or drop it off at my place.
                  </li>
                </ol>
              </Reveal>

              <Reveal className="mt-16">
                <h2 className="display text-5xl text-ink sm:text-6xl">Why go mobile?</h2>
                <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted-ink">
                  <p>
                    No drop-off, no waiting room: your vehicle gets detailed while you&apos;re at home or work. And a real detail goes deeper than a wash. Extraction isn&apos;t just for
                    stains — it pulls out the dirt your vacuum leaves behind. Paint correction takes out scratches, swirls and water spots. Headlight restoration clears up cloudy,
                    yellowed lenses so they shine brighter at night.
                  </p>
                  <p>
                    I serve {site.serviceArea}
                    {site.serviceTowns.length ? `, including ${site.serviceTowns.join(", ")}` : ""}. Not sure if you&apos;re in range? Put your address in the quote form and I&apos;ll let
                    you know.
                  </p>
                </div>
              </Reveal>
            </div>

            <aside className="lg:col-span-5" aria-label="Recent mobile detailing work in Harrisonburg">
              <div className="grid gap-4 lg:sticky lg:top-28">
                {photos.map((p, i) => (
                  <Reveal key={p.id} delay={i * 0.06} className={`relative overflow-hidden rounded-2xl bg-ink ${i === 0 ? "aspect-[4/3]" : "aspect-[16/9]"}`}>
                    <Photo id={p.id} crop="wide" alt={p.alt} sizes="(min-width: 1024px) 40vw, 100vw" tone={i === 1 ? "blue" : "dark"} />
                  </Reveal>
                ))}
              </div>
            </aside>
          </div>

          <div className="mt-24 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="display text-5xl text-ink sm:text-6xl">Harrisonburg mobile detailing FAQ</h2>
            </div>
            <div className="lg:col-span-8">
              <FaqList items={localFaq} />
            </div>
          </div>
        </div>
      </article>

      <FinalCta />
      <JsonLd data={faqSchema(localFaq)} />
      <JsonLd data={breadcrumbSchema("Mobile Detailing Harrisonburg VA", PATH)} />
    </>
  );
}
