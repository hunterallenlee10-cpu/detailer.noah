import { site } from "@/site.config";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";

const panels = [
  {
    id: "boat-sealant",
    title: "Boats",
    body: "Inside and out, finished with a polymer paint sealant.",
  },
  {
    id: "tractor",
    title: "Tractors & Farm Equipment",
    body: "Big equipment, same attention to detail. Yes — I've detailed a large tractor.",
  },
  {
    id: "farm-trailers",
    title: "Trailers",
    body: site.farmClientName ? `Trailers for ${site.farmClientName} — washed and ready to work.` : "Farm trailers, washed and ready to work.",
  },
];

export function MoreThanCars() {
  return (
    <section aria-labelledby="more-heading" className="relative bg-ink pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <p className="eyebrow">More than cars</p>
            <h2 id="more-heading" className="display mt-4 text-6xl text-foam sm:text-8xl">
              If it rolls
              <br />
              or floats<span className="text-blue-glow">…</span>
            </h2>
          </div>
          <p className="max-w-md text-lg text-muted md:justify-self-end">
            Cars, trucks, boats, tractors. If it rolls or floats, I&apos;ll make it shine.
          </p>
        </Reveal>

        <ul className="mt-14 flex flex-col gap-3 md:h-[560px] md:flex-row">
          {panels.map((p, i) => (
            <Reveal
              as="li"
              key={p.id}
              delay={i * 0.08}
              className="group relative min-h-[340px] overflow-hidden rounded-2xl bg-panel md:min-h-0 md:flex-1 md:transition-[flex-grow] md:duration-700 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:hover:flex-[1.8] md:focus-within:flex-[1.8]"
            >
              <Photo id={p.id} crop="tall" sizes="(min-width: 768px) 50vw, 100vw" className="transition-transform duration-[1.2s] ease-out group-hover:scale-105" tone={i === 1 ? "blue" : "dark"} showLabel={false} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <span className="font-display text-sm font-extrabold italic text-blue-glow">0{i + 1}</span>
                <h3 className="display mt-2 text-4xl text-foam sm:text-5xl">{p.title}</h3>
                <p className="mt-3 max-w-sm text-foam/80">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
