import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Dress code tier icons ─── */
const TIER_ICONS = {
    formal: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 6C24 6 18 8 16 12L12 18L18 20L16 42H32L30 20L36 18L32 12C30 8 24 6 24 6Z" 
                  stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
            <path d="M20 12L24 16L28 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 16V24" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="24" cy="26" r="1" fill="currentColor" opacity="0.5" />
            <circle cx="24" cy="30" r="1" fill="currentColor" opacity="0.4" />
        </svg>
    ),
    'semi-formal': (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M16 14C16 14 18 8 24 8C30 8 32 14 32 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M14 14H34V38C34 40 32 42 30 42H18C16 42 14 40 14 38V14Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
            <path d="M14 22H34" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
            <circle cx="24" cy="18" r="1.2" fill="currentColor" opacity="0.5" />
        </svg>
    ),
    casual: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M16 16H32V40H16V16Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
            <path d="M16 16C16 12 18 8 24 8C30 8 32 12 32 16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M20 16V12C20 10 22 8 24 8C26 8 28 10 28 12V16" stroke="currentColor" strokeWidth="0.8" />
            <path d="M20 24H28" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        </svg>
    ),
    traditional: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M24 4L28 8H36L32 14V38L28 42H20L16 38V14L12 8H20L24 4Z" 
                  stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
            <path d="M20 16H28" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M18 22C18 22 24 26 30 22" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
            <circle cx="24" cy="32" r="3" stroke="currentColor" strokeWidth="0.8" fill="none" />
            <circle cx="24" cy="32" r="1" fill="currentColor" opacity="0.4" />
        </svg>
    ),
};

const TIER_LABELS = {
    formal: 'Black Tie / Formal',
    'semi-formal': 'Semi-Formal Elegance',
    casual: 'Smart Casual',
    traditional: 'Traditional Attire',
};

const TIER_DESCRIPTIONS = {
    formal: 'Floor-length gowns & tuxedos. Think timeless glamour — this is a night to shine.',
    'semi-formal': 'Cocktail dresses & tailored suits. Elegant yet comfortable for a memorable evening.',
    casual: 'Dress to impress but keep it relaxed. Smart separates & stylish dresses welcome.',
    traditional: 'We warmly welcome traditional attire. Celebrate with us in the elegance of heritage.',
};

export default function DressCode({ dressCode, colors }) {
    const sceneRef = useRef(null);
    const titleRef = useRef(null);
    const cardRef = useRef(null);
    const colorsRef = useRef(null);

    const tier = dressCode || 'formal';
    const icon = TIER_ICONS[tier] || TIER_ICONS.formal;
    const label = TIER_LABELS[tier] || TIER_LABELS.formal;
    const description = TIER_DESCRIPTIONS[tier] || TIER_DESCRIPTIONS.formal;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1, y: 0, duration: 1,
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 80%' },
                },
            );

            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out',
                    scrollTrigger: { trigger: sceneRef.current, start: 'top 75%' },
                },
            );

            if (colorsRef.current) {
                gsap.fromTo(
                    colorsRef.current.children,
                    { opacity: 0, scale: 0 },
                    {
                        opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.6)',
                        scrollTrigger: { trigger: colorsRef.current, start: 'top 85%' },
                    },
                );
            }
        }, sceneRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sceneRef} className="invite-scene schedule-scene dresscode-scene">
            <p ref={titleRef} className="schedule-title">Dress Code</p>

            <div ref={cardRef} className="dresscode-card">
                <div className="dresscode-icon" aria-hidden="true">
                    {icon}
                </div>
                <h3 className="dresscode-tier">{label}</h3>
                <p className="dresscode-description">{description}</p>

                {colors && colors.length > 0 && (
                    <div className="dresscode-colors-section">
                        <p className="dresscode-colors-label">Suggested Palette</p>
                        <div ref={colorsRef} className="dresscode-colors">
                            {colors.map((color, i) => (
                                <span
                                    key={i}
                                    className="dresscode-swatch"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                    aria-label={`Color: ${color}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
