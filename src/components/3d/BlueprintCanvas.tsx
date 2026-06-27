"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

function BlueprintStructure({ isDarkTheme }: { isDarkTheme: boolean }) {
  const outerLinesRef = useRef<THREE.LineSegments>(null);
  const outerGroupRef = useRef<THREE.Group>(null);
  
  const innerLinesRef = useRef<THREE.LineSegments>(null);
  const innerGroupRef = useRef<THREE.Group>(null);

  const pointsRef = useRef<THREE.Points>(null);
  
  // State for hover interaction
  const isDesigningRef = useRef(false);
  const speedRef = useRef(1);

  // Smooth scroll tracker
  const targetScrollProgress = useRef(0);
  const currentScrollProgress = useRef(0);

  // Parallax mouse variables
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetMouseX = useRef(0);
  const targetMouseY = useRef(0);

  // Click shockwave variables
  const rippleProgress = useRef(-1.0);
  const rippleIntensity = useRef(0.0);

  useEffect(() => {
    const handleDesignMode = (e: CustomEvent<boolean>) => {
      isDesigningRef.current = e.detail;
    };
    window.addEventListener('setDesignMode', handleDesignMode as EventListener);
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(Math.max(scrollY / 800, 0), 1);
      targetScrollProgress.current = progress;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Scale between -0.5 and 0.5
      targetMouseX.current = (e.clientX / window.innerWidth) - 0.5;
      targetMouseY.current = (e.clientY / window.innerHeight) - 0.5;
    };

    const handleClick = () => {
      rippleProgress.current = 0.0;
      rippleIntensity.current = 1.0;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('setDesignMode', handleDesignMode as EventListener);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Outer Shell Geometry (Icosahedron + Cylinder)
  const { outerPositions, outerVertices } = useMemo(() => {
    const geom1 = new THREE.IcosahedronGeometry(4, 2);
    const geom2 = new THREE.CylinderGeometry(5, 5, 2, 32, 4, true);
    geom2.rotateX(Math.PI / 2);
    
    const edges1 = new THREE.EdgesGeometry(geom1);
    const edges2 = new THREE.EdgesGeometry(geom2);

    const pos1 = edges1.attributes.position.array;
    const pos2 = edges2.attributes.position.array;

    const totalLength = pos1.length + pos2.length;
    const combined = new Float32Array(totalLength);
    combined.set(pos1, 0);
    combined.set(pos2, pos1.length);

    return { outerPositions: combined, outerVertices: totalLength / 3 };
  }, []);

  // Inner Core Geometry (Torus Knot)
  const { innerPositions, innerVertices } = useMemo(() => {
    const geom = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32, 3, 5);
    const edges = new THREE.EdgesGeometry(geom);
    return { innerPositions: edges.attributes.position.array, innerVertices: edges.attributes.position.array.length / 3 };
  }, []);

  // Particle Swarm Coordinates
  const particleCount = 300;
  const { particlePositions, particleSpeeds } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const r = 2.0 + Math.random() * 8.0;
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      speeds[i] = 0.4 + Math.random() * 1.6;
    }
    return { particlePositions: positions, particleSpeeds: speeds };
  }, []);

  // Custom shader material for Inner Core
  const innerShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00f2fe) },
        uOpacity: { value: 0.0 },
        uScroll: { value: 0.0 },
        uNoiseStrength: { value: 0.06 },
        uRippleProgress: { value: -1.0 },
        uRippleIntensity: { value: 0.0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScroll;
        uniform float uNoiseStrength;
        uniform float uRippleProgress;
        uniform float uRippleIntensity;
        varying vec3 vPosition;
        varying float vRipple;
        
        void main() {
          vPosition = position;
          vec3 pos = position;
          
          // Ripple calculations based on distance from center
          float dist = length(pos);
          float rippleWidth = 0.6;
          // Creates a peak ring at uRippleProgress
          float ripple = smoothstep(rippleWidth, 0.0, abs(dist - uRippleProgress));
          vRipple = ripple;
          
          // Organic waves displacement based on time and scroll
          float freq = 1.6 + uScroll * 1.4;
          float waveX = sin(pos.y * freq + uTime * 2.2) * uNoiseStrength;
          float waveY = cos(pos.z * freq + uTime * 2.6) * uNoiseStrength;
          float waveZ = sin(pos.x * freq + uTime * 1.9) * uNoiseStrength;
          
          pos += vec3(waveX, waveY, waveZ);
          
          // Ripple expands vertices outwards slightly
          pos += normalize(pos) * ripple * uRippleIntensity * 0.4;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec3 vPosition;
        varying float vRipple;
        
        void main() {
          // Dynamic pulse effect
          float pulse = 0.8 + 0.2 * sin(vPosition.x * 4.0 + vPosition.y * 3.0);
          
          // Ripple turns white and adds brightness
          vec3 finalColor = mix(uColor, vec3(1.0, 1.0, 1.0), vRipple * 0.8);
          float finalOpacity = mix(uOpacity, uOpacity + 0.4, vRipple * 0.7);
          
          gl_FragColor = vec4(finalColor * pulse, clamp(finalOpacity, 0.0, 1.0));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Animation variables
  const drawCount = useRef(0);

  useFrame((state) => {
    if (!outerLinesRef.current || !outerGroupRef.current || !innerLinesRef.current || !innerGroupRef.current) return;

    const time = state.clock.elapsedTime;

    // Smooth scroll interpolation
    currentScrollProgress.current += (targetScrollProgress.current - currentScrollProgress.current) * 0.05;
    const progress = currentScrollProgress.current;

    // Smooth mouse coordinates interpolation
    mouseX.current += (targetMouseX.current - mouseX.current) * 0.05;
    mouseY.current += (targetMouseY.current - mouseY.current) * 0.05;

    // Smooth speed change based on hover
    const targetSpeed = isDesigningRef.current ? 400 : 10;
    speedRef.current += (targetSpeed - speedRef.current) * 0.1;
    drawCount.current = (drawCount.current + speedRef.current);
    
    // Outer Shell Updates
    outerLinesRef.current.geometry.setDrawRange(0, Math.floor(drawCount.current % outerVertices));
    
    // Inner Core Updates - always draw fully
    innerLinesRef.current.geometry.setDrawRange(0, innerVertices);

    // ----------------------------------------------------
    // SCROLL & MOUSE INTERACTION (ROTATIONS & SCALES)
    // ----------------------------------------------------
    
    // 1. Outer Shell: Scale & Rotation
    const outerScaleTarget = isDesigningRef.current ? 1.2 : 1.0;
    const finalOuterScale = THREE.MathUtils.lerp(outerScaleTarget, 12.0, Math.pow(progress, 1.5));
    outerGroupRef.current.scale.set(finalOuterScale, finalOuterScale, finalOuterScale);
    
    // Combine automatic spin with mouse parallax tilt
    outerGroupRef.current.rotation.y = time * 0.02 + mouseX.current * 0.3;
    outerGroupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1 + mouseY.current * 0.3;

    // 2. Inner Core: Scale & Rotation
    const finalInnerScale = THREE.MathUtils.lerp(0.01, 1.2, progress);
    innerGroupRef.current.scale.set(finalInnerScale, finalInnerScale, finalInnerScale);
    
    // Spin inner core faster, responding to mouse tilt & scroll progress
    innerGroupRef.current.rotation.y = time * 0.4 + (progress * Math.PI) + mouseX.current * 0.6;
    innerGroupRef.current.rotation.x = time * 0.2 + (progress * Math.PI * 0.5) + mouseY.current * 0.6;

    // 3. Particles Swarm movement
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.01 + mouseX.current * 0.2;
      pointsRef.current.rotation.x = time * 0.005 + mouseY.current * 0.2;

      // Animate particles flying forward as scroll happens
      const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const baseSpeed = 0.005;
        const scrollBonus = progress * 0.08;
        
        // Move towards camera
        posArr[i * 3 + 2] += (baseSpeed + scrollBonus) * particleSpeeds[i];
        
        // Wrap around when passing target cameras z coordinate (Z > 5)
        if (posArr[i * 3 + 2] > 6) {
          posArr[i * 3 + 2] = -8; // Teleport back
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // ----------------------------------------------------
    // SHADER & COLOR UPDATES
    // ----------------------------------------------------
    
    // Update Ripple parameters
    if (rippleProgress.current >= 0.0) {
      rippleProgress.current += 0.06; // expansion rate
      rippleIntensity.current *= 0.94; // dissipation decay
      
      // Reset ripple when it expands past boundaries
      if (rippleProgress.current > 5.0) {
        rippleProgress.current = -1.0;
        rippleIntensity.current = 0.0;
      }
    }

    // Bind Shader Uniforms
    innerShaderMaterial.uniforms.uTime.value = time;
    innerShaderMaterial.uniforms.uScroll.value = progress;
    innerShaderMaterial.uniforms.uRippleProgress.value = rippleProgress.current;
    innerShaderMaterial.uniforms.uRippleIntensity.value = rippleIntensity.current;

    const outerMat = outerLinesRef.current.material as THREE.LineBasicMaterial;
    
    // Opacities based on theme
    const baseOuterOpacity = isDarkTheme ? 0.3 : 0.05;
    const targetOuterOpacity = THREE.MathUtils.lerp(baseOuterOpacity, 0.0, Math.pow(progress, 0.5));
    
    if (isDesigningRef.current && progress < 0.5) {
      outerMat.color.lerp(new THREE.Color(0x00f2fe), 0.1);
      outerMat.opacity = THREE.MathUtils.lerp(outerMat.opacity, 0.8 * (1 - progress), 0.1);
    } else {
      outerMat.color.lerp(new THREE.Color(isDarkTheme ? 0x444444 : 0xa1a1aa), 0.1);
      outerMat.opacity = THREE.MathUtils.lerp(outerMat.opacity, targetOuterOpacity, 0.1);
    }

    // Dynamic inner material configurations
    const coreColor = isDarkTheme ? new THREE.Color(0x00f2fe) : new THREE.Color(0x0284c7);
    innerShaderMaterial.uniforms.uColor.value.copy(coreColor);
    
    const targetInnerOpacity = THREE.MathUtils.lerp(0.0, isDarkTheme ? 0.15 : 0.06, progress);
    innerShaderMaterial.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      innerShaderMaterial.uniforms.uOpacity.value,
      targetInnerOpacity,
      0.1
    );
  });

  return (
    <group position={[0, 0, -2]}>
      {/* Outer Shell */}
      <group ref={outerGroupRef}>
        <lineSegments ref={outerLinesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[outerPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={isDarkTheme ? 0x444444 : 0xa1a1aa}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      </group>
      
      {/* Inner Core (Custom Shader Material for Organic Waves + Ripples) */}
      <group ref={innerGroupRef}>
        <lineSegments ref={innerLinesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[innerPositions, 3]}
            />
          </bufferGeometry>
          <primitive object={innerShaderMaterial} attach="material" />
        </lineSegments>
      </group>

      {/* Floating Particles Swarm */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={isDarkTheme ? 0x00f2fe : 0x0284c7}
          size={0.05}
          transparent
          opacity={isDarkTheme ? 0.12 : 0.05}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
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
