import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GoldLine from '../shared/GoldLine';

gsap.registerPlugin(ScrollTrigger);

/**
 * OrnamentalDivider — the single section divider used between scenes.
 *
 * On scroll the centre dot appears first, then the hairlines draw
 * outward from it — like a rule being inked. The `variant` prop only
 * nudges the width so the rhythm down the page stays varied without
 * introducing competing motifs.
 */
const VARIANT_WIDTH = {
  diamond: 200,
  arabesque: 240,
  dots: 160,
  floral: 220,
};

export default function OrnamentalDivider({ variant = 'diamond' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref);

      // Lines grow outward from the centre dot
      gsap.set(q('.gl-line--left'), { transformOrigin: '100% 50%', scaleX: 0 });
      gsap.set(q('.gl-line--right'), { transformOrigin: '0% 50%', scaleX: 0 });
      gsap.set(q('.gl-ring, .gl-dot'), { transformOrigin: '50% 50%', scale: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 88%',
        },
      });

      tl.from(ref.current, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 0)
        .to(q('.gl-ring, .gl-dot'), { scale: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .to(q('.gl-line--left, .gl-line--right'), {
          scaleX: 1,
          duration: 1.1,
          ease: 'power2.inOut',
        }, 0.15);
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="ornamental-divider" aria-hidden="true">
      <GoldLine width={VARIANT_WIDTH[variant] || 200} className="divider-svg" />
    </div>
  );
}
