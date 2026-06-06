import { useRef, useState } from 'react';
import gsap from 'gsap';

export default function DrapeOpening({ onComplete }) {
    const sceneRef = useRef(null);
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const [isOpening, setIsOpening] = useState(false);
    const [isDone, setIsDone] = useState(false);

    function openDrapes() {
        if (isOpening || isDone) {
            return;
        }

        setIsOpening(true);

        const tl = gsap.timeline({
            onComplete: () => {
                setIsDone(true);
                gsap.to(sceneRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    delay: 0.3,
                    onComplete: () => {
                        onComplete?.();
                    },
                });
            },
        });

        tl.to(leftRef.current, {
            xPercent: -105,
            rotationY: -28,
            skewY: 2,
            duration: 2.8,
            ease: 'power3.inOut',
        }, 0);

        tl.to(rightRef.current, {
            xPercent: 105,
            rotationY: 28,
            skewY: -2,
            duration: 2.8,
            ease: 'power3.inOut',
        }, 0);

        tl.to(leftRef.current, {
            filter: 'brightness(0.6)',
            duration: 2.8,
            ease: 'power2.in',
        }, 0);

        tl.to(rightRef.current, {
            filter: 'brightness(0.6)',
            duration: 2.8,
            ease: 'power2.in',
        }, 0);
    }

    if (isDone) {
        return null;
    }

    return (
        <div
            ref={sceneRef}
            className={`drape-scene${isOpening ? ' is-opening' : ''}`}
            onClick={openDrapes}
            onTouchEnd={(e) => {
                e.preventDefault();
                openDrapes();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openDrapes()}
            aria-label="Touch to open invitation"
        >
            <div ref={leftRef} className="drape-panel drape-panel--left">
                <div className="drape-rod" />
                <div className="drape-fabric">
                    <div className="drape-fold" />
                </div>
            </div>

            <div ref={rightRef} className="drape-panel drape-panel--right">
                <div className="drape-rod" />
                <div className="drape-fabric">
                    <div className="drape-fold" />
                </div>
            </div>

            <div className="drape-cta">
                <p className="drape-cta-label">A Special Invitation</p>
                <p className="drape-cta-hint">Touch to Open</p>
            </div>
        </div>
    );
}
