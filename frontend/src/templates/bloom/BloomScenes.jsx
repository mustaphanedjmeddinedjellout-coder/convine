import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DateScratchReveal from '../../components/shared/DateScratchReveal';

gsap.registerPlugin(ScrollTrigger);

function CornerVineFlourish({ className }) {
    return (
        <svg viewBox="0 0 100 100" className={`bloom-vine-flourish ${className}`} width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.45">
            {/* Elegant botanical vine branch curling inward */}
            <path d="M10 90 Q10 30 50 30 Q70 30 70 50 Q70 65 55 65 Q45 65 48 50 Q50 35 65 35" />
            {/* Little leaf shapes along the vine */}
            <path d="M22 65 C26 62, 32 66, 26 72 C20 68, 18 64, 22 65 Z" fill="currentColor" opacity="0.15" stroke="none" />
            <path d="M42 38 C45 32, 52 35, 48 42 C44 42, 40 40, 42 38 Z" fill="currentColor" opacity="0.15" stroke="none" />
            <path d="M64 42 C68 38, 74 42, 70 48 C66 48, 62 46, 64 42 Z" fill="currentColor" opacity="0.15" stroke="none" />
            {/* Small flower bud at the tip */}
            <circle cx="65" cy="35" r="2.5" fill="currentColor" opacity="0.65" stroke="none" />
        </svg>
    );
}

export function BloomNames({ bride, groom, visible }) {
    const sectionRef = useRef(null);
    const frameRef = useRef(null);
    const refs = useRef([]);

    useEffect(() => {
        if (!visible) return;

        // Names fade up
        gsap.fromTo(
            refs.current, 
            { opacity: 0, y: 36 }, 
            { opacity: 1, y: 0, duration: 1.4, stagger: 0.2, ease: 'power3.out' }
        );

        // Subtle frame zoom
        gsap.fromTo(
            frameRef.current,
            { scale: 0.95, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out', delay: 0.1 }
        );

        // Parallax effect on scroll
        const scrollTriggerObj = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
                if (frameRef.current) {
                    gsap.set(frameRef.current, { y: self.progress * 40 });
                }
            }
        });

        return () => scrollTriggerObj.kill();
    }, [visible]);

    return (
        <section ref={sectionRef} className="bloom-scene">
            <div ref={frameRef} className="bloom-names-frame">
                <CornerVineFlourish className="bloom-vine-flourish--tl" />
                <CornerVineFlourish className="bloom-vine-flourish--tr" />
                <CornerVineFlourish className="bloom-vine-flourish--bl" />
                <CornerVineFlourish className="bloom-vine-flourish--br" />

                <p ref={(el) => { refs.current[0] = el; }} className="bloom-eyebrow">Together with their families</p>
                <h1 ref={(el) => { refs.current[1] = el; }} className="bloom-name">{bride}</h1>
                <p ref={(el) => { refs.current[2] = el; }} className="bloom-amp">&amp;</p>
                <h1 ref={(el) => { refs.current[3] = el; }} className="bloom-name">{groom}</h1>
                <div ref={(el) => { refs.current[4] = el; }} className="bloom-divider" />
            </div>

            <div className="bloom-scroll-hint">
                <span className="bloom-scroll-hint-label">Scroll to reveal</span>
                <svg className="bloom-scroll-hint-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>
        </section>
    );
}

export function BloomDate({ eventDate }) {
    return (
        <DateScratchReveal
            eventDate={eventDate}
            theme="bloom"
            shape="circle"
            scrollTrigger
            sceneClass="bloom-scene"
            titleClass="bloom-eyebrow"
            rowClass="bloom-date-row scratch-date-row"
            hintClass="scratch-date-hint scratch-date-hint--bloom"
            title="Save the date"
            hintScratch="Swipe your finger to brush away the coating"
            hintDone="We cannot wait to celebrate with you"
        />
    );
}

