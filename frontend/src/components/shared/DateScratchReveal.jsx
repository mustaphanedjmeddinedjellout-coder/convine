import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { parseEventDate } from '../../lib/formatWeddingDate';
import {
    drawScratchOverlay,
    measureScratchRatio,
    paintScratchStroke,
    setupCanvasSize,
} from '../../lib/scratchBrush';

gsap.registerPlugin(ScrollTrigger);

const DATE_KEYS = ['day', 'month', 'year'];
const BRUSH_SCALE = 1.05;
const REVEAL_RATIO = 0.2;

function ScratchCard({ label, value, variant, theme, shape, revealed, onReveal }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);
    const revealedRef = useRef(false);
    const lastPoint = useRef(null);

    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) {
            return;
        }

        const { ctx, width, height } = setupCanvasSize(canvas, container);
        drawScratchOverlay(ctx, width, height, theme);
        revealedRef.current = false;
        lastPoint.current = null;
    }, [theme]);

    useEffect(() => {
        if (revealed) {
            return;
        }

        initCanvas();
        const onResize = () => initCanvas();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [revealed, initCanvas]);

    function tryReveal() {
        const canvas = canvasRef.current;
        if (!canvas || revealedRef.current) {
            return;
        }

        if (measureScratchRatio(canvas) >= REVEAL_RATIO) {
            revealedRef.current = true;
            gsap.to(canvas, {
                opacity: 0,
                duration: 0.45,
                ease: 'power2.out',
                onComplete: () => onReveal(),
            });
        }
    }

    function scratchAt(clientX, clientY) {
        const canvas = canvasRef.current;
        if (!canvas || revealedRef.current) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const ctx = canvas.getContext('2d');

        if (lastPoint.current) {
            paintScratchStroke(ctx, lastPoint.current.x, lastPoint.current.y, x, y, BRUSH_SCALE);
        } else {
            paintScratchStroke(ctx, x, y, x, y, BRUSH_SCALE);
        }

        lastPoint.current = { x, y };
        tryReveal();
    }

    function handleStart(e) {
        if (revealed) {
            return;
        }
        isDrawing.current = true;
        lastPoint.current = null;
        const point = e.touches ? e.touches[0] : e;
        scratchAt(point.clientX, point.clientY);
    }

    function handleMove(e) {
        if (!isDrawing.current || revealed) {
            return;
        }
        e.preventDefault();
        const point = e.touches ? e.touches[0] : e;
        scratchAt(point.clientX, point.clientY);
    }

    function handleEnd() {
        isDrawing.current = false;
        lastPoint.current = null;
    }

    const shapeClass =
        shape === 'rect'
            ? `scratch-date-card scratch-date-card--rect scratch-date-card--${theme}`
            : `scratch-date-card scratch-date-card--circle scratch-date-card--${theme} scratch-date-card--${variant}`;

    return (
        <div className="scratch-date-item">
            <div ref={containerRef} className={`${shapeClass}${revealed ? ' is-revealed' : ''}`}>
                <div className={`scratch-date-value scratch-date-value--${theme}${revealed ? ' is-glowing' : ''}`}>
                    {value}
                </div>
                {!revealed && (
                    <canvas
                        ref={canvasRef}
                        className="scratch-date-canvas"
                        onMouseDown={handleStart}
                        onMouseMove={handleMove}
                        onMouseUp={handleEnd}
                        onMouseLeave={handleEnd}
                        onTouchStart={handleStart}
                        onTouchMove={handleMove}
                        onTouchEnd={handleEnd}
                    />
                )}
            </div>
            <span className={`scratch-date-label scratch-date-label--${theme}`}>{label}</span>
        </div>
    );
}

function fireCelebration(theme) {
    const palettes = {
        velvet: ['#c9a962', '#e8d5a3', '#8b4a5c', '#faf6f0'],
        bloom: ['#e8b4b8', '#c9a87c', '#8fa98f', '#fffaf7'],
        noir: ['#d4af37', '#f5ecd8', '#e8d5a3', '#12121a'],
    };
    const colors = palettes[theme] ?? palettes.velvet;
    const end = Date.now() + 2600;

    (function burst() {
        confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.2 }, colors });
        confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.2 }, colors });
        if (Date.now() < end) {
            requestAnimationFrame(burst);
        }
    })();
}

/**
 * Shared scratch-to-reveal date row for all invitation templates.
 */
export default function DateScratchReveal({
    eventDate,
    theme = 'velvet',
    shape = 'circle',
    visible = true,
    scrollTrigger = false,
    sceneClass = '',
    titleClass = '',
    rowClass = '',
    hintClass = '',
    title = 'Our Wedding Date',
    hintScratch = 'Scratch each circle to reveal our date',
    hintDone = 'Save the date in your heart',
}) {
    const sceneRef = useRef(null);
    const titleRef = useRef(null);
    const rowRef = useRef(null);
    const { day, month, year } = parseEventDate(eventDate);
    const values = { day, month, year };
    const [revealed, setRevealed] = useState({ day: false, month: false, year: false });

    const allRevealed = DATE_KEYS.every((key) => revealed[key]);
    const revealedCount = DATE_KEYS.filter((key) => revealed[key]).length;

    useEffect(() => {
        if (!titleRef.current) {
            return;
        }

        if (scrollTrigger && sceneRef.current) {
            const ctx = gsap.context(() => {
                gsap.fromTo(
                    sceneRef.current,
                    { opacity: 0, y: 28 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power2.out',
                        scrollTrigger: { trigger: sceneRef.current, start: 'top 78%' },
                    },
                );
            }, sceneRef);
            return () => ctx.revert();
        }

        if (!visible) {
            return;
        }

        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        tl.fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 });

        if (rowRef.current) {
            tl.fromTo(
                rowRef.current.children,
                { opacity: 0, scale: 0.88 },
                { opacity: 1, scale: 1, duration: 0.75, stagger: 0.12 },
                0.25,
            );
        }

        return () => tl.kill();
    }, [visible, scrollTrigger]);

    useEffect(() => {
        if (allRevealed) {
            fireCelebration(theme);
        }
    }, [allRevealed, theme]);

    const hint = allRevealed
        ? hintDone
        : revealedCount === 0
          ? hintScratch
          : `${3 - revealedCount} more to scratch`;

    return (
        <section ref={sceneRef} className={sceneClass}>
            <p ref={titleRef} className={titleClass}>
                {title}
            </p>

            <div ref={rowRef} className={rowClass}>
                {DATE_KEYS.map((key) => (
                    <ScratchCard
                        key={key}
                        label={key}
                        variant={key}
                        theme={theme}
                        shape={shape}
                        value={values[key]}
                        revealed={revealed[key]}
                        onReveal={() => setRevealed((prev) => ({ ...prev, [key]: true }))}
                    />
                ))}
            </div>

            <p className={hintClass}>{hint}</p>
        </section>
    );
}
