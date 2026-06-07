/**
 * Cornice — Gold rod + sliding curtain rings
 *
 * The rod is a cylinder spanning the scene width.
 * Rings are torus geometries positioned at each top-row particle,
 * updated every frame so they slide as the curtain gathers.
 */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONFIG } from './ClothSimulator';
import { createGoldNormalMap } from './generateTextures';

const COLS = CONFIG.cols;

// Rod dimensions
const ROD_RADIUS = 0.012;
const ROD_LENGTH = 3.2;     // wide enough to cover both panels + overhang
const ROD_Y = 0.92;         // slightly above the top of the cloth

// Ring dimensions
const RING_OUTER = 0.018;
const RING_TUBE = 0.004;

export default function Cornice({ leftSimulatorRef, rightSimulatorRef }) {
  const ringsGroupRef = useRef();

  // Gold material textures
  const goldNormal = useMemo(() => createGoldNormalMap(256), []);

  const goldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xc9972a),
        roughness: 0.3,
        metalness: 0.9,
        normalMap: goldNormal,
        normalScale: new THREE.Vector2(0.3, 0.3),
      }),
    [goldNormal],
  );

  const ringMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xd4a930),
        roughness: 0.2,
        metalness: 0.95,
      }),
    [],
  );

  // Pre-create ring geometries (shared)
  const ringGeometry = useMemo(
    () => new THREE.TorusGeometry(RING_OUTER, RING_TUBE, 8, 16),
    [],
  );

  // Create ring meshes (one per top-row column per panel = 2 × COLS)
  const rings = useMemo(() => {
    const arr = [];
    for (let i = 0; i < COLS * 2; i++) {
      arr.push({ x: 0, z: 0 });
    }
    return arr;
  }, []);

  // Update ring positions every frame from simulators
  useFrame(() => {
    const group = ringsGroupRef.current;
    if (!group) return;

    const leftSim = leftSimulatorRef?.current;
    const rightSim = rightSimulatorRef?.current;

    if (leftSim) {
      const topRow = leftSim.getTopRowPositions();
      // Show every 3rd ring to avoid visual clutter
      for (let i = 0; i < COLS; i++) {
        const child = group.children[i];
        if (!child) continue;
        if (i % 3 !== 0) {
          child.visible = false;
          continue;
        }
        child.visible = true;
        child.position.set(topRow[i].x, ROD_Y - 0.012, topRow[i].z);
      }
    }

    if (rightSim) {
      const topRow = rightSim.getTopRowPositions();
      for (let i = 0; i < COLS; i++) {
        const child = group.children[COLS + i];
        if (!child) continue;
        if (i % 3 !== 0) {
          child.visible = false;
          continue;
        }
        child.visible = true;
        child.position.set(topRow[i].x, ROD_Y - 0.012, topRow[i].z);
      }
    }
  });

  return (
    <group>
      {/* Gold rod */}
      <mesh position={[0, ROD_Y, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[ROD_RADIUS, ROD_RADIUS, ROD_LENGTH, 16]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>

      {/* Decorative finials on each end */}
      <mesh position={[-ROD_LENGTH / 2, ROD_Y, 0]}>
        <sphereGeometry args={[ROD_RADIUS * 1.8, 12, 12]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>
      <mesh position={[ROD_LENGTH / 2, ROD_Y, 0]}>
        <sphereGeometry args={[ROD_RADIUS * 1.8, 12, 12]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>

      {/* Curtain rings group */}
      <group ref={ringsGroupRef}>
        {rings.map((_, i) => (
          <mesh
            key={i}
            geometry={ringGeometry}
            material={ringMaterial}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, ROD_Y - 0.012, 0]}
          />
        ))}
      </group>
    </group>
  );
}
