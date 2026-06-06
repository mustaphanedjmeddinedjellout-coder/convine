import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_MESSAGE =
    'We are delighted to invite you to celebrate our wedding and share this special day with us.';

export default function InvitationLetter({ guestName, brideName, groomName, message }) {
    const sceneRef = useRef(null);
    const frameRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                frameRef.current,
                { opacity: 0, y: 60, rotationX: 8, transformPerspective: 800 },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    duration: 1.6,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sceneRef.current,
                        start: 'top 70%',
                        toggleActions: 'play none none reverse',
                    },
                },
            );
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

                <p className="letter-greeting">
                    Dear <strong>{guestName}</strong>,
                </p>
                <p className="letter-body">{message || DEFAULT_MESSAGE}</p>
                <p className="letter-signature">
                    {brideName} &amp; {groomName}
                </p>
            </div>
        </section>
    );
}
