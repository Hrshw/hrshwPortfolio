/* eslint-disable react-hooks/purity */
"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";

interface NeuralGatewayProps {
  position: [number, number, number];
}

const skills = [
  "React", "Node.js", "TypeScript", "Next.js", "Three.js", 
  "AWS", "Docker", "Kubernetes", "Express.js", "DynamoDB", 
  "Lambda", "CI/CD", "MongoDB", "C#", "ASP.NET", 
  "React Native", "Redis", "Python", "TailwindCSS", "Route 53"
];

export default function NeuralGateway({ position }: NeuralGatewayProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate random positions for the skill nodes
  const nodes = useMemo(() => {
    return skills.map((skill) => {
      // Create a somewhat spherical distribution
      const radius = 6 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return { skill, position: new THREE.Vector3(x, y, z) };
    });
  }, []);

  // Generate connection lines between close nodes
  const lines = useMemo(() => {
    const linesArr: { start: THREE.Vector3; end: THREE.Vector3; color: string }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 8) {
          linesArr.push({
            start: nodes[i].position,
            end: nodes[j].position,
            color: Math.random() > 0.5 ? "rgba(0, 242, 254, 0.3)" : "rgba(167, 139, 250, 0.3)"
          });
        }
      }
    }
    return linesArr;
  }, [nodes]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.5;
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group position={position}>
      <Html position={[0, 15, 0]} center zIndexRange={[100, 0]} transform sprite distanceFactor={15}>
        <div style={{ color: "var(--color-secondary)", textShadow: "0 0 10px #a78bfa", fontWeight: "bold", fontSize: "1.5rem", whiteSpace: "nowrap" }}>
          SKILLS_GALAXY
        </div>
      </Html>

      <group ref={groupRef}>
        {/* Central Core */}
        <Sphere args={[3, 32, 32]}>
          <meshStandardMaterial emissive="#a78bfa" emissiveIntensity={0.5} color="#000" wireframe />
        </Sphere>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <group key={i} position={node.position.toArray()}>
            <Sphere args={[0.3, 16, 16]}>
              <meshBasicMaterial color="#00f2fe" />
            </Sphere>
            <Html position={[0, -1, 0]} center zIndexRange={[100, 0]} transform sprite distanceFactor={15}>
              <div style={{ color: "var(--color-text)", fontSize: "0.8rem", background: "rgba(0,0,0,0.5)", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(0, 242, 254, 0.3)" }}>
                {node.skill}
              </div>
            </Html>
          </group>
        ))}

        {/* Connections */}
        {lines.map((line, i) => (
          <Line
            key={i}
            points={[line.start, line.end]}
            color={line.color}
            lineWidth={1}
            transparent
            opacity={0.5}
          />
        ))}
      </group>
    </group>
  );
}
