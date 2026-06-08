import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Timeline event icons ─── */
const EVENT_ICONS = {
    ceremony: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 3C14 3 8 8 8 14C8 17.3 10.7 20 14 20C17.3 20 20 17.3 20 14C20 8 14 3 14 3Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M14 10V16M11 13H17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M10 22H18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M12 22V25H16V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    cocktails: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M7 4H21L14 14V22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 22H18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="17" cy="8" r="1" fill="currentColor" opacity="0.5" />
            <circle cx="11" cy="7" r="0.8" fill="currentColor" opacity="0.4" />
        </svg>
    ),
    reception: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 18C4 18 8 14 14 14C20 14 24 18 24 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M6 18V22H22V18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 8V14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <circle cx="14" cy="6" r="2" stroke="currentColor" strokeWidth="1" />
            <path d="M10 4L14 6L18 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
        </svg>
    ),
    dinner: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="16" r="8" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="14" cy="16" r="5.5" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
            <path d="M8 6V12M8 6C8 6 6 7 6 9C6 11 8 12 8 12M8 6C8 6 10 7 10 9C10 11 8 12 8 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M20 6V12M19 6V9M21 6V9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
    ),
    dance: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="6" r="2.5" stroke="currentColor" strokeWidth="1" />
            <path d="M14 9V16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M14 12L8 16M14 12L20 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M14 16L10 24M14 16L18 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M6 3L8 5M22 3L20 5M4 10H6M22 10H24" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        </svg>
    ),
};

const DEFAULT_SCHEDULE = [
    { time: '16:00', title: 'The Ceremony', description: 'Exchange of vows & rings', icon: 'ceremony' },
    { time: '17:00', title: 'Cocktail Hour', description: 'Welcome drinks & canapés', icon: 'cocktails' },
    { time: '18:00', title: 'Grand Reception', description: 'Formal dinner & toasts', icon: 'reception' },
    { time: '20:00', title: 'Dinner & Celebration', description: 'A feast to remember', icon: 'dinner' },
    { time: '22:00', title: 'Dance & Festivities', description: 'Dancing the night away', icon: 'dance' },
];

export default function CeremonySchedule({ schedule }) {
    const sceneRef = useRef(null);
    const titleRef = useRef(null);
    const lineRef = useRef(null);
    const itemsRef = useRef([]);

    const events = schedule?.length ? schedule : DEFAULT_SCHEDULE;

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* Title entrance */
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 80%' },
                },
            );

            /* Timeline vertical line draws down */
            gsap.fromTo(
                lineRef.current,
                { scaleY: 0 },
                {
                    scaleY: 1,
                    duration: 1.8,
                    ease: 'power2.inOut',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 75%' },
                },
            );

            /* Staggered item reveals */
            itemsRef.current.forEach((el, index) => {
                if (!el) return;
                const isLeft = index % 2 === 0;
                gsap.fromTo(
                    el,
                    { opacity: 0, x: isLeft ? -40 : 40, y: 20 },
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        duration: 1.2,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: el, start: 'top 85%' },
                    },
                );
            });
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="invite-scene schedule-scene">
            <p ref={titleRef} className="schedule-title">The Celebration</p>

            <div className="schedule-timeline">
                {/* Vertical connecting line */}
                <div ref={lineRef} className="schedule-line" aria-hidden="true" />

                {events.map((event, index) => (
                    <div
                        key={index}
                        ref={(el) => { itemsRef.current[index] = el; }}
                        className={`schedule-item ${index % 2 === 0 ? 'schedule-item--left' : 'schedule-item--right'}`}
                    >
                        {/* Timeline dot */}
                        <div className="schedule-dot" aria-hidden="true">
                            <div className="schedule-dot-inner" />
                        </div>

                        {/* Event card */}
                        <div className="schedule-card">
                            <div className="schedule-card-icon" aria-hidden="true">
                                {EVENT_ICONS[event.icon] || EVENT_ICONS.ceremony}
                            </div>
                            <span className="schedule-card-time">{event.time}</span>
                            <h3 className="schedule-card-title">{event.title}</h3>
                            <p className="schedule-card-desc">{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
