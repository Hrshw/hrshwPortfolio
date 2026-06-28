"use client";

import { useEffect, useRef, useState } from "react";

type CursorState = "default" | "hover" | "text";

const HOVER_SELECTORS = [
  "a[href]",
  "button",
  '[role="button"]',
  '[role="link"]',
  '[role="tab"]',
  '[role="menuitem"]',
  "[onclick]",
  ".cursor-pointer",
  "[tabindex]:not([tabindex='-1'])",
  "area[href]",
  "summary",
].join(",");

const TEXT_SELECTORS = [
  "input:not([type='hidden']):not([type='submit']):not([type='button']):not([type='checkbox']):not([type='radio'])",
  "textarea",
  "select",
  "[contenteditable='true']",
].join(",");

function getCursorState(el: EventTarget | null): CursorState {
  const target = el instanceof HTMLElement ? el : null;
  if (!target || !target.closest) return "default";
  if (target.closest(TEXT_SELECTORS)) return "text";
  if (target.closest(HOVER_SELECTORS)) return "hover";
  return "default";
}

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: -4, y: -4 });
  const ringPos = useRef({ x: -20, y: -20 });
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CursorState>("default");
  const tickRef = useRef(false);

  const updateState = (next: CursorState) => {
    if (stateRef.current !== next) {
      stateRef.current = next;
      setCursorState(next);
    }
  };

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(isTouch);
    if (isTouch) return;

    const detect = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y);
      if (el) updateState(getCursorState(el));
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!tickRef.current) {
        tickRef.current = true;
        dotPos.current = { x: e.clientX - 4, y: e.clientY - 4 };
        ringPos.current = { x: e.clientX - 20, y: e.clientY - 20 };
        setIsVisible(true);
      }
      detect(e.clientX, e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      updateState(getCursorState(e.target));
    };

    const onMouseLeaveDoc = () => updateState("default");

    const onResize = () => {
      const last = mousePos.current;
      if (last.x > 0 || last.y > 0) detect(last.x, last.y);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeaveDoc);
    window.addEventListener("resize", onResize, { passive: true });

    let frameId: number;
    const tick = () => {
      const tx = mousePos.current.x;
      const ty = mousePos.current.y;

      dotPos.current.x += (tx - dotPos.current.x) * 0.5;
      dotPos.current.y += (ty - dotPos.current.y) * 0.5;
      ringPos.current.x += (tx - ringPos.current.x) * 0.35;
      ringPos.current.y += (ty - ringPos.current.y) * 0.35;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      document.documentElement.removeEventListener("mouseleave", onMouseLeaveDoc);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  if (isMobile) return null;

  const isText = cursorState === "text";
  const isHover = cursorState === "hover";

  return (
    <div
      aria-hidden="true"
      style={{
        pointerEvents: "none",
        zIndex: 99999,
        position: "fixed",
        inset: 0,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s",
      }}
    >
      <div
        ref={dotRef}
        className="bg-zinc-900 dark:bg-white"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          willChange: "transform",
          transition: "opacity 0.2s",
          opacity: isHover || isText ? 0 : 1,
        }}
      />
      <div
        ref={ringRef}
        className={
          isHover
            ? "border border-zinc-900/80 dark:border-white/80 bg-zinc-900/5 dark:bg-white/5 backdrop-blur-[2px]"
            : "border border-zinc-900/30 dark:border-white/30 bg-transparent"
        }
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          willChange: "transform",
          transition: "opacity 0.2s, scale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          opacity: isText ? 0 : 1,
          scale: isHover ? 1.5 : 1,
        }}
      />
    </div>
  );
}
