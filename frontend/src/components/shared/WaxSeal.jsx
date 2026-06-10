import { forwardRef, useId } from 'react';

/**
 * WaxSeal — a pressed red wax seal with an embossed monogram initial.
 *
 * Deep oxblood disc, a faint inner ring suggesting the press of a die,
 * and a single italic initial. Layered drop-shadows give it physical
 * weight resting on the paper rather than a flat sticker.
 */
const WaxSeal = forwardRef(function WaxSeal({ initial = 'A', className = '' }, ref) {
  // Unique gradient id per instance so multiple seals never collide
  const gradId = `wax-body-${useId()}`;
  return (
    <div ref={ref} className={`wax-seal ${className}`.trim()}>
      <svg viewBox="0 0 80 80" width="80" height="80" aria-hidden="true">
        <defs>
          {/* Subtle sheen so the wax catches light off-centre */}
          <radialGradient id={gradId} cx="38%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#a82424" />
            <stop offset="55%" stopColor="#8b1a1a" />
            <stop offset="100%" stopColor="#6e1212" />
          </radialGradient>
        </defs>

        {/* Body */}
        <circle cx="40" cy="40" r="36" fill={`url(#${gradId})`} />
        {/* Embossed inner ring */}
        <circle cx="40" cy="40" r="28" fill="none" stroke="rgba(255,200,150,0.22)" strokeWidth="0.5" />
        <circle cx="40" cy="40" r="30.5" fill="none" stroke="rgba(60,8,8,0.45)" strokeWidth="0.5" />
        {/* Monogram */}
        <text
          x="40"
          y="47"
          textAnchor="middle"
          fontFamily="'IM Fell English', Georgia, serif"
          fontStyle="italic"
          fontSize="26"
          fill="rgba(255,222,168,0.88)"
        >
          {initial}
        </text>
      </svg>
    </div>
  );
});

export default WaxSeal;
