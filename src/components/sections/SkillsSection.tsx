"use client";

import React from "react";
import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Programming",
    skills: ["JavaScript", "TypeScript", "Python", "PHP"]
  },
  {
    title: "Frontend",
    skills: ["React.js", "Next.js", "Redux", "TailwindCSS", "Bootstrap", "HTML/CSS"]
  },
  {
    title: "Backend & DBs",
    skills: ["Node.js", "Express.js", "MongoDB", "MySQL", "PostgreSQL", "DynamoDB"]
  },
  {
    title: "Cloud & DevOps (AWS)",
    skills: ["EC2", "Lambda", "S3", "API Gateway", "IAM", "CloudWatch", "Docker", "CI/CD"]
  },
  {
    title: "AI & Emerging Tech",
    skills: ["Large Language Models (LLMs)", "RAG", "Agentic AI Concepts"]
  }
];

export default function SkillsSection() {
  return (
    <section id="section-skills" className="min-h-screen flex flex-col justify-center px-8 md:px-24 py-32 relative" style={{ zIndex: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-24">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4">
            Capabilities.
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl font-light tracking-tight max-w-2xl">
            A comprehensive overview of my technical expertise and the tools I use to build scalable systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {skillCategories.map((category, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <h3 className="text-lg font-medium text-zinc-300 mb-6 tracking-tight border-b border-zinc-800 pb-3">{category.title}</h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, i) => (
                  <div 
                    key={i} 
                    className="px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-full text-zinc-400 text-sm hover:text-white hover:bg-zinc-800 hover:border-white/20 transition-all cursor-default"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
