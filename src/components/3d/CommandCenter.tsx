"use client";

import React from "react";
import { Html, Box, Edges } from "@react-three/drei";

interface CommandCenterProps {
  position: [number, number, number];
}

export default function CommandCenter({ position }: CommandCenterProps) {
  // Removed floating animation to ensure buttons are easily clickable

  return (
    <group position={position}>
      {/* Abstract Command Server Structure */}
      <Box args={[10, 6, 2]}>
        <meshStandardMaterial emissive="#00f2fe" emissiveIntensity={0.15} color="#000" transparent opacity={0.6} />
        <Edges color="#00f2fe" />
      </Box>

      {/* sprite={true} ensures it perfectly faces the camera at the end of the journey */}
      <Html position={[0, 0, 1.2]} transform center sprite zIndexRange={[100, 0]} scale={0.5} distanceFactor={15}>
        <div className="glass-hud hud-interactive" style={{ padding: "3rem", width: "800px", textAlign: "left", display: "flex", gap: "2rem", borderTop: "4px solid var(--color-primary)", boxShadow: "0 0 30px rgba(0, 242, 254, 0.15)" }}>
          <div style={{ flex: 1 }}>
            <h1 className="glow-text" style={{ fontSize: "2.8rem", fontFamily: "var(--font-mono)", color: "#fff", textShadow: "0 0 15px rgba(0, 242, 254, 0.8)", marginBottom: "0.5rem" }}>
              COMMAND_CENTER
            </h1>
            <p style={{ color: "var(--color-muted)", fontSize: "1.1rem", marginBottom: "2rem", letterSpacing: "1px" }}>
              Connection established. Ready for transmission.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <a href="mailto:rahulsinghshekhawat2003@gmail.com" 
                 style={{ textAlign: "center", display: "block", textDecoration: "none", color: "#000", background: "var(--color-primary)", padding: "12px 24px", borderRadius: "4px", fontWeight: "bold", letterSpacing: "2px", textShadow: "none", boxShadow: "0 0 15px var(--color-primary)" }}>
                INITIATE_CONTACT
              </a>
              <a href="https://github.com/Hrshw" target="_blank" rel="noreferrer" 
                 style={{ textAlign: "center", display: "block", textDecoration: "none", color: "#fff", background: "rgba(0, 242, 254, 0.1)", border: "1px solid var(--color-primary)", padding: "12px 24px", borderRadius: "4px", fontWeight: "bold", letterSpacing: "2px", transition: "all 0.2s" }}>
                VIEW_GITHUB_DATABANK
              </a>
              <a href="https://linkedin.com/in/rahul-singh-shekhawat" target="_blank" rel="noreferrer" 
                 style={{ textAlign: "center", display: "block", textDecoration: "none", color: "#fff", background: "rgba(167, 139, 250, 0.1)", border: "1px solid var(--color-secondary)", padding: "12px 24px", borderRadius: "4px", fontWeight: "bold", letterSpacing: "2px", transition: "all 0.2s", boxShadow: "0 0 10px rgba(167, 139, 250, 0.2) inset" }}>
                CONNECT_LINKEDIN
              </a>
            </div>
          </div>
          <div style={{ flex: 1, borderLeft: "1px solid rgba(0, 242, 254, 0.3)", paddingLeft: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "var(--color-primary)", lineHeight: 2 }}>
              <p style={{ margin: 0 }}>&gt; SYSTEM STATUS: <span style={{ color: "var(--color-success)" }}>OPTIMAL</span></p>
              <p style={{ margin: 0 }}>&gt; UPTIME: <span style={{ color: "#fff" }}>99.99%</span></p>
              <p style={{ margin: 0 }}>&gt; NEURAL LINK: <span style={{ color: "var(--color-success)" }}>ACTIVE</span></p>
              <p style={{ margin: 0, marginTop: "1rem", color: "var(--color-secondary)" }}>&gt; AWAITING INPUT...</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "1rem" }}>
                <span className="indicator indicator-green" />
                <span style={{ fontSize: "0.8rem", color: "var(--color-muted)", letterSpacing: "2px" }}>SECURE CONNECTION</span>
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}
