import { pairs, getLabel } from "@/lib/photos";
import { CompareSlider } from "./CompareSlider";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";

// Featured "after" shots when no before/after pairs exist yet.
const FEATURED = ["corvette-c8r", "4runner-full-detail", "miata-wash-wax"];

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
            {sliders.length
              ? "Drag the handle. Same vehicle, same angle — just a few hours apart."
              : "Real jobs from around the Valley. Paint, interiors, wheels — the details most washes skip."}
          </p>
        </Reveal>

        {sliders.length ? (
          <ul className={`mt-14 grid gap-8 ${sliders.length > 1 ? "sm:grid-cols-2" : "max-w-xl"}`}>
            {sliders.map((pair, i) => (
              <Reveal as="li" key={pair.id} delay={i * 0.08}>
                <CompareSlider pair={pair} sizes="(min-width: 640px) 50vw, 100vw" />
                <Caption vehicle={pair.vehicle} service={pair.service} />
              </Reveal>
            ))}
          </ul>
        ) : (
          <ul className="mt-14 grid gap-6 md:grid-cols-12 md:grid-rows-2">
            {FEATURED.map((id, i) => {
              const l = getLabel(id);
              return (
                <Reveal
                  as="li"
                  key={id}
                  delay={i * 0.08}
                  className={i === 0 ? "flex flex-col md:col-span-7 md:row-span-2" : "md:col-span-5"}
                >
                  <div className={`gloss relative overflow-hidden rounded-2xl bg-panel ${i === 0 ? "aspect-[4/5] md:aspect-auto md:min-h-0 md:flex-1" : "aspect-[16/10]"}`}>
                    <Photo id={id} crop={i === 0 ? "tall" : "wide"} sizes={i === 0 ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 42vw, 100vw"} />
                  </div>
                  <Caption {...l} />
                </Reveal>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
