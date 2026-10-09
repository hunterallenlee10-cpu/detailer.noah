type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "header";
};

/**
 * Fade/rise once on enter. Server-rendered (no hydration cost): a single observer in <RevealObserver />
 * adds `.is-in`. Content stays visible without JS and under prefers-reduced-motion.
 */
export function Reveal({ children, className, delay = 0, y = 24, as: Comp = "div" }: Props) {
  return (
    <Comp data-reveal="" className={className} style={{ "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` } as React.CSSProperties}>
      {children}
    </Comp>
  );
}
