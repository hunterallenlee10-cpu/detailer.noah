import { faq as defaultFaq } from "@/data/faq";
import { Reveal } from "./Reveal";

type Item = { q: string; a: string };

export function FaqList({ items = defaultFaq }: { items?: Item[] }) {
  return (
    <div className="divide-y divide-[#c9d6ea] border-y border-[#c9d6ea]">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 text-left text-lg font-bold text-ink sm:text-xl">
            {f.q}
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c9d6ea] transition-colors group-open:border-blue-deep group-open:bg-blue-deep" aria-hidden="true">
              <span className="absolute h-0.5 w-3.5 rounded bg-ink group-open:bg-white" />
              <span className="absolute h-3.5 w-0.5 rounded bg-ink transition-transform duration-300 group-open:rotate-90 group-open:bg-white" />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 text-[17px] leading-relaxed text-muted-ink">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="light relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-heading" className="display mt-4 text-6xl text-ink sm:text-7xl">
            Good
            <br />
            questions.
          </h2>
          <p className="mt-6 max-w-sm text-muted-ink">Anything else? Put it in the notes on your quote request and I&apos;ll answer it.</p>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-8">
          <FaqList />
        </Reveal>
      </div>
    </section>
  );
}
