"use client";

import React, { useEffect, useState } from "react";

export default function HUDHeader() {
  const [telemetry, setTelemetry] = useState({
    ping: 14,
    temp: 34,
    load: 2.4
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        ping: Math.floor(11 + Math.random() * 8),
        temp: Math.floor(32 + Math.random() * 5),
        load: parseFloat((1.2 + Math.random() * 3.5).toFixed(1))
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className="glass"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "60px",
        zIndex: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        borderBottom: "1px solid var(--border-color)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.8rem",
        color: "var(--color-muted)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
      }}
    >
      {/* HUD Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span className="indicator indicator-green" />
        <span style={{ fontWeight: 700, color: "#ffffff", letterSpacing: "1px" }}>
          SYS_NODE_RSS // <span className="glow-text">ONLINE</span>
        </span>
      </div>

      {/* Nav Link Chapters */}
      <nav style={{ display: "flex", gap: "1.5rem" }}>
        <button
          onClick={() => scrollTo("section-hero")}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.8rem",
            fontFamily: "inherit",
            transition: "var(--transition-smooth)"
          }}
          className="hud-link"
        >
          [ 01_HERO ]
        </button>
        <button
          onClick={() => scrollTo("section-terminal")}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.8rem",
            fontFamily: "inherit",
            transition: "var(--transition-smooth)"
          }}
          className="hud-link"
        >
          [ 02_SHELL ]
        </button>
        <button
          onClick={() => scrollTo("section-experience")}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.8rem",
            fontFamily: "inherit",
            transition: "var(--transition-smooth)"
          }}
          className="hud-link"
        >
          [ 03_JOURNEY ]
        </button>
        <button
          onClick={() => scrollTo("section-projects")}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.8rem",
            fontFamily: "inherit",
            transition: "var(--transition-smooth)"
          }}
          className="hud-link"
        >
          [ 04_PROJECTS ]
        </button>
        <button
          onClick={() => scrollTo("section-contact")}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontWeight: 500,
            fontSize: "0.8rem",
            fontFamily: "inherit",
            transition: "var(--transition-smooth)"
          }}
          className="hud-link"
        >
          [ 05_CONNECT ]
        </button>
      </nav>

      {/* Cyber Diagnostics */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <div>
          PING: <span className="glow-text" style={{ color: "#ffffff" }}>{telemetry.ping}ms</span>
        </div>
        <div>
          TEMP: <span style={{ color: "#ffffff" }}>{telemetry.temp}°C</span>
        </div>
        <div style={{ display: "inline-block" }}>
          SYS_LOAD: <span style={{ color: "#ffffff" }}>{telemetry.load}%</span>
        </div>
      </div>
      
      {/* Link Hover FX style overrides */}
      <style jsx global>{`
        .hud-link:hover {
          color: var(--color-primary) !important;
          text-shadow: 0 0 8px rgba(0, 242, 254, 0.4);
        }
      `}</style>
    </header>
  );
}
