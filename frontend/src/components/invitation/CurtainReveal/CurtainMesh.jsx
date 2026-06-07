/**
 * CurtainMesh — Single cloth panel rendered via React Three Fiber
 *
 * Creates a PlaneGeometry whose vertex positions are updated every
 * frame from a ClothSimulator instance.  Uses MeshStandardMaterial
 * with procedural velvet textures for realistic fabric appearance.
 */
import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ClothSimulator, { CONFIG } from './ClothSimulator';
import { createVelvetNormalMap, createVelvetRoughnessMap } from './generateTextures';

const COLS = CONFIG.cols;
const ROWS = CONFIG.rows;

export default function CurtainMesh({ side = 'left', simulatorRef }) {
  const meshRef = useRef();
  const geoRef = useRef();

  // Get dynamic viewport dimensions from R3F context
  const { width: viewportWidth, height: viewportHeight } = useThree((state) => state.viewport);

  // Create the cloth simulator for this panel
  const simulator = useMemo(() => {
    const sim = new ClothSimulator(side, viewportWidth, viewportHeight);
    // Expose via ref so parent can control openProgress
    if (simulatorRef) simulatorRef.current = sim;
    return sim;
  }, [side, simulatorRef, viewportWidth, viewportHeight]);

  // Procedural textures (created once)
  const velvetNormal = useMemo(() => createVelvetNormalMap(512), []);
  const velvetRoughness = useMemo(() => createVelvetRoughnessMap(256), []);

  // Geometry with matching segment count
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1, COLS - 1, ROWS - 1);
    return geo;
  }, []);

  // Assign ref so useFrame can access it
  useEffect(() => {
    geoRef.current = geometry;
  }, [geometry]);

  // Material
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x52030a),   // rich, deep burgundy velvet
      roughness: 0.95,
      metalness: 0.05,
      normalMap: velvetNormal,
      normalScale: new THREE.Vector2(0.12, 0.12), // soft, micro-fabric texture
      roughnessMap: velvetRoughness,
      sheen: 1.0,                         // activates standard fabric/velvet shader model
      sheenColor: new THREE.Color(0xd46a7a), // warm rose-gold reflection on glancing angles
      sheenRoughness: 0.3,                // tight scattering for velvety sheen highlights
      side: THREE.DoubleSide,
      envMapIntensity: 0.6,               // reflection reflection details
    });
  }, [velvetNormal, velvetRoughness]);

  // Per-frame update: copy simulator positions into geometry vertices
  useFrame((_, delta) => {
    // Clamp delta to prevent explosion on tab-switch
    const dt = Math.min(delta, 0.05);
    simulator.update(dt);

    const geo = geoRef.current;
    if (!geo) return;

    const positions = geo.attributes.position;
    const points = simulator.points;

    for (let i = 0; i < points.length; i++) {
      positions.setXYZ(i, points[i].x, points[i].y, points[i].z);
    }

    positions.needsUpdate = true;

    // CRITICAL: recompute normals so lighting follows deformation
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} />
  );
}
