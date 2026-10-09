"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getLenis, scrollToTarget, setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling for the whole site.
 * - Wheel/trackpad get a soft, weighted glide; touch stays native (feels right on phones).
 * - Same-page hash links ("#quote", "/#work" while on "/") glide to their section under the fixed header.
 * - Inertia stops on navigation; Next keeps control of where a new page lands (top, hash, Back/Forward restore).
 * - Off entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const start = () => {
      lenis = new Lenis({
        lerp: 0.085, // lower = silkier, higher = snappier
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: true,
        stopInertiaOnNavigate: true,
        // Let nested scrollers (and anything marked data-lenis-prevent) scroll on their own.
        allowNestedScroll: true,
      });
      setLenis(lenis);
    };
    const stop = () => {
      lenis?.destroy();
      lenis = null;
      setLenis(null);
    };

    // In-page anchor links: one smooth glide instead of the router's instant jump.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault(); // next/link skips navigation when defaultPrevented; component onClicks still run
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
      scrollToTarget(el);
    };

    if (!mq.matches) start();
    const onChange = () => (mq.matches ? stop() : start());
    mq.addEventListener("change", onChange);
    document.addEventListener("click", onClick, true); // capture: runs before React's handlers
    return () => {
      mq.removeEventListener("change", onChange);
      document.removeEventListener("click", onClick, true);
      stop();
    };
  }, []);

  // After a route change Next has already placed the page (top, hash target, or restored position on Back);
  // Lenis just needs to re-measure the new page height.
  useEffect(() => {
    getLenis()?.resize();
  }, [pathname]);

  return null;
}
