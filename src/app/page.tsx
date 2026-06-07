"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

// Use dynamic import for the 3D canvas so we don't SSR the WebGL context
const UniverseCanvas = dynamic(() => import("@/components/3d/UniverseCanvas"), {
  ssr: false,
  loading: () => (
    <div style={{ display: "flex", width: "100vw", height: "100vh", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
      <span className="indicator indicator-blue" style={{ marginRight: "1rem" }} />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.2rem", letterSpacing: "2px" }}>INITIALIZING UNIVERSE...</span>
    </div>
  ),
});

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="canvas-container">
        <UniverseCanvas />
      </div>
      
      {/* Scroll container gives the page height for Lenis to scroll through */}
      <div className="scroll-container">
        {/* Empty, serves as a track for the scroll progress */}
      </div>
    </>
  );
}
