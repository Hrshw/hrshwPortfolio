"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 150;
const MAX_DISTANCE = 3.5;

function Network() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  const { mouse } = useThree();

  // State for scaling interaction
  const isScalingRef = useRef(false);
  const scalingFactorRef = useRef(0);

  useEffect(() => {
    const handleScaling = (e: any) => {
      isScalingRef.current = e.detail;
    };
    window.addEventListener('setScalingMode', handleScaling);
    return () => window.removeEventListener('setScalingMode', handleScaling);
  }, []);

  // Initialize particle positions and velocities
  const { particles, positions, velocities } = useMemo(() => {
    const p = new Float32Array(PARTICLE_COUNT * 3);
    const v = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
      
      v.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ));
    }
    return { particles: p, positions: p, velocities: v };
  }, []);

  // Pre-allocate arrays for line geometry
  const maxLines = (PARTICLE_COUNT * (PARTICLE_COUNT - 1)) / 2;
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !linesRef.current || !groupRef.current) return;

    // Smooth lerp for scaling factor
    const targetScale = isScalingRef.current ? 1 : 0;
    scalingFactorRef.current += (targetScale - scalingFactorRef.current) * 0.05;
    const sf = scalingFactorRef.current;

    // Dynamic Variables based on scaling factor
    const dynamicMaxDist = THREE.MathUtils.lerp(MAX_DISTANCE, 8.0, sf);
    const speedMultiplier = THREE.MathUtils.lerp(1.0, 15.0, sf);
    const groupScale = THREE.MathUtils.lerp(1.0, 1.4, sf);
    
    groupRef.current.scale.setScalar(groupScale);

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const pts = posAttr.array as Float32Array;
    
    // Mouse interaction target
    const targetX = (mouse.x * 10);
    const targetY = (mouse.y * 10);

    // Update positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      pts[idx] += velocities[i].x * speedMultiplier;
      pts[idx + 1] += velocities[i].y * speedMultiplier;
      pts[idx + 2] += velocities[i].z * speedMultiplier;

      // Wrap around bounds
      if (pts[idx] > 10) pts[idx] = -10;
      if (pts[idx] < -10) pts[idx] = 10;
      if (pts[idx + 1] > 10) pts[idx + 1] = -10;
      if (pts[idx + 1] < -10) pts[idx + 1] = 10;
      if (pts[idx + 2] > 5) pts[idx + 2] = -15;
      if (pts[idx + 2] < -15) pts[idx + 2] = 5;

      // Mouse repulsion/attraction subtle effect (stronger when scaling)
      const dx = targetX - pts[idx];
      const dy = targetY - pts[idx + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const mouseInfluence = THREE.MathUtils.lerp(0.01, 0.05, sf);
      if (dist < 4) {
        pts[idx] -= dx * mouseInfluence;
        pts[idx + 1] -= dy * mouseInfluence;
      }
    }
    posAttr.needsUpdate = true;

    // Calculate connections
    let lineIdx = 0;
    let colorIdx = 0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const idx1 = i * 3;
        const idx2 = j * 3;
        
        const dx = pts[idx1] - pts[idx2];
        const dy = pts[idx1 + 1] - pts[idx2 + 1];
        const dz = pts[idx1 + 2] - pts[idx2 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < dynamicMaxDist * dynamicMaxDist) {
          const alpha = 1.0 - Math.sqrt(distSq) / dynamicMaxDist;
          
          linePositions[lineIdx++] = pts[idx1];
          linePositions[lineIdx++] = pts[idx1 + 1];
          linePositions[lineIdx++] = pts[idx1 + 2];
          
          linePositions[lineIdx++] = pts[idx2];
          linePositions[lineIdx++] = pts[idx2 + 1];
          linePositions[lineIdx++] = pts[idx2 + 2];

          // Dynamic Colors
          // Normal: r=0.47, g=0.46, b=0.8
          // Scaled (Cyan/Emerald): r=0.0, g=1.0, b=0.8
          const r = THREE.MathUtils.lerp(0.47, 0.0, sf);
          const g = THREE.MathUtils.lerp(0.46, 1.0, sf);
          const b = THREE.MathUtils.lerp(0.80, 0.8, sf);

          // Lines get brighter when scaling
          const alphaMult = THREE.MathUtils.lerp(0.3, 0.8, sf);

          lineColors[colorIdx++] = r;
          lineColors[colorIdx++] = g;
          lineColors[colorIdx++] = b;
          lineColors[colorIdx++] = alpha * alphaMult;

          lineColors[colorIdx++] = r;
          lineColors[colorIdx++] = g;
          lineColors[colorIdx++] = b;
          lineColors[colorIdx++] = alpha * alphaMult;
        }
      }
    }

    const linesGeom = linesRef.current.geometry;
    linesGeom.setDrawRange(0, lineIdx / 3);
    
    const linePosAttr = linesGeom.attributes.position as THREE.BufferAttribute;
    const lineColorAttr = linesGeom.attributes.color as THREE.BufferAttribute;
    
    linePosAttr.needsUpdate = true;
    lineColorAttr.needsUpdate = true;
    
    linesRef.current.rotation.y += 0.0005 * speedMultiplier;
    pointsRef.current.rotation.y += 0.0005 * speedMultiplier;
    
    // Add some chaos shake when fully scaled
    if (sf > 0.1) {
       groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 20) * 0.01 * sf;
       groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 25) * 0.01 * sf;
    } else {
       groupRef.current.rotation.z = 0;
       groupRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#a0a0ff"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            usage={THREE.DynamicDrawUsage}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 4]}
            usage={THREE.DynamicDrawUsage}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function ScalableNodes() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0, opacity: 0.6 }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 2]}>
        <Network />
      </Canvas>
    </div>
  );
}
