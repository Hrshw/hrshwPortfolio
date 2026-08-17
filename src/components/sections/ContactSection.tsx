"use client";

import React from "react";
import { motion } from "framer-motion";
import ContactForm from "@/components/ContactForm";

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
        className="text-center bg-black/5 dark:bg-[#050505]/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 p-16 md:p-24 rounded-[3rem] w-full max-w-5xl relative overflow-hidden transition-colors duration-500"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 dark:from-white/5 to-transparent opacity-50 pointer-events-none transition-colors duration-500" />

        <h2 className="text-5xl md:text-7xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tighter relative z-10 transition-colors duration-500">Let&apos;s collaborate.</h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-14 font-light tracking-tight relative z-10 transition-colors duration-500">
          Whether you have a question, a project idea, or just want to discuss scalability, my inbox is always open.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10 flex-wrap">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="mailto:rahulsinghpilani7@gmail.com"
            className="px-8 py-5 bg-zinc-900 dark:bg-white text-white dark:text-black font-semibold tracking-wide rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-300 w-full sm:w-auto"
          >
            Say Hello
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/resume.pdf"
            download="Rahul_Singh_Shekhawat_Resume.pdf"
            className="px-8 py-5 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300 w-full sm:w-auto"
          >
            Download Resume
          </motion.a>
          
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://github.com/Hrshw"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-5 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300 w-full sm:w-auto"
          >
            GitHub
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://www.linkedin.com/in/rahul-singh-shekhawat-b4ba481ab"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-5 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300 w-full sm:w-auto"
          >
            LinkedIn
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://www.instagram.com/hr.shw/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-5 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide rounded-full hover:border-zinc-900 hover:text-zinc-900 dark:hover:border-zinc-400 dark:hover:text-white transition-all duration-300 w-full sm:w-auto"
          >
            Instagram
          </motion.a>
        </div>
      </motion.div>

      {/* Contact form — server-validated, rate-limited, spam-filtered */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl mt-12 bg-black/5 dark:bg-[#050505]/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-[2rem] p-8 md:p-12 transition-colors duration-500"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
                Send a message.
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-light leading-relaxed">
                For project inquiries, collaborations, or just to say hi — your
                message goes straight to my inbox. I reply to every serious note.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-xs">
                  ✉
                </span>
                <a
                  href="mailto:rahulsinghpilani7@gmail.com"
                  className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  rahulsinghpilani7@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-xs">
                  ☎
                </span>
                <span className="text-zinc-700 dark:text-zinc-300">+91 7082739587</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center text-xs">
                  ⌖
                </span>
                <span className="text-zinc-700 dark:text-zinc-300">Mumbai, India</span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-600 font-mono">
              Messages are spam-filtered and rate-limited. Your email is only
              used to reply — never shared.
            </p>
          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-10 text-zinc-600 font-mono text-xs tracking-widest uppercase">
        © {new Date().getFullYear()} Rahul Singh Shekhawat.
      </div>
    </section>
  );
}
