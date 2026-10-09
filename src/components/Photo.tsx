import Image from "next/image";
import { getLabel, getPhoto } from "@/lib/photos";
import type { CropName, Photo as PhotoT } from "@/lib/photo-types";

type Props = {
  id: string;
  crop?: CropName;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Override the photo object (e.g. before/after halves). */
  photo?: PhotoT;
  alt?: string;
  /** Placeholder tone. */
  tone?: "dark" | "blue";
  /** Show the faint vehicle caption on placeholders (off where a title already overlays). */
  showLabel?: boolean;
};

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
}

/**
 * Real photo via next/image (fills its positioned parent), or an abstract "studio paint" placeholder
 * when the photo hasn't been added yet. Placeholders never pretend to be Noah's work.
 */
export function Photo({ id, crop = "tall", sizes, priority, className = "", photo, alt, tone = "dark", showLabel = true }: Props) {
  const p = photo ?? getPhoto(id);
  if (p) {
    const c = p.crops[crop];
    return (
      <Image
        src={c.src}
        alt={alt ?? p.alt}
        fill
        sizes={sizes}
        preload={priority}
        fetchPriority={priority ? "high" : undefined}
        placeholder="blur"
        blurDataURL={c.blurDataURL}
        className={`object-cover ${className}`}
      />
    );
  }
  return <PhotoPlaceholder seed={id} className={className} tone={tone} label={showLabel ? getLabel(id).vehicle : undefined} />;
}

export function PhotoPlaceholder({ seed, className = "", tone = "dark", label }: { seed: string; className?: string; tone?: "dark" | "blue"; label?: string }) {
  const h = hash(seed);
  const angle = 100 + (h % 50);
  const x = 20 + (h % 60);
  const y = 15 + ((h >> 3) % 50);
  const base =
    tone === "blue"
      ? `radial-gradient(120% 90% at ${x}% ${y}%, #3d7bff 0%, #1a4fd6 35%, #0b1c4a 75%, #07090d 100%)`
      : `radial-gradient(90% 70% at ${x}% ${y}%, rgba(90,162,255,.28) 0%, rgba(46,107,255,.10) 35%, transparent 65%), linear-gradient(${angle}deg, #0b1018 0%, #111a28 45%, #0a0e15 100%)`;
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} role="presentation" data-placeholder>
      <div className="absolute inset-0" style={{ background: base }} />
      {/* reflection streaks, like a studio light on clear coat */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `linear-gradient(${angle - 20}deg, transparent 38%, rgba(234,242,255,.10) 46%, rgba(234,242,255,.22) 48.5%, transparent 51%, transparent 58%, rgba(234,242,255,.07) 61%, transparent 64%)`,
        }}
      />
      {/* beading */}
      <div className="beads absolute inset-0 opacity-[0.12]" />
      {/* faint outlined caption so empty slots read as designed, not broken */}
      {label && (
        <span aria-hidden="true" className="display text-outline absolute inset-x-4 bottom-[38%] text-center text-[clamp(1.75rem,5vw,3.5rem)] leading-[0.9] opacity-60">
          {label}
        </span>
      )}
      {process.env.NODE_ENV === "development" && (
        <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 font-mono text-[10px] text-amber-300">
          DEV: add source-photos/{seed}.jpg{label ? ` (${label})` : ""}
        </span>
      )}
    </div>
  );
}
