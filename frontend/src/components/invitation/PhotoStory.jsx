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
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: sceneRef.current,
                        start: 'top 80%',
                    },
                },
            );

            itemsRef.current.forEach((el, index) => {
                if (!el) {
                    return;
                }

                const fromVars = [
                    { opacity: 0, x: -80, rotation: -3 },
                    { opacity: 0, x: 80, y: 40, rotation: 4 },
                    { opacity: 0, y: 60, scale: 0.9 },
                    { opacity: 0, x: 40, y: -30, rotation: -2 },
                ];

                gsap.fromTo(
                    el,
                    fromVars[index] ?? { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        rotation: 0,
                        scale: 1,
                        duration: 1.4,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
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
                Our Story
            </p>

            <div className="photo-story-stage">
                {photoList.slice(0, 4).map((src, index) => (
                    <div
                        key={index}
                        ref={(el) => {
                            itemsRef.current[index] = el;
                        }}
                        className={`photo-story-item photo-story-item--${index + 1}`}
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
