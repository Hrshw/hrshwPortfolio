"use client";

import React, { useEffect, useState, useRef } from "react";

type CursorState = "default" | "hover" | "text";

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Refs so the rAF loop never closes over stale state
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect touch-only devices — bail early, render nothing
    const isTouchOnly = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(isTouchOnly);
    if (isTouchOnly) return;

    // Small delay so the cursor doesn't flash at (0,0) on mount
    const showTimeout = setTimeout(() => setIsVisible(true), 100);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.closest("input, textarea, select")) {
        // Over a text field — hide custom cursor, native I-beam shows via CSS
        setCursorState("text");
      } else if (target.closest("a, button, [role='button']")) {
        // Over a clickable — enlarge ring, hide dot
        setCursorState("hover");
      } else {
        setCursorState("default");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });

    // rAF loop: runs continuously, component never unmounts
    let frameId: number;
    const tick = () => {
      // Dot: snappy (50% lerp per frame)
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.5;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.5;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px, 0)`;
      }

      // Ring: smooth, slightly lagged (15% lerp per frame)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px, 0)`;
      }

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      clearTimeout(showTimeout);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(frameId);
    };
  }, []); // ← empty deps: run once, never re-mount mid-session

  // Don't render at all on touch devices
  if (isMobile) return null;

  const isText = cursorState === "text";
  const isHover = cursorState === "hover";

  return (
    // Wrap with visibility: hidden until first mouse move fires
    <div
      style={{
        pointerEvents: "none",
        zIndex: 99999,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        // Keep the wrapper invisible until the cursor has moved at least once
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s",
      }}
    >
      {/* Central solid dot
          – hidden on hover (only ring shows) and hidden on text fields */}
      <div
        ref={dotRef}
        style={{
          position: "absolute",
          width: 8,
          height: 8,
          borderRadius: "50%",
          transform: "translate3d(-100px, -100px, 0)",
          willChange: "transform",
          transition: "opacity 0.15s, transform 0.15s",
          opacity: isHover || isText ? 0 : 1,
          backgroundColor: "var(--dot-color, currentColor)",
        }}
        className="bg-zinc-900 dark:bg-white"
      />

      {/* Outer smooth ring
          – enlarges on hover, completely hidden on text fields */}
      <div
        ref={ringRef}
        style={{
          position: "absolute",
          width: 40,
          height: 40,
          borderRadius: "50%",
          transform: "translate3d(-100px, -100px, 0)",
          willChange: "transform",
          transition: "opacity 0.2s, scale 0.3s, border-color 0.2s, background-color 0.2s",
          opacity: isText ? 0 : 1,
          scale: isHover ? "1.5" : "1",
        }}
        className={
          isHover
            ? "border border-zinc-900/80 dark:border-white/80 bg-zinc-900/5 dark:bg-white/5 backdrop-blur-[2px]"
            : "border border-zinc-900/30 dark:border-white/30 bg-transparent"
        }
      />
    </div>
  );
}
