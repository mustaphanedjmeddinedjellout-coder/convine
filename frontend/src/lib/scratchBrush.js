/** Procedural scratch-card brush texture — bristled, grainy stamp rotated along swipe */
let cachedBrush = null;

function buildBrushTexture(stampW = 76, stampH = 34) {
    const canvas = document.createElement('canvas');
    canvas.width = stampW;
    canvas.height = stampH;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, stampW, stampH);

    // Bristle clusters — horizontal brush drag orientation
    for (let i = 0; i < 140; i++) {
        const x = Math.random() * stampW;
        const y = stampH / 2 + (Math.random() - 0.5) * stampH * 0.92;
        const bristleW = 1.2 + Math.random() * 2.8;
        const bristleH = 6 + Math.random() * 16;
        const tilt = (Math.random() - 0.5) * 0.55;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(tilt);
        ctx.globalAlpha = 0.12 + Math.random() * 0.38;
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.ellipse(0, 0, bristleW, bristleH, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // Scratch dust / grain
    const grain = ctx.getImageData(0, 0, stampW, stampH);
    for (let i = 0; i < grain.data.length; i += 4) {
        const alpha = grain.data[i + 3];
        if (alpha === 0) {
            continue;
        }
        const n = (Math.random() - 0.5) * 36;
        grain.data[i] = Math.min(255, Math.max(0, grain.data[i] + n));
        grain.data[i + 1] = Math.min(255, Math.max(0, grain.data[i + 1] + n));
        grain.data[i + 2] = Math.min(255, Math.max(0, grain.data[i + 2] + n));
        grain.data[i + 3] = Math.min(255, alpha + Math.random() * 40);
    }
    ctx.putImageData(grain, 0, 0);

    // Soft feathered edges so stamps blend
    ctx.globalCompositeOperation = 'destination-in';
    const fade = ctx.createRadialGradient(
        stampW / 2,
        stampH / 2,
        0,
        stampW / 2,
        stampH / 2,
        Math.max(stampW, stampH) * 0.55,
    );
    fade.addColorStop(0, 'rgba(0,0,0,1)');
    fade.addColorStop(0.72, 'rgba(0,0,0,0.85)');
    fade.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, stampW, stampH);
    ctx.globalCompositeOperation = 'source-over';

    return canvas;
}

export function getScratchBrush() {
    if (!cachedBrush) {
        cachedBrush = {
            texture: buildBrushTexture(),
            width: 76,
            height: 34,
        };
    }
    return cachedBrush;
}

/** Stamp textured brush at point, rotated to stroke angle */
export function paintTexturedBrush(ctx, x, y, angle = 0, scale = 1) {
    const brush = getScratchBrush();
    const w = brush.width * scale;
    const h = brush.height * scale;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 0.78 + Math.random() * 0.22;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(brush.texture, -w / 2, -h / 2, w, h);
    ctx.restore();
    ctx.globalAlpha = 1;
}

/** Brush stroke between two points with texture stamps + light jitter */
export function paintScratchStroke(ctx, x1, y1, x2, y2, scale = 1) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const step = Math.max(2.5, 8 * scale);
    const steps = Math.max(1, Math.ceil(dist / step));

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const jitter = dist > 0 ? (Math.random() - 0.5) * 4 * scale : 0;
        const px = x1 + dx * t + Math.cos(angle + Math.PI / 2) * jitter;
        const py = y1 + dy * t + Math.sin(angle + Math.PI / 2) * jitter;
        const spin = angle + (Math.random() - 0.5) * 0.35;
        paintTexturedBrush(ctx, px, py, spin, scale * (0.92 + Math.random() * 0.16));
    }
}

export function measureScratchRatio(canvas, sampleStep = 10) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    let transparent = 0;
    let sampled = 0;

    for (let y = 0; y < height; y += sampleStep) {
        for (let x = 0; x < width; x += sampleStep) {
            const i = (y * width + x) * 4 + 3;
            sampled++;
            if (imageData.data[i] < 128) {
                transparent++;
            }
        }
    }

    return sampled ? transparent / sampled : 0;
}

export function setupCanvasSize(canvas, container) {
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return { ctx, width: rect.width, height: rect.height };
}

function addCoatingGrain(ctx, width, height, intensity = 14) {
    const tile = document.createElement('canvas');
    tile.width = 64;
    tile.height = 64;
    const tctx = tile.getContext('2d');
    const img = tctx.createImageData(64, 64);

    for (let i = 0; i < img.data.length; i += 4) {
        const v = 200 + Math.random() * 55;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = intensity + Math.random() * intensity;
    }
    tctx.putImageData(img, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    const pattern = ctx.createPattern(tile, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
}

function clipCircle(ctx, width, height) {
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2 - 1;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    return { cx, cy, radius };
}

function clipRoundRect(ctx, width, height, radius = 4) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(width - r, 0);
    ctx.quadraticCurveTo(width, 0, width, r);
    ctx.lineTo(width, height - r);
    ctx.quadraticCurveTo(width, height, width - r, height);
    ctx.lineTo(r, height);
    ctx.quadraticCurveTo(0, height, 0, height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.clip();
}

const OVERLAY_DRAWERS = {
    velvet(ctx, width, height) {
        const { cx, cy, radius } = clipCircle(ctx, width, height);
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ead9a8');
        gradient.addColorStop(0.35, '#c9a962');
        gradient.addColorStop(0.7, '#b8944f');
        gradient.addColorStop(1, '#967832');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        addCoatingGrain(ctx, width, height, 18);

        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.font = 'italic 11px "Cormorant Garamond", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('swipe to reveal', cx, cy);
    },

    bloom(ctx, width, height) {
        const { cx, cy, radius } = clipCircle(ctx, width, height);
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f8dde0');
        gradient.addColorStop(0.45, '#e8b4b8');
        gradient.addColorStop(1, '#b86872');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        addCoatingGrain(ctx, width, height, 16);

        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.font = 'italic 12px "Cormorant Garamond", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('swipe to reveal', cx, cy);
    },

    noir(ctx, width, height) {
        clipRoundRect(ctx, width, height, 2);
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#252530');
        gradient.addColorStop(0.5, '#14141c');
        gradient.addColorStop(1, '#0a0a10');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        addCoatingGrain(ctx, width, height, 22);

        ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
        ctx.lineWidth = 1;
        ctx.strokeRect(1, 1, width - 2, height - 2);

        ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
        ctx.font = '600 9px Cinzel, Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('SWIPE', width / 2, height / 2);
    },
};

export function drawScratchOverlay(ctx, width, height, theme) {
    ctx.save();
    const draw = OVERLAY_DRAWERS[theme] ?? OVERLAY_DRAWERS.velvet;
    draw(ctx, width, height);
    ctx.restore();
}
