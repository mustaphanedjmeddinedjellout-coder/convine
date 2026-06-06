import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatEventTime } from '../../lib/formatWeddingDate';

gsap.registerPlugin(ScrollTrigger);

export default function WeddingTime({ eventTime }) {
    const sceneRef = useRef(null);
    const labelRef = useRef(null);
    const valueRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                [labelRef.current, valueRef.current],
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.4,
                    stagger: 0.3,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sceneRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                },
            );
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="invite-scene invite-scene--compact time-scene">
            <p ref={labelRef} className="time-label">
                Wedding Time
            </p>
            <p ref={valueRef} className="time-value">
                {formatEventTime(eventTime)}
            </p>
        </section>
    );
}
