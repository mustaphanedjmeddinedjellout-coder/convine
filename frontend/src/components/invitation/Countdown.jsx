import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getCountdownTarget } from '../../lib/formatWeddingDate';
import GoldLine from '../shared/GoldLine';

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
                { scale: 1.1, opacity: 0.65 },
                { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
            );
        }
        prevSecondsRef.current = remaining.seconds;
    }, [remaining.seconds]);

    // Slow, inevitable entrance — medallions rise and settle
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(unitsRef.current, {
                opacity: 0,
                y: 22,
                duration: 1.4,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sceneRef.current,
                    start: 'top 75%',
                },
            });
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
            {/* Engraved rule above the title */}
            <div className="countdown-ornament" aria-hidden="true">
                <GoldLine width={120} />
            </div>

            <p className="countdown-title label">Until We Say I Do</p>

            <div className="countdown-grid">
                {units.map((unit, index) => (
                    <div
                        key={unit.label}
                        ref={(el) => {
                            unitsRef.current[index] = el;
                        }}
                        className="countdown-unit"
                    >
                        {/* Engraved medallion */}
                        <div className="countdown-glow">
                            <span
                                className="countdown-number"
                                ref={unit.label === 'Seconds' ? secondsRef : null}
                            >
                                {String(unit.value).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="countdown-label label">{unit.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
