/**
 * GoldLine — the single decorative rule used throughout the invitation.
 *
 * Two hairlines meeting a small ringed centre dot. Replaces every CSS
 * border, <hr>, and gradient divider in the design. Drawn as SVG so the
 * stroke stays crisp at any width and reads as engraved, not painted.
 *
 * Each part carries a class (.gl-line--left/right, .gl-ring, .gl-dot)
 * so entrance choreography can draw the lines outward from the centre.
 */
export default function GoldLine({ width = 120, className }) {
  const w = width;
  return (
    <svg
      width={w}
      height="8"
      viewBox={`0 0 ${w} 8`}
      className={className}
      fill="none"
      aria-hidden="true"
      role="presentation"
    >
      <line className="gl-line gl-line--left" x1="0" y1="4" x2={w * 0.42} y2="4" stroke="#c9a84c" strokeWidth="0.5" opacity="0.7" />
      <circle className="gl-ring" cx={w * 0.5} cy="4" r="1.5" fill="none" stroke="#c9a84c" strokeWidth="0.5" />
      <circle className="gl-dot" cx={w * 0.5} cy="4" r="0.5" fill="#c9a84c" />
      <line className="gl-line gl-line--right" x1={w * 0.58} y1="4" x2={w} y2="4" stroke="#c9a84c" strokeWidth="0.5" opacity="0.7" />
    </svg>
  );
}
