import { useEffect, useRef, useState } from 'react';
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
    };
}

export default function Countdown({ eventDate, eventTime }) {
    const sceneRef = useRef(null);
    const unitsRef = useRef([]);
    const target = getCountdownTarget(eventDate, eventTime);
    const [remaining, setRemaining] = useState(() => calcRemaining(target));

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining(calcRemaining(target));
        }, 30000);

        return () => clearInterval(interval);
    }, [eventDate, eventTime]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                unitsRef.current,
                { opacity: 0, y: 40, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: 'power3.out',
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
    ];

    return (
        <section ref={sceneRef} className="invite-scene countdown-scene">
            <p className="countdown-title">Counting Down</p>

            <div className="countdown-grid">
                {units.map((unit, index) => (
                    <div
                        key={unit.label}
                        ref={(el) => {
                            unitsRef.current[index] = el;
                        }}
                        className="countdown-unit"
                    >
                        <span className="countdown-number">{unit.value}</span>
                        <span className="countdown-label">{unit.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
