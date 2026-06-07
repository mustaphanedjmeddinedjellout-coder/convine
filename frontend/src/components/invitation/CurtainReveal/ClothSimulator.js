/**
 * ClothSimulator — Verlet Integration Cloth Physics
 * Pure JavaScript, no React / Three.js dependency.
 *
 * Simulates one curtain panel (left or right).
 * Grid: 40 columns × 60 rows of 3D particles.
 * Top row is pinned (curtain rings on the rod).
 */

const CONFIG = {
  cols: 40,
  rows: 60,
  damping: 0.983,
  gravity: 0.0000024,
  constraintIterations: 12,
  windStrength: 0.000018,
  windFrequency: 0.8,
};

export { CONFIG };

export default class ClothSimulator {
  /**
   * @param {'left'|'right'} side — which curtain panel
   */
  constructor(side = 'left', viewportWidth = 2.8, viewportHeight = 2.05) {
    this.side = side;
    this.cols = CONFIG.cols;
    this.rows = CONFIG.rows;

    // Add vertical overhang so the curtain extends slightly off-screen (top and bottom)
    // on all devices, hiding the geometry edges completely
    const overhangY = 0.2;
    this.panelHeight = viewportHeight + overhangY * 2;
    
    // Each panel covers slightly more than half the viewport width to create a solid overlap
    // and prevent any central gap
    const overlapX = 0.15;
    this.panelWidth = viewportWidth / 2 + overlapX;

    if (side === 'left') {
      this.xStart = -viewportWidth / 2 - 0.1; // extend 10cm past left screen boundary
      this.xEnd = overlapX;
    } else {
      this.xStart = -overlapX;
      this.xEnd = viewportWidth / 2 + 0.1;   // extend 10cm past right screen boundary
    }
    
    this.yTop = viewportHeight / 2 + overhangY;
    this.yBottom = -viewportHeight / 2 - overhangY;

    this.openProgress = 0;
    this.settleAmplitude = 0;
    this.time = 0;
    this.points = [];

    this._initPoints();
  }

  /* ------------------------------------------------------------------ */
  /*  Initialisation                                                     */
  /* ------------------------------------------------------------------ */

