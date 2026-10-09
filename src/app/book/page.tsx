import type { Metadata } from "next";
import { site } from "@/site.config";
import { QuoteForm } from "@/components/QuoteForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { Check, InstagramIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Get a Free Quote — Mobile Detailing in Harrisonburg, VA",
  description: "Send your vehicle, the services you want and a few photos. Noah will contact you with a free quote for mobile detailing in Harrisonburg VA.",
  alternates: { canonical: "/book" },
  openGraph: { url: "/book" },
};

export default function BookPage() {
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-[calc(var(--header-h)+3rem)] sm:pt-[calc(var(--header-h)+5rem)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_0%,rgba(46,107,255,0.28),transparent_65%),linear-gradient(180deg,#0b1220,#07090d_60%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <p className="eyebrow fade-up">Free quote</p>
          <h1 className="display fade-up mt-4 text-6xl text-foam sm:text-7xl" style={{ animationDelay: "100ms" }}>
            Get a free <span className="text-blue-glow">quote</span>
          </h1>
          <p className="fade-up mt-6 text-lg leading-relaxed text-muted" style={{ animationDelay: "200ms" }}>
            Fill this form out and I will contact you with a quote — or answer any questions!
          </p>
          <ul className="fade-up mt-8 space-y-3 text-foam/90" style={{ animationDelay: "300ms" }}>
            {["Vehicle + services + a few photos", "I'll reach out with a price and a time", "I come to you — hose spigot & outlet is all I need"].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue/20 text-blue-glow">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <p className="fade-up mt-10 flex flex-wrap items-center gap-2 text-sm text-muted" style={{ animationDelay: "400ms" }}>
            <InstagramIcon className="h-4 w-4" /> Rather message?
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-foam underline underline-offset-4 hover:text-blue-glow">
              DM {site.instagramHandle}
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </p>
        </div>
        <div className="lg:col-span-8">
          <QuoteForm />
        </div>
      </div>
      <JsonLd data={breadcrumbSchema("Get a Quote", "/book")} />
    </section>
  );
}
