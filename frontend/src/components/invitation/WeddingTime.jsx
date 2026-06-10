import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GoldLine from '../shared/GoldLine';

gsap.registerPlugin(ScrollTrigger);

/**
 * Splits an "HH:MM" 24-hour string into an engraved numeral ("7:00") and a
 * spoken period ("in the evening"). Falls back gracefully on bad input.
 */
function parseTime(eventTime) {
    if (!eventTime || !eventTime.includes(':')) {
        return { numeral: eventTime || '7:00', period: 'in the evening' };
    }
    const [hStr, mStr = '00'] = eventTime.split(':');
    const h = parseInt(hStr, 10);
    const m = mStr.padStart(2, '0');
    const hour12 = ((h + 11) % 12) + 1;

    let period;
    if (h < 12) period = 'in the morning';
    else if (h < 17) period = 'in the afternoon';
    else period = 'in the evening';

    return { numeral: `${hour12}:${m}`, period };
}

export default function WeddingTime({ eventTime }) {
    const sceneRef = useRef(null);
    const itemsRef = useRef([]);

    const { numeral, period } = useMemo(() => parseTime(eventTime), [eventTime]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(itemsRef.current.filter(Boolean), {
                opacity: 0,
                y: 22,
                duration: 1.4,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sceneRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                },
            });
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    const register = (el) => {
        if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el);
    };

    return (
        <section ref={sceneRef} className="invite-scene invite-scene--compact time-scene">
            <div className="time-display">
                <div ref={register}>
                    <GoldLine width={100} />
                </div>
                <p ref={register} className="label time-label">The Ceremony Begins</p>
                <p ref={register} className="time-numeral">{numeral}</p>
                <p ref={register} className="time-period">{period}</p>
                <div ref={register}>
                    <GoldLine width={100} />
                </div>
            </div>
        </section>
    );
}
