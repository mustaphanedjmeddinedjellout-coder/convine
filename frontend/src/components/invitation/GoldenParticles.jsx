import { useEffect, useRef } from 'react';

/**
 * GoldenParticles — Floating golden bokeh dots that drift upward,
 * creating a warm, cinematic atmosphere behind all invitation content.
 * Pure canvas 2D — no Three.js overhead.
 */
export default function GoldenParticles({ count = 45 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Gold/amber color palette
        const colors = [
            'rgba(212, 168, 83,',   // --gold
            'rgba(232, 201, 122,',  // --gold-light
            'rgba(184, 137, 46,',   // --gold-dark
            'rgba(255, 215, 140,',  // warm amber
            'rgba(200, 160, 80,',   // muted gold
        ];

        // Initialize particles with random properties
        const init = () => {
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 3 + 1,
                    speedY: -(Math.random() * 0.3 + 0.1),  // drift upward
                    speedX: 0,
                    wobbleSpeed: Math.random() * 0.01 + 0.005,
                    wobbleAmp: Math.random() * 30 + 10,
                    phase: Math.random() * Math.PI * 2,
                    opacity: Math.random() * 0.35 + 0.08,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    pulseSpeed: Math.random() * 0.02 + 0.005,
                    pulsePhase: Math.random() * Math.PI * 2,
                });
            }
        };
        init();

        let time = 0;
        const animate = () => {
            time += 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of particles) {
                // Gentle upward drift
                p.y += p.speedY;
                // Horizontal sine-wave wobble
                p.x += Math.sin(time * p.wobbleSpeed + p.phase) * 0.3;

                // Pulsing opacity
                const pulse = Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.15 + 0.85;
                const alpha = p.opacity * pulse;

                // Wrap around when particle drifts off-screen
                if (p.y < -10) {
                    p.y = canvas.height + 10;
                    p.x = Math.random() * canvas.width;
                }
                if (p.x < -20) p.x = canvas.width + 20;
                if (p.x > canvas.width + 20) p.x = -20;

                // Draw soft bokeh circle with radial gradient
                const grad = ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, p.size * 2.5
                );
                grad.addColorStop(0, `${p.color}${alpha})`);
                grad.addColorStop(0.4, `${p.color}${alpha * 0.6})`);
                grad.addColorStop(1, `${p.color}0)`);

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }

            animId = requestAnimationFrame(animate);
        };

        // Use IntersectionObserver to pause when not visible (battery saving)
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!animId) animate();
                } else {
                    cancelAnimationFrame(animId);
                    animId = null;
                }
            },
            { threshold: 0 }
        );
        observer.observe(canvas);
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            observer.disconnect();
        };
    }, [count]);

    return (
        <canvas
            ref={canvasRef}
            className="golden-particles"
            aria-hidden="true"
        />
    );
}
