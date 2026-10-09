import { site } from "@/site.config";
import { galleryIds, getLabel, getPhoto, hasPhotos } from "@/lib/photos";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { Reviews } from "./Reviews";
import { InstagramIcon } from "./icons";

export function Proof() {
  const ids = galleryIds(hasPhotos ? 9 : 6);
  return (
    <section aria-labelledby="proof-heading" className="relative bg-ink pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-panel px-6 py-12 sm:px-14 sm:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 bg-[radial-gradient(closest-side,rgba(46,107,255,0.25),transparent)]" aria-hidden="true" />
          <p className="eyebrow">From Noah</p>
          <h2 id="proof-heading" className="sr-only">
            Recent work and thanks
          </h2>
          <figure className="mt-5">
            <p className="display text-[2.6rem] leading-[0.92] text-foam sm:text-6xl">“A busy life is a blessed life.”</p>
            <blockquote className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              Booked-out schedule, referrals, and constant support from friends and clients — thank you.
            </blockquote>
            <figcaption className="mt-6 text-sm font-semibold text-foam">— {site.owner}, owner</figcaption>
          </figure>
        </Reveal>

        <div className="mt-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal>
            <p className="eyebrow">On the feed</p>
            <p className="display mt-3 text-5xl text-foam sm:text-6xl">{site.instagramHandle}</p>
          </Reveal>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost gloss self-start sm:self-auto">
            <InstagramIcon /> Follow {site.instagramHandle}
            <span className="sr-only">(opens in new tab)</span>
          </a>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
          {ids.map((id, i) => {
            const l = getLabel(id);
            const real = Boolean(getPhoto(id));
            return (
              <Reveal as="li" key={id} delay={(i % 3) * 0.06} className={i === 8 ? "max-md:hidden" : undefined}>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-xl bg-panel"
                  aria-label={`${l.vehicle} — ${l.service}. See more on Instagram (opens in new tab)`}
                >
                  <Photo id={id} crop="square" sizes="(min-width: 768px) 33vw, 50vw" className="transition-transform duration-700 ease-out group-hover:scale-105" />
                  <div className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/30 to-transparent p-3 opacity-100 transition-opacity duration-300 sm:p-5 ${real ? "md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100" : ""}`}>
                    <p className="text-sm font-bold text-foam sm:text-base">{l.vehicle}</p>
                    <p className="line-clamp-2 text-xs text-foam/75 sm:text-sm">{l.service}</p>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </ul>

        <Reviews />
      </div>
    </section>
  );
}
