import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_MESSAGE =
    'We are delighted to invite you to celebrate our wedding and share this special day with us.';

/* ─── Wax seal SVG: circle with interlocking hearts motif ─── */
function WaxSeal({ className, innerRef }) {
    return (
        <svg
            ref={innerRef}
            className={className}
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outer seal edge with wavy border effect */}
            <circle cx="40" cy="40" r="38" stroke="var(--gold, #d4a853)" strokeWidth="1.5" opacity="0.6" />
            <circle cx="40" cy="40" r="35" stroke="var(--gold-light, #e8c97a)" strokeWidth="0.8" opacity="0.3" />

            {/* Filled seal body */}
            <circle cx="40" cy="40" r="32" fill="var(--gold, #d4a853)" opacity="0.12" />

            {/* Inner decorative ring */}
            <circle cx="40" cy="40" r="28" stroke="var(--gold, #d4a853)" strokeWidth="0.6" opacity="0.5" />

            {/* Interlocking hearts — left heart */}
            <path
                d="M33 34 C33 30, 37 28, 40 32 C43 28, 47 30, 47 34 C47 39, 40 44, 40 44 C40 44, 33 39, 33 34Z"
                stroke="var(--gold, #d4a853)"
                strokeWidth="1.2"
                fill="var(--gold, #d4a853)"
                fillOpacity="0.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Second overlapping heart — offset right and slightly down */}
            <path
                d="M36 36 C36 32, 40 30, 43 34 C46 30, 50 32, 50 36 C50 41, 43 46, 43 46 C43 46, 36 41, 36 36Z"
                stroke="var(--gold-light, #e8c97a)"
                strokeWidth="1"
                fill="var(--gold-light, #e8c97a)"
                fillOpacity="0.15"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Small decorative dots around the seal ring */}
            <circle cx="40" cy="10" r="1" fill="var(--gold, #d4a853)" opacity="0.5" />
            <circle cx="40" cy="70" r="1" fill="var(--gold, #d4a853)" opacity="0.5" />
            <circle cx="10" cy="40" r="1" fill="var(--gold, #d4a853)" opacity="0.5" />
            <circle cx="70" cy="40" r="1" fill="var(--gold, #d4a853)" opacity="0.5" />
        </svg>
    );
}

export default function InvitationLetter({ guestName, brideName, groomName, message }) {
    const sceneRef = useRef(null);
    const frameRef = useRef(null);
    const greetingRef = useRef(null);
    const bodyRef = useRef(null);
    const signatureRef = useRef(null);
    const quoteRef = useRef(null);
    const sealRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                    trigger: sceneRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
            });

            /* ── Card frame entrance with perspective tilt ── */
            tl.fromTo(
                frameRef.current,
                { opacity: 0, y: 60, rotationX: 8, transformPerspective: 800 },
                { opacity: 1, y: 0, rotationX: 0, duration: 1.6 },
                0,
            );

            /* ── Decorative quote mark ── */
            tl.fromTo(
                quoteRef.current,
                { opacity: 0, scale: 0.5, y: 10 },
                { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.6)' },
                0.6,
            );

            /* ── Staggered letter lines: dramatic y:30 entrance ── */
            const letterLines = [greetingRef.current, bodyRef.current, signatureRef.current];
            tl.fromTo(
                letterLines,
                { opacity: 0, y: 30, filter: 'blur(4px)' },
                {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1.2,
                    stagger: 0.25,
                    ease: 'power2.out',
                },
                0.8,
            );

            /* ── Wax seal entrance: scale + rotation ── */
            tl.fromTo(
                sealRef.current,
                { opacity: 0, scale: 0, rotation: -45 },
                { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.8)' },
                1.6,
            );

            /* ── Mark the card as fully revealed for CSS effects ── */
            tl.call(() => {
                frameRef.current?.classList.add('letter-revealed');
            }, null, 2.4);
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="invite-scene letter-scene">
            <div ref={frameRef} className="letter-frame">
                <div className="letter-border-outer" />
                <div className="letter-border-inner" />
                <div className="letter-corner letter-corner--tl" />
                <div className="letter-corner letter-corner--tr" />
                <div className="letter-corner letter-corner--bl" />
                <div className="letter-corner letter-corner--br" />

                {/* Large decorative golden opening quote mark */}
                <span ref={quoteRef} className="letter-quote-mark">
                    ❝
                </span>

                <p ref={greetingRef} className="letter-greeting">
                    Dear <strong>{guestName}</strong>,
                </p>
                <p ref={bodyRef} className="letter-body">{message || DEFAULT_MESSAGE}</p>
                <p ref={signatureRef} className="letter-signature">
                    {brideName} &amp; {groomName}
                </p>

                {/* Wax seal decoration at the bottom */}
                <WaxSeal innerRef={sealRef} className="wax-seal" />
            </div>
        </section>
    );
}
