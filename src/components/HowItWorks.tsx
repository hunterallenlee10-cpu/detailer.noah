"use client";

import { useRef } from "react";
import { m, useScroll, useSpring } from "motion/react";
import { Reveal } from "./Reveal";

const steps = [
  { n: "01", title: "Send photos", body: "Fill out the quick form with your vehicle and a few photos." },
  { n: "02", title: "Get your quote", body: "I'll reach out with a price and a time." },
  { n: "03", title: "I come to you", body: "Just need a hose spigot and an outlet. Prefer drop-off? That works too." },
];

export function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section aria-labelledby="how-heading" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue/50 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="eyebrow">How it works</p>
          <h2 id="how-heading" className="display mt-4 text-6xl text-foam sm:text-8xl">
            Three steps.
            <br />
            <span className="text-outline">Zero hassle.</span>
          </h2>
        </Reveal>

        <ol ref={ref} className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {/* connector: vertical on mobile, horizontal on desktop — scales with scroll */}
          <div className="absolute bottom-6 left-[27px] top-6 w-px bg-line md:bottom-auto md:left-0 md:right-0 md:top-[27px] md:h-px md:w-auto" aria-hidden="true">
            <m.div className="h-full w-full origin-top bg-gradient-to-b from-blue-glow to-blue md:hidden" style={{ scaleY: progress }} />
            <m.div className="hidden h-full w-full origin-left bg-gradient-to-r from-blue-glow to-blue md:block" style={{ scaleX: progress }} />
          </div>

          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 0.12} className="relative flex gap-6 md:flex-col">
              <span className="relative z-[1] flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-blue/60 bg-ink font-display text-xl font-extrabold italic text-blue-glow shadow-[0_0_30px_-6px_rgba(46,107,255,0.7)]">
                {s.n}
              </span>
              <div>
                <h3 className="display text-4xl text-foam">{s.title}</h3>
                <p className="mt-3 max-w-xs leading-relaxed text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
