"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section id="section-contact" className="min-h-[70vh] flex flex-col items-center justify-center px-8 py-32 relative overflow-hidden" style={{ zIndex: 10 }}>
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-zinc-800/20 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center bg-[#050505]/40 backdrop-blur-2xl border border-white/5 p-16 md:p-24 rounded-[3rem] w-full max-w-5xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none" />

        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter relative z-10">Let&apos;s collaborate.</h2>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-14 font-light tracking-tight relative z-10">
          I&apos;m currently open for new opportunities. Whether you have a question, a project idea, or just want to connect, my inbox is always open.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:rahulsinghpilani7@gmail.com"
            className="px-10 py-5 bg-white text-black font-semibold tracking-wide rounded-full hover:bg-zinc-200 transition-colors duration-300 w-full sm:w-auto"
          >
            Say Hello
          </motion.a>
          
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://github.com/Hrshw"
            target="_blank"
            rel="noreferrer"
            className="px-10 py-5 bg-transparent border border-zinc-700 text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-500 hover:text-white transition-all duration-300 w-full sm:w-auto"
          >
            GitHub Profile
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://linkedin.com/in/rahulsinghshekhawat"
            target="_blank"
            rel="noreferrer"
            className="px-10 py-5 bg-transparent border border-zinc-700 text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-500 hover:text-white transition-all duration-300 w-full sm:w-auto"
          >
            LinkedIn
          </motion.a>
        </div>
      </motion.div>

      <div className="absolute bottom-10 text-zinc-600 font-mono text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} Rahul Singh Shekhawat. Built with Next.js & Tailwind.
      </div>
    </section>
  );
}
