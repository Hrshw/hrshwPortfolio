"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

function BlueprintStructure({ isDarkTheme }: { isDarkTheme: boolean }) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // State for hover interaction
  const isDesigningRef = useRef(false);
  const speedRef = useRef(1);

  useEffect(() => {
    const handleDesignMode = (e: any) => {
      isDesigningRef.current = e.detail;
    };
    window.addEventListener('setDesignMode', handleDesignMode);
    return () => window.removeEventListener('setDesignMode', handleDesignMode);
  }, []);

  // Pre-calculate a massive wireframe shape (a complex icosahedron or sphere + grid)
  const { positions, totalVertices } = useMemo(() => {
    const geom1 = new THREE.IcosahedronGeometry(4, 2);
    const geom2 = new THREE.CylinderGeometry(5, 5, 2, 32, 4, true);
    geom2.rotateX(Math.PI / 2);
    
    // Merge geometries by extracting their edges
    const edges1 = new THREE.EdgesGeometry(geom1);
    const edges2 = new THREE.EdgesGeometry(geom2);

    const pos1 = edges1.attributes.position.array;
    const pos2 = edges2.attributes.position.array;

    const totalLength = pos1.length + pos2.length;
    const combinedPositions = new Float32Array(totalLength);
    
    combinedPositions.set(pos1, 0);
    combinedPositions.set(pos2, pos1.length);

    return { positions: combinedPositions, totalVertices: totalLength / 3 };
  }, []);

  // Animation variables
  const drawCount = useRef(0);

  useFrame((state) => {
    if (!linesRef.current || !groupRef.current) return;

    // Smooth lerp speed based on hover
    const targetSpeed = isDesigningRef.current ? 400 : 10;
    speedRef.current += (targetSpeed - speedRef.current) * 0.1;

    // Increment draw count
    drawCount.current = (drawCount.current + speedRef.current) % totalVertices;

    // Update drawing range to simulate drawing over time
    linesRef.current.geometry.setDrawRange(0, Math.floor(drawCount.current));

    // Dynamic scale/rotation during 'Designing' burst
    const scaleTarget = isDesigningRef.current ? 1.2 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), 0.05);

    groupRef.current.rotation.y += 0.001 * (isDesigningRef.current ? 5 : 1);
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    
    // Dynamic color (glow cyan when designing, subtle grey/black based on theme when idle)
    const mat = linesRef.current.material as THREE.LineBasicMaterial;
    if (isDesigningRef.current) {
      mat.color.lerp(new THREE.Color(0x00f2fe), 0.1);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.8, 0.1);
    } else {
      mat.color.lerp(new THREE.Color(isDarkTheme ? 0x444444 : 0x000000), 0.1);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, isDarkTheme ? 0.3 : 0.05, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={0x444444}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function BlueprintCanvas() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkTheme = mounted ? resolvedTheme !== "light" : true;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
        <BlueprintStructure isDarkTheme={isDarkTheme} />
      </Canvas>
    </div>
  );
}
