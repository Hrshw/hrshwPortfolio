"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Sphere, Ring } from "@react-three/drei";
import * as THREE from "three";

interface ProfessionalOrbitProps {
  position: [number, number, number];
}

const experiences = [
  {
    role: "Full-Stack Developer Intern",
    company: "Envint Services LLP",
    duration: "Nov 2023 - Present",
    color: "#00f2fe",
    radius: 12,
    angle: 0,
  },
  {
    role: "Software Engineer Intern",
    company: "Finquant Technologies",
    duration: "Aug 2023 - Sep 2023",
    color: "#a78bfa",
    radius: 12,
    angle: (Math.PI * 2) / 3,
  },
  {
    role: "Web Dev Intern",
    company: "PIEDS BITS Pilani",
    duration: "2023",
    color: "#10b981",
    radius: 12,
    angle: (Math.PI * 4) / 3,
  },
  {
    role: "Backend Dev Intern",
    company: "DreamSync",
    duration: "2023",
    color: "#f59e0b",
    radius: 18,
    angle: Math.PI / 2,
  },
  {
    role: "Full-Stack Developer",
    company: "Freelance",
    duration: "2022 - 2024",
    color: "#ef4444",
    radius: 18,
    angle: (Math.PI * 3) / 2,
  }
];

export default function ProfessionalOrbit({ position }: ProfessionalOrbitProps) {
  const orbitGroup = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (orbitGroup.current) {
      orbitGroup.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Central Star */}
      <Sphere args={[2, 32, 32]}>
        <meshStandardMaterial emissive="#00f2fe" emissiveIntensity={2} color="#000" />
      </Sphere>
      <Html position={[0, 3, 0]} center zIndexRange={[100, 0]} transform sprite distanceFactor={15}>
        <div style={{ color: "var(--color-primary)", textShadow: "0 0 10px #00f2fe", fontWeight: "bold", fontSize: "1.5rem", whiteSpace: "nowrap" }}>
          PROFESSIONAL_JOURNEY
        </div>
      </Html>

      {/* Orbit Rings */}
      <Ring args={[11.8, 12, 64]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </Ring>
      <Ring args={[17.8, 18, 64]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </Ring>

      <group ref={orbitGroup}>
        {experiences.map((exp, index) => {
          const x = Math.cos(exp.angle) * exp.radius;
          const z = Math.sin(exp.angle) * exp.radius;
          
          return (
            <group key={index} position={[x, 0, z]}>
              <Sphere args={[0.5, 16, 16]}>
                <meshStandardMaterial emissive={exp.color} emissiveIntensity={0.8} color="#111" />
              </Sphere>
              <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]} transform sprite distanceFactor={15}>
                <div className="glass-hud" style={{ padding: "1rem", whiteSpace: "nowrap", pointerEvents: "auto", cursor: "pointer", borderTop: `2px solid ${exp.color}` }}>
                  <h3 style={{ color: "#fff", textShadow: `0 0 10px ${exp.color}` }}>{exp.role}</h3>
                  <h4 style={{ color: exp.color, fontSize: "0.9rem", marginTop: "0.2rem" }}>{exp.company}</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-muted)", marginTop: "0.5rem" }}>{exp.duration}</p>
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
}
