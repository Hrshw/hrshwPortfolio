"use client";

import React from "react";
import Image from "next/image";

export default function Hero() {
  const scrollTerminal = () => {
    const el = document.getElementById("section-terminal");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section>
      {/* Profile Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem" }}>
        <div
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid var(--color-primary)",
            boxShadow: "var(--glow-shadow)",
            position: "relative",
            flexShrink: 0
          }}
        >
          <Image
            src="/rahul.png"
            alt="Rahul Singh Shekhawat"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "9999px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              color: "var(--color-success)",
              fontSize: "0.85rem",
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
          >
            <span className="pulsing-node" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-success)" }} />
            Active_System_Online
          </div>
          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 3.8rem)", // Scaled up (was 2rem to 3rem)
              fontWeight: 800,
              lineHeight: 1.1,
              marginTop: "0.5rem",
              color: "#ffffff"
            }}
          >
            Rahul Singh <span className="glow-text">Shekhawat</span>
          </h1>
        </div>
      </div>

      {/* Title Tagline */}
      <h2
        style={{
          fontSize: "1.5rem", // Scaled up (was 1.25rem)
          fontWeight: 600,
          color: "var(--color-secondary)",
          marginBottom: "1.25rem",
          fontFamily: "var(--font-mono)",
        }}
      >
        &lt; AI-Powered SaaS &amp; Cloud Engineer /&gt;
      </h2>

      {/* Professional Bio */}
      <p
        style={{
          fontSize: "1.2rem", // Scaled up (was 1rem)
          lineHeight: 1.6,
          color: "var(--color-muted)",
          marginBottom: "2.5rem",
          maxWidth: "850px",
        }}
      >
        Specializing in high-performance web applications, scalable cloud infrastructure design on AWS, and production intelligent AI integrations. Resolving complex engineering challenges with elegant, developer-centric software architecture.
      </p>

      {/* Quick Specs Dashboard Card */}
      <div
        className="glass"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1.5rem",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2.5rem",
          border: "1px solid var(--border-color)"
        }}
      >
        <div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>EXPERIENCE</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginTop: "0.35rem" }}>3+ Years Exp.</div>
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>AWS_EXPERTISE</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginTop: "0.35rem" }}>Cloud Solutions</div>
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>EDUCATION</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginTop: "0.35rem" }}>B.Sc in CS</div>
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", color: "var(--color-muted)", fontFamily: "var(--font-mono)" }}>CURRENT_LOC</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginTop: "0.35rem" }}>India</div>
        </div>
      </div>

      {/* CTA Row */}
      <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
        <button onClick={scrollTerminal} className="btn-primary">
          <span>Run Interactive Shell</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>&gt;_</span>
        </button>
        <a
          href="mailto:rahulsinghpilani7@gmail.com"
          className="btn-secondary"
        >
          Request CV / Contact
        </a>
      </div>
    </section>
  );
}
