"use client";

import React from "react";
import { motion } from "framer-motion";

const projects = [
  {
    title: "Env Secret Lock",
    category: "Developer Environment Secret Manager",
    description: "A developer environment secret manager and CLI tool designed to prevent secret sprawl. Secures API credentials, environment variables, and system configurations with encrypted access protocols.",
    tech: ["Node.js", "TypeScript", "CLI", "Cryptography"],
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "SubTrackHub",
    category: "SaaS Cost Optimization Analyzer",
    description: "An enterprise SaaS analysis tool that hooks into cloud setups, maps active and idle instances, and calculates potential monthly/yearly savings. Uses LLMs to generate efficiency scores and automated reports.",
    tech: ["Node.js", "React", "MongoDB", "AWS", "LLMs"],
    color: "from-purple-500 to-indigo-400"
  },
  {
    title: "VidVerbalize",
    category: "AI Short-Form Video Generator",
    description: "An AI system that transcribes YouTube/local media, analyzes key moments, overlays auto-generated subtitles, trims video ratios, and produces ready-to-share social media clips.",
    tech: ["Python", "Whisper AI", "FFmpeg"],
    color: "from-rose-500 to-pink-400"
  },
  {
    title: "Observyze",
    category: "Analytics Platform",
    description: "An enterprise monitoring and coverage analytics platform built to automate performance tracking and code coverage insights. Integrates cloud pipelines and telemetry dashboard reporting.",
    tech: ["React.js", "Node.js", "AWS"],
    color: "from-emerald-500 to-teal-400"
  }
];

export default function ProjectsSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-8 md:px-24 py-24 relative" style={{ zIndex: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-wide">
            Featured Projects
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-gray-600 to-transparent ml-8 opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-[#0f172a]/60 backdrop-blur-md border border-gray-800 rounded-xl p-8 hover:border-gray-600 transition-colors group relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${project.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
              
              <div className="font-mono text-sm text-gray-400 mb-2">{project.category}</div>
              <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-6 h-24 overflow-hidden text-ellipsis">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-800/50 text-[var(--color-primary)] text-xs font-mono rounded border border-[var(--color-primary)]/20">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
