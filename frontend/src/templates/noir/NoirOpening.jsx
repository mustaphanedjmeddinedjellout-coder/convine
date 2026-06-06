import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function NoirOpening({ onComplete }) {
    const rootRef = useRef(null);
    const openedRef = useRef(false);

    useEffect(() => {
        gsap.fromTo('.noir-opening__line', { strokeDashoffset: 800 }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: 0.15 });
    }, []);

    function open() {
        if (openedRef.current) return;
        openedRef.current = true;

        gsap.timeline({ onComplete })
            .to('.noir-opening__cta', { opacity: 0, duration: 0.4 })
            .to('.noir-opening__line', { stroke: '#f5ecd8', duration: 0.6 }, 0)
            .to(rootRef.current, { opacity: 0, duration: 0.8 }, 0.5);
    }

    return (
        <div ref={rootRef} className="noir-opening" onClick={open} onTouchEnd={(e) => { e.preventDefault(); open(); }} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && open()} aria-label="Enter invitation">
            <div className="noir-opening__frame">
                <svg className="noir-opening__svg" viewBox="0 0 320 520" aria-hidden="true">
                    <path className="noir-opening__line" strokeDasharray="800" d="M160 20 L300 20 L300 500 L20 500 L20 20 L160 20" />
                    <path className="noir-opening__line" strokeDasharray="400" d="M160 20 L160 120 M60 120 L260 120" />
                    <path className="noir-opening__line" strokeDasharray="300" d="M60 120 L60 200 L260 200 L260 120" />
                    <path className="noir-opening__line" strokeDasharray="600" d="M80 200 Q160 280 240 200" />
                    <path className="noir-opening__line" strokeDasharray="500" d="M100 320 L220 320 M100 380 L220 380 M100 440 L220 440" />
                </svg>
                <div className="noir-opening__cta">
                    <p className="noir-opening__eyebrow">You are invited</p>
                    <p className="noir-opening__title">Enter</p>
                </div>
            </div>
        </div>
    );
}
