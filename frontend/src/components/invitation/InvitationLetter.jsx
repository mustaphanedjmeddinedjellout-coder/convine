import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WaxSeal from '../shared/WaxSeal';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_MESSAGE =
    'We are delighted to invite you to celebrate our wedding and share this special day with us.';

export default function InvitationLetter({ guestName, brideName, groomName, message }) {
    const sceneRef = useRef(null);
    const frameRef = useRef(null);
    const greetingRef = useRef(null);
    const bodyRef = useRef(null);
    const signatureRef = useRef(null);
    const sealRef = useRef(null);

    const sealInitial = (brideName || 'A').trim().charAt(0).toUpperCase();

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

            /* ── Card frame lifts in ── */
            tl.from(
                frameRef.current,
                { opacity: 0, y: 22, duration: 1.4 },
                0,
            );

            /* ── Letter lines arrive in reading order ── */
            tl.from(
                [greetingRef.current, bodyRef.current, signatureRef.current],
                { opacity: 0, y: 18, duration: 1.2, stagger: 0.2 },
                0.5,
            );

            /* ── Wax seal pressed in last ── */
            tl.from(
                sealRef.current,
                { opacity: 0, scale: 0.7, duration: 1, ease: 'back.out(1.5)' },
                1.2,
            );
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="invite-scene letter-scene">
            <div ref={frameRef} className="letter-frame">
                <p ref={greetingRef} className="letter-greeting">
                    Dear <span className="letter-greeting-name">{guestName}</span>,
                </p>
                <p ref={bodyRef} className="letter-body body">{message || DEFAULT_MESSAGE}</p>
                <p ref={signatureRef} className="letter-signature">
                    {brideName} <span className="ampersand">&amp;</span> {groomName}
                </p>

                <WaxSeal ref={sealRef} initial={sealInitial} />
            </div>
        </section>
    );
}
