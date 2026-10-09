import { photos, pairs } from "@/data/photos";
import meta from "@/data/photo-meta.json";
import type { Photo } from "@/lib/photo-types";

const metaMap = meta as unknown as Record<string, { vehicle: string; service: string } | string>;

/** A processed photo by id. For pairs, `id` resolves to the "after" shot. */
export function getPhoto(id: string): Photo | undefined {
  return photos.find((p) => p.id === id) ?? photos.find((p) => p.id === `${id}-after`);
}

/** Caption for a slot — from the real photo if present, else from photo-meta.json (his captions). */
export function getLabel(id: string): { vehicle: string; service: string } {
  const p = getPhoto(id);
  if (p) return { vehicle: p.vehicle, service: p.service };
  const m = metaMap[id];
  if (m && typeof m === "object") return m;
  return { vehicle: "", service: "" };
}

export const hasPhotos = photos.length > 0;
export { photos, pairs };

/** Featured in the homepage "Work" section (next to any before/after sliders). */
export const featuredWork = ["corvette-c8r", "bmw-x3-black"];

/** IG-style work grid slots, in display order (filenames from the photo checklist). */
export const workSlots = [
  "4runner-full-detail",
  "exterior-trim-restoration",
  "miata-wash-wax",
  "jeep-extraction",
  "ram3500-wash-wax",
  "dart-pet-hair",
  "wrx-hand-wax",
  "minivan-reset",
  "camry-seat-shampoo",
];

/** Work photos for galleries: real photos first (non-"before" shots), else the slot list. */
export function galleryIds(limit = 9): string[] {
  // Only Noah's own photos — never stock — and nothing already shown elsewhere on the homepage.
  const shownElsewhere = ["f150-noahs-truck", "boat-sealant", "tractor", "farm-trailers", "headlight", ...featuredWork];
  const real = photos.filter((p) => p.stage !== "before" && !p.stock).map((p) => p.id.replace(/-after$/, ""));
  const ordered = [...workSlots.filter((s) => real.includes(s)), ...real.filter((r) => !workSlots.includes(r))];
  const pool = ordered.filter((id) => !shownElsewhere.includes(id));
  return (pool.length ? pool : workSlots).slice(0, limit);
}
