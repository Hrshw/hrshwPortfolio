"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Box, Torus } from "@react-three/drei";
import * as THREE from "three";

interface ProjectPlanetProps {
  position: [number, number, number];
  color: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
}

export default function ProjectPlanet({ position, color, title, category, description, technologies }: ProjectPlanetProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.5;
      coreRef.current.rotation.y = t * 0.5;
      coreRef.current.position.y = Math.sin(t * 2) * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t) * 0.2;
      ringRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Abstract Project Representation (Monolith/Cube) */}
      <Box ref={coreRef} args={[3, 3, 3]}>
        <meshStandardMaterial emissive={color} emissiveIntensity={0.8} color="#000" wireframe />
      </Box>

      {/* Energy Ring */}
      <Torus ref={ringRef} args={[5, 0.1, 16, 100]}>
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </Torus>

      <Html position={[0, 6, 0]} center zIndexRange={[100, 0]} transform distanceFactor={15}>
        <div className="glass-hud" style={{ padding: "1.5rem", width: "400px", pointerEvents: "auto", borderTop: `2px solid ${color}` }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: "0.5rem" }}>
            {category}
          </span>
          <h2 style={{ color: "#fff", textShadow: `0 0 10px ${color}`, margin: 0, marginBottom: "0.75rem", fontSize: "1.5rem" }}>{title}</h2>
          <p style={{ color: "var(--color-muted)", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: "1rem" }}>
            {description}
          </p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {technologies.map((tech, idx) => (
              <span key={idx} style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px", color: "var(--color-text)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
}