export function BloomLetter({ guestName, bride, groom, message }) {
    const cardRef = useRef(null);
    const defaultMsg = 'We are delighted to invite you to celebrate our wedding and share this special day with us.';

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Card fade and translation
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.4,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: cardRef.current, start: 'top 75%' }
                }
            );

            // Stagger line reveal inside card
            gsap.fromTo(
                '.bloom-letter-item',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.25,
                    ease: 'power2.out',
                    scrollTrigger: { trigger: cardRef.current, start: 'top 65%' }
                }
            );
        }, cardRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="bloom-scene">
            <div ref={cardRef} className="bloom-letter bloom-letter-deckled">
                {/* SVG Botanical Vines Background Details */}
                <svg className="bloom-letter__floral bloom-letter__floral--tl" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <path d="M4 12 Q20 8 36 28 M12 6 C20 12, 18 20, 10 24 M28 20 C32 12, 40 18, 32 24" opacity="0.35" />
                    <circle cx="36" cy="28" r="1.5" fill="currentColor" opacity="0.4" />
                    <circle cx="10" cy="24" r="1.2" fill="currentColor" opacity="0.4" />
                </svg>
                <svg className="bloom-letter__floral bloom-letter__floral--br" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="0.8">
                    <path d="M60 52 Q44 56 28 36 M52 58 C44 52, 46 44, 54 40 M36 44 C32 52, 24 46, 32 40" opacity="0.35" />
                    <circle cx="28" cy="36" r="1.5" fill="currentColor" opacity="0.4" />
                    <circle cx="54" cy="40" r="1.2" fill="currentColor" opacity="0.4" />
                </svg>

                <p className="bloom-letter__greeting bloom-letter-item">Dear <strong>{guestName}</strong>,</p>
                <p className="bloom-letter__body bloom-letter-item">{message || defaultMsg}</p>
                <p className="bloom-letter__sign bloom-letter-item">{bride} &amp; {groom}</p>

                {/* Stamped Botanical Wax Seal */}
                <div className="bloom-wax-seal bloom-letter-item">
                    <svg viewBox="0 0 100 100" className="bloom-wax-seal-svg" width="48" height="48" fill="none" stroke="currentColor">
                        <path d="M 50 10 C 27.9 10 10 27.9 10 50 C 10 72.1 27.9 90 50 90 C 72.1 90 90 72.1 90 50 C 90 27.9 72.1 10 50 10 Z" fill="currentColor" opacity="0.85" strokeWidth="0" />
                        <path d="M 50 15 C 30.7 15 15 30.7 15 50 C 15 69.3 30.7 85 50 85 C 69.3 85 85 69.3 85 50 C 85 30.7 69.3 15 50 15 Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                        <path d="M 40 65 Q 50 45 42 32 M 52 50 C 58 45, 62 48, 56 55 C 50 62, 46 64, 52 50 Z M 36 45 C 30 40, 34 32, 42 38 C 50 44, 46 50, 36 45 Z" fill="rgba(255,255,255,0.7)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </section>
    );
}

export function BloomPhotos({ photos = [] }) {
    const stageRef = useRef(null);
    const items = [...photos];
    while (items.length < 3) items.push(null);
    const fills = ['linear-gradient(135deg,#f5d5d8,#e8b4b8)', 'linear-gradient(135deg,#d4e0d4,#8fa98f)', 'linear-gradient(135deg,#f0e0c8,#c9a87c)'];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Staggered polaroid scaling + custom rotation reveal
            gsap.fromTo(
                '.bloom-photo',
                { opacity: 0, scale: 0.84, rotation: (i) => (i === 0 ? -12 : i === 1 ? 14 : -9) },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: (i) => (i === 0 ? -3 : i === 1 ? 4 : -2),
                    duration: 1.4,
                    stagger: 0.2,
                    ease: 'back.out(1.4)',
                    scrollTrigger: { trigger: stageRef.current, start: 'top 75%' }
                }
            );
        }, stageRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="bloom-scene">
            <p className="bloom-eyebrow">Our love story</p>
            <div ref={stageRef} className="bloom-photo-stage">
                {items.slice(0, 3).map((src, i) => (
                    <div key={i} className={`bloom-photo bloom-photo--${i + 1} bloom-photo-polaroid`}>
                        <div className="bloom-photo-wrap">
                            {src ? (
                                <img className="bloom-photo-img" src={src} alt="" loading="lazy" />
                            ) : (
                                <div className="bloom-photo__fill" style={{ background: fills[i] }} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
