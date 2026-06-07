import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const PETALS = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${6 + (i * 6) % 88}%`,
    top: `${4 + (i * 12) % 82}%`,
    size: 36 + (i % 4) * 16,
    rotate: i * 22.5 + Math.random() * 15,
    color: i % 2 === 0 ? '#e8b4b8' : '#8fa98f',
}));

function PetalSVG({ color, ...props }) {
    // Unique ID for gradients
    const gradId = `bloom-petal-grad-${color.replace('#', '')}-${props.id || 'default'}`;
    const darkColor = color === '#e8b4b8' ? '#c47b84' : '#6f8a69';

    return (
        <svg viewBox="0 0 40 40" fill="none" stroke="none" {...props}>
            <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.75" />
                    <stop offset="100%" stopColor={darkColor} stopOpacity="0.9" />
                </linearGradient>
            </defs>
            <path d="M20 2 C28 10, 36 18, 32 28 C28 36, 12 36, 8 28 C4 18, 12 10, 20 2 Z" fill={`url(#${gradId})`} />
            <path d="M20 2 L20 28" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="0.8" />
        </svg>
    );
}

export default function BloomOpening({ onComplete }) {
    const rootRef = useRef(null);
    const sealRef = useRef(null);

    useEffect(() => {
        // Soft idle floating animation on load
        gsap.to('.bloom-opening__petal', {
            x: 'random(-20, 20)',
            y: 'random(-20, 20)',
            rotation: '+=random(-25, 25)',
            duration: 'random(4, 6)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: {
                each: 0.12,
                from: 'random'
            }
        });
    }, []);

    function open() {
        const tl = gsap.timeline({ onComplete });

        // Circular blast away from the center
        tl.to(sealRef.current, { scale: 0.8, opacity: 0, rotation: -20, duration: 0.7, ease: 'back.in(1.5)' })
            .to(
                '.bloom-opening__petal',
                {
                    scale: 0.1,
                    opacity: 0,
                    x: (i) => {
                        const angle = (i / 16) * Math.PI * 2;
                        return Math.cos(angle) * 350;
                    },
                    y: (i) => {
                        const angle = (i / 16) * Math.PI * 2;
                        return Math.sin(angle) * 350;
                    },
                    rotation: (i) => (i % 2 === 0 ? 360 : -360) + Math.random() * 120,
                    duration: 1.6,
                    stagger: 0.02,
                    ease: 'power3.inOut',
                },
                0,
            )
            .to(rootRef.current, { opacity: 0, duration: 0.8 }, 0.8);
    }

    return (
        <div ref={rootRef} className="bloom-opening" onClick={open} onTouchEnd={(e) => { e.preventDefault(); open(); }} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && open()} aria-label="Tap to bloom open">
            {PETALS.map((p) => (
                <PetalSVG
                    key={p.id}
                    id={p.id}
                    className="bloom-opening__petal"
                    color={p.color}
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
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
