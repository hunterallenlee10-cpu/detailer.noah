"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { ToastProvider } from "./Toast";
import { RevealObserver } from "./RevealObserver";
import { SmoothScroll } from "./SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          {children}
          <RevealObserver />
          <SmoothScroll />
        </ToastProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
