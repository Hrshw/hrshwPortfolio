"use client";

import React, { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const isHoveringRef = useRef(false);
  const isTypingRef = useRef(false);
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

    const timeout = setTimeout(() => setIsVisible(true), 0);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if we're over a button — show the ring larger but hide the dot
      const isButton = !!target.closest("button, a, [role='button']");
      // Check if we're over a text input — hide cursor entirely
      const isInput = !!target.closest("input, textarea, select");

      if (isInput) {
        setIsTyping(true);
        isTypingRef.current = true;
        setIsHovering(false);
        isHoveringRef.current = false;
      } else if (isButton) {
        setIsTyping(false);
        isTypingRef.current = false;
        setIsHovering(true);
        isHoveringRef.current = true;
      } else {
        setIsTyping(false);
        isTypingRef.current = false;
        setIsHovering(false);
        isHoveringRef.current = false;
      }
    };

    // Also hide on focus of input/textarea (keyboard tab navigation)
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest("input, textarea, select")) {
        setIsTyping(true);
        isTypingRef.current = true;
      }
    };

    const onFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest("input, textarea, select")) {
        setIsTyping(false);
        isTypingRef.current = false;
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);

    let animationFrameId: number;
    const updateCursor = () => {
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.5;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.5;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px, 0)`;
      }

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
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  if (isMobile || !isVisible) return null;

  // When over an input/textarea, hide the custom cursor entirely so the
  // native text caret is shown without any visual conflict.
  if (isTyping) return null;

  return (
    <div style={{ pointerEvents: "none", zIndex: 99999, position: "fixed", top: 0, left: 0, width: "100%", height: "100%" }}>
      {/* Central Solid Dot — hidden on button hover so only ring shows */}
      <div
        ref={dotRef}
        className={`absolute w-2 h-2 rounded-full transition-all duration-200 ${
          isHovering ? "opacity-0 scale-0" : "bg-zinc-900 dark:bg-white opacity-100 scale-100"
        }`}
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          willChange: "transform",
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
          willChange: "transform",
        }}
      />
    </div>
  );
}
