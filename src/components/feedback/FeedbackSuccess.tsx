"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SubmitPayload } from "@/hooks/useFeedback";

// ---------------------------------------------------------------------------
// Confetti canvas — no dependencies, pure canvas API
// ---------------------------------------------------------------------------
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  opacity: number;
  life: number;
}

const CONFETTI_COLORS = [
  "#F59E0B", // amber
  "#FBBF24", // yellow
  "#E5E7EB", // light grey
  "#6B7280", // zinc
  "#ffffff", // white
  "#A78BFA", // violet accent
];

function useConfetti(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Particle[] = [];
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.4;

    // Spawn particles
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80;
      const speed = 3 + Math.random() * 5;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed * (0.5 + Math.random()),
        vy: Math.sin(angle) * speed * (0.5 + Math.random()) - 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 4 + Math.random() * 6,
        opacity: 1,
        life: 1,
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.vx *= 0.99; // air friction
        p.rotation += p.rotationSpeed;
        p.life -= 0.012;
        p.opacity = Math.max(0, p.life);

        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        }
      });

      if (alive) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [canvasRef]);
}

// ---------------------------------------------------------------------------
// Star display
// ---------------------------------------------------------------------------
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.svg
          key={i}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 300 }}
          className={`w-5 h-5 ${i < rating ? "text-amber-400" : "text-zinc-700 dark:text-zinc-600"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success component
// ---------------------------------------------------------------------------
interface FeedbackSuccessProps {
  payload: SubmitPayload;
  onReset: () => void;
}

export default function FeedbackSuccess({ payload, onReset }: FeedbackSuccessProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useConfetti(canvasRef);

  const preview =
    payload.message.length > 80
      ? payload.message.slice(0, 80) + "…"
      : payload.message;

  return (
    <div className="relative w-full">
      {/* Confetti canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20 rounded-3xl"
      />

      {/* Ambient amber glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-amber-400/10 rounded-3xl blur-2xl pointer-events-none"
      />

      {/* Thank-you card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 bg-black/5 dark:bg-zinc-900/60 backdrop-blur-2xl border border-black/5 dark:border-amber-400/20 rounded-3xl p-10 text-center flex flex-col items-center gap-5 overflow-hidden"
      >
        {/* Shimmer sweep */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none skew-x-12"
        />

        {/* Spark icon */}
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-amber-400 text-3xl select-none"
        >
          ✦
        </motion.div>

        {/* Heading */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight"
          >
            Thank you, {payload.name.split(" ")[0]}!
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 font-light"
          >
            Your feedback has been received and is under review.
            <br />
            It&apos;ll appear here once approved.
          </motion.p>
        </div>

        {/* Star rating */}
        <StarDisplay rating={payload.rating} />

        {/* Preview of their message */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="max-w-sm"
        >
          <p className="text-zinc-600 dark:text-zinc-300 text-sm italic font-light leading-relaxed">
            &ldquo;{preview}&rdquo;
          </p>
          <p className="text-zinc-500 dark:text-zinc-500 text-xs mt-2 font-mono">
            — {payload.name}
            {payload.role ? `, ${payload.role}` : ""}
          </p>
        </motion.div>

        {/* Reset button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="mt-2 px-7 py-3 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium text-sm rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300"
        >
          Leave Another Note
        </motion.button>
      </motion.div>
    </div>
  );
}
