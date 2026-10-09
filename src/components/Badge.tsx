// Badge matching Noah's apparel logo: tall rounded "pill" outline, NOAH'S over pickup line-art,
// solid blue band with DETAILING / NOBLE & MOBILE. TODO: swap in the owner's original vector file if available.

export const BADGE_SHAPE = "M100 8A86 86 0 0 1 186 94V166A86 86 0 0 1 14 166V94A86 86 0 0 1 100 8Z";
const BAND_TOP = 168;

export function TruckArt({ className, strokeWidth = 3.5 }: { className?: string; strokeWidth?: number }) {
  return (
    <g className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path pathLength={1} d="M12 66V46H92L102 22H134L150 42L182 46Q189 47 189 54V64Q189 67 186 67H170A18 18 0 0 0 134 67H70A18 18 0 0 0 34 67H15Q12 67 12 66Z" />
      <path pathLength={1} d="M106 27H118V42H100Z" />
      <path pathLength={1} d="M122 27H132L144 42H122Z" />
      <path pathLength={1} d="M16 52H86M92 46V62M179 51H186" />
      <circle pathLength={1} cx="152" cy="67" r="12" />
      <circle pathLength={1} cx="52" cy="67" r="12" />
      <circle pathLength={1} cx="152" cy="67" r="3.5" />
      <circle pathLength={1} cx="52" cy="67" r="3.5" />
    </g>
  );
}

export function Badge({ className, title = "Noah's Detailing — Noble & Mobile badge" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-label={title}>
      <defs>
        <clipPath id="badge-clip">
          <path d={BADGE_SHAPE} />
        </clipPath>
      </defs>
      <path d={BADGE_SHAPE} fill="#07090D" />
      <rect x="0" y={BAND_TOP} width="200" height="100" fill="#2E6BFF" clipPath="url(#badge-clip)" />
      <path d={BADGE_SHAPE} fill="none" stroke="#2E6BFF" strokeWidth="4.5" />
      <g style={{ fontFamily: "var(--font-display-face), 'Arial Narrow', sans-serif" }} fontStyle="italic" textAnchor="middle">
        <text x="100" y="62" fontSize="38" fontWeight="900" letterSpacing="0.5" fill="#2E6BFF">
          NOAH&apos;S
        </text>
        <text x="100" y="206" fontSize="35" fontWeight="900" fill="#07090D">
          DETAILING
        </text>
        <text x="100" y="228" fontSize="11.5" fontWeight="800" letterSpacing="1.5" fill="#07090D" fontStyle="normal">
          NOBLE &amp; MOBILE
        </text>
      </g>
      <g transform="translate(22 86) scale(0.78)" color="#5AA2FF">
        <TruckArt strokeWidth={3} />
      </g>
    </svg>
  );
}

/** Compact mark for the header: the same pill with the truck and blue band, no lettering. */
export function BadgeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true">
      <defs>
        <clipPath id="mark-clip">
          <path d={BADGE_SHAPE} />
        </clipPath>
      </defs>
      <path d={BADGE_SHAPE} fill="#0B1220" />
      <rect x="0" y={BAND_TOP - 8} width="200" height="110" fill="#2E6BFF" clipPath="url(#mark-clip)" />
      <path d={BADGE_SHAPE} fill="none" stroke="#2E6BFF" strokeWidth="12" />
      <g transform="translate(14 60) scale(0.86)" color="#EAF2FF">
        <TruckArt strokeWidth={10} />
      </g>
    </svg>
  );
}
