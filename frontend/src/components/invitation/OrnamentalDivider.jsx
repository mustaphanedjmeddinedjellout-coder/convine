import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * OrnamentalDivider — Elegant SVG ornamental dividers between invitation sections.
 * Three variants: 'diamond', 'arabesque', 'dots'
 * All gold-colored, fade-in on scroll.
 */
export default function OrnamentalDivider({ variant = 'diamond' }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;
        gsap.from(ref.current, {
            opacity: 0,
            scaleX: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: ref.current,
                start: 'top 90%',
            },
        });
    }, []);

    return (
        <div ref={ref} className="ornamental-divider" aria-hidden="true">
            {variant === 'diamond' && <DiamondDivider />}
            {variant === 'arabesque' && <ArabesqueDivider />}
            {variant === 'dots' && <DotsDivider />}
            {variant === 'floral' && <FloralDivider />}
        </div>
    );
}

function DiamondDivider() {
    return (
        <svg viewBox="0 0 400 30" className="divider-svg" preserveAspectRatio="xMidYMid meet">
            {/* Left line */}
            <line x1="20" y1="15" x2="175" y2="15" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
            {/* Center diamond */}
            <path d="M190 5 L200 15 L190 25 L180 15 Z" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            <path d="M193 9 L200 15 L193 21 L186 15 Z" fill="currentColor" opacity="0.15" />
            {/* Inner diamond accent */}
            <circle cx="200" cy="15" r="1.5" fill="currentColor" opacity="0.5" />
            {/* Right line */}
            <line x1="225" y1="15" x2="380" y2="15" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        </svg>
    );
}

function ArabesqueDivider() {
    return (
        <svg viewBox="0 0 400 40" className="divider-svg" preserveAspectRatio="xMidYMid meet">
            {/* Left line */}
            <line x1="20" y1="20" x2="155" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
            {/* Left curl */}
            <path d="M160 20 Q170 8 180 14 Q190 20 180 26 Q170 32 160 20" 
                  fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
            {/* Center ornament */}
            <circle cx="200" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
            <circle cx="200" cy="20" r="1" fill="currentColor" opacity="0.4" />
            {/* Right curl (mirrored) */}
            <path d="M240 20 Q230 8 220 14 Q210 20 220 26 Q230 32 240 20" 
                  fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
            {/* Right line */}
            <line x1="245" y1="20" x2="380" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        </svg>
    );
}

function DotsDivider() {
    return (
        <svg viewBox="0 0 400 20" className="divider-svg" preserveAspectRatio="xMidYMid meet">
            {/* Left line */}
            <line x1="30" y1="10" x2="170" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            {/* Three dots */}
            <circle cx="190" cy="10" r="1.5" fill="currentColor" opacity="0.4" />
            <circle cx="200" cy="10" r="2" fill="currentColor" opacity="0.6" />
            <circle cx="210" cy="10" r="1.5" fill="currentColor" opacity="0.4" />
            {/* Right line */}
            <line x1="230" y1="10" x2="370" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </svg>
    );
}

function FloralDivider() {
    return (
        <svg viewBox="0 0 400 30" className="divider-svg" preserveAspectRatio="xMidYMid meet">
            {/* Left line */}
            <line x1="20" y1="15" x2="160" y2="15" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
            {/* Leaf loops */}
            <path d="M164 15 C172 6, 180 6, 186 15 C180 24, 172 24, 164 15 Z" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
            {/* Center floral bud */}
            <circle cx="200" cy="15" r="4" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            <circle cx="200" cy="15" r="1.5" fill="currentColor" opacity="0.5" />
            {/* Little blossom petals */}
            <path d="M200 9 C201.5 11, 203 11, 200 15 C197 11, 198.5 11, 200 9 Z" fill="currentColor" opacity="0.45" />
            <path d="M200 21 C201.5 19, 203 19, 200 15 C197 19, 198.5 19, 200 21 Z" fill="currentColor" opacity="0.45" />
            <path d="M194 15 C196 16.5, 196 18, 200 15 C196 12, 196 13.5, 194 15 Z" fill="currentColor" opacity="0.45" />
            <path d="M206 15 C204 16.5, 204 18, 200 15 C204 12, 204 13.5, 206 15 Z" fill="currentColor" opacity="0.45" />
            {/* Right leaf loops */}
            <path d="M236 15 C228 6, 220 6, 214 15 C220 24, 228 24, 236 15 Z" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
            {/* Right line */}
            <line x1="240" y1="15" x2="380" y2="15" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        </svg>
    );
}
