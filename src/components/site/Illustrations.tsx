import { cn } from "@/lib/utils";

/** Side-profile driving school car with learner "L" board. */
export function CarIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 290" className={cn("h-auto w-full", className)} role="img" aria-label="BBC Motors training car">
      <ellipse cx="270" cy="262" rx="230" ry="14" className="fill-navy-deep" opacity="0.55" />
      {/* L board */}
      <rect x="196" y="72" width="8" height="16" className="fill-muted-foreground" />
      <rect x="236" y="72" width="8" height="16" className="fill-muted-foreground" />
      <rect x="182" y="26" width="76" height="50" rx="6" className="fill-card stroke-border" strokeWidth="2" />
      <text x="220" y="65" textAnchor="middle" className="fill-cert-red" style={{ font: "800 40px var(--font-sans)" }}>L</text>
      {/* body */}
      <path
        d="M40 228 L42 162 Q45 140 70 126 L120 93 Q130 87 146 86 L290 84 Q310 84 326 98 L374 140 L456 152 Q486 158 493 186 L495 214 Q495 228 480 228 L442 228 A44 44 0 0 0 354 228 L180 228 A44 44 0 0 0 92 228 Z"
        className="fill-card stroke-navy"
        strokeWidth="2.5"
      />
      {/* lower trim */}
      <path d="M48 205 L90 205 M182 205 L352 205 M444 205 L492 205" className="stroke-navy" strokeWidth="3" opacity="0.6" />
      {/* windows */}
      <path d="M132 101 L204 97 L204 140 L94 141 Q98 120 132 101 Z" className="fill-navy" opacity="0.88" />
      <path d="M214 96 L288 94 Q302 94 313 105 L346 140 L214 140 Z" className="fill-navy" opacity="0.88" />
      <path d="M140 106 L170 104 L120 136 L104 136 Z" className="fill-card" opacity="0.18" />
      <path d="M232 100 L262 99 L222 136 L214 136 L214 120 Z" className="fill-card" opacity="0.18" />
      {/* door lines */}
      <path d="M209 96 L209 222 M352 142 Q356 190 350 222" className="stroke-border" strokeWidth="2.5" fill="none" />
      <rect x="226" y="152" width="22" height="6" rx="3" className="fill-muted-foreground" />
      <rect x="320" y="152" width="20" height="6" rx="3" className="fill-muted-foreground" />
      {/* branding */}
      <text x="280" y="192" textAnchor="middle" className="fill-brand" style={{ font: "800 30px var(--font-sans)", letterSpacing: "2px" }}>BBC</text>
      <text x="150" y="174" textAnchor="middle" className="fill-navy" style={{ font: "700 11px var(--font-sans)" }}>DRIVING SCHOOL</text>
      {/* lights */}
      <path d="M460 160 Q484 164 488 182 L464 178 Z" className="fill-warning" />
      <rect x="40" y="150" width="10" height="26" rx="3" className="fill-cert-red" />
      {/* mirror */}
      <path d="M344 128 L366 124 L368 138 L350 140 Z" className="fill-navy" />
      {/* wheels */}
      {[136, 398].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="228" r="36" className="fill-navy-deep" />
          <circle cx={cx} cy="228" r="20" className="fill-muted-foreground" />
          <circle cx={cx} cy="228" r="7" className="fill-navy-deep" />
        </g>
      ))}
    </svg>
  );
}

/** Front of the school building with its signboard. */
export function SchoolIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 300" className={cn("h-full w-full", className)} role="img" aria-label="BBC Motor Driving School building" preserveAspectRatio="xMidYMid slice">
      <rect width="640" height="300" className="fill-brand-soft" />
      <circle cx="560" cy="60" r="30" className="fill-warning" opacity="0.5" />
      {/* trees */}
      {(
        [
          [40, 170, 60],
          [110, 150, 50],
          [600, 160, 62],
          [530, 180, 44],
        ] as const
      ).map(([cx, cy, r]) => (
        <g key={`${cx}`}>
          <rect x={cx - 5} y={cy} width="10" height={260 - cy} className="fill-navy" opacity="0.5" />
          <circle cx={cx} cy={cy} r={r} className="fill-success" opacity="0.85" />
        </g>
      ))}
      {/* building */}
      <rect x="130" y="120" width="380" height="140" className="fill-card" />
      <rect x="120" y="108" width="400" height="16" className="fill-navy" />
      {/* signboard */}
      <rect x="150" y="44" width="340" height="56" rx="4" className="fill-navy" />
      <rect x="156" y="50" width="328" height="44" rx="2" className="fill-none stroke-card" strokeWidth="1.5" opacity="0.6" />
      <text x="320" y="80" textAnchor="middle" className="fill-card" style={{ font: "800 19px var(--font-sans)", letterSpacing: "0.5px" }}>BBC MOTOR DRIVING SCHOOL</text>
      <rect x="200" y="100" width="6" height="10" className="fill-navy" />
      <rect x="434" y="100" width="6" height="10" className="fill-navy" />
      {/* pillars */}
      {[150, 230, 410, 490].map((x) => (
        <rect key={x} x={x - 6} y="124" width="12" height="136" className="fill-border" />
      ))}
      {/* windows and door */}
      {[175, 255, 365, 445].map((x) => (
        <rect key={x} x={x} y="150" width="34" height="44" rx="2" className="fill-navy" opacity="0.75" />
      ))}
      <rect x="296" y="160" width="48" height="100" rx="2" className="fill-navy" />
      <rect x="318" y="160" width="4" height="100" className="fill-card" opacity="0.4" />
      {/* ground */}
      <rect y="260" width="640" height="40" className="fill-muted-foreground" opacity="0.35" />
      <rect x="0" y="278" width="640" height="4" className="fill-card" opacity="0.6" />
    </svg>
  );
}
