/**
 * CurtainReveal — Main WebGL curtain scene
 *
 * Drop-in replacement for the old CSS-based DrapeOpening.
 * Same API: <CurtainReveal onComplete={fn} />
 *
 * Renders a full-viewport R3F canvas with two cloth-simulated
 * velvet curtain panels, a gold cornice, and an HTML invitation
 * overlay that fades in behind the curtain as it opens.
 */
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import gsap from 'gsap';
import CurtainMesh from './CurtainMesh';
import useCurtainSound from './useCurtainSound';

/* ------------------------------------------------------------------ */
/*  Reduced-motion detection                                           */
/* ------------------------------------------------------------------ */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);
    const handler = (e) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/* ------------------------------------------------------------------ */
/*  Scene contents (inside Canvas)                                     */
/* ------------------------------------------------------------------ */

function CurtainScene({ leftSimRef, rightSimRef }) {
  return (
    <>
      {/* Cinematic key light from front-top */}
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[0, 3, 2]}
        intensity={1.1}
        color="#fff8eb"
      />
      {/* Left warm rim light for highlights on drapes */}
      <directionalLight
        position={[-4, 2, -1]}
        intensity={1.4}
        color="#ffd4cc"
      />
      {/* Right soft gold rim light */}
      <directionalLight
        position={[4, 2, -1]}
        intensity={1.4}
        color="#ffeed4"
      />
      {/* Ambient bottom glow */}
      <pointLight position={[0, -0.8, 1.5]} intensity={0.4} color="#ffb380" />

      {/* Subtle environment reflection for fabric sheen */}
      <Environment preset="apartment" environmentIntensity={0.25} />

      {/* Left curtain panel */}
      <CurtainMesh side="left" simulatorRef={leftSimRef} />

      {/* Right curtain panel */}
      <CurtainMesh side="right" simulatorRef={rightSimRef} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function CurtainReveal({ onStart, onComplete, data }) {
  const leftSimRef = useRef(null);
  const rightSimRef = useRef(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [openProgress, setOpenProgress] = useState(0);
  const sceneRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { play: playCurtainSound } = useCurtainSound();

  // GSAP timeline state holder
  const curtainState = useMemo(() => ({ openProgress: 0, settleAmplitude: 1 }), []);

  const handleOpen = useCallback(() => {
    if (isOpening || isDone) return;
    setIsOpening(true);
    onStart?.(); // Notify parent immediately so the main invitation becomes visible behind drapes
    playCurtainSound();

    // ---- Reduced-motion fallback ----
    if (reducedMotion) {
      gsap.to(sceneRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        onComplete: () => {
          setIsDone(true);
          onComplete?.();
        },
      });
      setOpenProgress(1);
      return;
    }

    // ---- Full physics animation ----
    const tl = gsap.timeline({
      onComplete: () => {
        // After settle, fade out the overlay
        gsap.to(sceneRef.current, {
          opacity: 0,
          duration: 0.8,
          delay: 0.1,
          onComplete: () => {
            setIsDone(true);
            onComplete?.();
          },
        });
      },
    });

    // Phase 1: Open the curtain (3.5s with power2.out — starts moving IMMEDIATELY)
    tl.to(curtainState, {
      openProgress: 1,
      duration: 3.5,
      ease: 'power2.out',
      onUpdate: () => {
        const p = curtainState.openProgress;
        leftSimRef.current?.setOpenProgress(p);
        rightSimRef.current?.setOpenProgress(p);
        setOpenProgress(p);
      },
    });

    // Phase 2: Settle oscillation (gentle elastic decay, overlapping)
    tl.to(curtainState, {
      settleAmplitude: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.6)',
      onUpdate: () => {
        const a = curtainState.settleAmplitude;
        leftSimRef.current?.setSettleAmplitude(a);
        rightSimRef.current?.setSettleAmplitude(a);
      },
    }, '-=0.4');
  }, [isOpening, isDone, curtainState, onStart, onComplete, reducedMotion, playCurtainSound]);

  if (isDone) return null;

  return (
    <div
      ref={sceneRef}
      className={`curtain-reveal-scene${isOpening ? ' is-opening' : ''}`}
      onClick={handleOpen}
      onTouchStart={(e) => {
        e.preventDefault();
        handleOpen();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleOpen()}
      aria-label="Touch to open invitation"
    >
      {/* WebGL canvas — transparent background reveals content behind */}
      <Canvas
        className="curtain-reveal-canvas"
        dpr={Math.min(window.devicePixelRatio, 2)}
        camera={{ position: [0, -0.05, 2.2], fov: 50, near: 0.01, far: 10 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <CurtainScene leftSimRef={leftSimRef} rightSimRef={rightSimRef} />
      </Canvas>

      {/* Call-to-action overlay */}
      {!isOpening && (
        <div className="curtain-reveal-cta">
          <p className="curtain-reveal-cta-hint">Touch to Open</p>
        </div>
      )}
    </div>
  );
}
