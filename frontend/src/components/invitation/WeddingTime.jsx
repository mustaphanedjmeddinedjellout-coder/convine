import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatEventTime } from '../../lib/formatWeddingDate';

gsap.registerPlugin(ScrollTrigger);

/* ─── Elegant clock face outline SVG ─── */
function ClockIcon({ className }) {
    return (
        <svg
            className={className}
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outer circle */}
            <circle
                cx="14"
                cy="14"
                r="12.5"
                stroke="var(--gold, #d4a853)"
                strokeWidth="1"
                opacity="0.8"
            />
            {/* Inner decorative circle */}
            <circle
                cx="14"
                cy="14"
                r="10.5"
                stroke="var(--gold-light, #e8c97a)"
                strokeWidth="0.5"
                opacity="0.3"
            />
            {/* Hour hand */}
            <line x1="14" y1="14" x2="14" y2="7" stroke="var(--gold, #d4a853)" strokeWidth="1.2" strokeLinecap="round" />
            {/* Minute hand */}
            <line x1="14" y1="14" x2="20" y2="14" stroke="var(--gold, #d4a853)" strokeWidth="0.8" strokeLinecap="round" />
            {/* Center dot */}
            <circle cx="14" cy="14" r="1.2" fill="var(--gold, #d4a853)" />
            {/* Hour markers (12, 3, 6, 9) */}
            <line x1="14" y1="3" x2="14" y2="5" stroke="var(--gold, #d4a853)" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="25" y1="14" x2="23" y2="14" stroke="var(--gold, #d4a853)" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="14" y1="25" x2="14" y2="23" stroke="var(--gold, #d4a853)" strokeWidth="0.8" strokeLinecap="round" />
            <line x1="3" y1="14" x2="5" y2="14" stroke="var(--gold, #d4a853)" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
    );
}

export default function WeddingTime({ eventTime }) {
    const sceneRef = useRef(null);
    const labelRef = useRef(null);
    const ornamentTopRef = useRef(null);
    const ornamentBottomRef = useRef(null);
    const iconRef = useRef(null);
    const valueRef = useRef(null);
    const timeDisplayRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                    trigger: sceneRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                },
            });

            /* ── Label entrance ── */
            tl.fromTo(
                labelRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1.4 },
                0,
            );

            /* ── Top ornament line expands from center ── */
            tl.fromTo(
                ornamentTopRef.current,
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.inOut' },
                0.4,
            );

            /* ── Stagger: clock icon, then time value, then period ── */
            tl.fromTo(
                iconRef.current,
                { opacity: 0, scale: 0.5, rotation: -90 },
                { opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.4)' },
                0.6,
            );

            tl.fromTo(
                valueRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1.2 },
                0.9,
            );

            /* ── Bottom ornament line ── */
            tl.fromTo(
                ornamentBottomRef.current,
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.inOut' },
                1.3,
            );

            /* ── Add glow class after full reveal ── */
            tl.call(() => {
                timeDisplayRef.current?.classList.add('time-glow');
            }, null, 1.8);
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="invite-scene invite-scene--compact time-scene">
            <p ref={labelRef} className="time-label">
                The Ceremony Begins
            </p>

            {/* Decorative thin gold line above time */}
            <div ref={ornamentTopRef} className="time-ornament time-ornament--top" />

            <div ref={timeDisplayRef} className="time-display">
                {/* Elegant clock icon */}
                <span ref={iconRef} className="time-icon">
                    <ClockIcon />
                </span>
                <p ref={valueRef} className="time-value">
                    {formatEventTime(eventTime)}
                </p>
            </div>

            {/* Decorative thin gold line below time */}
            <div ref={ornamentBottomRef} className="time-ornament time-ornament--bottom" />
        </section>
    );
}
