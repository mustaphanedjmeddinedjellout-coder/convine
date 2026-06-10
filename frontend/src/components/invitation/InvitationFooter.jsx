import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GoldLine from '../shared/GoldLine';

gsap.registerPlugin(ScrollTrigger);

export default function InvitationFooter({ brideName, groomName }) {
    const footerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 22 },
                {
                    opacity: 1, y: 0, duration: 1.4, ease: 'power3.out',
                    scrollTrigger: { trigger: footerRef.current, start: 'top 90%' },
                },
            );
        }, footerRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} className="invitation-footer">
            <div ref={contentRef} className="invitation-footer__inner">
                {/* Engraved rule */}
                <div className="invitation-footer__ornament" aria-hidden="true">
                    <GoldLine width={200} />
                </div>

                {/* Couple initials monogram */}
                <div className="invitation-footer__monogram">
                    <span>{(brideName || 'B')[0]}</span>
                    <span className="invitation-footer__monogram-amp ampersand">&amp;</span>
                    <span>{(groomName || 'G')[0]}</span>
                </div>

                <p className="invitation-footer__thanks">
                    Thank you for being part of our story
                </p>

                {/* Branding */}
                <div className="invitation-footer__brand">
                    <p className="invitation-footer__brand-text">
                        Crafted with
                        <span className="invitation-footer__heart" aria-label="love"> ♥ </span>
                        by
                    </p>
                    <p className="invitation-footer__brand-name">Convine</p>
                </div>
            </div>
        </footer>
    );
}
