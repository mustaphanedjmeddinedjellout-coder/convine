import { useRef } from 'react';
import gsap from 'gsap';

const PETALS = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${8 + (i * 6.5) % 84}%`,
    top: `${5 + (i * 11) % 80}%`,
    size: 28 + (i % 4) * 12,
    rotate: i * 26,
    color: i % 2 === 0 ? '#e8b4b8' : '#8fa98f',
}));

export default function BloomOpening({ onComplete }) {
    const rootRef = useRef(null);
    const sealRef = useRef(null);

    function open() {
        const tl = gsap.timeline({ onComplete });

        tl.to(sealRef.current, { scale: 1.2, opacity: 0, duration: 0.6, ease: 'power2.in' })
            .to(
                '.bloom-opening__petal',
                {
                    scale: 2.2,
                    opacity: 0,
                    x: (i) => (i % 2 === 0 ? -80 : 80),
                    y: (i) => -120 - i * 8,
                    rotation: (i) => i * 40,
                    duration: 1.4,
                    stagger: 0.04,
                    ease: 'power2.out',
                },
                0.1,
            )
            .to(rootRef.current, { opacity: 0, duration: 0.7 }, 0.9);
    }

    return (
        <div ref={rootRef} className="bloom-opening" onClick={open} onTouchEnd={(e) => { e.preventDefault(); open(); }} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && open()} aria-label="Tap to bloom open">
            {PETALS.map((p) => (
                <span
                    key={p.id}
                    className="bloom-opening__petal"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        background: p.color,
                        transform: `rotate(${p.rotate}deg)`,
                    }}
                />
            ))}
            <div ref={sealRef} className="bloom-opening__seal">
                <p className="bloom-opening__label">Wedding Invitation</p>
                <div className="bloom-opening__seal-ring">
                    <span>A&amp;Y</span>
                </div>
                <p className="bloom-opening__hint">Tap to Bloom</p>
            </div>
        </div>
    );
}
