import { useEffect, useRef } from 'react';

/**
 * FallingPetals — Canvas-based animation of falling/fluttering rose/blush petals.
 * Oscillates scaleX and rotation to simulate a realistic 3D fluttering motion.
 */
export default function FallingPetals({ count = 24 }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let petals = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Pink/blush watercolor color scheme
        const petalColors = [
            { c1: 'rgba(245, 213, 216,', c2: 'rgba(232, 180, 184,' }, // Light blush
            { c1: 'rgba(232, 180, 184,', c2: 'rgba(196, 123, 132,' }, // Rose
            { c1: 'rgba(250, 220, 224,', c2: 'rgba(232, 180, 184,' }, // Soft pink
            { c1: 'rgba(240, 200, 205,', c2: 'rgba(215, 145, 153,' }, // Darker pink
        ];

        // Initialize particles
        const init = () => {
            petals = [];
            for (let i = 0; i < count; i++) {
                petals.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height - canvas.height,
                    size: Math.random() * 8 + 6,
                    speedY: Math.random() * 0.8 + 0.5,
                    speedX: Math.random() * 0.4 - 0.2,
                    wobbleSpeed: Math.random() * 0.02 + 0.01,
                    wobblePhase: Math.random() * Math.PI * 2,
                    angle: Math.random() * Math.PI * 2,
                    angleSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
                    flapSpeed: Math.random() * 0.04 + 0.02,
                    flapPhase: Math.random() * Math.PI * 2,
                    opacity: Math.random() * 0.45 + 0.15,
                    color: petalColors[Math.floor(Math.random() * petalColors.length)],
                });
            }
        };
        init();

        let time = 0;
        const animate = () => {
            time += 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of petals) {
                // Falling drift
                p.y += p.speedY;
                // Horizontal wobble (drift left/right)
                p.x += p.speedX + Math.sin(time * p.wobbleSpeed + p.wobblePhase) * 0.25;
                // Rotate
                p.angle += p.angleSpeed;

                // Wrap around when falling off the bottom
                if (p.y > canvas.height + 20) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                    p.speedY = Math.random() * 0.8 + 0.5;
                }
                // Wrap around horizontal edges
                if (p.x < -20) p.x = canvas.width + 20;
                if (p.x > canvas.width + 20) p.x = -20;

                // 3D flap calculation
                const scaleX = Math.sin(time * p.flapSpeed + p.flapPhase);

                // Draw rotated and scaled petal
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.scale(Math.abs(scaleX), 1); // 3D flip

                // Draw petal outline
                ctx.beginPath();
                ctx.moveTo(0, -p.size);
                // Curve left
                ctx.bezierCurveTo(p.size * 1.2, -p.size * 0.8, p.size * 1.2, p.size * 0.8, 0, p.size);
                // Curve right
                ctx.bezierCurveTo(-p.size * 1.2, p.size * 0.8, -p.size * 1.2, -p.size * 0.8, 0, -p.size);
                ctx.closePath();

                // Fill with watercolor gradient
                const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
                grad.addColorStop(0, `${p.color.c1}${p.opacity})`);
                grad.addColorStop(1, `${p.color.c2}${p.opacity * 0.7})`);

                ctx.fillStyle = grad;
                ctx.fill();

                // Subtle middle vein
                ctx.beginPath();
                ctx.moveTo(0, -p.size);
                ctx.lineTo(0, p.size * 0.6);
                ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.35})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();

                ctx.restore();
            }

            animId = requestAnimationFrame(animate);
        };

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
            className="falling-petals-canvas"
            aria-hidden="true"
        />
    );
}
