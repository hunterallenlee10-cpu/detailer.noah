// Custom line icons. Every shape uses pathLength=1 so the "draw" CSS animation works uniformly.
export type IconName = "mitt" | "vacuum" | "polisher" | "steam" | "paw" | "headlight" | "engine" | "spray";

const shapes: Record<IconName, React.ReactNode> = {
  // wash mitt + bubbles
  mitt: (
    <>
      <path pathLength={1} d="M14 40V22a6 6 0 0112 0v-4a5 5 0 0110 0v6a5 5 0 0110 0v16" />
      <path pathLength={1} d="M12 40h36v6a4 4 0 01-4 4H16a4 4 0 01-4-4z" />
      <circle pathLength={1} cx="44" cy="12" r="3" />
      <circle pathLength={1} cx="52" cy="20" r="2" />
    </>
  ),
  // vacuum wand + head
  vacuum: (
    <>
      <path pathLength={1} d="M44 8L28 40" />
      <path pathLength={1} d="M16 40h22a4 4 0 014 4v2a4 4 0 01-4 4H16a4 4 0 01-4-4v-2a4 4 0 014-4z" />
      <path pathLength={1} d="M40 6l8 4" />
      <path pathLength={1} d="M18 54h4M28 54h4M38 54h4" />
    </>
  ),
  // dual-action polisher
  polisher: (
    <>
      <path pathLength={1} d="M10 22h26a6 6 0 016 6v0a6 6 0 01-6 6H10z" />
      <path pathLength={1} d="M42 28h10" />
      <path pathLength={1} d="M24 34v6" />
      <ellipse pathLength={1} cx="24" cy="46" rx="14" ry="5" />
      <path pathLength={1} d="M46 44c3 2 6 2 9 0M44 52c3 2 7 2 11 0" />
    </>
  ),
  // steam cleaner nozzle + steam
  steam: (
    <>
      <path pathLength={1} d="M10 46h22l10-10h8v10H42l-6 6H10z" />
      <path pathLength={1} d="M20 34c-3-3 3-6 0-9s3-6 0-9" />
      <path pathLength={1} d="M30 34c-3-3 3-6 0-9s3-6 0-9" />
      <path pathLength={1} d="M40 28c-2-2 2-4 0-6" />
    </>
  ),
  // paw
  paw: (
    <>
      <path pathLength={1} d="M32 50c-8 0-14-4-14-10 0-5 6-10 14-10s14 5 14 10c0 6-6 10-14 10z" />
      <ellipse pathLength={1} cx="17" cy="26" rx="4.5" ry="6" />
      <ellipse pathLength={1} cx="27" cy="17" rx="4.5" ry="6" />
      <ellipse pathLength={1} cx="37" cy="17" rx="4.5" ry="6" />
      <ellipse pathLength={1} cx="47" cy="26" rx="4.5" ry="6" />
    </>
  ),
  // headlight with beams
  headlight: (
    <>
      <path pathLength={1} d="M30 14c-10 0-18 8-18 18s8 18 18 18h4V14z" />
      <path pathLength={1} d="M22 32a8 8 0 018-8" />
      <path pathLength={1} d="M40 20l14-4M40 28h16M40 36l14 4M40 44l12 6" />
    </>
  ),
  // engine block
  engine: (
    <>
      <path pathLength={1} d="M14 24h8v-6h14v6h10l6 6h4v14h-4l-6 6H22l-8-8z" />
      <path pathLength={1} d="M22 18v-4h14v4" />
      <path pathLength={1} d="M8 32v10M8 37h6" />
      <path pathLength={1} d="M30 30l-4 8h8l-4 8" />
    </>
  ),
  // spray bottle
  spray: (
    <>
      <path pathLength={1} d="M22 24h16l4 10v18a2 2 0 01-2 2H20a2 2 0 01-2-2V34z" />
      <path pathLength={1} d="M24 24v-8h10l6 4" />
      <path pathLength={1} d="M46 12l6-2M46 18h7M46 24l6 2" />
    </>
  ),
};

export function ServiceIcon({ name, className = "h-12 w-12" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={`draw ${className}`} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {shapes[name]}
    </svg>
  );
}
