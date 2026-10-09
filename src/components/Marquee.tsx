import { vehicles } from "@/data/vehicles";
import { BADGE_SHAPE } from "./Badge";

function Glyph() {
  return (
    <svg viewBox="0 0 200 260" className="mx-6 h-5 w-auto shrink-0 text-blue sm:mx-9 sm:h-7" aria-hidden="true">
      <path d={BADGE_SHAPE} fill="currentColor" />
    </svg>
  );
}

function Row({ items, reverse, duration }: { items: string[]; reverse?: boolean; duration: string }) {
  const group = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((v) => (
        <li key={v} className="flex items-center">
          <span className="display text-outline whitespace-nowrap text-5xl transition-colors duration-300 hover:text-foam sm:text-7xl">{v}</span>
          <Glyph />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee-track" data-reverse={reverse} style={{ ["--marquee-duration" as string]: duration }}>
      {group(false)}
      {group(true)}
    </div>
  );
}

export function Marquee() {
  const half = Math.ceil(vehicles.length / 2);
  return (
    <section aria-labelledby="marquee-heading" className="marquee relative overflow-hidden border-y border-line bg-ink py-8 sm:py-12">
      <h2 id="marquee-heading" className="sr-only">
        Vehicles I&apos;ve detailed
      </h2>
      <div className="flex flex-col gap-3 sm:gap-5 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <Row items={vehicles.slice(0, half)} duration="70s" />
        <Row items={vehicles.slice(half)} duration="80s" reverse />
      </div>
    </section>
  );
}
