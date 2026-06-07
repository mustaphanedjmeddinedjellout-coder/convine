import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getCountdownTarget } from '../../lib/formatWeddingDate';

gsap.registerPlugin(ScrollTrigger);

function calcRemaining(target) {
    const diff = Math.max(0, target.getTime() - Date.now());

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

export default function Countdown({ eventDate, eventTime }) {
    const sceneRef = useRef(null);
    const unitsRef = useRef([]);
    const secondsRef = useRef(null);
    const prevSecondsRef = useRef(null);
    const target = getCountdownTarget(eventDate, eventTime);
    const [remaining, setRemaining] = useState(() => calcRemaining(target));

    // Update every second for live seconds display
    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(calcRemaining(target));
        }, 1000);

        return () => clearInterval(interval);
    }, [eventDate, eventTime]);

    // Subtle scale pulse on the seconds value when it changes
    useEffect(() => {
        if (
            prevSecondsRef.current !== null &&
            prevSecondsRef.current !== remaining.seconds &&
            secondsRef.current
        ) {
            gsap.fromTo(
                secondsRef.current,
                { scale: 1.18, opacity: 0.7 },
                { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.6)' },
            );
        }
        prevSecondsRef.current = remaining.seconds;
    }, [remaining.seconds]);

    // Cinematic GSAP entrance — units fly in from below with rotation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                unitsRef.current,
                { opacity: 0, y: 70, scale: 0.8, rotationX: 45 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotationX: 0,
                    duration: 1.4,
                    stagger: 0.18,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: sceneRef.current,
                        start: 'top 75%',
                    },
                },
            );
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    const units = [
        { value: remaining.days, label: 'Days' },
        { value: remaining.hours, label: 'Hours' },
        { value: remaining.minutes, label: 'Minutes' },
        { value: remaining.seconds, label: 'Seconds' },
    ];

    return (
        <section ref={sceneRef} className="invite-scene countdown-scene">
            {/* Decorative ornament above the title */}
            <div className="countdown-ornament" aria-hidden="true">
                <svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M60 4C45 4 38 16 20 16C14 16 8 14 2 10" stroke="var(--gold, #d4a853)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    <path d="M60 4C75 4 82 16 100 16C106 16 112 14 118 10" stroke="var(--gold, #d4a853)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    <circle cx="60" cy="4" r="3" fill="var(--gold, #d4a853)" />
                    <circle cx="2" cy="10" r="1.5" fill="var(--gold-light, #e8c97a)" />
                    <circle cx="118" cy="10" r="1.5" fill="var(--gold-light, #e8c97a)" />
                    <path d="M50 28L60 20L70 28" stroke="var(--gold-light, #e8c97a)" strokeWidth="1" strokeLinecap="round" fill="none" />
                </svg>
            </div>

            <p className="countdown-title">Counting Down</p>

            <div className="countdown-grid">
                {units.map((unit, index) => (
                    <div key={unit.label} style={{ display: 'contents' }}>
                        {/* Pulsing colon separator between units */}
                        {index > 0 && (
                            <span className="countdown-separator" aria-hidden="true">:</span>
                        )}

                        <div
                            ref={(el) => {
                                unitsRef.current[index] = el;
                            }}
                            className="countdown-unit"
                        >
                            {/* Radial gradient glow container */}
                            <div className="countdown-glow">
                                <span
                                    className="countdown-number"
                                    ref={unit.label === 'Seconds' ? secondsRef : null}
                                >
                                    {String(unit.value).padStart(2, '0')}
                                </span>
                            </div>
                            <span className="countdown-label">{unit.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
