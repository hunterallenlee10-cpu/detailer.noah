"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Signature effect: one diagonal light sweep across the hero photo + headline after the letters land,
 * re-triggered (throttled) when the headline is hovered. Pure CSS animation; this only flips data attributes.
 * Renders the photo-sweep layer; finds the headline's text-sweep layer within the same <section>.
 */
export function HeroSweep() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const busy = useRef(false);

  const trigger = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    setRun(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setRun(true)));
    setTimeout(() => (busy.current = false), 1700);
  }, []);

  useEffect(() => {
    const t = setTimeout(trigger, 750);
    return () => clearTimeout(t);
  }, [trigger]);

  useEffect(() => {
    const section = ref.current?.closest("section");
    section?.querySelector("[data-sweep-text]")?.setAttribute("data-run", String(run));
  }, [run]);

  useEffect(() => {
    const h1 = ref.current?.closest("section")?.querySelector("[data-hero-headline]");
    h1?.addEventListener("mouseenter", trigger);
    return () => h1?.removeEventListener("mouseenter", trigger);
  }, [trigger]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden" aria-hidden="true">
      <div className="sweep" data-run={run} />
    </div>
  );
}
