"use client";

import { useEffect } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import Lenis from "lenis";
import { setLenis } from "@/lib/scroll";
import { ToastProvider } from "./Toast";
import { RevealObserver } from "./RevealObserver";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let raf = 0;

    const start = () => {
      lenis = new Lenis({ duration: 1.1, anchors: { offset: -80 }, autoRaf: false });
      setLenis(lenis);
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
      setLenis(null);
    };

    if (!mq.matches) start();
    const onChange = () => (mq.matches ? stop() : start());
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          {children}
          <RevealObserver />
        </ToastProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
