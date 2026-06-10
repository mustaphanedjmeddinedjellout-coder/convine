import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PLACEHOLDER_GRADIENTS = [
    'linear-gradient(135deg, #e8dcc8, #c9a962)',
    'linear-gradient(135deg, #d4c4a8, #8b4a5c)',
    'linear-gradient(135deg, #f0e8dc, #c9a962)',
    'linear-gradient(135deg, #e8d5a3, #6b0f1a)',
];

export default function PhotoStory({ photos = [] }) {
    const sceneRef = useRef(null);
    const titleRef = useRef(null);
    const itemsRef = useRef([]);

    const photoList = [...photos];
    while (photoList.length < 4) {
        photoList.push(null);
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Title entrance
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 22 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.4,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sceneRef.current,
                        start: 'top 80%',
                    },
                },
            );

            // Prints laid gently onto the table — a settle, not a fly-in
            itemsRef.current.forEach((el, index) => {
                if (!el) {
                    return;
                }

                const isEven = index % 2 === 0;

                gsap.fromTo(
                    el,
                    { opacity: 0, y: 26, rotation: isEven ? -1.5 : 1.5 },
                    {
                        opacity: 1,
                        y: 0,
                        rotation: 0,
                        duration: 1.4,
                        ease: 'power3.out',
                        delay: index * 0.08,
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 88%',
                            toggleActions: 'play none none reverse',
                        },
                    },
                );
            });
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="invite-scene photo-story-scene">
            <p ref={titleRef} className="photo-story-title">
                Moments That Define Us
            </p>

            <div className="photo-story-stage">
                {photoList.slice(0, 4).map((src, index) => (
                    <div
                        key={index}
                        ref={(el) => {
                            itemsRef.current[index] = el;
                        }}
                        className={`photo-story-item photo-story-item--${index + 1} ken-burns photo-glow`}
                    >
                        {src ? (
                            <img src={src} alt="" loading="lazy" />
                        ) : (
                            <div
                                className="photo-story-placeholder"
                                style={{ background: PLACEHOLDER_GRADIENTS[index] }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
