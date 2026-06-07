import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── SVG corner flourish (decorative L-shaped ornament with curves) ─── */
function CornerFlourish({ className }) {
    return (
        <svg
            className={className}
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Main curved L-shape ornament */}
            <path
                d="M2 58 C2 28, 4 16, 16 4 Q22 2, 58 2"
                stroke="var(--gold, #d4a853)"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
            />
            {/* Inner decorative curl */}
            <path
                d="M8 52 C8 32, 12 22, 22 12 Q26 8, 48 8"
                stroke="var(--gold-light, #e8c97a)"
                strokeWidth="0.8"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
            />
            {/* Tiny accent dot at the elbow */}
            <circle cx="14" cy="14" r="1.5" fill="var(--gold, #d4a853)" opacity="0.5" />
        </svg>
    );
}

export default function CoupleNames({ brideName, groomName, visible }) {
    const sceneRef = useRef(null);
    const wrapperRef = useRef(null);
    const brideRef = useRef(null);
    const ampRef = useRef(null);
    const groomRef = useRef(null);
    const dividerRef = useRef(null);
    const flourishRef = useRef(null);
    const scrollHintRef = useRef(null);

    useEffect(() => {
        if (!visible || !sceneRef.current) {
            return;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            /* ── Names entrance ── */
            tl.fromTo(brideRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.4 }, 0.2)
                .fromTo(ampRef.current, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.8 }, 0.8)
                .fromTo(groomRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.4 }, 1.0)
                .fromTo(dividerRef.current, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 1 }, 1.6);

            /* ── Corner flourishes fade in ── */
            if (flourishRef.current) {
                const flourishes = flourishRef.current.querySelectorAll('.flourish-corner');
                tl.fromTo(
                    flourishes,
                    { opacity: 0, scale: 0.6 },
                    { opacity: 1, scale: 1, duration: 0.9, stagger: 0.1, ease: 'power2.out' },
                    1.2,
                );
            }

            /* ── Activate shimmer on the wrapper after names land ── */
            if (wrapperRef.current) {
                tl.call(() => {
                    wrapperRef.current?.classList.add('shimmer-active');
                }, null, 2.4);
            }

            /* ── Scroll hint pulse animation ── */
            if (scrollHintRef.current) {
                tl.fromTo(
                    scrollHintRef.current,
                    { opacity: 0, y: -8 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                    2.6,
                );

                // Continuous gentle bounce on the chevron SVG
                const chevron = scrollHintRef.current.querySelector('svg');
                if (chevron) {
                    gsap.to(chevron, {
                        y: 6,
                        duration: 0.9,
                        ease: 'sine.inOut',
                        repeat: -1,
                        yoyo: true,
                        delay: 3.4,
                    });
                }
            }

            /* ── Parallax: subtle vertical shift on scroll ── */
            ScrollTrigger.create({
                trigger: sceneRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
                animation: gsap.to(sceneRef.current, { y: -30, ease: 'none' }),
            });
        }, sceneRef);

        return () => ctx.revert();
    }, [visible]);

    return (
        <section ref={sceneRef} className="invite-scene names-scene">
            {/* Decorative flourish frame around the names area */}
            <div ref={flourishRef} className="names-flourish-frame">
                <CornerFlourish className="flourish-corner flourish-corner--tl" />
                <CornerFlourish className="flourish-corner flourish-corner--tr" />
                <CornerFlourish className="flourish-corner flourish-corner--bl" />
                <CornerFlourish className="flourish-corner flourish-corner--br" />
            </div>

            <div ref={wrapperRef} className="couple-names-wrapper">
                <h1 ref={brideRef} className="couple-name">
                    {brideName}
                </h1>
                <p ref={ampRef} className="couple-ampersand">
                    &amp;
                </p>
                <h1 ref={groomRef} className="couple-name">
                    {groomName}
                </h1>
            </div>

            <div ref={dividerRef} className="names-divider" />

            {/* Animated scroll hint chevron */}
            <div ref={scrollHintRef} className="scroll-hint">
                <span>Scroll</span>
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                    <path d="M8 3v14M8 17l-4-4M8 17l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>
        </section>
    );
}
