/**
 * generateTextures — Procedural canvas-based normal & roughness maps
 *
 * Creates velvet fabric and gold metal textures at runtime so
 * we don't need to bundle external PNGs from ambientcg / freepbr.
 * Swap with real 2K textures later for even higher fidelity.
 */
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Simple seeded pseudo-random for repeatable noise */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** 2D value noise with bicubic-ish smoothing */
function makeNoiseGrid(size, seed) {
  const rand = seededRandom(seed);
  const grid = new Float32Array(size * size);
  for (let i = 0; i < grid.length; i++) grid[i] = rand();
  return grid;
}

function sampleNoise(grid, size, x, y) {
  const fx = ((x % size) + size) % size;
  const fy = ((y % size) + size) % size;
  const ix = Math.floor(fx);
  const iy = Math.floor(fy);
  const tx = fx - ix;
  const ty = fy - iy;

  // Smoothstep for continuity
  const sx = tx * tx * (3 - 2 * tx);
  const sy = ty * ty * (3 - 2 * ty);

  const idx = (r, c) => ((r % size) * size + (c % size));

  const v00 = grid[idx(iy, ix)];
  const v10 = grid[idx(iy, ix + 1)];
  const v01 = grid[idx(iy + 1, ix)];
  const v11 = grid[idx(iy + 1, ix + 1)];

  return (v00 * (1 - sx) + v10 * sx) * (1 - sy) +
         (v01 * (1 - sx) + v11 * sx) * sy;
}

/** Fractal Brownian Motion (multi-octave noise) */
function fbm(grid, gridSize, x, y, octaves, lacunarity, gain) {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxAmp = 0;

  for (let i = 0; i < octaves; i++) {
    value += sampleNoise(grid, gridSize, x * frequency, y * frequency) * amplitude;
    maxAmp += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }
  return value / maxAmp;
}

/* ------------------------------------------------------------------ */
/*  Velvet Normal Map                                                  */
/* ------------------------------------------------------------------ */

/**
 * Generates a normal map mimicking velvet microfiber orientation.
 * The fibers create a characteristic directional shading:
 *   - Fine-grained noise (individual fibers)
 *   - Directional bias (fibers tend vertically)
 *   - Medium-scale waves (groups of fibers bending together)
 */
export function createVelvetNormalMap(resolution = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(resolution, resolution);
  const data = imageData.data;

  const gridA = makeNoiseGrid(64, 42);
  const gridB = makeNoiseGrid(64, 137);
  const gridC = makeNoiseGrid(32, 999);

  for (let py = 0; py < resolution; py++) {
    for (let px = 0; px < resolution; px++) {
      const i = (py * resolution + px) * 4;
      const u = px / resolution;
      const v = py / resolution;

      // Fine fibers — high frequency, directional (stronger in y)
      const fineX = fbm(gridA, 64, u * 80, v * 80, 3, 2.0, 0.5) - 0.5;
      const fineY = fbm(gridB, 64, u * 80, v * 120, 3, 2.0, 0.5) - 0.5;

      // Medium waves — lower frequency, gives folds appearance
      const medX = fbm(gridC, 32, u * 12, v * 8, 2, 2.0, 0.6) - 0.5;
      const medY = fbm(gridA, 64, u * 8, v * 14, 2, 2.0, 0.6) - 0.5;

      // Combine with directional bias (fibers oriented vertically)
      const nx = fineX * 0.35 + medX * 0.25;
      const ny = fineY * 0.55 + medY * 0.20;

      // Normal map encoding: (0.5 + normal * 0.5) * 255
      data[i]     = Math.max(0, Math.min(255, Math.floor((nx + 0.5) * 255)));
      data[i + 1] = Math.max(0, Math.min(255, Math.floor((ny + 0.5) * 255)));
      data[i + 2] = 220; // z component — mostly pointing outward
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 24);
  return texture;
}

/* ------------------------------------------------------------------ */
/*  Velvet Roughness Map                                               */
/* ------------------------------------------------------------------ */

export function createVelvetRoughnessMap(resolution = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(resolution, resolution);
  const data = imageData.data;

  const grid = makeNoiseGrid(64, 314);

  for (let py = 0; py < resolution; py++) {
    for (let px = 0; px < resolution; px++) {
      const i = (py * resolution + px) * 4;
      const u = px / resolution;
      const v = py / resolution;

      // Velvet roughness: mostly very rough (0.85–0.98) with subtle variation
      const noise = fbm(grid, 64, u * 40, v * 40, 3, 2.0, 0.5);
      const roughness = 0.85 + noise * 0.13;
      const value = Math.max(0, Math.min(255, Math.floor(roughness * 255)));

      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 24);
  return texture;
}

/* ------------------------------------------------------------------ */
/*  Gold Metal Normal Map                                              */
/* ------------------------------------------------------------------ */

export function createGoldNormalMap(resolution = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(resolution, resolution);
  const data = imageData.data;

  const gridA = makeNoiseGrid(32, 77);
  const gridB = makeNoiseGrid(32, 200);

  for (let py = 0; py < resolution; py++) {
    for (let px = 0; px < resolution; px++) {
      const i = (py * resolution + px) * 4;
      const u = px / resolution;
      const v = py / resolution;

      // Scuffed gold — smooth bumps with fine scratches
      const bumpX = fbm(gridA, 32, u * 20, v * 20, 2, 2.0, 0.5) - 0.5;
      const bumpY = fbm(gridB, 32, u * 20, v * 20, 2, 2.0, 0.5) - 0.5;

      // Fine linear scratches along x-axis (rod direction)
      const scratch = Math.sin(v * resolution * 1.8) * 0.04;

      const nx = bumpX * 0.3 + scratch;
      const ny = bumpY * 0.3;

      data[i]     = Math.max(0, Math.min(255, Math.floor((nx + 0.5) * 255)));
      data[i + 1] = Math.max(0, Math.min(255, Math.floor((ny + 0.5) * 255)));
      data[i + 2] = 230;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
