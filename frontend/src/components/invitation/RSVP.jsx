import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Creates a ripple span inside the clicked button element.
 * The span has class `rsvp-ripple` for CSS styling (scale + fade).
 */
function createRipple(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 2;

    ripple.className = 'rsvp-ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    button.appendChild(ripple);

    // Animate the ripple with GSAP and remove when done
    gsap.fromTo(
        ripple,
        { scale: 0, opacity: 0.5 },
        {
            scale: 1,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => ripple.remove(),
        },
    );
}

export default function RSVP({ guestName, initialStatus, onSubmit, isDemo }) {
    const sceneRef = useRef(null);
    const contentRef = useRef(null);
    const successRef = useRef(null);
    const [status, setStatus] = useState(initialStatus);
    const [submitting, setSubmitting] = useState(false);

    // Initial scroll-triggered entrance
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sceneRef.current,
                        start: 'top 80%',
                    },
                },
            );
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    // Animate the success state when it appears
    useEffect(() => {
        if (status && successRef.current) {
            gsap.fromTo(
                successRef.current,
                { scale: 0.7, opacity: 0, y: 20 },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'back.out(1.7)',
                },
            );
        }
    }, [status]);

    async function handleRsvp(nextStatus, e) {
        // Fire ripple effect on click
        if (e) createRipple(e);

        setSubmitting(true);

        try {
            if (isDemo) {
                await new Promise((r) => setTimeout(r, 600));
            } else {
                await onSubmit(nextStatus);
            }
            setStatus(nextStatus);

            gsap.fromTo(
                contentRef.current,
                { scale: 0.95 },
                { scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (status) {
        const isAttending = status === 'attending';

        return (
            <section ref={sceneRef} className="invite-scene rsvp-scene">
                <div ref={contentRef} className="rsvp-confirmation">
                    {/* Animated success wrapper */}
                    <div ref={successRef} className="rsvp-success-animated">
                        <p className="rsvp-confirmation-icon">{isAttending ? '♥' : '✦'}</p>
                        <h2 className="rsvp-confirmation-title">
                            {isAttending ? 'We cannot wait!' : 'Thank you, dear friend'}
                        </h2>
                        <p className="rsvp-confirmation-text">
                            {isAttending
                                ? `Your presence means the world to us, ${guestName}. We look forward to celebrating together.`
                                : `We understand, ${guestName}. Thank you for letting us know — you will be in our hearts on our special day.`}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={sceneRef} className="invite-scene rsvp-scene">
            <div ref={contentRef}>
                {/* Decorative envelope SVG icon */}
                <div className="rsvp-envelope-icon" aria-hidden="true">
                    <svg width="56" height="44" viewBox="0 0 56 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect
                            x="2"
                            y="6"
                            width="52"
                            height="36"
                            rx="4"
                            stroke="var(--gold, #d4a853)"
                            strokeWidth="1.5"
                            fill="none"
                        />
                        <path
                            d="M2 10L28 28L54 10"
                            stroke="var(--gold, #d4a853)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            fill="none"
                        />
                        <path
                            d="M2 42L20 26"
                            stroke="var(--gold-light, #e8c97a)"
                            strokeWidth="1"
                            strokeLinecap="round"
                            fill="none"
                        />
                        <path
                            d="M54 42L36 26"
                            stroke="var(--gold-light, #e8c97a)"
                            strokeWidth="1"
                            strokeLinecap="round"
                            fill="none"
                        />
                        {/* Small heart seal */}
                        <path
                            d="M28 18C28 18 25 14 22.5 14C20 14 18 16 18 18.5C18 22 28 28 28 28C28 28 38 22 38 18.5C38 16 36 14 33.5 14C31 14 28 18 28 18Z"
                            fill="var(--gold, #d4a853)"
                            opacity="0.3"
                        />
                    </svg>
                </div>

                <h2 className="rsvp-title">Kindly Respond</h2>
                <p className="rsvp-subtitle">Your response is a gift to us</p>

                <div className="rsvp-buttons">
                    <button
                        type="button"
                        className="rsvp-btn rsvp-btn--primary btn-shimmer"
                        disabled={submitting}
                        onClick={(e) => handleRsvp('attending', e)}
                    >
                        Joyfully Accept
                    </button>
                    <button
                        type="button"
                        className="rsvp-btn btn-shimmer"
                        disabled={submitting}
                        onClick={(e) => handleRsvp('declined', e)}
                    >
                        Respectfully Decline
                    </button>
                </div>
            </div>
        </section>
    );
}
