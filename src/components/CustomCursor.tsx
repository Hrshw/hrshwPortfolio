"use client";

import React, { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Use refs for values accessed in the animation loop
  const isHoveringRef = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.matchMedia("(pointer: coarse)").matches;
      setIsMobile(mobile);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    if (isMobile) return;
    
    // Defer state update to avoid synchronous set-state during effect
    const timeout = setTimeout(() => setIsVisible(true), 0);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactiveEl = target.closest("a, button, input, textarea, [role='button']");
      if (interactiveEl) {
        setIsHovering(true);
        isHoveringRef.current = true;
      } else {
        setIsHovering(false);
        isHoveringRef.current = false;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    let animationFrameId: number;
    const updateCursor = () => {
      // Very fast lerp for the central dot
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.5;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.5;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px, 0)`;
      }

      // Smooth, slightly delayed lerp for the outer ring
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateCursor);
    };
    
    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  if (isMobile || !isVisible) return null;

  return (
    <div style={{ pointerEvents: "none", zIndex: 99999, position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}>
      {/* Central Solid Dot */}
      <div
        ref={dotRef}
        className={`absolute w-2 h-2 rounded-full transition-colors duration-200 ${
          isHovering ? "bg-transparent" : "bg-zinc-900 dark:bg-white"
        }`}
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          willChange: "transform"
        }}
      />
      
      {/* Outer Smooth Ring */}
      <div
        ref={ringRef}
        className={`absolute w-10 h-10 rounded-full border transition-all duration-300 origin-center ${
          isHovering 
            ? "border-zinc-900/80 dark:border-white/80 bg-zinc-900/5 dark:bg-white/5 backdrop-blur-[2px] scale-150" 
            : "border-zinc-900/30 dark:border-white/30 bg-transparent scale-100"
        }`}
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          willChange: "transform"
        }}
      />
    </div>
  );
}
