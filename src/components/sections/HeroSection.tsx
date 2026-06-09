"use client";

import React from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-start px-8 md:px-24 pt-20 relative overflow-hidden" style={{ zIndex: 10 }}>
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <h2 className="text-[var(--color-secondary)] font-mono text-lg md:text-xl mb-6 tracking-widest">
          HELLO VISITOR,
        </h2>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-8 drop-shadow-lg">
          I&apos;m Rahul Singh Shekhawat.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#4facfe]">
            I build digital experiences.
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-2xl max-w-2xl leading-relaxed mb-12">
          A Cloud Engineer and Full-Stack Developer who genuinely enjoys turning complex problems into elegant, scalable real-world solutions.
        </p>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="mailto:rahulsinghshekhawat2003@gmail.com"
          className="inline-block px-8 py-4 bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-mono font-bold tracking-widest rounded hover:bg-[var(--color-primary)] hover:text-black transition-all duration-300"
          style={{ boxShadow: "0 0 20px rgba(0, 242, 254, 0.2)" }}
        >
          INITIATE_CONTACT
        </motion.a>
      </motion.div>
    </section>
  );
}
