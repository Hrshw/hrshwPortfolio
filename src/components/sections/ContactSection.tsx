"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section className="min-h-[50vh] flex flex-col items-center justify-center px-8 py-24 relative overflow-hidden" style={{ zIndex: 10 }}>
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center bg-[#0f172a]/40 backdrop-blur-md border border-[var(--color-primary)]/30 p-12 md:p-24 rounded-2xl w-full max-w-5xl"
        style={{ boxShadow: "0 0 40px rgba(0, 242, 254, 0.05)" }}
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Let&apos;s Build Something.</h2>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Whether you have a question, a project idea, or just want to say hi, my inbox is always open.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="mailto:rahulsinghshekhawat2003@gmail.com"
            className="px-8 py-4 bg-[var(--color-primary)] text-black font-mono font-bold tracking-widest rounded transition-all duration-300 w-full sm:w-auto"
            style={{ boxShadow: "0 0 20px rgba(0, 242, 254, 0.3)" }}
          >
            SAY_HELLO
          </motion.a>
          
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://github.com/Hrshw"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-4 bg-transparent border-2 border-gray-600 text-white font-mono font-bold tracking-widest rounded hover:border-gray-400 transition-all duration-300 w-full sm:w-auto"
          >
            GITHUB
          </motion.a>
        </div>
      </motion.div>

      <div className="absolute bottom-8 text-gray-600 font-mono text-sm">
        © {new Date().getFullYear()} Rahul Singh Shekhawat.
      </div>
    </section>
  );
}
