import type Lenis from "lenis";

let lenis: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  lenis = l;
};

/** Smooth-scroll to an element id (Lenis when active, native otherwise). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const offset = -(parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 72) - 8;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 });
  else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reduce ? "auto" : "smooth" });
  }
  return true;
}
