"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-start px-8 md:px-24 pt-20 relative overflow-hidden" style={{ zIndex: 10 }}>
      {/* Sophisticated Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-[1px] bg-zinc-600" />
          <h2 className="text-zinc-400 font-mono text-sm tracking-[0.2em] uppercase">
            Software & Cloud Engineer
          </h2>
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
          Rahul Singh Shekhawat.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600">
            Designing scalable systems.
          </span>
        </h1>
        
        <p className="text-zinc-400 text-xl md:text-2xl max-w-2xl leading-relaxed mb-14 font-light tracking-tight">
          Cloud & Software Engineer with 3+ years of experience designing, developing, and deploying scalable web applications and cloud infrastructure.
        </p>

        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href="mailto:rahulsinghpilani7@gmail.com"
          className="inline-flex items-center gap-4 px-8 py-5 bg-white text-black font-semibold tracking-wide rounded-full hover:bg-zinc-200 transition-colors duration-300"
        >
          <span>Initiate Contact</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </motion.a>
      </motion.div>
    </section>
  );
}
