"use client";

import React from "react";
import { motion } from "framer-motion";

const experiences = [
  {
    role: "Full-Stack Developer Intern",
    company: "Envint",
    period: "May 2024 - Sep 2024",
    description: "Architected a scalable file-processing queue capable of parsing 5,000+ ESG data files. Developed custom Next.js dashboards and integrated AWS text extraction."
  },
  {
    role: "Cloud Engineering Intern",
    company: "Cloudeq",
    period: "Feb 2024 - May 2024",
    description: "Built Observyze (A code coverage tracking tool) focusing on cloud architecture, scaling performance, and ensuring fault-tolerance."
  }
];

export default function ExperienceSection() {
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
            Professional Journey
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--color-primary)] to-transparent ml-8 opacity-50" />
        </div>

        <div className="relative border-l-2 border-[var(--color-secondary)]/30 ml-4 md:ml-8 space-y-16">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="relative pl-8 md:pl-16"
            >
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[var(--color-secondary)]" style={{ boxShadow: "0 0 15px var(--color-secondary)" }} />
              
              <h3 className="text-2xl font-bold text-white mb-2">{exp.role}</h3>
              <div className="font-mono text-[var(--color-primary)] mb-4">
                <span>{exp.company}</span> <span className="text-gray-500 mx-2">|</span> <span>{exp.period}</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
