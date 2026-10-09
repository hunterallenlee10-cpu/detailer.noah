import { featuredWork, getLabel, getPhoto, pairs } from "@/lib/photos";
import { CompareSlider } from "./CompareSlider";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";

// Without pairs: a big "after" shot plus two more. With one pair: the slider takes the big slot.
const FALLBACK_LEAD = "4runner-full-detail";

function Caption({ vehicle, service }: { vehicle: string; service: string }) {
  return (
    <p className="mt-4 flex flex-wrap items-baseline gap-x-2 text-sm">
      <span className="font-bold text-foam">{vehicle}</span>
      <span className="text-muted">— {service}</span>
    </p>
  );
}

export function BeforeAfter() {
  const sliders = pairs.slice(0, 4);
  return (
    <section id="work" aria-labelledby="work-heading" className="relative bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">The work</p>
            <h2 id="work-heading" className="display mt-4 text-6xl text-foam sm:text-8xl">
              Before. After.
              <br />
              <span className="text-chrome">Difference.</span>
            </h2>
          </div>
          <p className="max-w-sm text-muted">
            {sliders.length && getPhoto(sliders[0].after.id)
              ? "Drag the handle to compare. Real jobs from around the Valley — the details most washes skip."
              : "Real jobs from around the Valley. Paint, interiors, wheels — the details most washes skip."}
          </p>
        </Reveal>

        {sliders.length > 1 ? (
          <ul className="mt-14 grid gap-8 sm:grid-cols-2">
            {sliders.map((pair, i) => (
              <Reveal as="li" key={pair.id} delay={i * 0.08}>
                <CompareSlider pair={pair} sizes="(min-width: 640px) 50vw, 100vw" />
                <Caption vehicle={pair.vehicle} service={pair.service} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <ul className="mt-14 grid gap-6 md:grid-cols-12 md:grid-rows-2">
            <Reveal as="li" className="flex flex-col md:col-span-7 md:row-span-2">
              {sliders[0] ? (
                <>
                  <CompareSlider pair={sliders[0]} sizes="(min-width: 768px) 58vw, 100vw" />
                  <Caption vehicle={sliders[0].vehicle} service={sliders[0].service} />
                </>
              ) : (
                <>
                  <div className="gloss relative aspect-[4/5] overflow-hidden rounded-2xl bg-panel md:aspect-auto md:min-h-0 md:flex-1">
                    <Photo id={FALLBACK_LEAD} crop="tall" sizes="(min-width: 768px) 58vw, 100vw" />
                  </div>
                  <Caption {...getLabel(FALLBACK_LEAD)} />
                </>
              )}
            </Reveal>
            {featuredWork.map((id, i) => (
              <Reveal as="li" key={id} delay={(i + 1) * 0.08} className="md:col-span-5">
                <div className="gloss relative aspect-[16/10] overflow-hidden rounded-2xl bg-panel">
                  <Photo id={id} crop="wide" sizes="(min-width: 768px) 42vw, 100vw" />
                </div>
                <Caption {...getLabel(id)} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
