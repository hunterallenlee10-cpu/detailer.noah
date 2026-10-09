import type Lenis from "lenis";

let lenis: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  lenis = l;
};

export const getLenis = () => lenis;

/** Expo-out: fast start, long soft landing — used for every programmatic scroll. */
export const scrollEasing = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Distance to keep clear under the fixed header. */
export function headerOffset() {
  return (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 72) + 8;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Smooth-scroll to an element or y position (Lenis when active, native otherwise). */
export function scrollToTarget(target: HTMLElement | number, { offset = -headerOffset(), immediate = false } = {}) {
  // Resolve to an exact pixel position ourselves: Lenis would otherwise also subtract html's scroll-padding-top.
  const y = Math.max(0, typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY + offset);
  if (lenis) {
    // A glide started while paused (e.g. a link inside the open mobile menu) would be cancelled by the later
    // start() → reset(), so unpause first.
    if (lenis.isStopped) lockScroll(false);
    // Longer trips get a little more time, capped so far jumps never feel sluggish.
    const duration = Math.min(1.6, 0.8 + Math.abs(y - window.scrollY) / 4000);
    lenis.scrollTo(y, { duration, easing: scrollEasing, immediate, force: true });
    return;
  }
  window.scrollTo({ top: y, behavior: immediate || reducedMotion() ? "auto" : "smooth" });
}

/** Smooth-scroll to an element id. Returns false if it isn't on this page. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  scrollToTarget(el);
  return true;
}

/** Freeze page scrolling (e.g. while the mobile menu is open). */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
