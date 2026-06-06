import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DateScratchReveal from '../../components/shared/DateScratchReveal';

gsap.registerPlugin(ScrollTrigger);

export function BloomNames({ bride, groom, visible }) {
    const refs = useRef([]);

    useEffect(() => {
        if (!visible) return;
        gsap.fromTo(refs.current, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out' });
    }, [visible]);

    return (
        <section className="bloom-scene">
            <p ref={(el) => { refs.current[0] = el; }} className="bloom-eyebrow">Together with their families</p>
            <h1 ref={(el) => { refs.current[1] = el; }} className="bloom-name">{bride}</h1>
            <p ref={(el) => { refs.current[2] = el; }} className="bloom-amp">&amp;</p>
            <h1 ref={(el) => { refs.current[3] = el; }} className="bloom-name">{groom}</h1>
            <div ref={(el) => { refs.current[4] = el; }} className="bloom-divider" />
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
    const ref = useRef(null);
    const defaultMsg = 'We are delighted to invite you to celebrate our wedding and share this special day with us.';

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.3, scrollTrigger: { trigger: ref.current, start: 'top 72%' } });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section className="bloom-scene">
            <div ref={ref} className="bloom-letter">
                <svg className="bloom-letter__floral bloom-letter__floral--tl" viewBox="0 0 64 64" aria-hidden="true">
                    <circle cx="32" cy="32" r="20" fill="#e8b4b8" opacity="0.4" />
                    <circle cx="20" cy="24" r="10" fill="#8fa98f" opacity="0.35" />
                    <circle cx="44" cy="28" r="8" fill="#c9a87c" opacity="0.4" />
                </svg>
                <svg className="bloom-letter__floral bloom-letter__floral--br" viewBox="0 0 64 64" aria-hidden="true">
                    <circle cx="32" cy="32" r="18" fill="#8fa98f" opacity="0.35" />
                    <circle cx="40" cy="40" r="12" fill="#e8b4b8" opacity="0.4" />
                </svg>
                <p className="bloom-letter__greeting">Dear <strong>{guestName}</strong>,</p>
                <p className="bloom-letter__body">{message || defaultMsg}</p>
                <p className="bloom-letter__sign">{bride} &amp; {groom}</p>
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
            gsap.fromTo('.bloom-photo', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: stageRef.current, start: 'top 75%' } });
        }, stageRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="bloom-scene">
            <p className="bloom-eyebrow">Our love story</p>
            <div ref={stageRef} className="bloom-photo-stage">
                {items.slice(0, 3).map((src, i) => (
                    <div key={i} className={`bloom-photo bloom-photo--${i + 1}`}>
                        {src ? <img src={src} alt="" loading="lazy" /> : <div className="bloom-photo__fill" style={{ background: fills[i] }} />}
                    </div>
                ))}
            </div>
        </section>
    );
}
