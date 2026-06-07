"use client";

import React, { useRef } from "react";
import { Html, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface UniverseEntryProps {
  position: [number, number, number];
}

export default function UniverseEntry({ position }: UniverseEntryProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group position={position} ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Html transform center position={[0, 0, 0]} scale={0.5} zIndexRange={[100, 0]} distanceFactor={15}>
          <div className="glass-hud" style={{ padding: "2rem 4rem", textAlign: "center", minWidth: "500px" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
              <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--color-primary)", boxShadow: "0 0 15px rgba(0, 242, 254, 0.4)" }}>
                <img src="/rahul.jpg" alt="Rahul Singh Shekhawat" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
            
            <h1 className="glow-text" style={{ fontSize: "2.5rem", margin: 0, fontFamily: "var(--font-mono)", fontWeight: 700, marginBottom: "1.5rem" }}>
              Rahul Singh Shekhawat
            </h1>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", textAlign: "center", marginBottom: "1.5rem", color: "var(--color-muted)", fontSize: "1.1rem" }}>
              <div><strong style={{ color: "var(--color-secondary)" }}>Role:</strong> Cloud Engineer • Full-Stack Developer • Product Builder</div>
              <div><strong style={{ color: "var(--color-secondary)" }}>Location:</strong> India</div>
              <div style={{ maxWidth: "450px", margin: "0 auto", fontStyle: "italic" }}>
                <strong style={{ color: "var(--color-secondary)", fontStyle: "normal" }}>Mission:</strong> Transform ambitious ideas into scalable, reliable, and impactful digital products
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.5rem" }}>
              <span style={{ fontSize: "0.85rem", background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "4px", color: "var(--color-text)" }}>B.Sc in CS</span>
              <span style={{ fontSize: "0.85rem", background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "4px", color: "var(--color-text)" }}>3+ Years Exp</span>
            </div>
            
            <div style={{ marginTop: "2rem", opacity: 0.7 }}>
              <p style={{ fontSize: "0.9rem", color: "var(--color-primary)" }}>SCROLL TO INITIATE TRAVEL</p>
              <div style={{ width: "2px", height: "40px", background: "var(--color-primary)", margin: "1rem auto 0" }} />
            </div>
          </div>
        </Html>
      </Float>
    </group>
  );
}
