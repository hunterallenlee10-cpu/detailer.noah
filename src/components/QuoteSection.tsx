import { site } from "@/site.config";
import { QuoteForm } from "./QuoteForm";
import { Reveal } from "./Reveal";
import { CameraIcon, Check, InstagramIcon } from "./icons";

export function QuoteSection() {
  return (
    <section id="quote" aria-label="Get a free quote" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(50%_50%_at_50%_30%,rgba(46,107,255,0.16),transparent_70%)]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Free quote</p>
          <p className="display mt-4 text-6xl text-foam sm:text-8xl" aria-hidden="true">
            Photos in.
            <br />
            <span className="text-blue-glow">Price out.</span>
          </p>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Fill this out and I&apos;ll contact you with a quote — or answer any questions you&apos;ve got.
          </p>
          <ul className="mt-8 space-y-3 text-foam/90">
            {["Takes about two minutes", "Photos help me quote accurately", "I come to you — or drop it off"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue/20 text-blue-glow">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-2 text-sm text-muted">
            <p className="flex items-center gap-2">
              <CameraIcon className="h-4 w-4" /> Prefer the old way?{" "}
              <a href={site.googleForm} target="_blank" rel="noopener noreferrer" className="font-semibold text-foam underline underline-offset-4 hover:text-blue-glow">
                Use my Google Form
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </p>
            <p className="flex items-center gap-2">
              <InstagramIcon className="h-4 w-4" /> Or{" "}
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-foam underline underline-offset-4 hover:text-blue-glow">
                DM {site.instagramHandle}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            </p>
          </div>
        </Reveal>
        <div className="lg:col-span-7">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
