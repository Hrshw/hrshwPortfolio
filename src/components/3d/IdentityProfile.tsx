"use client";

import React, { useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface IdentityProfileProps {
  position: [number, number, number];
}

export default function IdentityProfile({ position }: IdentityProfileProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Subtle floating effect for the entire group
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      
      {/* SECTION 2: HELLO VISITOR */}
      <Html position={[15, -2, -40]} transform distanceFactor={15} zIndexRange={[100, 0]}>
        <div className="glass-hud" style={{ padding: "2.5rem", width: "500px", borderRight: "4px solid var(--color-secondary)" }}>
          <h3 style={{ color: "var(--color-secondary)", marginBottom: "1rem", fontSize: "1.5rem", letterSpacing: "2px" }}>HELLO VISITOR,</h3>
          <p style={{ color: "#eee", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            I&apos;m Rahul Singh Shekhawat.
            <br/><br/>
            A Cloud Engineer and Full-Stack Developer who genuinely enjoys turning ideas into real-world products. My journey started with curiosity — understanding how applications work, how systems scale, and how technology can solve real problems. 
          </p>
          <p style={{ color: "var(--color-muted)", fontSize: "1.05rem", lineHeight: 1.7 }}>
            Over time, that curiosity evolved into building production-grade applications, cloud infrastructure, automation systems, and AI-powered tools. I enjoy taking a concept from a simple idea on paper, designing the architecture, writing the code, deploying the infrastructure, and watching it become something people can actually use.
          </p>
        </div>
      </Html>

      {/* SECTION 3: CORE INTERESTS */}
      <Html position={[-10, 8, -80]} transform distanceFactor={15} zIndexRange={[100, 0]}>
        <div className="glass-hud" style={{ padding: "2rem", width: "450px", borderLeft: "4px solid var(--color-success)" }}>
          <div style={{ color: "var(--color-success)", fontWeight: "bold", borderBottom: "1px solid rgba(16, 185, 129, 0.3)", paddingBottom: "0.5rem", marginBottom: "1.5rem", fontSize: "1.2rem", letterSpacing: "1px" }}>
            CORE SYSTEM DATA
          </div>

          <div style={{ marginBottom: "1.2rem" }}>
            <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}>◉ Cloud Architecture</div>
            <div style={{ color: "var(--color-muted)", fontSize: "0.95rem", lineHeight: 1.5 }}>Designing scalable, secure, and reliable infrastructure using modern cloud technologies.</div>
          </div>
          
          <div style={{ marginBottom: "1.2rem" }}>
            <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}>◉ Full-Stack Development</div>
            <div style={{ color: "var(--color-muted)", fontSize: "0.95rem", lineHeight: 1.5 }}>Building end-to-end applications with intuitive user experiences and robust backend systems.</div>
          </div>

          <div style={{ marginBottom: "1.2rem" }}>
            <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}>◉ Artificial Intelligence</div>
            <div style={{ color: "var(--color-muted)", fontSize: "0.95rem", lineHeight: 1.5 }}>Exploring AI systems, observability platforms, automation, and intelligent workflows.</div>
          </div>

          <div>
            <div style={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}>◉ Product Development</div>
            <div style={{ color: "var(--color-muted)", fontSize: "0.95rem", lineHeight: 1.5 }}>Transforming ideas into products that solve meaningful problems and create real value.</div>
          </div>
        </div>
      </Html>

      {/* SECTION 4: FINAL MESSAGE */}
      <Html position={[10, -5, -120]} transform distanceFactor={15} zIndexRange={[100, 0]}>
        <div className="glass-hud" style={{ padding: "2rem", width: "400px", background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0, 242, 254, 0.4)", boxShadow: "0 0 20px rgba(0, 242, 254, 0.1)" }}>
          <div style={{ color: "var(--color-secondary)", fontSize: "0.9rem", marginBottom: "1rem", letterSpacing: "1px" }}>CURRENT FOCUS:</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
            <span style={{ fontSize: "0.85rem", background: "rgba(167,139,250,0.15)", padding: "4px 10px", borderRadius: "4px", border: "1px solid rgba(167,139,250,0.3)" }}>✓ Cloud Engineering</span>
            <span style={{ fontSize: "0.85rem", background: "rgba(167,139,250,0.15)", padding: "4px 10px", borderRadius: "4px", border: "1px solid rgba(167,139,250,0.3)" }}>✓ AI Observability</span>
            <span style={{ fontSize: "0.85rem", background: "rgba(167,139,250,0.15)", padding: "4px 10px", borderRadius: "4px", border: "1px solid rgba(167,139,250,0.3)" }}>✓ System Architecture</span>
            <span style={{ fontSize: "0.85rem", background: "rgba(167,139,250,0.15)", padding: "4px 10px", borderRadius: "4px", border: "1px solid rgba(167,139,250,0.3)" }}>✓ SaaS Products</span>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
            <div style={{ color: "var(--color-primary)", fontWeight: "bold", marginBottom: "0.5rem", fontSize: "1.1rem" }}>FINAL MESSAGE</div>
            <p style={{ color: "#ddd", fontSize: "1rem", fontStyle: "italic", margin: 0, lineHeight: 1.6 }}>
              &quot;Every project is an opportunity to build something better than yesterday.&quot;<br/><br/>
              <span style={{ color: "var(--color-success)", fontWeight: "bold", fontStyle: "normal" }}>STATUS:</span> Always Learning. Always Building. Always Exploring.
            </p>
          </div>
        </div>
      </Html>

    </group>
  );
}