  _initPoints() {
    const { cols, rows } = this;
    const spanX = this.xEnd - this.xStart;
    const spanY = this.yTop - this.yBottom;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const u = col / (cols - 1);
        const v = row / (rows - 1);

        const x = this.xStart + u * spanX;
        const y = this.yTop - v * spanY;

        // Folds start at 0 at the top (pinned on rod) and quickly reach full depth (0.06 units)
        // by row 5 so that the curtain drapes beautifully rather than starting as a flat sheet.
        const foldProgress = Math.min(1, row / 5);
        const phase = this.side === 'left' ? 0 : Math.PI;
        // 4.5 waves across the width of the curtain panel
        const z = Math.sin(u * Math.PI * 2 * 4.5 + phase) * 0.06 * foldProgress;

        this.points.push({
          x, y, z,
          prevX: x,
          prevY: y,
          prevZ: z,
          pinned: row === 0,
          initX: x,
          initZ: z,
          col,
          row,
        });
      }
    }

    // Measure exact 3D distance between initial pleated vertices to use as rest lengths.
    // Storing unique rest lengths ensures the cloth stays stably pleated without self-tensioning.
    this.restLengthsH = new Float32Array(rows * (cols - 1));
    this.restLengthsV = new Float32Array((rows - 1) * cols);

    const dist = (p1, p2) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2);

    let hIdx = 0;
    let vIdx = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        if (col < cols - 1) {
          this.restLengthsH[hIdx++] = dist(this.points[idx], this.points[idx + 1]);
        }
        if (row < rows - 1) {
          this.restLengthsV[vIdx++] = dist(this.points[idx], this.points[idx + cols]);
        }
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  setOpenProgress(p) {
    this.openProgress = Math.max(0, Math.min(1, p));
  }

  setSettleAmplitude(a) {
    this.settleAmplitude = a;
  }

  /** Advance the simulation by one frame. */
  update(dt) {
    this.time += dt;

    const { points, cols, rows, openProgress } = this;
    const { damping, gravity, windStrength, windFrequency, constraintIterations } = CONFIG;

    // ---- Verlet integration ----
    for (let i = 0; i < points.length; i++) {
      const p = points[i];

      if (p.pinned) {
        this._updatePinnedPoint(p);
        continue;
      }

      const vx = (p.x - p.prevX) * damping;
      const vy = (p.y - p.prevY) * damping;
      const vz = (p.z - p.prevZ) * damping;

      p.prevX = p.x;
      p.prevY = p.y;
      p.prevZ = p.z;

      // Gravity (downward)
      p.y += vy - gravity;
      p.x += vx;
      p.z += vz;

      // Ambient wind — sinusoidal sway on z-axis + slight x perturbation
      const windPhase =
        this.time * windFrequency + p.col * 0.15 + p.row * 0.08;
      p.z += Math.sin(windPhase) * windStrength;
      p.x += Math.cos(windPhase * 0.7) * windStrength * 0.3;

      // Gathering force while curtain opens
      if (openProgress > 0) {
        this._applyGatherForce(p, dt);
      }
    }

    // ---- Constraint solver (bidirectional) ----
    for (let iter = 0; iter < constraintIterations; iter++) {
      this._solveConstraintsForward();
      this._solveConstraintsBackward();
    }
  }

  /** Return array of {x,y,z} for pinned top-row points (ring positions). */
  getTopRowPositions() {
    const out = [];
    for (let col = 0; col < this.cols; col++) {
      const p = this.points[col];
      out.push({ x: p.x, y: p.y, z: p.z });
    }
    return out;
  }

  /* ------------------------------------------------------------------ */
  /*  Pinned-point gathering                                             */
  /* ------------------------------------------------------------------ */

  _updatePinnedPoint(p) {
    const t = this._gatherEase(this.openProgress);
    const u = p.col / (this.cols - 1);
    const spanX = this.xEnd - this.xStart;

    // When gathering, the spread shrinks toward the outer edge.
    // At t = 1 the remaining spread is 15 % of original (bunched folds).
    const gatherRatio = 1 - t * 0.85;

    let newX;
    if (this.side === 'left') {
      // All points compress toward xStart (far-left)
      newX = this.xStart + u * spanX * gatherRatio;
    } else {
      // All points compress toward xEnd (far-right)
      newX = this.xEnd - (1 - u) * spanX * gatherRatio;
    }

    // Settling oscillation (decaying sine wave after opening completes)
    if (this.settleAmplitude > 0.001) {
      const settleOsc =
        Math.sin(this.time * 8) * this.settleAmplitude * 0.03;
      newX += settleOsc;
    }

    p.prevX = p.x;
    p.x = newX;

    // Keep pinned z stable
    p.prevZ = p.z;
  }

  /* ------------------------------------------------------------------ */
  /*  Gather force on free particles                                     */
  /* ------------------------------------------------------------------ */

  _applyGatherForce(p, dt) {
    const t = this._gatherEase(this.openProgress);
    const u = p.col / (this.cols - 1);
    
    // Scale force by time step (dt) to keep it frame-rate independent
    const dtScale = dt / 0.0166;

    // Strong horizontal pull — free particles follow the pinned top row sideways
    const strength = 0.002;
    if (this.side === 'left') {
      p.x -= (1 - u) * t * strength * dtScale;
    } else {
      p.x += u * t * strength * dtScale;
    }

    // Fold-preservation spring: gently push particles toward their initial z-position
    // so the velvet pleats stay visible throughout the opening, like real theatre curtains
    // that maintain their folds as they slide on the rod
    const foldSpring = 0.025;
    p.z += (p.initZ - p.z) * foldSpring * dtScale;

    // Subtle living sway — very gentle z-oscillation to add organic movement
    // without the grotesque billowing of the old version
    const rowNorm = p.row / (this.rows - 1);
    const sway = Math.sin(p.col * 0.4 + this.time * 1.5 + rowNorm * 2) * 0.00004;
    p.z += sway * t * dtScale;
  }

  /* ------------------------------------------------------------------ */
  /*  Constraint solver                                                  */
  /* ------------------------------------------------------------------ */

  _satisfyConstraint(p1, p2, restLen) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.00001;
    const correction = (dist - restLen) / dist / 2;

    if (!p1.pinned) {
      p1.x += dx * correction;
      p1.y += dy * correction;
      p1.z += dz * correction;
    }
    if (!p2.pinned) {
      p2.x -= dx * correction;
      p2.y -= dy * correction;
      p2.z -= dz * correction;
    }
  }

  /** Top-left → bottom-right sweep */
  _solveConstraintsForward() {
    const { points, cols, rows } = this;
    let hIdx = 0;
    let vIdx = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;

        // Horizontal neighbour
        if (col < cols - 1) {
          this._satisfyConstraint(points[idx], points[idx + 1], this.restLengthsH[hIdx++]);
        }
        // Vertical neighbour
        if (row < rows - 1) {
          this._satisfyConstraint(points[idx], points[idx + cols], this.restLengthsV[vIdx++]);
        }
      }
    }
  }

  /** Bottom-right → top-left sweep (eliminates directional bias) */
  _solveConstraintsBackward() {
    const { points, cols, rows } = this;

    for (let row = rows - 1; row >= 0; row--) {
      const rowHStart = row * (cols - 1);
      const rowVStart = row * cols;

      for (let col = cols - 1; col >= 0; col--) {
        const idx = row * cols + col;

        if (col < cols - 1) {
          const hIdx = rowHStart + col;
          this._satisfyConstraint(points[idx], points[idx + 1], this.restLengthsH[hIdx]);
        }
        if (row < rows - 1) {
          const vIdx = rowVStart + col;
          this._satisfyConstraint(points[idx], points[idx + cols], this.restLengthsV[vIdx]);
        }
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Easing                                                             */
  /* ------------------------------------------------------------------ */

  /** power3.inOut approximation */
  _gatherEase(t) {
    if (t < 0.5) return 4 * t * t * t;
    return 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
