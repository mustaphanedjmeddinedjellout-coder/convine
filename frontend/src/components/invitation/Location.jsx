import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Location({ venue, venueAddress }) {
    const sceneRef = useRef(null);
    const contentRef = useRef(null);

    const mapsQuery = encodeURIComponent(venueAddress || venue || '');
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, x: -40 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1.4,
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
        <section ref={sceneRef} className="invite-scene location-scene">
            <div ref={contentRef}>
                <p className="location-title">The Venue</p>
                <h2 className="location-venue">{venue || 'Venue TBA'}</h2>
                {venueAddress && <p className="location-address">{venueAddress}</p>}

                {mapsQuery && (
                    <a
                        className="location-map-btn"
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <MapPin size={16} />
                        Open in Google Maps
                    </a>
                )}
            </div>
        </section>
    );
}
