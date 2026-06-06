import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function RSVP({ guestName, initialStatus, onSubmit, isDemo }) {
    const sceneRef = useRef(null);
    const contentRef = useRef(null);
    const [status, setStatus] = useState(initialStatus);
    const [submitting, setSubmitting] = useState(false);

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

    async function handleRsvp(nextStatus) {
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
            </section>
        );
    }

    return (
        <section ref={sceneRef} className="invite-scene rsvp-scene">
            <div ref={contentRef}>
                <h2 className="rsvp-title">Will you attend?</h2>

                <div className="rsvp-buttons">
                    <button
                        type="button"
                        className="rsvp-btn rsvp-btn--primary"
                        disabled={submitting}
                        onClick={() => handleRsvp('attending')}
                    >
                        Yes, I will attend
                    </button>
                    <button
                        type="button"
                        className="rsvp-btn"
                        disabled={submitting}
                        onClick={() => handleRsvp('declined')}
                    >
                        Unfortunately, I cannot attend
                    </button>
                </div>
            </div>
        </section>
    );
}
