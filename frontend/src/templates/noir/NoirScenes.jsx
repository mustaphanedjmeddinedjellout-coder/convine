import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DateScratchReveal from '../../components/shared/DateScratchReveal';

gsap.registerPlugin(ScrollTrigger);

export function NoirNames({ bride, groom, visible }) {
    const sceneRef = useRef(null);

    useEffect(() => {
        if (!visible || !sceneRef.current) return;
        gsap.fromTo(sceneRef.current.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.18, ease: 'power3.out' });
    }, [visible]);

    return (
        <section ref={sceneRef} className="noir-scene">
            <div className="noir-scene__lines" />
            <p className="noir-eyebrow">The honour of your presence</p>
            <h1 className="noir-name">{bride}</h1>
            <p className="noir-amp">&amp;</p>
            <h1 className="noir-name">{groom}</h1>
        </section>
    );
}

export function NoirDate({ eventDate }) {
    return (
        <DateScratchReveal
            eventDate={eventDate}
            theme="noir"
            shape="rect"
            scrollTrigger
            sceneClass="noir-scene"
            titleClass="noir-eyebrow"
            rowClass="noir-date-row scratch-date-row"
            hintClass="scratch-date-hint scratch-date-hint--noir"
            title="Date of union"
            hintScratch="Swipe to brush away the gold coating"
            hintDone="Mark your calendar in gold"
        />
    );
}

export function NoirLetter({ guestName, bride, groom, message }) {
    const ref = useRef(null);
    const defaultMsg = 'We are delighted to invite you to celebrate our wedding and share this special day with us.';

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(ref.current, { opacity: 0, rotateX: 10, y: 40 }, { opacity: 1, rotateX: 0, y: 0, duration: 1.4, scrollTrigger: { trigger: ref.current, start: 'top 72%' } });
        }, ref);
        return () => ctx.revert();
    }, []);

    return (
        <section className="noir-scene">
            <div ref={ref} className="noir-letter">
                <div className="noir-letter__corner noir-letter__corner--tl" />
                <div className="noir-letter__corner noir-letter__corner--br" />
                <p className="noir-letter__greeting">Dear <strong>{guestName}</strong>,</p>
                <p className="noir-letter__body">{message || defaultMsg}</p>
                <p className="noir-letter__sign">{bride} &amp; {groom}</p>
            </div>
        </section>
    );
}

export function NoirPhotos({ photos = [] }) {
    const stageRef = useRef(null);
    const items = [...photos];
    while (items.length < 3) items.push(null);
    const fills = ['linear-gradient(135deg,#1a1a22,#3d3520)', 'linear-gradient(135deg,#12121a,#d4af37)', 'linear-gradient(135deg,#08080c,#8a8478)'];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.noir-photo', { opacity: 0, x: (i) => (i % 2 === 0 ? -50 : 50) }, { opacity: 1, x: 0, duration: 1.2, stagger: 0.22, scrollTrigger: { trigger: stageRef.current, start: 'top 75%' } });
        }, stageRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="noir-scene">
            <p className="noir-eyebrow">A glimpse of us</p>
            <div ref={stageRef} className="noir-photo-stage">
                {items.slice(0, 3).map((src, i) => (
                    <div key={i} className={`noir-photo noir-photo--${i + 1}`}>
                        {src ? <img src={src} alt="" loading="lazy" /> : <div className="noir-photo__fill" style={{ background: fills[i] }} />}
                    </div>
                ))}
            </div>
        </section>
    );
}
