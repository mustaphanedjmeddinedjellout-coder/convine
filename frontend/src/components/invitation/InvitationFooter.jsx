import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function InvitationFooter({ brideName, groomName }) {
    const footerRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0, duration: 1.2, ease: 'power2.out',
                    scrollTrigger: { trigger: footerRef.current, start: 'top 90%' },
                },
            );
        }, footerRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} className="invitation-footer">
            <div ref={contentRef} className="invitation-footer__inner">
                {/* Top ornamental line */}
                <div className="invitation-footer__ornament" aria-hidden="true">
                    <svg width="200" height="20" viewBox="0 0 200 20" fill="none" preserveAspectRatio="xMidYMid meet">
                        <line x1="10" y1="10" x2="85" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                        <circle cx="95" cy="10" r="1.5" fill="currentColor" opacity="0.4" />
                        <circle cx="100" cy="10" r="2" fill="currentColor" opacity="0.6" />
                        <circle cx="105" cy="10" r="1.5" fill="currentColor" opacity="0.4" />
                        <line x1="115" y1="10" x2="190" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                    </svg>
                </div>

                {/* Couple initials monogram */}
                <div className="invitation-footer__monogram">
                    <span>{(brideName || 'B')[0]}</span>
                    <span className="invitation-footer__monogram-amp">&</span>
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
