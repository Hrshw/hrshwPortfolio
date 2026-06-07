"use client";

import React, { useEffect, useState, useRef } from "react";

const TRAIL_LENGTH = 10;

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverLabel, setHoverLabel] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);

  const mousePos = useRef({ x: 0, y: 0 });
  const displayPos = useRef({ x: 0, y: 0 }); // Magnetic snapped pos
  const ringPos = useRef({ x: 0, y: 0 });
  const trailRef = useRef(Array(TRAIL_LENGTH).fill({ x: 0, y: 0 }));
  const magneticTarget = useRef<{ x: number; y: number } | null>(null);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(mobile);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    if (isMobile) return;
    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    let scrollTimeout: NodeJS.Timeout;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactiveEl = target.closest("a, button, input, textarea, .glass-interactive, .hud-interactive");
      if (interactiveEl) {
        setIsHovering(true);
        // Magnetic effect: find center of element
        const rect = interactiveEl.getBoundingClientRect();
        magneticTarget.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        
        // Custom label logic
        if (target.textContent && target.textContent.length < 20) {
          setHoverLabel(target.textContent.toUpperCase());
        } else {
          setHoverLabel("SYSTEM_ACCESS");
        }
      } else {
        setIsHovering(false);
        setHoverLabel("");
        magneticTarget.current = null;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("scroll", onScroll, { passive: true });

    let animationFrameId: number;
    const updateCursor = () => {
      // 1. Calculate Target Position (Magnetic vs Free)
      const targetX = magneticTarget.current ? (mousePos.current.x * 0.2 + magneticTarget.current.x * 0.8) : mousePos.current.x;
      const targetY = magneticTarget.current ? (mousePos.current.y * 0.2 + magneticTarget.current.y * 0.8) : mousePos.current.y;

      // 2. Update core dot (very fast lerp)
      displayPos.current.x += (targetX - displayPos.current.x) * 0.4;
      displayPos.current.y += (targetY - displayPos.current.y) * 0.4;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${displayPos.current.x - 4}px, ${displayPos.current.y - 4}px, 0)`;
      }

      // 3. Update Ring (slower lerp)
      ringPos.current.x += (targetX - ringPos.current.x) * 0.15;
      ringPos.current.y += (targetY - ringPos.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px, 0)`;
      }

      // 4. Update Particle Trail
      const newTrail = [...trailRef.current];
      newTrail.unshift({ ...displayPos.current });
      newTrail.pop();
      trailRef.current = newTrail;

      trailElementsRef.current.forEach((el, index) => {
        if (el) {
          const pt = trailRef.current[index];
          el.style.transform = `translate3d(${pt.x - 2}px, ${pt.y - 2}px, 0)`;
          el.style.opacity = `${(1 - index / TRAIL_LENGTH) * (isScrolling ? 0.8 : 0.3)}`;
        }
      });

      animationFrameId = requestAnimationFrame(updateCursor);
    };
    
    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  if (isMobile || !isVisible) return null;

  return (
    <div style={{ pointerEvents: "none", zIndex: 99999, position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}>
      {/* CSS for ring spinning */}
      <style>{`
        @keyframes spinSlow { 100% { transform: rotate(360deg); } }
        @keyframes spinFast { 100% { transform: rotate(360deg); } }
        .spin-ring { animation: spinSlow 8s linear infinite; }
        .spin-ring.fast { animation: spinFast 2s linear infinite; }
      `}</style>

      {/* Particle Trail */}
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailElementsRef.current[i] = el; }}
          style={{
            position: "absolute",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            backgroundColor: "var(--color-primary)",
            boxShadow: "0 0 8px var(--color-primary)",
            transform: "translate3d(-100px, -100px, 0)",
            willChange: "transform, opacity",
            transition: "opacity 0.1s"
          }}
        />
      ))}

      {/* Central Energy Core */}
      <div
        ref={dotRef}
        style={{
          position: "absolute",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: isHovering ? "var(--color-secondary)" : "var(--color-primary)",
          boxShadow: isHovering ? "0 0 15px var(--color-secondary), 0 0 30px var(--color-secondary)" : "0 0 10px var(--color-primary)",
          transform: "translate3d(-100px, -100px, 0)",
          transition: "background-color 0.3s, box-shadow 0.3s, transform 0.1s linear",
          willChange: "transform"
        }}
      />
      
      {/* Rotating HUD Ring */}
      <div
        ref={ringRef}
        className={`spin-ring ${isScrolling || isHovering ? 'fast' : ''}`}
        style={{
          position: "absolute",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: `1px solid ${isHovering ? "var(--color-secondary)" : "rgba(0, 242, 254, 0.4)"}`,
          borderTop: `2px solid ${isHovering ? "var(--color-secondary)" : "var(--color-primary)"}`,
          borderRight: `2px solid transparent`,
          transformOrigin: "center",
          scale: isHovering ? "1.6" : (isScrolling ? "0.8" : "1"),
          transition: "scale 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), border 0.3s",
          willChange: "transform, scale"
        }}
      >
        {/* Inner crosshair ticks */}
        {isHovering && (
          <>
            <div style={{ position: "absolute", top: "-4px", left: "18px", width: "2px", height: "6px", background: "var(--color-secondary)" }} />
            <div style={{ position: "absolute", bottom: "-4px", left: "18px", width: "2px", height: "6px", background: "var(--color-secondary)" }} />
            <div style={{ position: "absolute", left: "-4px", top: "18px", width: "6px", height: "2px", background: "var(--color-secondary)" }} />
            <div style={{ position: "absolute", right: "-4px", top: "18px", width: "6px", height: "2px", background: "var(--color-secondary)" }} />
          </>
        )}
      </div>

      {/* Holographic Label */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          transform: `translate3d(${displayPos.current.x + 25}px, ${displayPos.current.y - 10}px, 0)`,
          opacity: isHovering ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 0.2s, transform 0.1s linear",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "var(--color-secondary)",
          background: "rgba(0,0,0,0.6)",
          border: "1px solid var(--color-secondary)",
          padding: "2px 8px",
          borderRadius: "4px",
          letterSpacing: "1px",
          textShadow: "0 0 5px var(--color-secondary)",
          whiteSpace: "nowrap",
          willChange: "transform, opacity"
        }}
      >
        {hoverLabel && `[ ${hoverLabel} ]`}
      </div>
    </div>
  );
}
