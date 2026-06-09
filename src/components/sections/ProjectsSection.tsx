"use client";

import React from "react";
import { motion } from "framer-motion";

const projects = [
  {
    title: "PulseGuard",
    category: "AI-Powered Server & Website Monitoring",
    description: "A real-time monitoring platform for websites and servers featuring uptime tracking, DNS monitoring, SSL expiry alerts, and AI-driven insights for anomaly detection. Includes a tiered SaaS subscription system with secure payments.",
    tech: ["Node.js", "Python", "Redis", "React", "AWS"],
    color: "from-blue-500/20 to-cyan-500/0",
    colSpan: "md:col-span-2",
    link: "#"
  },
  {
    title: "Observyze",
    category: "AI Observability Platform",
    description: "An AI observability and monitoring platform focused on visibility, debugging, and trust in AI systems. Built to scale and ensure fault-tolerance.",
    tech: ["Next.js", "Cloud Architecture", "AI Integration"],
    color: "from-indigo-500/20 to-blue-500/0",
    colSpan: "md:col-span-1",
    link: "https://observyze.com"
  },
  {
    title: "Env Secret Lock",
    category: "Developer Tool",
    description: "A developer environment Secret Manager that solves the problem of secret sprawl. Securely locks and syncs environment variables across teams.",
    tech: ["CLI", "Cryptography", "Node.js"],
    color: "from-yellow-500/20 to-amber-500/0",
    colSpan: "md:col-span-1",
    link: "https://github.com/Hrshw/env-secret-lock"
  },
  {
    title: "SubTrackHub",
    category: "Cloud Cost Optimization",
    description: "Analyzes cloud infrastructure usage to identify idle resources. Integrates LLMs to generate efficiency scores and optimization recommendations.",
    tech: ["Node.js", "React", "MongoDB", "LLMs"],
    color: "from-purple-500/20 to-fuchsia-500/0",
    colSpan: "md:col-span-2",
    link: "#"
  },
  {
    title: "VidVerbalize",
    category: "AI Video Generator",
    description: "Converts YouTube videos into short, captioned clips optimized for social media using AI-based transcription and automated highlight extraction.",
    tech: ["Node.js", "AI APIs", "Video Processing"],
    color: "from-emerald-500/20 to-teal-500/0",
    colSpan: "md:col-span-2",
    link: "#"
  },
  {
    title: "NFT Showcase",
    category: "Web3 Static Platform",
    description: "A responsive NFT showcase website featuring curated collections. Hosted on AWS S3 with Route 53 domain routing for scalable delivery.",
    tech: ["AWS S3", "HTML/CSS", "JavaScript"],
    color: "from-rose-500/20 to-orange-500/0",
    colSpan: "md:col-span-1",
    link: "#"
  }
];

export default function ProjectsSection() {
  return (
    <section id="section-projects" className="min-h-screen flex flex-col justify-center px-8 md:px-24 py-32 relative" style={{ zIndex: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-24">
          <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white tracking-tighter mb-4 transition-colors duration-500">
            Selected Work.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-500 text-lg md:text-xl font-light tracking-tight max-w-2xl transition-colors duration-500">
            A showcase of my recent projects, focusing on scalable architecture, AI integration, and sleek user experiences.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`bg-black/5 dark:bg-zinc-900/40 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group transition-colors duration-500 ${project.colSpan}`}
            >
              {/* Subtle animated gradient glow inside the card */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className="font-mono text-xs text-zinc-600 dark:text-zinc-500 tracking-wider uppercase transition-colors duration-500">{project.category}</div>
                  {project.link !== "#" && (
                    <a href={project.link} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white transition-colors duration-500">
                      <svg className="w-5 h-5 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </a>
                  )}
                </div>
                <h3 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight transition-colors duration-500">
                  {project.link !== "#" ? <a href={project.link} target="_blank" rel="noreferrer" className="hover:underline decoration-black/30 dark:decoration-white/30 underline-offset-4">{project.title}</a> : project.title}
                </h3>
                <p className="text-zinc-700 dark:text-zinc-400 font-light leading-relaxed mb-8 flex-grow transition-colors duration-500">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((t, i) => (
                    <span key={i} className="px-3 py-1.5 bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-full border border-black/10 dark:border-white/10 backdrop-blur-md transition-colors duration-500">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
