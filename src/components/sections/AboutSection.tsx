"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="section-about" className="min-h-screen flex flex-col justify-center px-8 md:px-24 py-32 relative" style={{ zIndex: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
      >
        {/* Left Column: Image & Quick Stats */}
        <div className="lg:col-span-5 relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 pointer-events-none" />
          <div className="relative rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl aspect-[4/5]">
            <Image 
              src="/rahul.jpg" 
              alt="Rahul Singh Shekhawat" 
              fill
              priority 
              className="object-cover object-center grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            />
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-6 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-2xl transition-colors duration-500">
              <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-2">Mindset</div>
              <div className="text-zinc-800 dark:text-zinc-200 font-medium text-sm space-y-1 transition-colors duration-500">
                <p>Always Learning.</p>
                <p>Always Building.</p>
                <p>Always Exploring.</p>
              </div>
            </div>
            <div className="p-6 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-2xl transition-colors duration-500">
              <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-2">Location</div>
              <div className="text-zinc-800 dark:text-zinc-200 font-medium text-sm transition-colors duration-500">Building from India,<br/>Deploying Worldwide</div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio Content */}
        <div className="lg:col-span-7 space-y-12">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tighter mb-8 transition-colors duration-500">
              Hello Visitor,
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-light leading-relaxed transition-colors duration-500">
              <p>
                I&apos;m <span className="text-zinc-900 dark:text-white font-medium">Rahul Singh Shekhawat</span>. A Cloud Engineer and Full-Stack Developer who genuinely enjoys turning ideas into real-world products.
              </p>
              <p>
                My journey started with curiosity — understanding how applications work, how systems scale, and how technology can solve real problems. Over time, that curiosity evolved into building production-grade applications, cloud infrastructure, automation systems, and AI-powered tools.
              </p>
              <p>
                I enjoy taking a concept from a simple idea on paper, designing the architecture, writing the code, deploying the infrastructure, and watching it become something people can actually use.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl transition-colors duration-500">
              <h3 className="text-zinc-900 dark:text-white font-semibold mb-4 tracking-tight text-xl transition-colors duration-500">Core Interests</h3>
              <ul className="space-y-4 text-zinc-600 dark:text-zinc-400 font-light transition-colors duration-500">
                <li><strong className="text-zinc-800 dark:text-zinc-200 font-medium">Cloud Architecture</strong><br/><span className="text-sm">Designing scalable, secure, and reliable infrastructure.</span></li>
                <li><strong className="text-zinc-800 dark:text-zinc-200 font-medium">Full-Stack Dev</strong><br/><span className="text-sm">Building end-to-end applications with robust backends.</span></li>
                <li><strong className="text-zinc-800 dark:text-zinc-200 font-medium">Artificial Intelligence</strong><br/><span className="text-sm">Exploring AI systems, observability, and automation.</span></li>
                <li><strong className="text-zinc-800 dark:text-zinc-200 font-medium">Product Dev</strong><br/><span className="text-sm">Transforming ideas into value-driven products.</span></li>
              </ul>
            </div>

            <div className="p-8 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl transition-colors duration-500">
              <h3 className="text-zinc-900 dark:text-white font-semibold mb-4 tracking-tight text-xl transition-colors duration-500">What Drives Me</h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-light text-sm mb-4 transition-colors duration-500">
                I enjoy solving complex challenges, learning new technologies, and continuously improving my craft.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 font-light text-sm mb-4 transition-colors duration-500">
                Whether it&apos;s optimizing cloud infrastructure, designing architectures, or building monitoring platforms, I love the process of turning problems into solutions.
              </p>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium text-sm italic transition-colors duration-500">
                "Engineering is about understanding people, solving meaningful problems, and building technology that makes an impact."
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl transition-colors duration-500">
               <h3 className="text-zinc-900 dark:text-white font-semibold mb-4 tracking-tight text-xl transition-colors duration-500">Personality Traits</h3>
               <div className="flex flex-wrap gap-2.5">
                 {["Builder", "Curious", "Problem Solver", "Continuous Learner", "Product Thinker", "Technology Enthusiast"].map(trait => (
                   <span key={trait} className="px-3.5 py-1.5 bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 text-xs rounded-full border border-black/10 dark:border-white/10 transition-colors duration-500">
                     {trait}
                   </span>
                 ))}
               </div>
            </div>

            <div className="p-8 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl transition-colors duration-500">
               <h3 className="text-zinc-900 dark:text-white font-semibold mb-3 tracking-tight text-xl transition-colors duration-500">GitHub Contributions</h3>
               <div className="flex items-center gap-4 mb-4">
                 <div className="text-3xl font-bold text-zinc-900 dark:text-white font-mono">1,200+</div>
                 <div className="text-xs text-zinc-500 dark:text-zinc-400 font-light">Commits & PRs across cloud systems in the last 12 months</div>
               </div>
               {/* Visual Contribution Grid */}
               <div className="flex gap-[3px] flex-wrap max-w-full overflow-hidden opacity-80 mb-2">
                 {Array.from({ length: 48 }).map((_, i) => {
                   const opacity = [0.1, 0.3, 0.6, 0.8, 1.0][(i * 7) % 5];
                   return (
                     <span 
                       key={i} 
                       className="w-3.5 h-3.5 rounded-sm flex-shrink-0" 
                       style={{ 
                         backgroundColor: `rgba(16, 185, 129, ${opacity})`,
                         border: '1px solid rgba(16, 185, 129, 0.1)'
                       }} 
                     />
                   );
                 })}
               </div>
               <div className="text-[10px] text-zinc-500 font-mono flex justify-between">
                 <span>Less active</span>
                 <span>More active</span>
               </div>
            </div>
          </div>

          <div className="p-8 bg-black/5 dark:bg-zinc-900/40 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-3xl transition-colors duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider">Featured Open Source Project</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md font-mono text-[9px] uppercase">NPM CLI Utility</span>
              </div>
              <h4 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                <a 
                  href="https://github.com/Hrshw/env-secret-lock" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  Hrshw/env-secret-lock
                </a>
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-light max-w-2xl leading-relaxed">
                A fast, local-first developer environment secret manager CLI with Git protection pre-commit hook and in-memory process environment execution. AES-256-GCM symmetric encryption prevents raw API keys from being leaked or committed.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <a 
                href="https://github.com/Hrshw/env-secret-lock" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-medium text-xs tracking-tight hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                View Repository
              </a>
            </div>
          </div>
      </motion.div>
    </section>
  );
}
