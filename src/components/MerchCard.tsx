"use client";

import Image from "next/image";
import { useState } from "react";

type Props = { item: string; price: number; front: string; back: string; note: string };

/** Real product mockups from Noah's apparel story, with a front/back toggle (back first — that's where the badge is). */
export function MerchCard({ item, price, front, back, note }: Props) {
  const [side, setSide] = useState<"back" | "front">("back");
  const flip = () => setSide((s) => (s === "back" ? "front" : "back"));

  return (
    <figure className="group">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#e4e4ea]">
        {(["back", "front"] as const).map((s) => (
          <Image
            key={s}
            src={s === "back" ? back : front}
            alt={`Noah's Detailing ${item.toLowerCase()}, ${s === "back" ? "back with the full Noble & Mobile badge" : "front with the small chest logo"}`}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 40vw, 90vw"
            className={`object-cover transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.03] ${side === s ? "opacity-100" : "opacity-0"}`}
            aria-hidden={side !== s}
          />
        ))}
        <button
          type="button"
          onClick={flip}
          className="absolute inset-0 z-[1] cursor-pointer"
          aria-label={`Show the ${side === "back" ? "front" : "back"} of the ${item.toLowerCase()}`}
        />
        <div className="absolute bottom-3 left-1/2 z-[2] flex -translate-x-1/2 rounded-full bg-ink/85 p-1 text-[11px] font-bold tracking-widest shadow-lg backdrop-blur" role="group" aria-label={`${item} view`}>
          {(["back", "front"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              aria-pressed={side === s}
              className={`min-h-9 rounded-full px-4 uppercase transition-colors ${side === s ? "bg-blue text-white" : "text-foam/70 hover:text-foam"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <figcaption className="mt-4 flex items-start justify-between gap-3">
        <span>
          <span className="block text-lg font-bold text-foam">{item}</span>
          <span className="block text-sm text-muted">{note}</span>
        </span>
        <span className="display text-4xl leading-none text-blue-glow">${price}</span>
      </figcaption>
    </figure>
  );
}
