import { site } from "@/site.config";
import { QuoteLink } from "./QuoteLink";
import { Reveal } from "./Reveal";
import { ArrowRight, InstagramIcon } from "./icons";

export function FinalCta({ title = "Send me a few photos. I'll send you a quote." }: { title?: string }) {
  return (
    <section aria-labelledby="cta-heading" className="relative isolate overflow-hidden bg-blue py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_120%_at_85%_0%,#5aa2ff_0%,transparent_55%),radial-gradient(70%_100%_at_0%_100%,#1a4fd6_0%,transparent_60%),linear-gradient(135deg,#2e6bff,#1a4fd6)]" />
      <div className="beads absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(180deg,transparent,#000_30%,#000_70%,transparent)]" aria-hidden="true" />
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 id="cta-heading" className="display text-[clamp(3rem,9vw,6.5rem)] text-white">
            {title}
          </h2>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <QuoteLink className="btn gloss min-h-14 bg-white px-8 text-base text-ink hover:bg-foam">
              Get a Free Quote <ArrowRight />
            </QuoteLink>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn min-h-14 border border-white/50 px-8 text-base text-white hover:border-white">
              <InstagramIcon /> DM {site.instagramHandle}
              <span className="sr-only">(opens in new tab)</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
