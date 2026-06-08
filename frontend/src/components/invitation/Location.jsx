import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Location({ venue, venueAddress, googleMapsUrl }) {
    const sceneRef = useRef(null);
    const contentRef = useRef(null);

    const mapsQuery = encodeURIComponent(venueAddress || venue || '');
    const mapsUrl = googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Dramatic 3D tilt entrance that settles to flat
            gsap.fromTo(
                contentRef.current,
                {
                    opacity: 0,
                    x: -40,
                    rotationX: 12,
                    rotationY: -8,
                    scale: 0.92,
                    transformPerspective: 800,
                },
                {
                    opacity: 1,
                    x: 0,
                    rotationX: 0,
                    rotationY: 0,
                    scale: 1,
                    duration: 1.6,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sceneRef.current,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse',
                    },
                },
            );

            // Animate the location-glow border on viewport entry
            const glowEl = contentRef.current;
            if (glowEl) {
                gsap.fromTo(
                    glowEl,
                    { '--glow-opacity': 0 },
                    {
                        '--glow-opacity': 1,
                        duration: 2,
                        ease: 'power1.inOut',
                        scrollTrigger: {
                            trigger: sceneRef.current,
                            start: 'top 75%',
                        },
                    },
                );
            }
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="invite-scene location-scene">
            <div ref={contentRef} className="location-glow">
                {/* Decorative SVG map pin icon */}
                <div className="location-pin-icon" aria-hidden="true">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M24 4C16.268 4 10 10.268 10 18C10 28 24 44 24 44C24 44 38 28 38 18C38 10.268 31.732 4 24 4Z"
                            stroke="var(--gold, #d4a853)"
                            strokeWidth="2"
                            fill="none"
                        />
                        <circle
                            cx="24"
                            cy="18"
                            r="6"
                            stroke="var(--gold-light, #e8c97a)"
                            strokeWidth="1.5"
                            fill="none"
                        />
                        <circle cx="24" cy="18" r="2.5" fill="var(--gold, #d4a853)" />
                    </svg>
                </div>

                <p className="location-title">Where We Celebrate</p>
                <h2 className="location-venue">{venue || 'Venue TBA'}</h2>
                {venueAddress && <p className="location-address">{venueAddress}</p>}

                {mapsQuery && (
                    <a
                        className="location-map-btn btn-shimmer"
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {/* Inline SVG small pin for the button */}
                        <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M24 4C16.268 4 10 10.268 10 18C10 28 24 44 24 44C24 44 38 28 38 18C38 10.268 31.732 4 24 4Z"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                            />
                            <circle cx="24" cy="18" r="6" fill="currentColor" />
                        </svg>
                        Open in Google Maps
                    </a>
                )}
            </div>
        </section>
    );
}
