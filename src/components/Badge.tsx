// Badge inspired by Noah's apparel logo (rounded shield, pickup line-art, NOAH'S / DETAILING / NOBLE & MOBILE).
// TODO: replace with the owner's original logo files if available.

export const SHIELD = "M30 10H170Q190 10 190 30V170Q190 205 100 250Q10 205 10 170V30Q10 10 30 10Z";
const SHIELD_INNER = "M36 20H164Q180 20 180 36V168Q180 198 100 238Q20 198 20 168V36Q20 20 36 20Z";

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

export function Badge({ className, title = "Noah's Detailing badge" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id="badge-fill" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#3D7BFF" />
          <stop offset="1" stopColor="#1A4FD6" />
        </linearGradient>
        <linearGradient id="badge-shine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.65" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={SHIELD} fill="url(#badge-fill)" />
      <path d={SHIELD} fill="url(#badge-shine)" />
      <path d={SHIELD_INNER} fill="none" stroke="#EAF2FF" strokeOpacity="0.55" strokeWidth="2.5" />
      <g fill="#EAF2FF" style={{ fontFamily: "var(--font-display-face), 'Arial Narrow', sans-serif" }} fontStyle="italic" textAnchor="middle">
        <text x="100" y="66" fontSize="36" fontWeight="800" letterSpacing="1">NOAH&apos;S</text>
        <g transform="translate(34 82) scale(0.66)" color="#EAF2FF">
          <TruckArt strokeWidth={4.5} />
        </g>
        <text x="100" y="176" fontSize="40" fontWeight="900" letterSpacing="0.5">DETAILING</text>
        <text x="100" y="200" fontSize="12.5" fontWeight="700" letterSpacing="3.5" fontStyle="normal">NOBLE &amp; MOBILE</text>
      </g>
    </svg>
  );
}

/** Compact mark for the header / favicon sizes: shield + truck, no text. */
export function BadgeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="mark-fill" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#3D7BFF" />
          <stop offset="1" stopColor="#1A4FD6" />
        </linearGradient>
      </defs>
      <path d={SHIELD} fill="url(#mark-fill)" />
      <path d={SHIELD_INNER} fill="none" stroke="#EAF2FF" strokeOpacity="0.6" strokeWidth="5" />
      <g transform="translate(16 82) scale(0.84)" color="#EAF2FF">
        <TruckArt strokeWidth={9} />
      </g>
    </svg>
  );
}
