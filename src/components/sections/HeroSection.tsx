"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeroProps {
  customTagline?: string;
}

const STATS = [
  { value: "4", label: "SaaS Products Shipped", suffix: "+" },
  { value: "35", label: "Cloud Cost Reduction", suffix: "%" },
  { value: "10", label: "M+ Traces Processed", suffix: "+" },
];

const TECH_STACK = ["AWS", "Node.js", "React", "Next.js", "Python", "TypeScript", "MongoDB", "Redis"];

export default function HeroSection({ customTagline }: HeroProps) {
  return (
    <section className="min-h-screen flex flex-col justify-center items-start px-8 md:px-24 pt-20 relative overflow-hidden" style={{ zIndex: 10 }}>
      {/* Sophisticated Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[var(--color-secondary)]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl relative z-10 w-full flex flex-col items-start text-left">
        {/* Tagline */}
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
        
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] text-zinc-900 dark:text-white">
            Rahul Singh Shekhawat.
            <br />
            <span
              className="inline-block transition-all duration-500 cursor-default group/design"
              onMouseEnter={() => {
                if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('setDesignMode', { detail: true }));
              }}
              onMouseLeave={() => {
                if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('setDesignMode', { detail: false }));
              }}
            >
              <span className="text-zinc-600 dark:text-zinc-400 group-hover/design:text-transparent group-hover/design:bg-clip-text group-hover/design:bg-gradient-to-r group-hover/design:from-cyan-500 group-hover/design:to-emerald-500 dark:group-hover/design:from-cyan-400 dark:group-hover/design:to-emerald-400 transition-all duration-500">
                {['D', 'e', 's', 'i', 'g', 'n', 'i', 'n', 'g'].map((char, i) => {
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
              </span>
              <span className="text-zinc-600 dark:text-zinc-400 group-hover/design:text-transparent group-hover/design:bg-clip-text group-hover/design:bg-gradient-to-r group-hover/design:from-emerald-500 group-hover/design:to-cyan-500 dark:group-hover/design:from-emerald-400 dark:group-hover/design:to-cyan-400 transition-all duration-500"> scalable systems.</span>
            </span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-zinc-600 dark:text-zinc-400 text-xl md:text-2xl max-w-3xl leading-relaxed mt-6 mb-10 font-light tracking-tight transition-colors duration-500"
        >
          {customTagline || "Full-Stack & Cloud Engineer building scalable SaaS, AI-powered products, and AWS cloud infrastructure. Available for freelance projects, MVPs, and cloud migration."}
        </motion.p>

        {/* Social Proof Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-8 mb-10"
        >
          {STATS.map((stat, i) => (
            <div key={i} className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                {stat.value}
              </span>
              <span className="text-lg font-bold text-[var(--color-primary)]">
                {stat.suffix}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-500 font-medium ml-1">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Tech Stack Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full transition-colors duration-300 hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-4 items-center"
        >
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:rahulsinghpilani7@gmail.com"
            className="inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold tracking-wide rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-300 text-base"
          >
            <span>Let's Talk</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/resume.pdf"
            download="Rahul_Singh_Shekhawat_Resume.pdf"
            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300 text-base"
          >
            <span>Download Resume</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
