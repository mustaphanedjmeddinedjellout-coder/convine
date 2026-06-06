import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CoupleNames({ brideName, groomName, visible }) {
    const sceneRef = useRef(null);
    const brideRef = useRef(null);
    const ampRef = useRef(null);
    const groomRef = useRef(null);
    const dividerRef = useRef(null);

    useEffect(() => {
        if (!visible || !sceneRef.current) {
            return;
        }

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(brideRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.4 }, 0.2)
            .fromTo(ampRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.8)
            .fromTo(groomRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.4 }, 1.0)
            .fromTo(dividerRef.current, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 1 }, 1.6);

        return () => tl.kill();
    }, [visible]);

    return (
        <section ref={sceneRef} className="invite-scene names-scene">
            <h1 ref={brideRef} className="couple-name">
                {brideName}
            </h1>
            <p ref={ampRef} className="couple-ampersand">
                &amp;
            </p>
            <h1 ref={groomRef} className="couple-name">
                {groomName}
            </h1>
            <div ref={dividerRef} className="names-divider" />

            <div className="scroll-hint">
                <span>Scroll</span>
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                    <path d="M8 3v14M8 17l-4-4M8 17l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>
        </section>
    );
}
