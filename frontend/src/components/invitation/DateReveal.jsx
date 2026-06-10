import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DateScratchReveal from '../shared/DateScratchReveal';

gsap.registerPlugin(ScrollTrigger);

export default function DateReveal({ eventDate, visible }) {
    const wrapperRef = useRef(null);
    const lineRef = useRef(null);
    const badgeRef = useRef(null);

    useEffect(() => {
        if (!wrapperRef.current) {
            return;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: 'top 78%',
                    toggleActions: 'play none none reverse',
                },
            });

            /* ── Expanding horizontal line grows from center ── */
            if (lineRef.current) {
                tl.fromTo(
                    lineRef.current,
                    { scaleX: 0, opacity: 0 },
                    { scaleX: 1, opacity: 1, duration: 1, ease: 'power2.inOut' },
                    0,
                );
            }

            /* ── Date badge rests into place ── */
            if (badgeRef.current) {
                tl.fromTo(
                    badgeRef.current,
                    { opacity: 0, y: 22 },
                    { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' },
                    0.4,
                );
            }
        }, wrapperRef);

        return () => ctx.revert();
    }, [visible]);

    return (
        <div ref={wrapperRef} className="date-reveal-wrapper">
            {/* Expanding horizontal line — grows outward from center */}
            <div ref={lineRef} className="date-line-expand" />

            {/* Decorative date badge container */}
            <div ref={badgeRef} className="date-badge">
                <DateScratchReveal
                    eventDate={eventDate}
                    visible={visible}
                    theme="velvet"
                    shape="circle"
                    sceneClass="invite-scene date-scene"
                    titleClass="date-scene-title"
                    rowClass="date-reveal-row scratch-date-row"
                    hintClass="date-reveal-hint"
                    title="Our Wedding Date"
                    hintScratch="Swipe your finger to brush away the coating"
                    hintDone="Save the date in your heart"
                />
            </div>

            {/* Bottom expanding line for symmetry */}
            <div className="date-line-expand date-line-expand--bottom" />
        </div>
    );
}
