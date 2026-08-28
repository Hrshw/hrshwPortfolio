"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeroProps {
  customTagline?: string;
}

export default function HeroSection({ customTagline }: HeroProps) {
  return (
    <section className="min-h-screen flex flex-col justify-center items-start px-8 md:px-24 pt-20 relative overflow-hidden" style={{ zIndex: 10 }}>
      {/* Sophisticated Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[var(--color-secondary)]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl relative z-10 w-full flex flex-col items-start text-left">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h2 className="text-zinc-500 font-mono text-sm tracking-[0.2em] uppercase">
            <span className="text-[var(--color-primary)] pr-2">{"//"}</span>
            Full-Stack & Cloud Engineer · AI-Powered SaaS
          </h2>
        </motion.div>
        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] text-zinc-900 dark:text-white">
              Rahul Singh Shekhawat.
              <br />
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-600 to-zinc-900 dark:from-zinc-400 dark:to-zinc-600 transition-colors duration-500 hover:from-cyan-500 hover:to-emerald-500 dark:hover:from-cyan-400 dark:hover:to-emerald-400 cursor-default"
                onMouseEnter={() => {
                  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('setDesignMode', { detail: true }));
                }}
                onMouseLeave={() => {
                  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('setDesignMode', { detail: false }));
                }}
              >
                {['D', 'e', 's', 'i', 'g', 'n', 'i', 'n', 'g'].map((char, i) => {
                  // Use deterministic pseudo-random values to prevent SSR Hydration Mismatch
                  // Math.round is critical to prevent floating-point precision mismatches between Node and Browser
                  const rX = Math.round(Math.sin(i * 12.9898) * 800);
                  const rY = Math.round(Math.cos(i * 78.233) * 800);
                  const rRot = Math.round(Math.sin(i * 43.11) * 720);
                  
                  return (
                    <motion.span
                      key={i}
                      initial={{ x: rX, y: rY, rotate: rRot, opacity: 0 }}
                      animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                      transition={{ 
                        duration: 1.5, 
                        ease: "circOut", 
                        delay: 0.2 + (Math.abs(Math.sin(i)) * 0.5) 
                      }}
                      className="inline-block origin-center"
                    >
                      {char}
                    </motion.span>
                  );
                })}
                <span> scalable systems.</span>
              </span>
            </h1>
          </motion.div>
        
        <p className="text-zinc-600 dark:text-zinc-400 text-xl md:text-2xl max-w-3xl leading-relaxed mb-14 font-light tracking-tight transition-colors duration-500">
          {customTagline || "Full-Stack & Cloud Engineer building scalable SaaS, AI-powered products, and AWS cloud infrastructure. Available for freelance projects, MVPs, and cloud migration."}
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:rahulsinghpilani7@gmail.com"
            className="inline-flex items-center gap-4 px-8 py-5 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold tracking-wide rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-300"
          >
            <span>Initiate Contact</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/resume.pdf"
            download="Rahul_Singh_Shekhawat_Resume.pdf"
            className="inline-flex items-center gap-4 px-8 py-5 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300"
          >
            <span>Download Resume</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
