"use client";

import { useCallback, useRef, useState } from "react";
import type { PhotoPair } from "@/lib/photo-types";
import { Photo } from "./Photo";

/** Before/after comparison: drag anywhere, touch-friendly, arrow keys / Home / End on the handle. */
export function CompareSlider({ pair, sizes }: { pair: PhotoPair; sizes: string }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromClientX = useCallback((x: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)));
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 5;
    const map: Record<string, number> = {
      ArrowLeft: pos - step,
      ArrowDown: pos - step,
      ArrowRight: pos + step,
      ArrowUp: pos + step,
      Home: 0,
      End: 100,
      PageDown: pos - 20,
      PageUp: pos + 20,
    };
    if (e.key in map) {
      e.preventDefault();
      setPos(Math.min(100, Math.max(0, map[e.key])));
    }
  };

  const label = `${pair.vehicle} — ${pair.service}`;

  return (
    <div
      ref={box}
      className="relative aspect-square touch-pan-y select-none overflow-hidden rounded-2xl bg-panel"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        fromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <Photo id={pair.after.id} photo={pair.after} crop="square" sizes={sizes} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Photo id={pair.before.id} photo={pair.before} crop="square" sizes={sizes} />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-bold uppercase tracking-widest text-foam backdrop-blur">Before</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-blue px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">After</span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-foam shadow-[0_0_20px_rgba(90,162,255,0.8)]" style={{ left: `${pos}%` }} />
      <div
        role="slider"
        tabIndex={0}
        aria-label={`Before and after: ${label}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% before`}
        onKeyDown={onKey}
        className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-foam bg-ink/70 text-foam shadow-xl backdrop-blur"
        style={{ left: `${pos}%` }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
        </svg>
      </div>
    </div>
  );
}
